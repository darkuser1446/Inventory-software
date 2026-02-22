"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const order_repository_1 = require("./order.repository");
const inventory_service_1 = require("../inventory/inventory.service");
const error_middleware_1 = require("../../middleware/error.middleware");
const socket_service_1 = require("../../services/socket.service");
const nanoid_1 = require("../../utils/nanoid");
class OrderService {
    async getOrders(companyId, options) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        return order_repository_1.orderRepository.findMany(companyId, {
            ...options,
            page,
            limit,
            status: options.status,
            source: options.source,
        });
    }
    async getOrder(id, companyId) {
        const order = await order_repository_1.orderRepository.findById(id, companyId);
        if (!order)
            throw new error_middleware_1.AppError('Order not found', 404);
        return order;
    }
    /**
     * Create order from external webhook/API
     * Validates stock availability and reserves inventory atomically
     */
    async createExternalOrder(companyId, data) {
        // Check for duplicate external order
        if (data.externalOrderId) {
            const existing = await order_repository_1.orderRepository.findByExternalId(data.externalOrderId, data.source, companyId);
            if (existing)
                throw new error_middleware_1.AppError('Duplicate external order', 409);
        }
        // Reserve stock first (will throw if insufficient)
        await inventory_service_1.inventoryService.reserveStock({
            productId: data.productId,
            companyId,
            quantity: data.quantity,
        });
        const orderNumber = `ORD-${(0, nanoid_1.nanoid)(10)}`;
        const totalPrice = (data.unitPrice || 0) * data.quantity;
        const order = await order_repository_1.orderRepository.create({
            orderNumber,
            source: data.source,
            status: client_1.OrderStatus.PENDING,
            externalOrderId: data.externalOrderId,
            quantity: data.quantity,
            unitPrice: data.unitPrice || 0,
            totalPrice,
            shippingDetails: data.shippingDetails,
            productId: data.productId,
            companyId,
        });
        // Emit realtime event
        try {
            (0, socket_service_1.emitOrderNew)(companyId, order);
        }
        catch (err) {
            console.error('[OrderService] Failed to emit order_new:', err);
        }
        return order;
    }
    /**
     * Status transition: PENDING → SHIPPED → DELIVERED | CANCELLED
     */
    async updateStatus(orderId, companyId, newStatus) {
        const order = await this.getOrder(orderId, companyId);
        // Validate transitions
        const validTransitions = {
            PENDING: [client_1.OrderStatus.SHIPPED, client_1.OrderStatus.CANCELLED],
            SHIPPED: [client_1.OrderStatus.DELIVERED, client_1.OrderStatus.CANCELLED],
            DELIVERED: [],
            CANCELLED: [],
        };
        if (!validTransitions[order.status].includes(newStatus)) {
            throw new error_middleware_1.AppError(`Cannot transition from ${order.status} to ${newStatus}`, 400);
        }
        // Handle inventory side effects
        if (newStatus === client_1.OrderStatus.DELIVERED) {
            await inventory_service_1.inventoryService.handleDelivered({
                productId: order.productId,
                companyId,
                quantity: order.quantity,
                orderId: order.id,
            });
        }
        else if (newStatus === client_1.OrderStatus.CANCELLED) {
            await inventory_service_1.inventoryService.handleCancelled({
                productId: order.productId,
                companyId,
                quantity: order.quantity,
                orderId: order.id,
            });
        }
        return order_repository_1.orderRepository.updateStatus(orderId, newStatus);
    }
    async getOrdersToPack(companyId, options) {
        return order_repository_1.orderRepository.getPendingOrdersForStaff(companyId, {
            page: options?.page || 1,
            limit: Math.min(options?.limit || 20, 100),
        });
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
//# sourceMappingURL=order.service.js.map