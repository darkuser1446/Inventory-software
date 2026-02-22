import { Prisma } from '@prisma/client';
import type { RegisterInput, LoginInput } from './auth.schema';
export declare class AuthService {
    register(input: RegisterInput): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            companyId: string;
            companyName: string;
        };
    }>;
    login(input: LoginInput): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            companyId: string;
            companyName: string;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        companyId: string;
        company: {
            name: string;
            id: string;
            slug: string;
            branding: Prisma.JsonValue;
        };
    }>;
    private generateToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map