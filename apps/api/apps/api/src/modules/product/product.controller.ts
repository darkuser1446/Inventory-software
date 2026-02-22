import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export class ProductController {
    async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page, limit, search, sortBy, sortOrder } = req.query;
            const result = await productService.getProducts(req.companyId!, {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                search: search as string,
                sortBy: sortBy as string,
                sortOrder: sortOrder as 'asc' | 'desc',
            });

            res.json({
                success: true,
                data: result.data,
                meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
            });
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await productService.getProduct(req.params.id as string, req.companyId!);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await productService.createProduct(req.companyId!, req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await productService.updateProduct(req.params.id as string, req.companyId!, req.body);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await productService.deleteProduct(req.params.id as string, req.companyId!);
            res.json({ success: true, message: 'Product deleted' });
        } catch (error) {
            next(error);
        }
    }

    async importCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, error: 'CSV file required' });
                return;
            }

            const records: any[] = [];
            const stream = Readable.from(req.file.buffer);

            await new Promise<void>((resolve, reject) => {
                stream
                    .pipe(csvParser())
                    .on('data', (data: any) => records.push(data))
                    .on('end', () => resolve())
                    .on('error', (err: Error) => reject(err));
            });

            const result = await productService.importFromCSV(req.companyId!, records);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
