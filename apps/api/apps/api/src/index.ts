import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { env } from './config/env';
import { createSocketServer } from './config/socket';
import { errorMiddleware } from './middleware/error.middleware';
import prisma from './config/prisma';
import { redis } from './config/redis';
import { startStockSyncWorker } from './workers/stock-sync.worker';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import productRoutes from './modules/product/product.routes';
import orderRoutes from './modules/order/order.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import integrationRoutes from './modules/integration/integration.routes';
import userRoutes from './modules/user/user.routes';
import companyRoutes from './modules/company/company.routes';
import webhookRoutes from './modules/webhook/webhook.routes';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
createSocketServer(httpServer);

// Security Middleware
app.use(helmet());

// Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
});

const webhookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Higher limit for webhooks
    standardHeaders: true,
    legacyHeaders: false,
});

// Global middleware
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger Middleware
import { loggerMiddleware } from './middleware/logger.middleware';
app.use(loggerMiddleware);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', (req, res, next) => {
    // Disable caching for health check
    res.set('Cache-Control', 'no-store');
    next();
}, require('./modules/health/health.routes').default);
app.use('/api/company', companyRoutes);

// Webhook routes (public, no auth)
app.use('/webhooks', webhookLimiter, webhookRoutes);

// Global error handler
app.use(errorMiddleware);

// Start server
httpServer.listen(env.PORT, () => {
    console.log(`[Server] OMS API running on port ${env.PORT}`);
    console.log(`[Server] Environment: ${env.NODE_ENV}`);

    // Start BullMQ workers
    // startStockSyncWorker();

    // Verification Logs
    console.log('[Server] Starting health checks...');

    // Check Redis
    // redis.ping().then(() => console.log('[OK] Redis connected successfully')).catch(err => console.error('[ERROR] Redis connection failed:', err.message));

    // Check Database
    prisma.$connect().then(() => {
        console.log('[OK] Database connected successfully');
        console.log('[OK] Prisma ready');
    }).catch(err => console.error('[ERROR] Database connection failed:', err.message));

    console.log('[OK] API started');
});

export default app;
