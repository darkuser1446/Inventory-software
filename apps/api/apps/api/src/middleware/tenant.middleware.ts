import { Request, Response, NextFunction } from 'express';

export function tenantMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.companyId) {
        res.status(403).json({
            success: false,
            error: 'Tenant context not available. Ensure authentication.',
        });
        return;
    }
    next();
}
