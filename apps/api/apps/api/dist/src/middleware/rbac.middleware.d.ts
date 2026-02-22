import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types/index';
export declare const checkRole: (roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map