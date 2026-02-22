"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const auth_schema_1 = require("./auth.schema");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_middleware_1.validate)(auth_schema_1.registerSchema), (req, res, next) => auth_controller_1.authController.register(req, res, next));
router.post('/login', (0, validate_middleware_1.validate)(auth_schema_1.loginSchema), (req, res, next) => auth_controller_1.authController.login(req, res, next));
router.post('/logout', (req, res) => auth_controller_1.authController.logout(req, res));
router.get('/me', auth_middleware_1.authMiddleware, (req, res, next) => auth_controller_1.authController.me(req, res, next));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map