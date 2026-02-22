import type { NormalizedWebhookPayload } from '../../types';
export declare class WebhookService {
    /**
     * Normalize incoming webhook payload from different sources to a standard format.
     */
    normalizePayload(source: string, rawBody: any): NormalizedWebhookPayload;
    handleIncomingOrder(source: string, rawBody: any, companyId: string): Promise<{
        product: {
            name: string;
            sku: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        orderNumber: string;
        source: import(".prisma/client").$Enums.OrderSource;
        status: import(".prisma/client").$Enums.OrderStatus;
        externalOrderId: string | null;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        shippingDetails: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
        productId: string;
        assignedToId: string | null;
    }>;
}
export declare const webhookService: WebhookService;
//# sourceMappingURL=webhook.service.d.ts.map