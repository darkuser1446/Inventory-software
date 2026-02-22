"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisSubscriber = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
exports.redis = new ioredis_1.default(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
exports.redisSubscriber = new ioredis_1.default(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
exports.redis.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});
exports.redis.on('connect', () => {
    console.log('[Redis] Connected successfully');
});
//# sourceMappingURL=redis.js.map