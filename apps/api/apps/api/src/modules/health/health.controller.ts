
import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { redis } from '../../config/redis';

export class HealthController {
    async check(req: Request, res: Response) {
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
            await prisma.$queryRaw`SELECT 1`;
            health.services.db.status = 'up';
            health.services.db.latency = Date.now() - dbStart;
        } catch (error: any) {
            health.services.db.status = 'down';
            console.error('Health Check DB Error:', error.message);
        }

        // Check Redis
        const redisStart = Date.now();
        try {
            await redis.ping();
            health.services.redis.status = 'up';
            health.services.redis.latency = Date.now() - redisStart;
        } catch (error: any) {
            health.services.redis.status = 'down';
            console.error('Health Check Redis Error:', error.message);
        }

        const overallStatus =
            health.services.db.status === 'up' &&
                health.services.redis.status === 'up' ? 200 : 503;

        res.status(overallStatus).json(health);
    }
}

export const healthController = new HealthController();
