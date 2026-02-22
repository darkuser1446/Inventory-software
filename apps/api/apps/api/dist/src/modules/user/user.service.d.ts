import { UserRole } from '@prisma/client';
export declare class UserService {
    getUsers(companyId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }[]>;
    createUser(companyId: string, data: {
        email: string;
        password: string;
        name: string;
        role: UserRole;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    updateUser(id: string, companyId: string, data: {
        name?: string;
        role?: UserRole;
        isActive?: boolean;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    deleteUser(id: string, companyId: string, requestingUserId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        companyId: string;
        isActive: boolean;
    }>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map