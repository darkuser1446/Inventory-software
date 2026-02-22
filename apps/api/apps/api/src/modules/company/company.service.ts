import prisma from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';

export class CompanyService {
    async getCompany(companyId: string) {
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company) throw new AppError('Company not found', 404);
        return company;
    }

    async updateSettings(companyId: string, data: {
        name?: string;
        settings?: any;
        branding?: any;
        featureFlags?: any;
    }) {
        return prisma.company.update({
            where: { id: companyId },
            data,
        });
    }
}

export const companyService = new CompanyService();
