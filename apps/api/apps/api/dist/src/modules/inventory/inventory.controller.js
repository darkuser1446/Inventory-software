"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = exports.InventoryController = void 0;
const inventory_service_1 = require("./inventory.service");
class InventoryController {
    async adjustStock(req, res, next) {
        try {
            const { productId, quantity, action, reason } = req.body;
            const result = await inventory_service_1.inventoryService.adjustStock({
                productId,
                companyId: req.companyId,
                quantity,
                action,
                reason,
            });
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async getLogs(req, res, next) {
        try {
            const { productId } = req.query;
            const { page, limit } = req.query;
            const result = await inventory_service_1.inventoryService.getInventoryLogs(req.companyId, productId, {
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
exports.InventoryController = InventoryController;
exports.inventoryController = new InventoryController();
//# sourceMappingURL=inventory.controller.js.map