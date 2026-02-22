import { Request, Response, NextFunction } from 'express';
export declare class OrderController {
    getOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    createExternalOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrdersToPack(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const orderController: OrderController;
//# sourceMappingURL=order.controller.d.ts.map