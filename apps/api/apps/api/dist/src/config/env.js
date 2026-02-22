"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '4000', 10),
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
//# sourceMappingURL=env.js.map