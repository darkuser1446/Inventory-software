import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import type { RegisterInput, LoginInput } from './auth.schema';

export class AuthService {
    async register(input: RegisterInput) {
        const slug = input.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const existingCompany = await prisma.company.findUnique({
            where: { slug },
        });

        if (existingCompany) {
            throw new AppError('Company name already taken', 409);
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);

        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const company = await tx.company.create({
                data: {
                    name: input.companyName,
                    slug,
                },
            });

            const user = await tx.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                    role: 'ADMIN',
                    companyId: company.id,
                },
            });

            return { user, company };
        });

        const token = this.generateToken(result.user.id, result.company.id, result.user.role);

        return {
            token,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
                companyId: result.company.id,
                companyName: result.company.name,
            },
        };
    }

    async login(input: LoginInput) {
        let company;
        let user;

        if (input.companySlug) {
            // Legacy/Specific login with slug
            company = await prisma.company.findUnique({
                where: { slug: input.companySlug },
            });

            if (!company) {
                throw new AppError('Invalid credentials', 401);
            }

            user = await prisma.user.findUnique({
                where: {
                    email_companyId: {
                        email: input.email,
                        companyId: company.id,
                    },
                },
            });
        } else {
            // Login by email only
            const users = await prisma.user.findMany({
                where: { email: input.email },
                include: { company: true },
            });

            if (users.length === 0) {
                throw new AppError('Invalid credentials', 401);
            }

            if (users.length > 1) {
                throw new AppError('Email is associated with multiple companies. Please use company specific login or contact support.', 400);
            }

            user = users[0];
            company = user.company;
        }

        if (!user || !user.isActive) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = this.generateToken(user.id, company.id, user.role);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                companyId: company.id,
                companyName: company.name,
            },
        };
    }

    async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { company: { select: { id: true, name: true, slug: true, branding: true } } },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId,
            company: user.company,
        };
    }

    private generateToken(userId: string, companyId: string, role: string): string {
        const options: SignOptions = {
            expiresIn: env.JWT_EXPIRES_IN as any,
        };
        return jwt.sign({ userId, companyId, role }, env.JWT_SECRET, options);
    }
}

export const authService = new AuthService();
