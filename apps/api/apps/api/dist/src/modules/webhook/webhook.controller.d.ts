import { Request, Response, NextFunction } from 'express';
export declare class WebhookController {
    /**
     * POST /webhooks/:source
     * Incoming webhook from marketplace (Amazon, Flipkart, etc.)
     * Requires integration to exist and be active for the company.
     */
    handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const webhookController: WebhookController;
//# sourceMappingURL=webhook.controller.d.ts.map