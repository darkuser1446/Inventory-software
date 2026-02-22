import { UserRole } from '@prisma/client';

interface AuthenticatedUser {
    userId: string;
    companyId: string;
    role: UserRole;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            companyId?: string;
            userRole?: UserRole;
            user?: AuthenticatedUser;
        }
    }
}

export { };
