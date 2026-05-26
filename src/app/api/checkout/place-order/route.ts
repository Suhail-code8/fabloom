import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { sendOrderConfirmationEmail } from '@/lib/notifications/email';
import { createRazorpayOrder } from '@/lib/razorpay';
import { z } from 'zod';

const OrderItemSchema = z.object({
    itemType: z.enum(['readymade', 'accessory', 'stitching', 'fabric']),
    productId: z.string().optional(),
    fabricId: z.string().optional(),
    name: z.string().optional(),
    fabricName: z.string().optional(),
    image: z.string().optional(),
    fabricImage: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    quantity: z.number().optional(),
    price: z.number().optional(),
    meters: z.number().optional(),
    pricePerMeter: z.number().optional(),
    totalPrice: z.number().optional(),
    stitchingCharge: z.number().optional(),
    garmentType: z.string().optional(),
    measurementProfileName: z.string().optional(),
    measurementSnapshot: z.any().optional()
}).passthrough();

const AddressSchema = z.object({
    fullName: z.string().min(1),
    phone: z.string().min(10),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(6),
    country: z.string().default('India')
});

const PlaceOrderSchema = z.object({
    items: z.array(OrderItemSchema).min(1),
    shippingAddress: AddressSchema,
    paymentMethod: z.enum(['online', 'cod']),
    subtotal: z.number().min(0),
    shippingCost: z.number().min(0),
    totalAmount: z.number().min(0)
});

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        
        const body = await req.json();
        
        // 1. Zod Validation
        const parsed = PlaceOrderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid request data', details: parsed.error.format() }, { status: 400 });
        }

        const { items, shippingAddress, paymentMethod, subtotal, shippingCost, totalAmount } = parsed.data;

        // 2. Atomic Stock Reduction (Pre-check & Reduce)
        const processedItems: { type: string, id: string, field: string, amount: number }[] = [];
        
        try {
            for (const item of items) {
                if (item.itemType === 'readymade') {
                    const sizeKey = `sizeStock.${item.size}`;
                    const qty = item.quantity || 1;
                    const updated = await Product.findOneAndUpdate(
                        { _id: item.productId, [sizeKey]: { $gte: qty } },
                        { $inc: { [sizeKey]: -qty } }
                    );
                    if (!updated) throw new Error(`Insufficient stock for readymade item: ${item.name || item.productId}`);
                    processedItems.push({ type: 'readymade', id: item.productId!, field: sizeKey, amount: qty });
                    
                } else if (item.itemType === 'accessory') {
                    const qty = item.quantity || 1;
                    const updated = await Product.findOneAndUpdate(
                        { _id: item.productId, stock: { $gte: qty } },
                        { $inc: { stock: -qty } }
                    );
                    if (!updated) throw new Error(`Insufficient stock for accessory: ${item.name || item.productId}`);
                    processedItems.push({ type: 'accessory', id: item.productId!, field: 'stock', amount: qty });
                    
                } else if (item.itemType === 'stitching') {
                    const meters = item.meters || 1;
                    const updated = await Product.findOneAndUpdate(
                        { _id: item.fabricId, stockInMeters: { $gte: meters } },
                        { $inc: { stockInMeters: -meters } }
                    );
                    if (!updated) throw new Error(`Insufficient fabric stock for: ${item.fabricName || item.fabricId}`);
                    processedItems.push({ type: 'stitching', id: item.fabricId!, field: 'stockInMeters', amount: meters });
                } else if (item.itemType === 'fabric') {
                    const qty = item.quantity || 1;
                    const metersPerUnit = item.meters || 1;
                    const totalMeters = metersPerUnit * qty;

                    const updated = await Product.findOneAndUpdate(
                        { _id: item.productId, stockInMeters: { $gte: totalMeters } },
                        { $inc: { stockInMeters: -totalMeters } }
                    );
                    if (!updated) throw new Error(`Insufficient fabric stock for: ${item.name || item.productId}`);
                    processedItems.push({ type: 'fabric', id: item.productId!, field: 'stockInMeters', amount: totalMeters });
                }
            }
        } catch (stockError: any) {
            // Rollback processed items
            for (const p of processedItems) {
                await Product.updateOne({ _id: p.id }, { $inc: { [p.field]: p.amount } });
            }
            return NextResponse.json({ error: stockError.message }, { status: 400 });
        }

        // 3. Format items for the Order schema
        const orderItems = items.map((item: any) => {
            if (item.itemType === 'readymade') {
                return {
                    itemType: 'readymade',
                    productId: item.productId,
                    productName: item.name,
                    productImage: item.image,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.totalPrice || (item.price * item.quantity)
                };
            }
            if (item.itemType === 'accessory') {
                return {
                    itemType: 'accessory',
                    productId: item.productId,
                    productName: item.name,
                    productImage: item.image,
                    color: item.color,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.totalPrice || (item.price * item.quantity)
                };
            }
            if (item.itemType === 'stitching') {
                return {
                    itemType: 'fabric',
                    productId: item.fabricId,
                    productName: item.fabricName,
                    productImage: item.fabricImage,
                    meters: item.meters,
                    pricePerMeter: item.pricePerMeter,
                    totalPrice: item.totalPrice,
                    stitchingDetails: {
                        measurements: item.measurementSnapshot,
                        stitchingPrice: item.stitchingCharge,
                        status: 'pending',
                        specialInstructions: `Garment: ${item.garmentType} | Profile: ${item.measurementProfileName}`
                    }
                };
            }

            if (item.itemType === 'fabric') {
                const qty = item.quantity || 1;
                const meters = item.meters || 0;
                const pricePerMeter = item.pricePerMeter || 0;
                const stitchingCost = item.stitchingPrice || 0;

                // If this fabric cart item has stitching details, preserve them as well.
                const hasStitching = Boolean(item.stitchingDetails);

                const totalPrice = item.totalPrice || ((meters * pricePerMeter + stitchingCost) * qty);

                return {
                    itemType: 'fabric',
                    productId: item.productId,
                    productName: item.name,
                    productImage: item.image,
                    meters,
                    pricePerMeter,
                    totalPrice,
                    ...(hasStitching && item.stitchingDetails
                        ? {
                            stitchingDetails: {
                                measurements: item.stitchingDetails.measurements,
                                stitchingPrice: stitchingCost,
                                status: 'pending',
                                specialInstructions: `Garment: ${(item.stitchingDetails.style || 'Garment').toString()}`,
                                adminNotes: item.stitchingDetails.notes,
                            },
                        }
                        : {}),
                };
            }

            throw new Error(`Unsupported order item type: ${item.itemType}`);
        });

        // 4. Create the Order
        const newOrder = new Order({
            userId,
            items: orderItems,
            subtotal,
            shippingCost,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod === 'online' ? 'card' : 'cod',
            paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending', // Will be 'paid' after Razorpay verify
            status: paymentMethod === 'online' ? 'pending' : 'confirmed'
        });

        await newOrder.save();

        // 5. Trigger Email Notification (Fire and forget with try/catch)
        if (user.emailAddresses && user.emailAddresses.length > 0) {
            try {
                const estDelivery = items.some((i: any) => i.itemType === 'stitching') ? '10-12 Days' : '4-6 Days';
                await sendOrderConfirmationEmail(user.emailAddresses[0].emailAddress, {
                    orderNumber: newOrder.orderNumber,
                    customerName: shippingAddress.fullName,
                    items: orderItems,
                    total: totalAmount,
                    deliveryAddress: shippingAddress,
                    estimatedDelivery: estDelivery
                });
            } catch (emailErr) {
                console.error('Failed to send order confirmation email:', emailErr);
                // We do NOT fail the order if the email fails
            }
        }

        // 6. Handle Razorpay Initialization
        if (paymentMethod === 'online') {
            try {
                const amountInPaise = Math.round(totalAmount * 100);
                const rzpOrder = await createRazorpayOrder({
                    amount: amountInPaise,
                    currency: 'INR',
                    receipt: newOrder.orderNumber,
                    notes: { orderId: newOrder._id.toString() }
                });

                return NextResponse.json({ 
                    success: true, 
                    orderId: newOrder._id, 
                    orderNumber: newOrder.orderNumber,
                    razorpayOrderId: rzpOrder.id,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
                });
            } catch (rzpErr: any) {
                // If razorpay fails, we might want to rollback the order and stock, or let the user retry payment later.
                // For now, fail the request but keep the order as 'pending'.
                return NextResponse.json({ error: 'Failed to initialize payment gateway' }, { status: 500 });
            }
        }

        // For COD:
        return NextResponse.json({ 
            success: true, 
            orderId: newOrder._id, 
            orderNumber: newOrder.orderNumber 
        });

    } catch (error: any) {
        console.error('Error placing order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
