"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockSyncQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.stockSyncQueue = new bullmq_1.Queue('stock-sync', {
    connection: redis_1.redis,
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
//# sourceMappingURL=stock-sync.queue.js.map