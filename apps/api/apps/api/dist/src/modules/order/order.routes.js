"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware);
router.get('/', (req, res, next) => order_controller_1.orderController.getOrders(req, res, next));
router.get('/to-pack', (req, res, next) => order_controller_1.orderController.getOrdersToPack(req, res, next));
router.get('/:id', (req, res, next) => order_controller_1.orderController.getOrder(req, res, next));
router.post('/external', (req, res, next) => order_controller_1.orderController.createExternalOrder(req, res, next));
router.patch('/:id/status', (req, res, next) => order_controller_1.orderController.updateStatus(req, res, next));
exports.default = router;
//# sourceMappingURL=order.routes.js.map