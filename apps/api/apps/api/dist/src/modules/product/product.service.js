"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const product_repository_1 = require("./product.repository");
const error_middleware_1 = require("../../middleware/error.middleware");
const socket_service_1 = require("../../services/socket.service");
class ProductService {
    async getProducts(companyId, options) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        return product_repository_1.productRepository.findMany(companyId, { ...options, page, limit });
    }
    async getProduct(id, companyId) {
        const product = await product_repository_1.productRepository.findById(id, companyId);
        if (!product)
            throw new error_middleware_1.AppError('Product not found', 404);
        return product;
    }
    async createProduct(companyId, data) {
        const existing = await product_repository_1.productRepository.findBySku(data.sku, companyId);
        if (existing)
            throw new error_middleware_1.AppError('Product with this SKU already exists', 409);
        return product_repository_1.productRepository.create({
            ...data,
            company: { connect: { id: companyId } },
        });
    }
    async updateProduct(id, companyId, data) {
        await this.getProduct(id, companyId);
        return product_repository_1.productRepository.update(id, companyId, data);
    }
    async deleteProduct(id, companyId) {
        await this.getProduct(id, companyId);
        return product_repository_1.productRepository.delete(id, companyId);
    }
    async importFromCSV(companyId, records) {
        const results = { created: 0, updated: 0, errors: [] };
        for (const record of records) {
            try {
                const existing = await product_repository_1.productRepository.findBySku(record.sku, companyId);
                if (existing) {
                    await product_repository_1.productRepository.update(existing.id, companyId, {
                        name: record.name,
                        description: record.description,
                        price: record.price ? parseFloat(record.price) : undefined,
                        costPrice: record.costPrice ? parseFloat(record.costPrice) : undefined,
                        currentStock: record.currentStock ? parseInt(record.currentStock, 10) : undefined,
                        lowStockThreshold: record.lowStockThreshold ? parseInt(record.lowStockThreshold, 10) : undefined,
                    });
                    results.updated++;
                }
                else {
                    await product_repository_1.productRepository.create({
                        sku: record.sku,
                        name: record.name,
                        description: record.description,
                        price: record.price ? parseFloat(record.price) : 0,
                        costPrice: record.costPrice ? parseFloat(record.costPrice) : 0,
                        currentStock: record.currentStock ? parseInt(record.currentStock, 10) : 0,
                        lowStockThreshold: record.lowStockThreshold ? parseInt(record.lowStockThreshold, 10) : 10,
                        company: { connect: { id: companyId } },
                    });
                    results.created++;
                }
            }
            catch (err) {
                results.errors.push(`SKU ${record.sku}: ${err.message}`);
            }
        }
        return results;
    }
    async checkLowStockAlerts(companyId) {
        const products = await product_repository_1.productRepository.findMany(companyId, {
            page: 1,
            limit: 1000,
        });
        const lowStockProducts = products.data.filter((p) => p.isActive && (p.currentStock - p.reservedStock) <= p.lowStockThreshold);
        if (lowStockProducts.length > 0) {
            (0, socket_service_1.emitStockLow)(companyId, lowStockProducts.map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                available: p.currentStock - p.reservedStock,
                threshold: p.lowStockThreshold,
            })));
        }
        return lowStockProducts;
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
//# sourceMappingURL=product.service.js.map