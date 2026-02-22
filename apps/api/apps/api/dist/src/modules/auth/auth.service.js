"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const env_1 = require("../../config/env");
const error_middleware_1 = require("../../middleware/error.middleware");
class AuthService {
    async register(input) {
        const slug = input.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const existingCompany = await prisma_1.default.company.findUnique({
            where: { slug },
        });
        if (existingCompany) {
            throw new error_middleware_1.AppError('Company name already taken', 409);
        }
        const hashedPassword = await bcryptjs_1.default.hash(input.password, 12);
        const result = await prisma_1.default.$transaction(async (tx) => {
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
    async login(input) {
        let company;
        let user;
        if (input.companySlug) {
            // Legacy/Specific login with slug
            company = await prisma_1.default.company.findUnique({
                where: { slug: input.companySlug },
            });
            if (!company) {
                throw new error_middleware_1.AppError('Invalid credentials', 401);
            }
            user = await prisma_1.default.user.findUnique({
                where: {
                    email_companyId: {
                        email: input.email,
                        companyId: company.id,
                    },
                },
            });
        }
        else {
            // Login by email only
            const users = await prisma_1.default.user.findMany({
                where: { email: input.email },
                include: { company: true },
            });
            if (users.length === 0) {
                throw new error_middleware_1.AppError('Invalid credentials', 401);
            }
            if (users.length > 1) {
                throw new error_middleware_1.AppError('Email is associated with multiple companies. Please use company specific login or contact support.', 400);
            }
            user = users[0];
            company = user.company;
        }
        if (!user || !user.isActive) {
            throw new error_middleware_1.AppError('Invalid credentials', 401);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('Invalid credentials', 401);
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
    async getMe(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { company: { select: { id: true, name: true, slug: true, branding: true } } },
        });
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
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
    generateToken(userId, companyId, role) {
        const options = {
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        };
        return jsonwebtoken_1.default.sign({ userId, companyId, role }, env_1.env.JWT_SECRET, options);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map