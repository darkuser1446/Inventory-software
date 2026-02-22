"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware, (0, role_middleware_1.roleMiddleware)('ADMIN'));
router.get('/', (req, res, next) => user_controller_1.userController.getUsers(req, res, next));
router.post('/', (req, res, next) => user_controller_1.userController.createUser(req, res, next));
router.put('/:id', (req, res, next) => user_controller_1.userController.updateUser(req, res, next));
router.delete('/:id', (req, res, next) => user_controller_1.userController.deleteUser(req, res, next));
exports.default = router;
//# sourceMappingURL=user.routes.js.map