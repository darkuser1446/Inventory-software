import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import { AppError } from '../../middleware/error.middleware';
import { UserRole } from '@prisma/client';

export class UserService {
    async getUsers(companyId: string) {
        return prisma.user.findMany({
            where: { companyId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createUser(companyId: string, data: {
        email: string;
        password: string;
        name: string;
        role: UserRole;
    }) {
        const existing = await prisma.user.findUnique({
            where: { email_companyId: { email: data.email, companyId } },
        });

        if (existing) throw new AppError('User with this email already exists', 409);

        const hashedPassword = await bcrypt.hash(data.password, 12);

        return prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                companyId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    async updateUser(id: string, companyId: string, data: {
        name?: string;
        role?: UserRole;
        isActive?: boolean;
    }) {
        const user = await prisma.user.findFirst({ where: { id, companyId } });
        if (!user) throw new AppError('User not found', 404);

        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    async deleteUser(id: string, companyId: string, requestingUserId: string) {
        if (id === requestingUserId) {
            throw new AppError('Cannot delete your own account', 400);
        }

        const user = await prisma.user.findFirst({ where: { id, companyId } });
        if (!user) throw new AppError('User not found', 404);

        return prisma.user.delete({ where: { id } });
    }
}

export const userService = new UserService();
