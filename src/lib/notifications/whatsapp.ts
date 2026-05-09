/* ARCHIVED — WhatsApp via Meta Cloud API
Activate when Meta Business account + phone number verified.
Replace WATI calls below with Meta graph API calls.
See README_WHATSAPP.md for setup steps.

const WATI_BASE = process.env.WATI_API_ENDPOINT;
const WATI_TOKEN = process.env.WATI_API_TOKEN;

// Generic sender
async function sendWhatsAppTemplate(phone: string, templateName: string, params: { name: string, value: string }[]) {
    if (!WATI_BASE || !WATI_TOKEN) {
        console.warn(`[WATI MOCK] Sending WhatsApp to ${phone} using template '${templateName}'. Payload:`, params);
        return;
    }

    try {
        // Clean phone number (ensure country code exists)
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

        const url = `${WATI_BASE}/api/v1/sendTemplateMessage?whatsappNumber=${cleanPhone}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WATI_TOKEN}`
            },
            body: JSON.stringify({
                template_name: templateName,
                broadcast_name: `system_${templateName}`,
                parameters: params
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[WATI ERROR] Failed to send template ${templateName}:`, errText);
        }
    } catch (error) {
        console.error(`[WATI CATCH ERROR] Failed to send template ${templateName}:`, error);
        // Fire and forget: NEVER throw error to prevent interrupting checkout flow
    }
}

// Wrapper Functions

export async function sendOrderConfirmation(
    phone: string, 
    data: { orderNumber: string, customerName: string, itemCount: number, total: number, estimatedDelivery: string }
) {
    await sendWhatsAppTemplate(phone, 'order_confirmation', [
        { name: 'customer_name', value: data.customerName },
        { name: 'order_number', value: data.orderNumber },
        { name: 'item_count', value: data.itemCount.toString() },
        { name: 'total_amount', value: data.total.toLocaleString('en-IN') },
        { name: 'estimated_delivery', value: data.estimatedDelivery }
    ]);
}

export async function sendStitchingStarted(
    phone: string,
    data: { orderNumber: string, customerName: string, garmentType: string }
) {
    await sendWhatsAppTemplate(phone, 'stitching_started', [
        { name: 'customer_name', value: data.customerName },
        { name: 'order_number', value: data.orderNumber },
        { name: 'garment_type', value: data.garmentType }
    ]);
}

export async function sendStitchingReady(
    phone: string,
    data: { orderNumber: string, customerName: string, garmentType: string }
) {
    await sendWhatsAppTemplate(phone, 'stitching_ready', [
        { name: 'customer_name', value: data.customerName },
        { name: 'order_number', value: data.orderNumber },
        { name: 'garment_type', value: data.garmentType }
    ]);
}

export async function sendOrderDispatched(
    phone: string,
    data: { orderNumber: string, customerName: string, trackingNumber: string, courierName: string }
) {
    await sendWhatsAppTemplate(phone, 'order_dispatched', [
        { name: 'customer_name', value: data.customerName },
        { name: 'order_number', value: data.orderNumber },
        { name: 'tracking_number', value: data.trackingNumber },
        { name: 'courier_name', value: data.courierName }
    ]);
}
*/

export const sendOrderConfirmation = async (...args: any[]) => {}
export const sendStitchingStarted = async (...args: any[]) => {}
export const sendStitchingReady = async (...args: any[]) => {}
export const sendOrderDispatched = async (...args: any[]) => {}

