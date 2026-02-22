import { Router } from 'express';
import { orderController } from './order.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', (req, res, next) => orderController.getOrders(req, res, next));
router.get('/to-pack', (req, res, next) => orderController.getOrdersToPack(req, res, next));
router.get('/:id', (req, res, next) => orderController.getOrder(req, res, next));
router.post('/external', (req, res, next) => orderController.createExternalOrder(req, res, next));
router.patch('/:id/status', (req, res, next) => orderController.updateStatus(req, res, next));

export default router;
