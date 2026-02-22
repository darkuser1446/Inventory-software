import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

export function roleMiddleware(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.userRole) {
            res.status(403).json({ success: false, error: 'Role not determined' });
            return;
        }

        if (!allowedRoles.includes(req.userRole)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
            });
            return;
        }

        next();
    };
}
