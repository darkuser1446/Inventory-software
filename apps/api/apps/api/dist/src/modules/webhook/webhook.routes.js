"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhook_controller_1 = require("./webhook.controller");
const router = (0, express_1.Router)();
// Webhooks are publicly accessible but authenticated via x-company-id + x-webhook-secret headers
router.post('/:source', (req, res, next) => webhook_controller_1.webhookController.handleWebhook(req, res, next));
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map