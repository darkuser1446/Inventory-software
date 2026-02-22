"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const integration_controller_1 = require("./integration.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'));
router.get('/', (req, res, next) => integration_controller_1.integrationController.getIntegrations(req, res, next));
router.get('/:id', (req, res, next) => integration_controller_1.integrationController.getIntegration(req, res, next));
router.post('/', (req, res, next) => integration_controller_1.integrationController.createIntegration(req, res, next));
router.put('/:id', (req, res, next) => integration_controller_1.integrationController.updateIntegration(req, res, next));
router.delete('/:id', (req, res, next) => integration_controller_1.integrationController.deleteIntegration(req, res, next));
exports.default = router;
//# sourceMappingURL=integration.routes.js.map