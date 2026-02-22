import { OrderSource } from '@prisma/client';
import prisma from '../../config/prisma';
import { orderService } from '../order/order.service';
import { AppError } from '../../middleware/error.middleware';
import type { NormalizedWebhookPayload } from '../../types';

export class WebhookService {
    /**
     * Normalize incoming webhook payload from different sources to a standard format.
     */
    normalizePayload(source: string, rawBody: any): NormalizedWebhookPayload {
        switch (source.toUpperCase()) {
            case 'AMAZON':
                return {
                    source: 'AMAZON',
                    sku: rawBody.sku || rawBody.product_sku || rawBody.item_sku,
                    qty: rawBody.quantity || rawBody.qty || 1,
                    externalId: rawBody.order_id || rawBody.amazon_order_id,
                    unitPrice: rawBody.price || rawBody.unit_price,
                    shippingDetails: rawBody.shipping || rawBody.shipping_address,
                    customerName: rawBody.customer_name,
                    customerEmail: rawBody.customer_email,
                };

            case 'FLIPKART':
                return {
                    source: 'FLIPKART',
                    sku: rawBody.sku || rawBody.seller_sku,
                    qty: rawBody.quantity || rawBody.qty || 1,
                    externalId: rawBody.order_item_id || rawBody.flipkart_order_id,
                    unitPrice: rawBody.selling_price || rawBody.price,
                    shippingDetails: rawBody.dispatch_address || rawBody.shipping,
                    customerName: rawBody.buyer_name,
                };

            case 'MEESHO':
                return {
                    source: 'MEESHO',
                    sku: rawBody.sku || rawBody.variation_sku,
                    qty: rawBody.quantity || rawBody.qty || 1,
                    externalId: rawBody.sub_order_id || rawBody.order_id,
                    unitPrice: rawBody.supplier_price || rawBody.price,
                    shippingDetails: rawBody.shipping_details,
                };

            case 'WEBSITE':
                return {
                    source: 'WEBSITE',
                    sku: rawBody.sku,
                    qty: rawBody.quantity || rawBody.qty || 1,
                    externalId: rawBody.order_id,
                    unitPrice: rawBody.price || rawBody.unit_price,
                    shippingDetails: rawBody.shipping,
                    customerName: rawBody.customer_name,
                    customerEmail: rawBody.customer_email,
                };

            default:
                throw new AppError(`Unsupported source: ${source}`, 400);
        }
    }

    async handleIncomingOrder(source: string, rawBody: any, companyId: string) {
        const payload = this.normalizePayload(source, rawBody);

        if (!payload.sku) throw new AppError('SKU is required', 400);
        if (!payload.externalId) throw new AppError('External order ID is required', 400);
        if (!payload.qty || payload.qty <= 0) throw new AppError('Valid quantity is required', 400);

        // Look up product by SKU
        const product = await prisma.product.findUnique({
            where: { sku_companyId: { sku: payload.sku, companyId } },
        });

        if (!product) {
            throw new AppError(`Product with SKU "${payload.sku}" not found`, 404);
        }

        // Create order via OrderService (which handles inventory reservation)
        const order = await orderService.createExternalOrder(companyId, {
            source: payload.source as OrderSource,
            productId: product.id,
            quantity: payload.qty,
            externalOrderId: payload.externalId,
            unitPrice: payload.unitPrice,
            shippingDetails: payload.shippingDetails,
        });

        return order;
    }
}

export const webhookService = new WebhookService();
