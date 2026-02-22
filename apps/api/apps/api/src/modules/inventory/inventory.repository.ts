import prisma from '../../config/prisma';
import { InventoryAction, Prisma } from '@prisma/client';

export class InventoryRepository {
    async createLog(data: {
        action: InventoryAction;
        quantity: number;
        reason?: string;
        metadata?: any;
        productId: string;
        companyId: string;
        orderId?: string;
    }) {
        return prisma.inventoryLog.create({ data });
    }

    async getLogsByProduct(productId: string, companyId: string, options: {
        page: number;
        limit: number;
    }) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { productId, companyId };

        const [data, total] = await Promise.all([
            prisma.inventoryLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { product: { select: { sku: true, name: true } } },
            }),
            prisma.inventoryLog.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async getLogsByCompany(companyId: string, options: {
        page: number;
        limit: number;
    }) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { companyId };

        const [data, total] = await Promise.all([
            prisma.inventoryLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { product: { select: { sku: true, name: true } } },
            }),
            prisma.inventoryLog.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
}

export const inventoryRepository = new InventoryRepository();
