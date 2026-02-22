"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware);
router.get('/summary', (req, res, next) => dashboard_controller_1.dashboardController.getSummary(req, res, next));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map