"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../config/prisma"));
async function authMiddleware(req, res, next) {
    try {
        // TEMPORARY: Debug Auth Bypass
        if (process.env.DEBUG_AUTH === 'true') {
            req.userId = 'debug-user';
            req.companyId = 'debug-company';
            req.userRole = 'ADMIN';
            // @ts-ignore - Injecting full user object for compatibility if needed, though individual fields are set above
            req.user = {
                id: 'debug-user',
                email: 'debug@local',
                role: 'ADMIN',
                companyId: 'debug-company',
            };
            next();
            return;
        }
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ success: false, error: 'Authentication required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, companyId: true, role: true, isActive: true },
        });
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, error: 'User not found or inactive' });
            return;
        }
        req.userId = user.id;
        req.companyId = user.companyId;
        req.userRole = user.role;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.middleware.js.map