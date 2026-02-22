"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
class ProductController {
    async getProducts(req, res, next) {
        try {
            const { page, limit, search, sortBy, sortOrder } = req.query;
            const result = await product_service_1.productService.getProducts(req.companyId, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            res.json({
                success: true,
                data: result.data,
                meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProduct(req, res, next) {
        try {
            const product = await product_service_1.productService.getProduct(req.params.id, req.companyId);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    }
    async createProduct(req, res, next) {
        try {
            const product = await product_service_1.productService.createProduct(req.companyId, req.body);
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProduct(req, res, next) {
        try {
            const product = await product_service_1.productService.updateProduct(req.params.id, req.companyId, req.body);
            res.json({ success: true, data: product });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteProduct(req, res, next) {
        try {
            await product_service_1.productService.deleteProduct(req.params.id, req.companyId);
            res.json({ success: true, message: 'Product deleted' });
        }
        catch (error) {
            next(error);
        }
    }
    async importCSV(req, res, next) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, error: 'CSV file required' });
                return;
            }
            const records = [];
            const stream = stream_1.Readable.from(req.file.buffer);
            await new Promise((resolve, reject) => {
                stream
                    .pipe((0, csv_parser_1.default)())
                    .on('data', (data) => records.push(data))
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err));
            });
            const result = await product_service_1.productService.importFromCSV(req.companyId, records);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
exports.productController = new ProductController();
//# sourceMappingURL=product.controller.js.map