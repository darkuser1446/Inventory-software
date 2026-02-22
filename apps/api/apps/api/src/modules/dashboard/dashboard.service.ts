import { orderRepository } from '../order/order.repository';
import { productRepository } from '../product/product.repository';
import prisma from '../../config/prisma';
import type { DashboardSummary } from '../../types';
import { emitDashboardStats } from '../../services/socket.service';

export class DashboardService {
    async getSummary(companyId: string): Promise<DashboardSummary> {
        const [
            totalProducts,
            totalOrders,
            pendingOrders,
            ordersByChannel,
            ordersByStatus,
            revenueTotal,
            recentOrders,
        ] = await Promise.all([
            productRepository.countByCompany(companyId),
            orderRepository.countByCompany(companyId),
            orderRepository.countByCompany(companyId, { status: 'PENDING' }),
            orderRepository.getOrdersByChannel(companyId),
            orderRepository.getOrdersByStatus(companyId),
            orderRepository.getRevenueTotal(companyId),
            orderRepository.getRecentOrders(companyId, 10),
        ]);

        const lowStockProducts = await prisma.product.count({
            where: {
                companyId,
                isActive: true,
            },
        });

        // Count low stock separately since Prisma doesn't support column-to-column comparison
        const allProducts = await prisma.product.findMany({
            where: { companyId, isActive: true },
            select: { currentStock: true, reservedStock: true, lowStockThreshold: true },
        });
        const lowStockCount = allProducts.filter(
            (p) => (p.currentStock - p.reservedStock) <= p.lowStockThreshold
        ).length;

        const summary: DashboardSummary = {
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

    async emitDashboardUpdate(companyId: string) {
        try {
            const summary = await this.getSummary(companyId);
            emitDashboardStats(companyId, summary);
        } catch (err) {
            console.error('[DashboardService] Failed to emit dashboard update:', err);
        }
    }
}

export const dashboardService = new DashboardService();
