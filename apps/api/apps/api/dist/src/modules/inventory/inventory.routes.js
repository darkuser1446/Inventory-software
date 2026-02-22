"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = require("./inventory.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware);
router.post('/adjust', (0, role_middleware_1.roleMiddleware)('ADMIN'), (req, res, next) => inventory_controller_1.inventoryController.adjustStock(req, res, next));
router.get('/logs', (req, res, next) => inventory_controller_1.inventoryController.getLogs(req, res, next));
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map