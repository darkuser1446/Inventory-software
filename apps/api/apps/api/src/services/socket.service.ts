import { getSocketServer } from '../config/socket';

export function emitDashboardStats(companyId: string, data: any): void {
    try {
        const io = getSocketServer();
        io.to(`company_${companyId}`).emit('dashboard_stats', data);
    } catch (err) {
        console.error('[SocketService] emitDashboardStats failed:', err);
    }
}

export function emitOrderNew(companyId: string, order: any): void {
    try {
        const io = getSocketServer();
        io.to(`company_${companyId}`).emit('order_new', order);
    } catch (err) {
        console.error('[SocketService] emitOrderNew failed:', err);
    }
}

export function emitStockLow(companyId: string, products: Array<{
    id: string;
    sku: string;
    name: string;
    available: number;
    threshold: number;
}>): void {
    try {
        const io = getSocketServer();
        io.to(`company_${companyId}`).emit('stock_low', products);
    } catch (err) {
        console.error('[SocketService] emitStockLow failed:', err);
    }
}

export function emitOrderStatusUpdate(companyId: string, order: any): void {
    try {
        const io = getSocketServer();
        io.to(`company_${companyId}`).emit('order_status_update', order);
    } catch (err) {
        console.error('[SocketService] emitOrderStatusUpdate failed:', err);
    }
}
