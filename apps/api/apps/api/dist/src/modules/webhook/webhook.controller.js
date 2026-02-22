"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookController = exports.WebhookController = void 0;
const webhook_service_1 = require("./webhook.service");
const prisma_1 = __importDefault(require("../../config/prisma"));
class WebhookController {
    /**
     * POST /webhooks/:source
     * Incoming webhook from marketplace (Amazon, Flipkart, etc.)
     * Requires integration to exist and be active for the company.
     */
    async handleWebhook(req, res, next) {
        try {
            const { source } = req.params;
            const sourceUpper = source.toUpperCase();
            // Find integration to determine which company this webhook belongs to
            // In production, webhooks are typically authenticated via webhook secrets
            const companyId = req.headers['x-company-id'];
            const eventType = req.headers['x-event-type']?.toUpperCase();
            const webhookSecret = req.headers['x-webhook-secret'];
            if (!companyId) {
                res.status(400).json({ success: false, error: 'x-company-id header required' });
                return;
            }
            // Verify integration exists and secret matches
            const integration = await prisma_1.default.integration.findFirst({
                where: {
                    companyId,
                    platform: sourceUpper,
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
            const order = await webhook_service_1.webhookService.handleIncomingOrder(sourceUpper, req.body, companyId);
            res.status(201).json({ success: true, data: { orderId: order.id, orderNumber: order.orderNumber } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WebhookController = WebhookController;
exports.webhookController = new WebhookController();
//# sourceMappingURL=webhook.controller.js.map