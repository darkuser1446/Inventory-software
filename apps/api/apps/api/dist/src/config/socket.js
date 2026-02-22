"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
exports.getSocketServer = getSocketServer;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("./redis");
const env_1 = require("./env");
let io;
function createSocketServer(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.env.CORS_ORIGIN,
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });
    io.adapter((0, redis_adapter_1.createAdapter)(redis_1.redis, redis_1.redisSubscriber));
    io.on('connection', (socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id}`);
        socket.on('join_company', (companyId) => {
            socket.join(`company_${companyId}`);
            console.log(`[Socket.io] ${socket.id} joined room company_${companyId}`);
        });
        socket.on('disconnect', (reason) => {
            console.log(`[Socket.io] Client disconnected: ${socket.id} (${reason})`);
        });
    });
    return io;
}
function getSocketServer() {
    if (!io) {
        throw new Error('Socket.io server not initialized');
    }
    return io;
}
//# sourceMappingURL=socket.js.map