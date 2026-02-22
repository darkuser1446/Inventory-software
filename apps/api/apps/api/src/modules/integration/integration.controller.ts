import { Request, Response, NextFunction } from 'express';
import { integrationService } from './integration.service';

export class IntegrationController {
    async getIntegrations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const integrations = await integrationService.getIntegrations(req.companyId!);
            res.json({ success: true, data: integrations });
        } catch (error) {
            next(error);
        }
    }

    async getIntegration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const integration = await integrationService.getIntegration(req.params.id as string, req.companyId!);
            res.json({ success: true, data: integration });
        } catch (error) {
            next(error);
        }
    }

    async createIntegration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const integration = await integrationService.createIntegration(req.companyId!, req.body);
            res.status(201).json({ success: true, data: integration });
        } catch (error) {
            next(error);
        }
    }

    async updateIntegration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const integration = await integrationService.updateIntegration(req.params.id as string, req.companyId!, req.body);
            res.json({ success: true, data: integration });
        } catch (error) {
            next(error);
        }
    }

    async deleteIntegration(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await integrationService.deleteIntegration(req.params.id as string, req.companyId!);
            res.json({ success: true, message: 'Integration deleted' });
        } catch (error) {
            next(error);
        }
    }
}

export const integrationController = new IntegrationController();
