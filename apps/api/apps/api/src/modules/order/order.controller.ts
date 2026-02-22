import { Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';

export class OrderController {
    async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page, limit, status, source, search, sortBy, sortOrder } = req.query;
            const result = await orderService.getOrders(req.companyId!, {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                status: status as string,
                source: source as string,
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

    async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const order = await orderService.getOrder(req.params.id as string, req.companyId!);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async createExternalOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const order = await orderService.createExternalOrder(req.companyId!, req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status } = req.body;
            const order = await orderService.updateStatus(req.params.id as string, req.companyId!, status);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    }

    async getOrdersToPack(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page, limit } = req.query;
            const result = await orderService.getOrdersToPack(req.companyId!, {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
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
}

export const orderController = new OrderController();
