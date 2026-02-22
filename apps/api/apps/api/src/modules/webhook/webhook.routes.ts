import { Router } from 'express';
import { webhookController } from './webhook.controller';

const router = Router();

// Webhooks are publicly accessible but authenticated via x-company-id + x-webhook-secret headers
router.post('/:source', (req, res, next) => webhookController.handleWebhook(req, res, next));

export default router;
