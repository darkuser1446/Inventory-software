import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next));

export default router;
