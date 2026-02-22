"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_middleware_1 = require("../../middleware/error.middleware");
class UserService {
    async getUsers(companyId) {
        return prisma_1.default.user.findMany({
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
    async createUser(companyId, data) {
        const existing = await prisma_1.default.user.findUnique({
            where: { email_companyId: { email: data.email, companyId } },
        });
        if (existing)
            throw new error_middleware_1.AppError('User with this email already exists', 409);
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        return prisma_1.default.user.create({
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
    async updateUser(id, companyId, data) {
        const user = await prisma_1.default.user.findFirst({ where: { id, companyId } });
        if (!user)
            throw new error_middleware_1.AppError('User not found', 404);
        return prisma_1.default.user.update({
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
    async deleteUser(id, companyId, requestingUserId) {
        if (id === requestingUserId) {
            throw new error_middleware_1.AppError('Cannot delete your own account', 400);
        }
        const user = await prisma_1.default.user.findFirst({ where: { id, companyId } });
        if (!user)
            throw new error_middleware_1.AppError('User not found', 404);
        return prisma_1.default.user.delete({ where: { id } });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map