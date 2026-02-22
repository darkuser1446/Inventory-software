"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRepository = exports.InventoryRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class InventoryRepository {
    async createLog(data) {
        return prisma_1.default.inventoryLog.create({ data });
    }
    async getLogsByProduct(productId, companyId, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { productId, companyId };
        const [data, total] = await Promise.all([
            prisma_1.default.inventoryLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { product: { select: { sku: true, name: true } } },
            }),
            prisma_1.default.inventoryLog.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getLogsByCompany(companyId, options) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { companyId };
        const [data, total] = await Promise.all([
            prisma_1.default.inventoryLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { product: { select: { sku: true, name: true } } },
            }),
            prisma_1.default.inventoryLog.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
}
exports.InventoryRepository = InventoryRepository;
exports.inventoryRepository = new InventoryRepository();
//# sourceMappingURL=inventory.repository.js.map