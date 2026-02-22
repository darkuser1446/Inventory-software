import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/prisma';

interface JwtPayload {
    userId: string;
    companyId: string;
    role: string;
}

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
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
            } as any;
            next();
            return;
        }

        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ success: false, error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
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
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
}
