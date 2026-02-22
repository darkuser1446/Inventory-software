"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("./user.service");
class UserController {
    async getUsers(req, res, next) {
        try {
            const users = await user_service_1.userService.getUsers(req.companyId);
            res.json({ success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    }
    async createUser(req, res, next) {
        try {
            const user = await user_service_1.userService.createUser(req.companyId, req.body);
            res.status(201).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await user_service_1.userService.updateUser(req.params.id, req.companyId, req.body);
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            await user_service_1.userService.deleteUser(req.params.id, req.companyId, req.userId);
            res.json({ success: true, message: 'User deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map