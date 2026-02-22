
import { PrismaClient } from '@prisma/client';
import prisma from '../src/config/prisma';

async function main() {
    console.log('🔍 Verifying Login Data...');

    const companySlug = 'demo-company';
    const email = 'admin@demo.com';

    // 1. Check Company
    const company = await prisma.company.findUnique({
        where: { slug: companySlug },
    });

    if (!company) {
        console.error(`❌ Company with slug "${companySlug}" not found!`);
    } else {
        console.log(`✅ Company found: ${company.name} (${company.id})`);
    }

    // 2. Check User
    if (company) {
        const user = await prisma.user.findUnique({
            where: {
                email_companyId: {
                    email: email,
                    companyId: company.id,
                },
            },
        });

        if (!user) {
            console.error(`❌ User with email "${email}" and company ID "${company.id}" not found!`);
        } else {
            console.log(`✅ User found: ${user.name} (${user.id})`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Is Active: ${user.isActive}`);
            console.log(`   Password Hash length: ${user.password.length}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
