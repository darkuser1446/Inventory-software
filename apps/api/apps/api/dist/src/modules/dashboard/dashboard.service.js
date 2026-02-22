"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const order_repository_1 = require("../order/order.repository");
const product_repository_1 = require("../product/product.repository");
const prisma_1 = __importDefault(require("../../config/prisma"));
const socket_service_1 = require("../../services/socket.service");
class DashboardService {
    async getSummary(companyId) {
        const [totalProducts, totalOrders, pendingOrders, ordersByChannel, ordersByStatus, revenueTotal, recentOrders,] = await Promise.all([
            product_repository_1.productRepository.countByCompany(companyId),
            order_repository_1.orderRepository.countByCompany(companyId),
            order_repository_1.orderRepository.countByCompany(companyId, { status: 'PENDING' }),
            order_repository_1.orderRepository.getOrdersByChannel(companyId),
            order_repository_1.orderRepository.getOrdersByStatus(companyId),
            order_repository_1.orderRepository.getRevenueTotal(companyId),
            order_repository_1.orderRepository.getRecentOrders(companyId, 10),
        ]);
        const lowStockProducts = await prisma_1.default.product.count({
            where: {
                companyId,
                isActive: true,
            },
        });
        // Count low stock separately since Prisma doesn't support column-to-column comparison
        const allProducts = await prisma_1.default.product.findMany({
            where: { companyId, isActive: true },
            select: { currentStock: true, reservedStock: true, lowStockThreshold: true },
        });
        const lowStockCount = allProducts.filter((p) => (p.currentStock - p.reservedStock) <= p.lowStockThreshold).length;
        const summary = {
            totalProducts,
            totalOrders,
            pendingOrders,
            lowStockProducts: lowStockCount,
            revenueTotal,
            ordersByChannel,
            ordersByStatus,
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                source: o.source,
                status: o.status,
                totalPrice: Number(o.totalPrice),
                createdAt: o.createdAt,
            })),
        };
        return summary;
    }
    async emitDashboardUpdate(companyId) {
        try {
            const summary = await this.getSummary(companyId);
            (0, socket_service_1.emitDashboardStats)(companyId, summary);
        }
        catch (err) {
            console.error('[DashboardService] Failed to emit dashboard update:', err);
        }
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map