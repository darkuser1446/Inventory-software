"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMiddleware = tenantMiddleware;
function tenantMiddleware(req, res, next) {
    if (!req.companyId) {
        res.status(403).json({
            success: false,
            error: 'Tenant context not available. Ensure authentication.',
        });
        return;
    }
    next();
}
//# sourceMappingURL=tenant.middleware.js.map