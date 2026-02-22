"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const env_1 = require("./config/env");
const socket_1 = require("./config/socket");
const error_middleware_1 = require("./middleware/error.middleware");
const prisma_1 = __importDefault(require("./config/prisma"));
// Route imports
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const inventory_routes_1 = __importDefault(require("./modules/inventory/inventory.routes"));
const integration_routes_1 = __importDefault(require("./modules/integration/integration.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const company_routes_1 = __importDefault(require("./modules/company/company.routes"));
const webhook_routes_1 = __importDefault(require("./modules/webhook/webhook.routes"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.io
(0, socket_1.createSocketServer)(httpServer);
// Security Middleware
app.use((0, helmet_1.default)());
// Rate Limiting
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
});
const webhookLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Higher limit for webhooks
    standardHeaders: true,
    legacyHeaders: false,
});
// Global middleware
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Logger Middleware
const logger_middleware_1 = require("./middleware/logger.middleware");
app.use(logger_middleware_1.loggerMiddleware);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/auth', authLimiter, auth_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/integrations', integration_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/health', (req, res, next) => {
    // Disable caching for health check
    res.set('Cache-Control', 'no-store');
    next();
}, require('./modules/health/health.routes').default);
app.use('/api/company', company_routes_1.default);
// Webhook routes (public, no auth)
app.use('/webhooks', webhookLimiter, webhook_routes_1.default);
// Global error handler
app.use(error_middleware_1.errorMiddleware);
// Start server
httpServer.listen(env_1.env.PORT, () => {
    console.log(`[Server] OMS API running on port ${env_1.env.PORT}`);
    console.log(`[Server] Environment: ${env_1.env.NODE_ENV}`);
    // Start BullMQ workers
    // startStockSyncWorker();
    // Verification Logs
    console.log('[Server] Starting health checks...');
    // Check Redis
    // redis.ping().then(() => console.log('[OK] Redis connected successfully')).catch(err => console.error('[ERROR] Redis connection failed:', err.message));
    // Check Database
    prisma_1.default.$connect().then(() => {
        console.log('[OK] Database connected successfully');
        console.log('[OK] Prisma ready');
    }).catch(err => console.error('[ERROR] Database connection failed:', err.message));
    console.log('[OK] API started');
});
exports.default = app;
//# sourceMappingURL=index.js.map