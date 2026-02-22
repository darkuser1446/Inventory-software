import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redis, redisSubscriber } from './redis';
import { env } from './env';

let io: SocketServer;

export function createSocketServer(httpServer: HttpServer): SocketServer {
    io = new SocketServer(httpServer, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    io.adapter(createAdapter(redis, redisSubscriber));

    io.on('connection', (socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id}`);

        socket.on('join_company', (companyId: string) => {
            socket.join(`company_${companyId}`);
            console.log(`[Socket.io] ${socket.id} joined room company_${companyId}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`[Socket.io] Client disconnected: ${socket.id} (${reason})`);
        });
    });

    return io;
}

export function getSocketServer(): SocketServer {
    if (!io) {
        throw new Error('Socket.io server not initialized');
    }
    return io;
}
