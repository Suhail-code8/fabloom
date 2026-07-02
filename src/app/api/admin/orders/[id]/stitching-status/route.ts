import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { sendStitchingReady, sendStitchingStarted } from '@/lib/notifications/whatsapp';
import { sendStitchingStartedEmail, sendStitchingReadyEmail } from '@/lib/notifications/email';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, status, adminNotes, stitchingStatus } = await req.json();

    if (!itemId && !stitchingStatus) {
        return NextResponse.json({ error: 'itemId or stitchingStatus is required' }, { status: 400 });
    }

    await dbConnect();

    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 1. Handle Order-Level Update
    if (stitchingStatus && !itemId) {
        let updatedCount = 0;
        let lastStatus = null;
        for (const item of order.items) {
            if (item.stitchingDetails) {
                lastStatus = item.stitchingDetails.status;
                item.stitchingDetails.status = stitchingStatus;
                updatedCount++;
            }
        }
        await order.save();

        // Trigger WhatsApp and Email notifications if applicable (we just trigger one per order)
        try {
            if (updatedCount > 0 && stitchingStatus !== lastStatus) {
                const phone = order.shippingAddress.phone;
                const customerName = order.shippingAddress.fullName;
                
                let email = null;
                if (order.userId && order.userId !== 'guest') {
                    const u = await User.findOne({ clerkId: order.userId }).lean();
                    email = (u as any)?.email;
                }

                if (stitchingStatus === 'ready') {
                    void sendStitchingReady(phone, {
                        orderNumber: order.orderNumber,
                        customerName,
                        garmentType: 'Order Items',
                    });
                    if (email) {
                        void sendStitchingReadyEmail(email, {
                            orderNumber: order.orderNumber,
                            customerName,
                            garmentType: 'Order Items',
                        });
                    }
                } else if (stitchingStatus === 'cutting' && lastStatus === 'pending') {
                    void sendStitchingStarted(phone, {
                        orderNumber: order.orderNumber,
                        customerName,
                        garmentType: 'Order Items',
                    });
                    if (email) {
                        void sendStitchingStartedEmail(email, {
                            orderNumber: order.orderNumber,
                            customerName,
                            garmentType: 'Order Items',
                        });
                    }
                }
            }
        } catch (e) {
            // Ignore notification failures
            console.error('Notification error:', e);
        }

        return NextResponse.json({ success: true, order });
    }

    // 2. Handle Item-Level Update
    const item = order.items.id(itemId);
    if (!item || !item.stitchingDetails) {
        return NextResponse.json({ error: 'Stitching item not found' }, { status: 404 });
    }

    const previousStatus = item.stitchingDetails.status;

    if (status) {
        item.stitchingDetails.status = status;
    }
    
    if (adminNotes !== undefined) {
        item.stitchingDetails.adminNotes = adminNotes;
    }

    await order.save();

    // WhatsApp and Email notification stub for single item
    try {
        const nextStatus = item.stitchingDetails.status;
        if (status && nextStatus !== previousStatus) {
            const specialInstructions = item.stitchingDetails.specialInstructions || '';
            const garmentType =
                specialInstructions.match(/Garment:\s*([^|]+)/i)?.[1]?.trim() ||
                (item as any).productName ||
                'Garment';

            const phone = order.shippingAddress.phone;
            const customerName = order.shippingAddress.fullName;

            let email = null;
            if (order.userId && order.userId !== 'guest') {
                const u = await User.findOne({ clerkId: order.userId }).lean();
                email = (u as any)?.email;
            }

            if (nextStatus === 'ready') {
                void sendStitchingReady(phone, {
                    orderNumber: order.orderNumber,
                    customerName,
                    garmentType,
                });
                if (email) {
                    void sendStitchingReadyEmail(email, {
                        orderNumber: order.orderNumber,
                        customerName,
                        garmentType,
                    });
                }
            } else if (nextStatus === 'cutting' && previousStatus === 'pending') {
                void sendStitchingStarted(phone, {
                    orderNumber: order.orderNumber,
                    customerName,
                    garmentType,
                });
                if (email) {
                    void sendStitchingStartedEmail(email, {
                        orderNumber: order.orderNumber,
                        customerName,
                        garmentType,
                    });
                }
            }
        }
    } catch (e) {
        // Ignore notification failures
        console.error('Notification error:', e);
    }

    return NextResponse.json({ success: true, item });
}
