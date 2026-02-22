import { Router } from 'express';
import { integrationController } from './integration.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';
import { roleMiddleware } from '../../middleware/role.middleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware, roleMiddleware('ADMIN'));

router.get('/', (req, res, next) => integrationController.getIntegrations(req, res, next));
router.get('/:id', (req, res, next) => integrationController.getIntegration(req, res, next));
router.post('/', (req, res, next) => integrationController.createIntegration(req, res, next));
router.put('/:id', (req, res, next) => integrationController.updateIntegration(req, res, next));
router.delete('/:id', (req, res, next) => integrationController.deleteIntegration(req, res, next));

export default router;
