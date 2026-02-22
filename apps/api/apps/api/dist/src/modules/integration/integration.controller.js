"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationController = exports.IntegrationController = void 0;
const integration_service_1 = require("./integration.service");
class IntegrationController {
    async getIntegrations(req, res, next) {
        try {
            const integrations = await integration_service_1.integrationService.getIntegrations(req.companyId);
            res.json({ success: true, data: integrations });
        }
        catch (error) {
            next(error);
        }
    }
    async getIntegration(req, res, next) {
        try {
            const integration = await integration_service_1.integrationService.getIntegration(req.params.id, req.companyId);
            res.json({ success: true, data: integration });
        }
        catch (error) {
            next(error);
        }
    }
    async createIntegration(req, res, next) {
        try {
            const integration = await integration_service_1.integrationService.createIntegration(req.companyId, req.body);
            res.status(201).json({ success: true, data: integration });
        }
        catch (error) {
            next(error);
        }
    }
    async updateIntegration(req, res, next) {
        try {
            const integration = await integration_service_1.integrationService.updateIntegration(req.params.id, req.companyId, req.body);
            res.json({ success: true, data: integration });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteIntegration(req, res, next) {
        try {
            await integration_service_1.integrationService.deleteIntegration(req.params.id, req.companyId);
            res.json({ success: true, message: 'Integration deleted' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.IntegrationController = IntegrationController;
exports.integrationController = new IntegrationController();
//# sourceMappingURL=integration.controller.js.map