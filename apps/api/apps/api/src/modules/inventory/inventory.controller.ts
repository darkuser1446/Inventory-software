import { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service';

export class InventoryController {
    async adjustStock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, quantity, action, reason } = req.body;
            const result = await inventoryService.adjustStock({
                productId,
                companyId: req.companyId!,
                quantity,
                action,
                reason,
            });
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.query;
            const { page, limit } = req.query;
            const result = await inventoryService.getInventoryLogs(
                req.companyId!,
                productId as string | undefined,
                {
                    page: page ? parseInt(page as string) : undefined,
                    limit: limit ? parseInt(limit as string) : undefined,
                }
            );
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

export const inventoryController = new InventoryController();
