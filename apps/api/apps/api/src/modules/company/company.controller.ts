import { Request, Response, NextFunction } from 'express';
import { companyService } from './company.service';

export class CompanyController {
    async getCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const company = await companyService.getCompany(req.companyId!);
            res.json({ success: true, data: company });
        } catch (error) {
            next(error);
        }
    }

    async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const company = await companyService.updateSettings(req.companyId!, req.body);
            res.json({ success: true, data: company });
        } catch (error) {
            next(error);
        }
    }
}

export const companyController = new CompanyController();
