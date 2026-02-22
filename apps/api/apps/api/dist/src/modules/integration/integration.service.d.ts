import { Prisma, OrderSource } from '@prisma/client';
export declare class IntegrationService {
    getIntegrations(companyId: string): Promise<{
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }[]>;
    getIntegration(id: string, companyId: string): Promise<{
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        apiKey: string | null;
        apiSecret: string | null;
        webhookSecret: string | null;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }>;
    getDecryptedCredentials(id: string, companyId: string): Promise<{
        apiKey: string | undefined;
        apiSecret: string | undefined;
        webhookSecret: string | undefined;
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }>;
    createIntegration(companyId: string, data: {
        platform: OrderSource;
        name: string;
        apiKey?: string;
        apiSecret?: string;
        webhookSecret?: string;
        endpoint?: string;
        settings?: any;
    }): Promise<{
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        apiKey: string | null;
        apiSecret: string | null;
        webhookSecret: string | null;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }>;
    updateIntegration(id: string, companyId: string, data: {
        name?: string;
        apiKey?: string;
        apiSecret?: string;
        webhookSecret?: string;
        endpoint?: string;
        isActive?: boolean;
        settings?: any;
    }): Promise<{
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        apiKey: string | null;
        apiSecret: string | null;
        webhookSecret: string | null;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }>;
    deleteIntegration(id: string, companyId: string): Promise<{
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        apiKey: string | null;
        apiSecret: string | null;
        webhookSecret: string | null;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }>;
    getActiveIntegrations(companyId: string): Promise<{
        name: string;
        id: string;
        settings: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        isActive: boolean;
        platform: import(".prisma/client").$Enums.OrderSource;
        apiKey: string | null;
        apiSecret: string | null;
        webhookSecret: string | null;
        endpoint: string | null;
        lastSyncAt: Date | null;
    }[]>;
}
export declare const integrationService: IntegrationService;
//# sourceMappingURL=integration.service.d.ts.map