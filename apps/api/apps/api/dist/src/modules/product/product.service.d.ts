export declare class ProductService {
    getProducts(companyId: string, options: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            isActive: boolean;
            sku: string;
            price: import("@prisma/client/runtime/library").Decimal;
            costPrice: import("@prisma/client/runtime/library").Decimal;
            currentStock: number;
            reservedStock: number;
            lowStockThreshold: number;
            imageUrl: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProduct(id: string, companyId: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    createProduct(companyId: string, data: {
        sku: string;
        name: string;
        description?: string;
        price?: number;
        costPrice?: number;
        currentStock?: number;
        lowStockThreshold?: number;
        imageUrl?: string;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    updateProduct(id: string, companyId: string, data: {
        name?: string;
        description?: string;
        price?: number;
        costPrice?: number;
        lowStockThreshold?: number;
        imageUrl?: string;
        isActive?: boolean;
    }): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    deleteProduct(id: string, companyId: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }>;
    importFromCSV(companyId: string, records: Array<{
        sku: string;
        name: string;
        description?: string;
        price?: string;
        costPrice?: string;
        currentStock?: string;
        lowStockThreshold?: string;
    }>): Promise<{
        created: number;
        updated: number;
        errors: string[];
    }>;
    checkLowStockAlerts(companyId: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        currentStock: number;
        reservedStock: number;
        lowStockThreshold: number;
        imageUrl: string | null;
    }[]>;
}
export declare const productService: ProductService;
//# sourceMappingURL=product.service.d.ts.map