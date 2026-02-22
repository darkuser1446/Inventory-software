import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantMiddleware } from '../../middleware/tenant.middleware';
import { roleMiddleware } from '../../middleware/role.middleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware, roleMiddleware('ADMIN'));

router.get('/', (req, res, next) => userController.getUsers(req, res, next));
router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.put('/:id', (req, res, next) => userController.updateUser(req, res, next));
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default router;
