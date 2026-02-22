"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = exports.CompanyService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const error_middleware_1 = require("../../middleware/error.middleware");
class CompanyService {
    async getCompany(companyId) {
        const company = await prisma_1.default.company.findUnique({ where: { id: companyId } });
        if (!company)
            throw new error_middleware_1.AppError('Company not found', 404);
        return company;
    }
    async updateSettings(companyId, data) {
        return prisma_1.default.company.update({
            where: { id: companyId },
            data,
        });
    }
}
exports.CompanyService = CompanyService;
exports.companyService = new CompanyService();
//# sourceMappingURL=company.service.js.map