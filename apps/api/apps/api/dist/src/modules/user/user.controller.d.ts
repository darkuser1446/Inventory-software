import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map