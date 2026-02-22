import { Router } from 'express';
import { companyController } from './company.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';
import { roleMiddleware } from '../../middleware/role.middleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware, roleMiddleware('ADMIN'));

router.get('/', (req, res, next) => companyController.getCompany(req, res, next));
router.put('/', (req, res, next) => companyController.updateSettings(req, res, next));

export default router;
