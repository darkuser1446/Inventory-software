import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';

export class DashboardController {
    async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const summary = await dashboardService.getSummary(req.companyId!);
            res.json({ success: true, data: summary });
        } catch (error) {
            next(error);
        }
    }
}

export const dashboardController = new DashboardController();
