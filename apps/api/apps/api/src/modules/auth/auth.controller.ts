import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { env } from '../../config/env';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.register(req.body);

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });

            res.status(201).json({ success: true, data: result.user });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.login(req.body);

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });

            res.status(200).json({ success: true, data: result.user });
        } catch (error) {
            next(error);
        }
    }

    async logout(_req: Request, res: Response): Promise<void> {
        res.clearCookie('token', { path: '/' });
        res.status(200).json({ success: true, message: 'Logged out' });
    }

    async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await authService.getMe(req.userId!);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
