import { Prisma } from '@prisma/client';
export declare class InventoryService {
    /**
     * Reserve stock for a new order using Prisma interactive transactions.
     * available = current_stock - reserved_stock
     * If available >= qty → increment reserved_stock, create order.
     * Else → reject.
     */
    reserveStock(params: {
        productId: string;
        companyId: string;
        quantity: number;
        orderId?: string;
        reason?: string;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: Prisma.Decimal;
        costPrice: Prisma.Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    /**
     * On DELIVERED: decrement current_stock + decrement reserved_stock
     */
    handleDelivered(params: {
        productId: string;
        companyId: string;
        quantity: number;
        orderId: string;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: Prisma.Decimal;
        costPrice: Prisma.Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    /**
     * On CANCELLED: restore reserved_stock
     */
    handleCancelled(params: {
        productId: string;
        companyId: string;
        quantity: number;
        orderId: string;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: Prisma.Decimal;
        costPrice: Prisma.Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    /**
     * Manual stock adjustment (Admin only)
     */
    adjustStock(params: {
        productId: string;
        companyId: string;
        quantity: number;
        action: 'STOCK_IN' | 'STOCK_OUT';
        reason: string;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: Prisma.Decimal;
        costPrice: Prisma.Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    getInventoryLogs(companyId: string, productId?: string, options?: {
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
            companyId: string;
            quantity: number;
            productId: string;
            action: import(".prisma/client").$Enums.InventoryAction;
            reason: string | null;
            metadata: Prisma.JsonValue | null;
            orderId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    private triggerLowStockAlert;
}
export declare const inventoryService: InventoryService;
//# sourceMappingURL=inventory.service.d.ts.map