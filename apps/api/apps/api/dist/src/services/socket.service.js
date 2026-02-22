"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitDashboardStats = emitDashboardStats;
exports.emitOrderNew = emitOrderNew;
exports.emitStockLow = emitStockLow;
exports.emitOrderStatusUpdate = emitOrderStatusUpdate;
const socket_1 = require("../config/socket");
function emitDashboardStats(companyId, data) {
    try {
        const io = (0, socket_1.getSocketServer)();
        io.to(`company_${companyId}`).emit('dashboard_stats', data);
    }
    catch (err) {
        console.error('[SocketService] emitDashboardStats failed:', err);
    }
}
function emitOrderNew(companyId, order) {
    try {
        const io = (0, socket_1.getSocketServer)();
        io.to(`company_${companyId}`).emit('order_new', order);
    }
    catch (err) {
        console.error('[SocketService] emitOrderNew failed:', err);
    }
}
function emitStockLow(companyId, products) {
    try {
        const io = (0, socket_1.getSocketServer)();
        io.to(`company_${companyId}`).emit('stock_low', products);
    }
    catch (err) {
        console.error('[SocketService] emitStockLow failed:', err);
    }
}
function emitOrderStatusUpdate(companyId, order) {
    try {
        const io = (0, socket_1.getSocketServer)();
        io.to(`company_${companyId}`).emit('order_status_update', order);
    }
    catch (err) {
        console.error('[SocketService] emitOrderStatusUpdate failed:', err);
    }
}
//# sourceMappingURL=socket.service.js.map