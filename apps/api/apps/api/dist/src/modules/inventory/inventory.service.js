"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const error_middleware_1 = require("../../middleware/error.middleware");
const inventory_repository_1 = require("./inventory.repository");
const stock_sync_queue_1 = require("../../workers/stock-sync.queue");
const socket_service_1 = require("../../services/socket.service");
const client_1 = require("@prisma/client");
class InventoryService {
    /**
     * Reserve stock for a new order using Prisma interactive transactions.
     * available = current_stock - reserved_stock
     * If available >= qty → increment reserved_stock, create order.
     * Else → reject.
     */
    async reserveStock(params) {
        const { productId, companyId, quantity, orderId, reason } = params;
        return prisma_1.default.$transaction(async (tx) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });
            if (!product) {
                throw new error_middleware_1.AppError('Product not found', 404);
            }
            const available = product.currentStock - product.reservedStock;
            if (available < quantity) {
                throw new error_middleware_1.AppError(`Insufficient stock. Available: ${available}, Requested: ${quantity}`, 400);
            }
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { reservedStock: { increment: quantity } },
            });
            await tx.inventoryLog.create({
                data: {
                    action: client_1.InventoryAction.RESERVED,
                    quantity,
                    reason: reason || 'Stock reserved for order',
                    productId,
                    companyId,
                    orderId,
                    metadata: { previousReserved: product.reservedStock, newReserved: updatedProduct.reservedStock },
                },
            });
            // Check low stock alert
            const newAvailable = updatedProduct.currentStock - updatedProduct.reservedStock;
            if (newAvailable <= updatedProduct.lowStockThreshold) {
                this.triggerLowStockAlert(companyId, updatedProduct);
            }
            // Queue stock sync to external channels
            await stock_sync_queue_1.stockSyncQueue.add('sync', {
                companyId,
                productId,
                sku: product.sku,
                availableQty: newAvailable,
            });
            return updatedProduct;
        });
    }
    /**
     * On DELIVERED: decrement current_stock + decrement reserved_stock
     */
    async handleDelivered(params) {
        const { productId, companyId, quantity, orderId } = params;
        return prisma_1.default.$transaction(async (tx) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });
            if (!product)
                throw new error_middleware_1.AppError('Product not found', 404);
            if (product.reservedStock < quantity) {
                throw new error_middleware_1.AppError(`Invalid operation: Cannot deliver ${quantity}, only ${product.reservedStock} reserved.`, 400);
            }
            if (product.currentStock < quantity) {
                throw new error_middleware_1.AppError(`Invalid operation: Cannot deliver ${quantity}, only ${product.currentStock} in stock.`, 400);
            }
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    currentStock: { decrement: quantity },
                    reservedStock: { decrement: quantity },
                },
            });
            await tx.inventoryLog.create({
                data: {
                    action: client_1.InventoryAction.DELIVERED,
                    quantity,
                    reason: 'Order delivered — stock consumed',
                    productId,
                    companyId,
                    orderId,
                    metadata: {
                        previousCurrent: product.currentStock,
                        previousReserved: product.reservedStock,
                        newCurrent: updatedProduct.currentStock,
                        newReserved: updatedProduct.reservedStock,
                    },
                },
            });
            const newAvailable = updatedProduct.currentStock - updatedProduct.reservedStock;
            await stock_sync_queue_1.stockSyncQueue.add('sync', {
                companyId,
                productId,
                sku: product.sku,
                availableQty: newAvailable,
            });
            return updatedProduct;
        });
    }
    /**
     * On CANCELLED: restore reserved_stock
     */
    async handleCancelled(params) {
        const { productId, companyId, quantity, orderId } = params;
        return prisma_1.default.$transaction(async (tx) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });
            if (!product)
                throw new error_middleware_1.AppError('Product not found', 404);
            if (product.reservedStock < quantity) {
                // Determine if we should throw or just zero it out? Throwing is safer.
                throw new error_middleware_1.AppError(`Invalid operation: Cannot release ${quantity}, only ${product.reservedStock} reserved.`, 400);
            }
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { reservedStock: { decrement: quantity } },
            });
            await tx.inventoryLog.create({
                data: {
                    action: client_1.InventoryAction.RELEASED,
                    quantity,
                    reason: 'Order cancelled — stock released',
                    productId,
                    companyId,
                    orderId,
                    metadata: {
                        previousReserved: product.reservedStock,
                        newReserved: updatedProduct.reservedStock,
                    },
                },
            });
            const newAvailable = updatedProduct.currentStock - updatedProduct.reservedStock;
            await stock_sync_queue_1.stockSyncQueue.add('sync', {
                companyId,
                productId,
                sku: product.sku,
                availableQty: newAvailable,
            });
            return updatedProduct;
        });
    }
    /**
     * Manual stock adjustment (Admin only)
     */
    async adjustStock(params) {
        const { productId, companyId, quantity, action, reason } = params;
        return prisma_1.default.$transaction(async (tx) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });
            if (!product)
                throw new error_middleware_1.AppError('Product not found', 404);
            const stockChange = action === 'STOCK_IN' ? { increment: quantity } : { decrement: quantity };
            if (action === 'STOCK_OUT') {
                const available = product.currentStock - product.reservedStock;
                if (available < quantity) {
                    throw new error_middleware_1.AppError(`Cannot remove ${quantity} units. Only ${available} available.`, 400);
                }
            }
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { currentStock: stockChange },
            });
            await tx.inventoryLog.create({
                data: {
                    action: action === 'STOCK_IN' ? client_1.InventoryAction.STOCK_IN : client_1.InventoryAction.STOCK_OUT,
                    quantity,
                    reason,
                    productId,
                    companyId,
                    metadata: { previousStock: product.currentStock, newStock: updatedProduct.currentStock },
                },
            });
            const newAvailable = updatedProduct.currentStock - updatedProduct.reservedStock;
            if (newAvailable <= updatedProduct.lowStockThreshold) {
                this.triggerLowStockAlert(companyId, updatedProduct);
            }
            await stock_sync_queue_1.stockSyncQueue.add('sync', {
                companyId,
                productId,
                sku: product.sku,
                availableQty: newAvailable,
            });
            return updatedProduct;
        });
    }
    async getInventoryLogs(companyId, productId, options) {
        const page = options?.page || 1;
        const limit = Math.min(options?.limit || 50, 100);
        if (productId) {
            return inventory_repository_1.inventoryRepository.getLogsByProduct(productId, companyId, { page, limit });
        }
        return inventory_repository_1.inventoryRepository.getLogsByCompany(companyId, { page, limit });
    }
    triggerLowStockAlert(companyId, product) {
        try {
            (0, socket_service_1.emitStockLow)(companyId, [{
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    available: product.currentStock - product.reservedStock,
                    threshold: product.lowStockThreshold,
                }]);
        }
        catch (err) {
            console.error('[InventoryService] Failed to emit low stock alert:', err);
        }
    }
}
exports.InventoryService = InventoryService;
exports.inventoryService = new InventoryService();
//# sourceMappingURL=inventory.service.js.map