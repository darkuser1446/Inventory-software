import { productRepository } from './product.repository';
import { AppError } from '../../middleware/error.middleware';
import { stockSyncQueue } from '../../workers/stock-sync.queue';
import { emitStockLow } from '../../services/socket.service';

export class ProductService {
    async getProducts(companyId: string, options: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        return productRepository.findMany(companyId, { ...options, page, limit });
    }

    async getProduct(id: string, companyId: string) {
        const product = await productRepository.findById(id, companyId);
        if (!product) throw new AppError('Product not found', 404);
        return product;
    }

    async createProduct(companyId: string, data: {
        sku: string;
        name: string;
        description?: string;
        price?: number;
        costPrice?: number;
        currentStock?: number;
        lowStockThreshold?: number;
        imageUrl?: string;
    }) {
        const existing = await productRepository.findBySku(data.sku, companyId);
        if (existing) throw new AppError('Product with this SKU already exists', 409);

        return productRepository.create({
            ...data,
            company: { connect: { id: companyId } },
        });
    }

    async updateProduct(id: string, companyId: string, data: {
        name?: string;
        description?: string;
        price?: number;
        costPrice?: number;
        lowStockThreshold?: number;
        imageUrl?: string;
        isActive?: boolean;
    }) {
        await this.getProduct(id, companyId);
        return productRepository.update(id, companyId, data);
    }

    async deleteProduct(id: string, companyId: string) {
        await this.getProduct(id, companyId);
        return productRepository.delete(id, companyId);
    }

    async importFromCSV(companyId: string, records: Array<{
        sku: string;
        name: string;
        description?: string;
        price?: string;
        costPrice?: string;
        currentStock?: string;
        lowStockThreshold?: string;
    }>) {
        const results = { created: 0, updated: 0, errors: [] as string[] };

        for (const record of records) {
            try {
                const existing = await productRepository.findBySku(record.sku, companyId);
                if (existing) {
                    await productRepository.update(existing.id, companyId, {
                        name: record.name,
                        description: record.description,
                        price: record.price ? parseFloat(record.price) : undefined,
                        costPrice: record.costPrice ? parseFloat(record.costPrice) : undefined,
                        currentStock: record.currentStock ? parseInt(record.currentStock, 10) : undefined,
                        lowStockThreshold: record.lowStockThreshold ? parseInt(record.lowStockThreshold, 10) : undefined,
                    });
                    results.updated++;
                } else {
                    await productRepository.create({
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
            } catch (err: any) {
                results.errors.push(`SKU ${record.sku}: ${err.message}`);
            }
        }

        return results;
    }

    async checkLowStockAlerts(companyId: string) {
        const products = await productRepository.findMany(companyId, {
            page: 1,
            limit: 1000,
        });

        const lowStockProducts = products.data.filter(
            (p) => p.isActive && (p.currentStock - p.reservedStock) <= p.lowStockThreshold
        );

        if (lowStockProducts.length > 0) {
            emitStockLow(companyId, lowStockProducts.map((p) => ({
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

export const productService = new ProductService();
