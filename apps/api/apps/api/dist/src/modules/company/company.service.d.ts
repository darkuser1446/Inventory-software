export declare class CompanyService {
    getCompany(companyId: string): Promise<{
        name: string;
        id: string;
        slug: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        branding: import("@prisma/client/runtime/library").JsonValue;
        featureFlags: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSettings(companyId: string, data: {
        name?: string;
        settings?: any;
        branding?: any;
        featureFlags?: any;
    }): Promise<{
        name: string;
        id: string;
        slug: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        branding: import("@prisma/client/runtime/library").JsonValue;
        featureFlags: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const companyService: CompanyService;
//# sourceMappingURL=company.service.d.ts.map