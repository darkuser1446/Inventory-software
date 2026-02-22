import { Request, Response, NextFunction } from 'express';
export declare class IntegrationController {
    getIntegrations(req: Request, res: Response, next: NextFunction): Promise<void>;
    getIntegration(req: Request, res: Response, next: NextFunction): Promise<void>;
    createIntegration(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateIntegration(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteIntegration(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const integrationController: IntegrationController;
//# sourceMappingURL=integration.controller.d.ts.map