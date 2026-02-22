"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startStockSyncWorker = startStockSyncWorker;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const prisma_1 = __importDefault(require("../config/prisma"));
function startStockSyncWorker() {
    const worker = new bullmq_1.Worker('stock-sync', async (job) => {
        const { companyId, productId, sku, availableQty } = job.data;
        console.log(`[StockSync] Processing job ${job.id}: SKU=${sku}, Qty=${availableQty}`);
        // Fetch all active integrations for this company
        const integrations = await prisma_1.default.integration.findMany({
            where: { companyId, isActive: true },
        });
        if (integrations.length === 0) {
            console.log(`[StockSync] No active integrations for company ${companyId}`);
            return;
        }
        const results = [];
        for (const integration of integrations) {
            try {
                // In production, this would push stock quantities to each marketplace API
                // For now, we simulate the HTTP call
                await pushStockToIntegration(integration, sku, availableQty);
                await prisma_1.default.integration.update({
                    where: { id: integration.id },
                    data: { lastSyncAt: new Date() },
                });
                results.push({ platform: integration.platform, success: true });
                console.log(`[StockSync] Synced SKU=${sku} Qty=${availableQty} to ${integration.platform}`);
            }
            catch (err) {
                results.push({
                    platform: integration.platform,
                    success: false,
                    error: err.message,
                });
                console.error(`[StockSync] Failed to sync to ${integration.platform}:`, err.message);
            }
        }
        // Log sync results to inventory log
        await prisma_1.default.inventoryLog.create({
            data: {
                action: 'ADJUSTMENT',
                quantity: availableQty,
                reason: `Stock sync to channels: ${results.map((r) => `${r.platform}:${r.success ? 'OK' : 'FAIL'}`).join(', ')}`,
                productId,
                companyId,
                metadata: { syncResults: results },
            },
        });
        return results;
    }, {
        connection: redis_1.redis,
        concurrency: 5,
        limiter: {
            max: 10,
            duration: 1000,
        },
    });
    worker.on('completed', (job) => {
        console.log(`[StockSync] Job ${job.id} completed`);
    });
    worker.on('failed', (job, err) => {
        console.error(`[StockSync] Job ${job?.id} failed:`, err.message);
    });
    console.log('[BullMQ] Stock sync worker started');
    return worker;
}
/**
 * Push stock quantity to an integration's marketplace API.
 * In production, replace with actual HTTP calls to Amazon/Flipkart/Meesho APIs.
 */
async function pushStockToIntegration(integration, sku, quantity) {
    // Simulate API call based on platform
    const endpoint = integration.endpoint;
    if (!endpoint) {
        console.log(`[StockSync] No endpoint configured for ${integration.platform}, skipping`);
        return;
    }
    // Production: Use fetch/axios to call the marketplace API
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${integration.apiKey}`,
    //   },
    //   body: JSON.stringify({ sku, quantity }),
    // });
    // Simulate success for now
    await new Promise((resolve) => setTimeout(resolve, 100));
}
//# sourceMappingURL=stock-sync.worker.js.map