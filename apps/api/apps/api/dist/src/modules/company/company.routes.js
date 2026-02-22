"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("./company.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'));
router.get('/', (req, res, next) => company_controller_1.companyController.getCompany(req, res, next));
router.put('/', (req, res, next) => company_controller_1.companyController.updateSettings(req, res, next));
exports.default = router;
//# sourceMappingURL=company.routes.js.map