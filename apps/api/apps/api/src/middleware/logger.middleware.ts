import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { v4 as uuidv4 } from 'uuid';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Generate correlation ID
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req.headers['x-correlation-id'] = correlationId as string;

    // Log request
    logger.http(`${req.method} ${req.url}`, { correlationId });

    const start = Date.now();

    // Hook into response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`, { correlationId });
    });

    next();
};
