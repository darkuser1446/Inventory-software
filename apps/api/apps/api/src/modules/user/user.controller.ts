import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export class UserController {
    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getUsers(req.companyId!);
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.createUser(req.companyId!, req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await userService.updateUser(req.params.id as string, req.companyId!, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await userService.deleteUser(req.params.id as string, req.companyId!, req.userId!);
            res.json({ success: true, message: 'User deleted' });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
