import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';
import { roleMiddleware } from '../../middleware/role.middleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.post('/adjust', roleMiddleware('ADMIN'), (req, res, next) => inventoryController.adjustStock(req, res, next));
router.get('/logs', (req, res, next) => inventoryController.getLogs(req, res, next));

export default router;
