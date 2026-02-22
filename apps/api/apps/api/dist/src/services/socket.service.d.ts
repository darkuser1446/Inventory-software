export declare function emitDashboardStats(companyId: string, data: any): void;
export declare function emitOrderNew(companyId: string, order: any): void;
export declare function emitStockLow(companyId: string, products: Array<{
    id: string;
    sku: string;
    name: string;
    available: number;
    threshold: number;
}>): void;
export declare function emitOrderStatusUpdate(companyId: string, order: any): void;
//# sourceMappingURL=socket.service.d.ts.map