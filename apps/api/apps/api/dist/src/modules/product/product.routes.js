"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tenant_middleware_1 = require("../../middleware/tenant.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware, tenant_middleware_1.tenantMiddleware);
router.get('/', (req, res, next) => product_controller_1.productController.getProducts(req, res, next));
router.get('/:id', (req, res, next) => product_controller_1.productController.getProduct(req, res, next));
router.post('/', (0, role_middleware_1.roleMiddleware)('ADMIN'), (req, res, next) => product_controller_1.productController.createProduct(req, res, next));
router.put('/:id', (0, role_middleware_1.roleMiddleware)('ADMIN'), (req, res, next) => product_controller_1.productController.updateProduct(req, res, next));
router.delete('/:id', (0, role_middleware_1.roleMiddleware)('ADMIN'), (req, res, next) => product_controller_1.productController.deleteProduct(req, res, next));
router.post('/import', (0, role_middleware_1.roleMiddleware)('ADMIN'), upload.single('file'), (req, res, next) => product_controller_1.productController.importCSV(req, res, next));
exports.default = router;
//# sourceMappingURL=product.routes.js.map