"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const order_service_1 = require("./order.service");
class OrderController {
    async getOrders(req, res, next) {
        try {
            const { page, limit, status, source, search, sortBy, sortOrder } = req.query;
            const result = await order_service_1.orderService.getOrders(req.companyId, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                status: status,
                source: source,
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            res.json({
                success: true,
                data: result.data,
                meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOrder(req, res, next) {
        try {
            const order = await order_service_1.orderService.getOrder(req.params.id, req.companyId);
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    }
    async createExternalOrder(req, res, next) {
        try {
            const order = await order_service_1.orderService.createExternalOrder(req.companyId, req.body);
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const order = await order_service_1.orderService.updateStatus(req.params.id, req.companyId, status);
            res.json({ success: true, data: order });
        }
        catch (error) {
            next(error);
        }
    }
    async getOrdersToPack(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await order_service_1.orderService.getOrdersToPack(req.companyId, {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.json({
                success: true,
                data: result.data,
                meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
exports.orderController = new OrderController();
//# sourceMappingURL=order.controller.js.map