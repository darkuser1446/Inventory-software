import prisma from '../../config/prisma';
import { Prisma, OrderSource, OrderStatus } from '@prisma/client';

export class OrderRepository {
    async findMany(companyId: string, options: {
        page: number;
        limit: number;
        status?: OrderStatus;
        source?: OrderSource;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        const { page, limit, status, source, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = {
            companyId,
            ...(status && { status }),
            ...(source && { source }),
            ...(search && {
                OR: [
                    { orderNumber: { contains: search, mode: 'insensitive' } },
                    { externalOrderId: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    product: { select: { sku: true, name: true } },
                    assignedTo: { select: { name: true } },
                },
            }),
            prisma.order.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findById(id: string, companyId: string) {
        return prisma.order.findFirst({
            where: { id, companyId },
            include: {
                product: { select: { id: true, sku: true, name: true, currentStock: true, reservedStock: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async findByExternalId(externalOrderId: string, source: OrderSource, companyId: string) {
        return prisma.order.findUnique({
            where: {
                externalOrderId_source_companyId: { externalOrderId, source, companyId },
            },
        });
    }

    async create(data: Prisma.OrderUncheckedCreateInput) {
        return prisma.order.create({
            data,
            include: { product: { select: { sku: true, name: true } } },
        });
    }

    async updateStatus(id: string, status: OrderStatus) {
        return prisma.order.update({
            where: { id },
            data: { status },
            include: { product: { select: { id: true, sku: true, name: true } } },
        });
    }

    async countByCompany(companyId: string, filters?: { status?: OrderStatus; source?: OrderSource }) {
        return prisma.order.count({
            where: {
                companyId,
                ...filters,
            },
        });
    }

    async getOrdersByChannel(companyId: string) {
        const results = await prisma.order.groupBy({
            by: ['source'],
            where: { companyId },
            _count: { id: true },
        });
        return results.reduce((acc, r) => ({ ...acc, [r.source]: r._count.id }), {} as Record<string, number>);
    }

    async getOrdersByStatus(companyId: string) {
        const results = await prisma.order.groupBy({
            by: ['status'],
            where: { companyId },
            _count: { id: true },
        });
        return results.reduce((acc, r) => ({ ...acc, [r.status]: r._count.id }), {} as Record<string, number>);
    }

    async getRevenueTotal(companyId: string): Promise<number> {
        const result = await prisma.order.aggregate({
            where: { companyId, status: { not: 'CANCELLED' } },
            _sum: { totalPrice: true },
        });
        return Number(result._sum.totalPrice || 0);
    }

    async getRecentOrders(companyId: string, limit: number = 10) {
        return prisma.order.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { product: { select: { sku: true, name: true } } },
        });
    }

    async getPendingOrdersForStaff(companyId: string, options: { page: number; limit: number }) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { companyId, status: { in: [OrderStatus.PENDING, OrderStatus.SHIPPED] as OrderStatus[] } };

        const [data, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'asc' },
                include: {
                    product: { select: { sku: true, name: true } },
                },
            }),
            prisma.order.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
}

export const orderRepository = new OrderRepository();
