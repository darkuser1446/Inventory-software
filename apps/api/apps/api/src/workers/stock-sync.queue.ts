import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const stockSyncQueue = new Queue('stock-sync', {
    connection: redis as any,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
        // @ts-ignore
        timeout: 30000,
    },
});

console.log('[BullMQ] Stock sync queue initialized');
