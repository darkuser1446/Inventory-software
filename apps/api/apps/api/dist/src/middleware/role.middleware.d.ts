import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
export declare function roleMiddleware(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map