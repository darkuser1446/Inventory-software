export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface NormalizedWebhookPayload {
    source: string;
    sku: string;
    qty: number;
    externalId: string;
    unitPrice?: number;
    shippingDetails?: Record<string, unknown>;
    customerName?: string;
    customerEmail?: string;
}

export interface DashboardSummary {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    lowStockProducts: number;
    revenueTotal: number;
    ordersByChannel: Record<string, number>;
    ordersByStatus: Record<string, number>;
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        source: string;
        status: string;
        totalPrice: number;
        createdAt: Date;
    }>;
}

export interface StockSyncJob {
    companyId: string;
    productId: string;
    sku: string;
    availableQty: number;
}

export interface AuthenticatedUser {
    userId: string;
    companyId: string;
    role: 'ADMIN' | 'STAFF';
}

export type AuthenticatedRequest = import('express').Request & { user?: AuthenticatedUser };
