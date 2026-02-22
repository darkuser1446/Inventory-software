"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_1 = require("../lib/logger");
const uuid_1 = require("uuid");
const loggerMiddleware = (req, res, next) => {
    // Generate correlation ID
    const correlationId = req.headers['x-correlation-id'] || (0, uuid_1.v4)();
    req.headers['x-correlation-id'] = correlationId;
    // Log request
    logger_1.logger.http(`${req.method} ${req.url}`, { correlationId });
    const start = Date.now();
    // Hook into response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.http(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`, { correlationId });
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map