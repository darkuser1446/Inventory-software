"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        if (!req.userRole) {
            res.status(403).json({ success: false, error: 'Role not determined' });
            return;
        }
        if (!allowedRoles.includes(req.userRole)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map