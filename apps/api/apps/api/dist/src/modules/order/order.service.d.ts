import { OrderSource, OrderStatus } from '@prisma/client';
export declare class OrderService {
    getOrders(companyId: string, options: {
        page?: number;
        limit?: number;
        status?: string;
        source?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            product: {
                name: string;
                sku: string;
            };
            assignedTo: {
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            orderNumber: string;
            source: import(".prisma/client").$Enums.OrderSource;
            status: import(".prisma/client").$Enums.OrderStatus;
            externalOrderId: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            shippingDetails: import("@prisma/client/runtime/library").JsonValue | null;
            notes: string | null;
            productId: string;
            assignedToId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOrder(id: string, companyId: string): Promise<{
        product: {
            name: string;
            id: string;
            sku: string;
            currentStock: number;
            reservedStock: number;
        };
        assignedTo: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        orderNumber: string;
        source: import(".prisma/client").$Enums.OrderSource;
        status: import(".prisma/client").$Enums.OrderStatus;
        externalOrderId: string | null;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        shippingDetails: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }>;
    /**
     * Create order from external webhook/API
     * Validates stock availability and reserves inventory atomically
     */
    createExternalOrder(companyId: string, data: {
        source: OrderSource;
        productId: string;
        quantity: number;
        externalOrderId?: string;
        unitPrice?: number;
        shippingDetails?: any;
    }): Promise<{
        product: {
            name: string;
            sku: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        orderNumber: string;
        source: import(".prisma/client").$Enums.OrderSource;
        status: import(".prisma/client").$Enums.OrderStatus;
        externalOrderId: string | null;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        shippingDetails: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }>;
    /**
     * Status transition: PENDING → SHIPPED → DELIVERED | CANCELLED
     */
    updateStatus(orderId: string, companyId: string, newStatus: OrderStatus): Promise<{
        product: {
            name: string;
            id: string;
            sku: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        orderNumber: string;
        source: import(".prisma/client").$Enums.OrderSource;
        status: import(".prisma/client").$Enums.OrderStatus;
        externalOrderId: string | null;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        shippingDetails: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }>;
    getOrdersToPack(companyId: string, options?: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            product: {
                name: string;
                sku: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            orderNumber: string;
            source: import(".prisma/client").$Enums.OrderSource;
            status: import(".prisma/client").$Enums.OrderStatus;
            externalOrderId: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            shippingDetails: import("@prisma/client/runtime/library").JsonValue | null;
            notes: string | null;
            productId: string;
            assignedToId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
export declare const orderService: OrderService;
//# sourceMappingURL=order.service.d.ts.map