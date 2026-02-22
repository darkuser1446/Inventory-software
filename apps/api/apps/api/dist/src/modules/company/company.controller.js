"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyController = exports.CompanyController = void 0;
const company_service_1 = require("./company.service");
class CompanyController {
    async getCompany(req, res, next) {
        try {
            const company = await company_service_1.companyService.getCompany(req.companyId);
            res.json({ success: true, data: company });
        }
        catch (error) {
            next(error);
        }
    }
    async updateSettings(req, res, next) {
        try {
            const company = await company_service_1.companyService.updateSettings(req.companyId, req.body);
            res.json({ success: true, data: company });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CompanyController = CompanyController;
exports.companyController = new CompanyController();
//# sourceMappingURL=company.controller.js.map