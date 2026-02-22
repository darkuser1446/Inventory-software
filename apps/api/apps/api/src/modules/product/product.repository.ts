import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

export class ProductRepository {
    async findMany(companyId: string, options: {
        page: number;
        limit: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        const { page, limit, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            companyId,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.product.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findById(id: string, companyId: string) {
        return prisma.product.findFirst({ where: { id, companyId } });
    }

    async findBySku(sku: string, companyId: string) {
        return prisma.product.findUnique({ where: { sku_companyId: { sku, companyId } } });
    }

    async create(data: Prisma.ProductCreateInput) {
        return prisma.product.create({ data });
    }

    async update(id: string, companyId: string, data: Prisma.ProductUpdateInput) {
        return prisma.product.update({ where: { id }, data });
    }

    async delete(id: string, companyId: string) {
        return prisma.product.delete({ where: { id } });
    }

    async getLowStockProducts(companyId: string) {
        return prisma.product.findMany({
            where: {
                companyId,
                isActive: true,
                currentStock: { lte: prisma.product.fields.lowStockThreshold as unknown as number },
            },
        });
    }

    async countByCompany(companyId: string) {
        return prisma.product.count({ where: { companyId, isActive: true } });
    }
}

export const productRepository = new ProductRepository();
