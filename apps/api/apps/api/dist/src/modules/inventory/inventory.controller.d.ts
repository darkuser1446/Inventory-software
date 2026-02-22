import { Request, Response, NextFunction } from 'express';
export declare class InventoryController {
    adjustStock(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const inventoryController: InventoryController;
//# sourceMappingURL=inventory.controller.d.ts.map