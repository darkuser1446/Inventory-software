import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));

export default router;
