"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const redis_1 = require("../../config/redis");
class HealthController {
    async check(req, res) {
        const health = {
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: {
                api: { status: 'up' },
                db: { status: 'unknown', latency: 0 },
                redis: { status: 'unknown', latency: 0 }
            }
        };
        // Check Database
        const dbStart = Date.now();
        try {
            await prisma_1.default.$queryRaw `SELECT 1`;
            health.services.db.status = 'up';
            health.services.db.latency = Date.now() - dbStart;
        }
        catch (error) {
            health.services.db.status = 'down';
            console.error('Health Check DB Error:', error.message);
        }
        // Check Redis
        const redisStart = Date.now();
        try {
            await redis_1.redis.ping();
            health.services.redis.status = 'up';
            health.services.redis.latency = Date.now() - redisStart;
        }
        catch (error) {
            health.services.redis.status = 'down';
            console.error('Health Check Redis Error:', error.message);
        }
        const overallStatus = health.services.db.status === 'up' &&
            health.services.redis.status === 'up' ? 200 : 503;
        res.status(overallStatus).json(health);
    }
}
exports.HealthController = HealthController;
exports.healthController = new HealthController();
//# sourceMappingURL=health.controller.js.map