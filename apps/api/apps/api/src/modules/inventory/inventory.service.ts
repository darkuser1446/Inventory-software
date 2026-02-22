import prisma from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { inventoryRepository } from './inventory.repository';
import { stockSyncQueue } from '../../workers/stock-sync.queue';
import { emitStockLow } from '../../services/socket.service';
import { InventoryAction, OrderStatus, Prisma } from '@prisma/client';

export class InventoryService {
    /**
     * Reserve stock for a new order using Prisma interactive transactions.
     * available = current_stock - reserved_stock
     * If available >= qty → increment reserved_stock, create order.
     * Else → reject.
     */
    async reserveStock(params: {
        productId: string;
        companyId: string;
        quantity: number;
        orderId?: string;
        reason?: string;
    }) {
        const { productId, companyId, quantity, orderId, reason } = params;

        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });

            if (!product) {
                throw new AppError('Product not found', 404);
            }

            const available = product.currentStock - product.reservedStock;

            if (available < quantity) {
                throw new AppError(
                    `Insufficient stock. Available: ${available}, Requested: ${quantity}`,
                    400
                );
            }

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { reservedStock: { increment: quantity } },
            });

            await tx.inventoryLog.create({
                data: {
                    action: InventoryAction.RESERVED,
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
            await stockSyncQueue.add('sync', {
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
    async handleDelivered(params: {
        productId: string;
        companyId: string;
        quantity: number;
        orderId: string;
    }) {
        const { productId, companyId, quantity, orderId } = params;

        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });

            if (!product) throw new AppError('Product not found', 404);

            if (product.reservedStock < quantity) {
                throw new AppError(`Invalid operation: Cannot deliver ${quantity}, only ${product.reservedStock} reserved.`, 400);
            }
            if (product.currentStock < quantity) {
                throw new AppError(`Invalid operation: Cannot deliver ${quantity}, only ${product.currentStock} in stock.`, 400);
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
                    action: InventoryAction.DELIVERED,
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
            await stockSyncQueue.add('sync', {
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
    async handleCancelled(params: {
        productId: string;
        companyId: string;
        quantity: number;
        orderId: string;
    }) {
        const { productId, companyId, quantity, orderId } = params;

        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });

            if (!product) throw new AppError('Product not found', 404);

            if (product.reservedStock < quantity) {
                // Determine if we should throw or just zero it out? Throwing is safer.
                throw new AppError(`Invalid operation: Cannot release ${quantity}, only ${product.reservedStock} reserved.`, 400);
            }

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { reservedStock: { decrement: quantity } },
            });

            await tx.inventoryLog.create({
                data: {
                    action: InventoryAction.RELEASED,
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
            await stockSyncQueue.add('sync', {
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
    async adjustStock(params: {
        productId: string;
        companyId: string;
        quantity: number;
        action: 'STOCK_IN' | 'STOCK_OUT';
        reason: string;
    }) {
        const { productId, companyId, quantity, action, reason } = params;

        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const product = await tx.product.findFirst({
                where: { id: productId, companyId },
            });

            if (!product) throw new AppError('Product not found', 404);

            const stockChange = action === 'STOCK_IN' ? { increment: quantity } : { decrement: quantity };

            if (action === 'STOCK_OUT') {
                const available = product.currentStock - product.reservedStock;
                if (available < quantity) {
                    throw new AppError(`Cannot remove ${quantity} units. Only ${available} available.`, 400);
                }
            }

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { currentStock: stockChange },
            });

            await tx.inventoryLog.create({
                data: {
                    action: action === 'STOCK_IN' ? InventoryAction.STOCK_IN : InventoryAction.STOCK_OUT,
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

            await stockSyncQueue.add('sync', {
                companyId,
                productId,
                sku: product.sku,
                availableQty: newAvailable,
            });

            return updatedProduct;
        });
    }

    async getInventoryLogs(companyId: string, productId?: string, options?: { page?: number; limit?: number }) {
        const page = options?.page || 1;
        const limit = Math.min(options?.limit || 50, 100);

        if (productId) {
            return inventoryRepository.getLogsByProduct(productId, companyId, { page, limit });
        }
        return inventoryRepository.getLogsByCompany(companyId, { page, limit });
    }

    private triggerLowStockAlert(companyId: string, product: any) {
        try {
            emitStockLow(companyId, [{
                id: product.id,
                sku: product.sku,
                name: product.name,
                available: product.currentStock - product.reservedStock,
                threshold: product.lowStockThreshold,
            }]);
        } catch (err) {
            console.error('[InventoryService] Failed to emit low stock alert:', err);
        }
    }
}

export const inventoryService = new InventoryService();
