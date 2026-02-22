import { OrderSource, OrderStatus } from '@prisma/client';
import { orderRepository } from './order.repository';
import { inventoryService } from '../inventory/inventory.service';
import { AppError } from '../../middleware/error.middleware';
import { emitOrderNew } from '../../services/socket.service';
import { nanoid } from '../../utils/nanoid';

export class OrderService {
    async getOrders(companyId: string, options: {
        page?: number;
        limit?: number;
        status?: string;
        source?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);

        return orderRepository.findMany(companyId, {
            ...options,
            page,
            limit,
            status: options.status as OrderStatus | undefined,
            source: options.source as OrderSource | undefined,
        });
    }

    async getOrder(id: string, companyId: string) {
        const order = await orderRepository.findById(id, companyId);
        if (!order) throw new AppError('Order not found', 404);
        return order;
    }

    /**
     * Create order from external webhook/API
     * Validates stock availability and reserves inventory atomically
     */
    async createExternalOrder(companyId: string, data: {
        source: OrderSource;
        productId: string;
        quantity: number;
        externalOrderId?: string;
        unitPrice?: number;
        shippingDetails?: any;
    }) {
        // Check for duplicate external order
        if (data.externalOrderId) {
            const existing = await orderRepository.findByExternalId(data.externalOrderId, data.source, companyId);
            if (existing) throw new AppError('Duplicate external order', 409);
        }

        // Reserve stock first (will throw if insufficient)
        await inventoryService.reserveStock({
            productId: data.productId,
            companyId,
            quantity: data.quantity,
        });

        const orderNumber = `ORD-${nanoid(10)}`;
        const totalPrice = (data.unitPrice || 0) * data.quantity;

        const order = await orderRepository.create({
            orderNumber,
            source: data.source,
            status: OrderStatus.PENDING,
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
            emitOrderNew(companyId, order);
        } catch (err) {
            console.error('[OrderService] Failed to emit order_new:', err);
        }

        return order;
    }

    /**
     * Status transition: PENDING → SHIPPED → DELIVERED | CANCELLED
     */
    async updateStatus(orderId: string, companyId: string, newStatus: OrderStatus) {
        const order = await this.getOrder(orderId, companyId);

        // Validate transitions
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            PENDING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            SHIPPED: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
            DELIVERED: [],
            CANCELLED: [],
        };

        if (!validTransitions[order.status].includes(newStatus)) {
            throw new AppError(
                `Cannot transition from ${order.status} to ${newStatus}`,
                400
            );
        }

        // Handle inventory side effects
        if (newStatus === OrderStatus.DELIVERED) {
            await inventoryService.handleDelivered({
                productId: order.productId,
                companyId,
                quantity: order.quantity,
                orderId: order.id,
            });
        } else if (newStatus === OrderStatus.CANCELLED) {
            await inventoryService.handleCancelled({
                productId: order.productId,
                companyId,
                quantity: order.quantity,
                orderId: order.id,
            });
        }

        return orderRepository.updateStatus(orderId, newStatus);
    }

    async getOrdersToPack(companyId: string, options?: { page?: number; limit?: number }) {
        return orderRepository.getPendingOrdersForStaff(companyId, {
            page: options?.page || 1,
            limit: Math.min(options?.limit || 20, 100),
        });
    }
}

export const orderService = new OrderService();
