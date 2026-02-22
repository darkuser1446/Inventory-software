"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationService = exports.IntegrationService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const error_middleware_1 = require("../../middleware/error.middleware");
const crypto_1 = require("../../lib/crypto");
class IntegrationService {
    async getIntegrations(companyId) {
        return prisma_1.default.integration.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                platform: true,
                name: true,
                endpoint: true,
                isActive: true,
                lastSyncAt: true,
                settings: true,
                createdAt: true,
                // Omit apiKey, apiSecret, webhookSecret for security
            },
        });
    }
    async getIntegration(id, companyId) {
        const integration = await prisma_1.default.integration.findFirst({
            where: { id, companyId },
        });
        if (!integration)
            throw new error_middleware_1.AppError('Integration not found', 404);
        return integration;
    }
    async getDecryptedCredentials(id, companyId) {
        const integration = await this.getIntegration(id, companyId);
        return {
            ...integration,
            apiKey: integration.apiKey ? (0, crypto_1.decrypt)(integration.apiKey) : undefined,
            apiSecret: integration.apiSecret ? (0, crypto_1.decrypt)(integration.apiSecret) : undefined,
            webhookSecret: integration.webhookSecret ? (0, crypto_1.decrypt)(integration.webhookSecret) : undefined,
        };
    }
    async createIntegration(companyId, data) {
        const existing = await prisma_1.default.integration.findUnique({
            where: { platform_companyId: { platform: data.platform, companyId } },
        });
        if (existing)
            throw new error_middleware_1.AppError('Integration for this platform already exists', 409);
        // Encrypt sensitive fields
        if (data.apiKey)
            data.apiKey = (0, crypto_1.encrypt)(data.apiKey);
        if (data.apiSecret)
            data.apiSecret = (0, crypto_1.encrypt)(data.apiSecret);
        if (data.webhookSecret)
            data.webhookSecret = (0, crypto_1.encrypt)(data.webhookSecret);
        return prisma_1.default.integration.create({
            data: { ...data, companyId },
        });
    }
    async updateIntegration(id, companyId, data) {
        await this.getIntegration(id, companyId);
        // Encrypt sensitive fields if provided
        if (data.apiKey)
            data.apiKey = (0, crypto_1.encrypt)(data.apiKey);
        if (data.apiSecret)
            data.apiSecret = (0, crypto_1.encrypt)(data.apiSecret);
        if (data.webhookSecret)
            data.webhookSecret = (0, crypto_1.encrypt)(data.webhookSecret);
        return prisma_1.default.integration.update({ where: { id }, data });
    }
    async deleteIntegration(id, companyId) {
        await this.getIntegration(id, companyId);
        return prisma_1.default.integration.delete({ where: { id } });
    }
    async getActiveIntegrations(companyId) {
        return prisma_1.default.integration.findMany({
            where: { companyId, isActive: true },
        });
    }
}
exports.IntegrationService = IntegrationService;
exports.integrationService = new IntegrationService();
//# sourceMappingURL=integration.service.js.map