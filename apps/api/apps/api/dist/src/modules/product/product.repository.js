"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = exports.ProductRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class ProductRepository {
    async findMany(companyId, options) {
        const { page, limit, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            prisma_1.default.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma_1.default.product.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id, companyId) {
        return prisma_1.default.product.findFirst({ where: { id, companyId } });
    }
    async findBySku(sku, companyId) {
        return prisma_1.default.product.findUnique({ where: { sku_companyId: { sku, companyId } } });
    }
    async create(data) {
        return prisma_1.default.product.create({ data });
    }
    async update(id, companyId, data) {
        return prisma_1.default.product.update({ where: { id }, data });
    }
    async delete(id, companyId) {
        return prisma_1.default.product.delete({ where: { id } });
    }
    async getLowStockProducts(companyId) {
        return prisma_1.default.product.findMany({
            where: {
                companyId,
                isActive: true,
                currentStock: { lte: prisma_1.default.product.fields.lowStockThreshold },
            },
        });
    }
    async countByCompany(companyId) {
        return prisma_1.default.product.count({ where: { companyId, isActive: true } });
    }
}
exports.ProductRepository = ProductRepository;
exports.productRepository = new ProductRepository();
//# sourceMappingURL=product.repository.js.map