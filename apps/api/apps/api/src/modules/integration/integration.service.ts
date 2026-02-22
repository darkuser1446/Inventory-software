import prisma from '../../config/prisma';
import { Prisma, OrderSource } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { encrypt, decrypt } from '../../lib/crypto';

export class IntegrationService {
    async getIntegrations(companyId: string) {
        return prisma.integration.findMany({
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

    async getIntegration(id: string, companyId: string) {
        const integration = await prisma.integration.findFirst({
            where: { id, companyId },
        });
        if (!integration) throw new AppError('Integration not found', 404);
        return integration;
    }

    async getDecryptedCredentials(id: string, companyId: string) {
        const integration = await this.getIntegration(id, companyId);
        return {
            ...integration,
            apiKey: integration.apiKey ? decrypt(integration.apiKey) : undefined,
            apiSecret: integration.apiSecret ? decrypt(integration.apiSecret) : undefined,
            webhookSecret: integration.webhookSecret ? decrypt(integration.webhookSecret) : undefined,
        };
    }

    async createIntegration(companyId: string, data: {
        platform: OrderSource;
        name: string;
        apiKey?: string;
        apiSecret?: string;
        webhookSecret?: string;
        endpoint?: string;
        settings?: any;
    }) {
        const existing = await prisma.integration.findUnique({
            where: { platform_companyId: { platform: data.platform, companyId } },
        });

        if (existing) throw new AppError('Integration for this platform already exists', 409);

        // Encrypt sensitive fields
        if (data.apiKey) data.apiKey = encrypt(data.apiKey);
        if (data.apiSecret) data.apiSecret = encrypt(data.apiSecret);
        if (data.webhookSecret) data.webhookSecret = encrypt(data.webhookSecret);

        return prisma.integration.create({
            data: { ...data, companyId },
        });
    }

    async updateIntegration(id: string, companyId: string, data: {
        name?: string;
        apiKey?: string;
        apiSecret?: string;
        webhookSecret?: string;
        endpoint?: string;
        isActive?: boolean;
        settings?: any;
    }) {
        await this.getIntegration(id, companyId);

        // Encrypt sensitive fields if provided
        if (data.apiKey) data.apiKey = encrypt(data.apiKey);
        if (data.apiSecret) data.apiSecret = encrypt(data.apiSecret);
        if (data.webhookSecret) data.webhookSecret = encrypt(data.webhookSecret);

        return prisma.integration.update({ where: { id }, data });
    }

    async deleteIntegration(id: string, companyId: string) {
        await this.getIntegration(id, companyId);
        return prisma.integration.delete({ where: { id } });
    }

    async getActiveIntegrations(companyId: string) {
        return prisma.integration.findMany({
            where: { companyId, isActive: true },
        });
    }
}

export const integrationService = new IntegrationService();
