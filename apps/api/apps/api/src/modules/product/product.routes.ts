import { Router } from 'express';
import { productController } from './product.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';
import { roleMiddleware } from '../../middleware/role.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', (req, res, next) => productController.getProducts(req, res, next));
router.get('/:id', (req, res, next) => productController.getProduct(req, res, next));
router.post('/', roleMiddleware('ADMIN'), (req, res, next) => productController.createProduct(req, res, next));
router.put('/:id', roleMiddleware('ADMIN'), (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/:id', roleMiddleware('ADMIN'), (req, res, next) => productController.deleteProduct(req, res, next));
router.post('/import', roleMiddleware('ADMIN'), upload.single('file'), (req, res, next) => productController.importCSV(req, res, next));

export default router;
