"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
class DashboardController {
    async getSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.dashboardService.getSummary(req.companyId);
            res.json({ success: true, data: summary });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map