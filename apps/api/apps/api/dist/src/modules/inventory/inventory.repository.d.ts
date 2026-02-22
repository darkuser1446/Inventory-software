import { InventoryAction, Prisma } from '@prisma/client';
export declare class InventoryRepository {
    createLog(data: {
        action: InventoryAction;
        quantity: number;
        reason?: string;
        metadata?: any;
        productId: string;
        companyId: string;
        orderId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        quantity: number;
        productId: string;
        action: import(".prisma/client").$Enums.InventoryAction;
        reason: string | null;
        metadata: Prisma.JsonValue | null;
        orderId: string | null;
    }>;
    getLogsByProduct(productId: string, companyId: string, options: {
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
    getLogsByCompany(companyId: string, options: {
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
}
export declare const inventoryRepository: InventoryRepository;
//# sourceMappingURL=inventory.repository.d.ts.map