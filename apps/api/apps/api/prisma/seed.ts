import { PrismaClient, UserRole, OrderSource, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create demo company
    const company = await prisma.company.upsert({
        where: { slug: 'demo-company' },
        update: {},
        create: {
            name: 'Demo Company',
            slug: 'demo-company',
            settings: { currency: 'INR', timezone: 'Asia/Kolkata' },
            branding: { primaryColor: '#6366f1', logo: null },
            featureFlags: { csvImport: true, webhooks: true, multiChannel: true },
        },
    });

    console.log('✅ Company created:', company.name);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email_companyId: { email: 'admin@demo.com', companyId: company.id } },
        update: {},
        create: {
            email: 'admin@demo.com',
            password: adminPassword,
            name: 'Admin User',
            role: UserRole.ADMIN,
            companyId: company.id,
        },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 12);
    const staff = await prisma.user.upsert({
        where: { email_companyId: { email: 'staff@demo.com', companyId: company.id } },
        update: {},
        create: {
            email: 'staff@demo.com',
            password: staffPassword,
            name: 'Staff User',
            role: UserRole.STAFF,
            companyId: company.id,
        },
    });

    console.log('✅ Staff user created:', staff.email);

    // Create sample products
    const products = await Promise.all([
        prisma.product.upsert({
            where: { sku_companyId: { sku: 'SKU-TSHIRT-001', companyId: company.id } },
            update: {},
            create: {
                sku: 'SKU-TSHIRT-001',
                name: 'Classic Cotton T-Shirt - Black',
                description: 'Premium quality cotton t-shirt in black color',
                price: 599,
                costPrice: 250,
                currentStock: 150,
                reservedStock: 20,
                lowStockThreshold: 15,
                companyId: company.id,
            },
        }),
        prisma.product.upsert({
            where: { sku_companyId: { sku: 'SKU-JEANS-001', companyId: company.id } },
            update: {},
            create: {
                sku: 'SKU-JEANS-001',
                name: 'Slim Fit Denim Jeans - Blue',
                description: 'Comfortable slim fit jeans in classic blue',
                price: 1299,
                costPrice: 550,
                currentStock: 75,
                reservedStock: 10,
                lowStockThreshold: 10,
                companyId: company.id,
            },
        }),
        prisma.product.upsert({
            where: { sku_companyId: { sku: 'SKU-SNEAKER-001', companyId: company.id } },
            update: {},
            create: {
                sku: 'SKU-SNEAKER-001',
                name: 'Urban Street Sneakers - White',
                description: 'Stylish casual sneakers for everyday wear',
                price: 2499,
                costPrice: 1100,
                currentStock: 45,
                reservedStock: 5,
                lowStockThreshold: 8,
                companyId: company.id,
            },
        }),
        prisma.product.upsert({
            where: { sku_companyId: { sku: 'SKU-HOODIE-001', companyId: company.id } },
            update: {},
            create: {
                sku: 'SKU-HOODIE-001',
                name: 'Pullover Hoodie - Grey',
                description: 'Warm pullover hoodie in heather grey',
                price: 1199,
                costPrice: 480,
                currentStock: 8,
                reservedStock: 3,
                lowStockThreshold: 10,
                companyId: company.id,
            },
        }),
    ]);

    console.log(`✅ ${products.length} products created`);

    // Create sample orders
    const orders = await Promise.all([
        prisma.order.create({
            data: {
                orderNumber: 'ORD-SEED001',
                source: OrderSource.AMAZON,
                status: OrderStatus.PENDING,
                externalOrderId: 'AMZ-2024-001',
                quantity: 2,
                unitPrice: 599,
                totalPrice: 1198,
                shippingDetails: { address: '123 Main St, Mumbai', pincode: '400001' },
                productId: products[0].id,
                companyId: company.id,
            },
        }),
        prisma.order.create({
            data: {
                orderNumber: 'ORD-SEED002',
                source: OrderSource.FLIPKART,
                status: OrderStatus.SHIPPED,
                externalOrderId: 'FK-2024-001',
                quantity: 1,
                unitPrice: 1299,
                totalPrice: 1299,
                shippingDetails: { address: '456 MG Road, Bangalore', pincode: '560001' },
                productId: products[1].id,
                companyId: company.id,
            },
        }),
        prisma.order.create({
            data: {
                orderNumber: 'ORD-SEED003',
                source: OrderSource.MEESHO,
                status: OrderStatus.PENDING,
                externalOrderId: 'MS-2024-001',
                quantity: 3,
                unitPrice: 599,
                totalPrice: 1797,
                productId: products[0].id,
                companyId: company.id,
            },
        }),
        prisma.order.create({
            data: {
                orderNumber: 'ORD-SEED004',
                source: OrderSource.WEBSITE,
                status: OrderStatus.DELIVERED,
                externalOrderId: 'WEB-2024-001',
                quantity: 1,
                unitPrice: 2499,
                totalPrice: 2499,
                productId: products[2].id,
                companyId: company.id,
            },
        }),
    ]);

    console.log(`✅ ${orders.length} orders created`);

    // Create sample integrations
    await Promise.all([
        prisma.integration.upsert({
            where: { platform_companyId: { platform: OrderSource.AMAZON, companyId: company.id } },
            update: {},
            create: {
                platform: OrderSource.AMAZON,
                name: 'Amazon India',
                apiKey: 'demo-amazon-api-key',
                webhookSecret: 'demo-amazon-webhook-secret',
                endpoint: 'https://api.amazon.in/inventory',
                isActive: true,
                companyId: company.id,
            },
        }),
        prisma.integration.upsert({
            where: { platform_companyId: { platform: OrderSource.FLIPKART, companyId: company.id } },
            update: {},
            create: {
                platform: OrderSource.FLIPKART,
                name: 'Flipkart Seller Hub',
                apiKey: 'demo-flipkart-api-key',
                webhookSecret: 'demo-flipkart-webhook-secret',
                endpoint: 'https://api.flipkart.com/inventory',
                isActive: true,
                companyId: company.id,
            },
        }),
    ]);

    console.log('✅ Integrations created');
    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Login credentials:');
    console.log('  Admin: admin@demo.com / admin123 (company: demo-company)');
    console.log('  Staff: staff@demo.com / staff123 (company: demo-company)');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
