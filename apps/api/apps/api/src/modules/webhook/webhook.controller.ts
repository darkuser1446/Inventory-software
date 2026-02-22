import { Request, Response, NextFunction } from 'express';
import { webhookService } from './webhook.service';
import prisma from '../../config/prisma';

export class WebhookController {
    /**
     * POST /webhooks/:source
     * Incoming webhook from marketplace (Amazon, Flipkart, etc.)
     * Requires integration to exist and be active for the company.
     */
    async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { source } = req.params;
            const sourceUpper = (source as string).toUpperCase();

            // Find integration to determine which company this webhook belongs to
            // In production, webhooks are typically authenticated via webhook secrets
            const companyId = req.headers['x-company-id'] as string;
            const eventType = (req.headers['x-event-type'] as string)?.toUpperCase();
            const webhookSecret = req.headers['x-webhook-secret'] as string;

            if (!companyId) {
                res.status(400).json({ success: false, error: 'x-company-id header required' });
                return;
            }

            // Verify integration exists and secret matches
            const integration = await prisma.integration.findFirst({
                where: {
                    companyId,
                    platform: sourceUpper as any,
                    isActive: true,
                },
            });

            if (!integration) {
                res.status(404).json({ success: false, error: `No active integration found for ${source}` });
                return;
            }

            if (integration.webhookSecret && integration.webhookSecret !== webhookSecret) {
                res.status(401).json({ success: false, error: 'Invalid webhook secret' });
                return;
            }

            const order = await webhookService.handleIncomingOrder(sourceUpper, req.body, companyId);

            res.status(201).json({ success: true, data: { orderId: order.id, orderNumber: order.orderNumber } });
        } catch (error) {
            next(error);
        }
    }
}

export const webhookController = new WebhookController();
