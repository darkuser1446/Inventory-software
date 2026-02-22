import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
export declare function errorMiddleware(err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error.middleware.d.ts.map