"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const env_1 = require("../../config/env");
class AuthController {
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });
            res.status(201).json({ success: true, data: result.user });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
            });
            res.status(200).json({ success: true, data: result.user });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(_req, res) {
        res.clearCookie('token', { path: '/' });
        res.status(200).json({ success: true, message: 'Logged out' });
    }
    async me(req, res, next) {
        try {
            const user = await auth_service_1.authService.getMe(req.userId);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map