import { Prisma, OrderSource, OrderStatus } from '@prisma/client';
export declare class OrderRepository {
    findMany(companyId: string, options: {
        page: number;
        limit: number;
        status?: OrderStatus;
        source?: OrderSource;
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
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            shippingDetails: Prisma.JsonValue | null;
            notes: string | null;
            productId: string;
            assignedToId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string, companyId: string): Promise<({
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
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
        shippingDetails: Prisma.JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }) | null>;
    findByExternalId(externalOrderId: string, source: OrderSource, companyId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        orderNumber: string;
        source: import(".prisma/client").$Enums.OrderSource;
        status: import(".prisma/client").$Enums.OrderStatus;
        externalOrderId: string | null;
        quantity: number;
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
        shippingDetails: Prisma.JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    } | null>;
    create(data: Prisma.OrderUncheckedCreateInput): Promise<{
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
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
        shippingDetails: Prisma.JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }>;
    updateStatus(id: string, status: OrderStatus): Promise<{
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
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
        shippingDetails: Prisma.JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }>;
    countByCompany(companyId: string, filters?: {
        status?: OrderStatus;
        source?: OrderSource;
    }): Promise<number>;
    getOrdersByChannel(companyId: string): Promise<Record<string, number>>;
    getOrdersByStatus(companyId: string): Promise<Record<string, number>>;
    getRevenueTotal(companyId: string): Promise<number>;
    getRecentOrders(companyId: string, limit?: number): Promise<({
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
        unitPrice: Prisma.Decimal;
        totalPrice: Prisma.Decimal;
        shippingDetails: Prisma.JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    })[]>;
    getPendingOrdersForStaff(companyId: string, options: {
        page: number;
        limit: number;
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
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            shippingDetails: Prisma.JsonValue | null;
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
export declare const orderRepository: OrderRepository;
//# sourceMappingURL=order.repository.d.ts.map