"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = exports.OrderRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
class OrderRepository {
    async findMany(companyId, options) {
        const { page, limit, status, source, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const where = {
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
            prisma_1.default.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    product: { select: { sku: true, name: true } },
                    assignedTo: { select: { name: true } },
                },
            }),
            prisma_1.default.order.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id, companyId) {
        return prisma_1.default.order.findFirst({
            where: { id, companyId },
            include: {
                product: { select: { id: true, sku: true, name: true, currentStock: true, reservedStock: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async findByExternalId(externalOrderId, source, companyId) {
        return prisma_1.default.order.findUnique({
            where: {
                externalOrderId_source_companyId: { externalOrderId, source, companyId },
            },
        });
    }
    async create(data) {
        return prisma_1.default.order.create({
            data,
            include: { product: { select: { sku: true, name: true } } },
        });
    }
    async updateStatus(id, status) {
        return prisma_1.default.order.update({
            where: { id },
            data: { status },
            include: { product: { select: { id: true, sku: true, name: true } } },
        });
    }
    async countByCompany(companyId, filters) {
        return prisma_1.default.order.count({
            where: {
                companyId,
                ...filters,
            },
        });
    }
    async getOrdersByChannel(companyId) {
        const results = await prisma_1.default.order.groupBy({
            by: ['source'],
            where: { companyId },
            _count: { id: true },
        });
        return results.reduce((acc, r) => ({ ...acc, [r.source]: r._count.id }), {});
    }
    async getOrdersByStatus(companyId) {
        const results = await prisma_1.default.order.groupBy({
            by: ['status'],
            where: { companyId },
            _count: { id: true },
        });
        return results.reduce((acc, r) => ({ ...acc, [r.status]: r._count.id }), {});
    }
    async getRevenueTotal(companyId) {
        const result = await prisma_1.default.order.aggregate({
            where: { companyId, status: { not: 'CANCELLED' } },
            _sum: { totalPrice: true },
        });
        return Number(result._sum.totalPrice || 0);
    }
    async getRecentOrders(companyId, limit = 10) {
        return prisma_1.default.order.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { product: { select: { sku: true, name: true } } },
        });
    }
    async getPendingOrdersForStaff(companyId, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { companyId, status: { in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.SHIPPED] } };
        const [data, total] = await Promise.all([
            prisma_1.default.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'asc' },
                include: {
                    product: { select: { sku: true, name: true } },
                },
            }),
            prisma_1.default.order.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
}
exports.OrderRepository = OrderRepository;
exports.orderRepository = new OrderRepository();
//# sourceMappingURL=order.repository.js.map