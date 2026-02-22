import { Request, Response, NextFunction } from 'express';
export declare class ProductController {
    getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    createProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    importCSV(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const productController: ProductController;
//# sourceMappingURL=product.controller.d.ts.map