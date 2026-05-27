import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

type StitchingStatus = 'pending' | 'cutting' | 'stitching' | 'quality_check' | 'ready';

const STATUS_PRIORITY: Record<StitchingStatus, number> = {
    pending: 0,
    cutting: 1,
    stitching: 2,
    quality_check: 3,
    ready: 4,
};

function deriveOrderStitchingStatus(items: any[]): StitchingStatus {
    // We want the "earliest" stage across all stitching items to keep the order visible until all are ready.
    let min: StitchingStatus = 'ready';
    for (const it of items) {
        const s = it?.stitchingDetails?.status as StitchingStatus | undefined;
        if (!s) continue;
        if (STATUS_PRIORITY[s] < STATUS_PRIORITY[min]) min = s;
    }
    return min;
}

export async function GET() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const orders = await Order.find({
            items: { $elemMatch: { stitchingDetails: { $exists: true } } },
        })
            .sort({ createdAt: -1 })
            .lean();

        const mapped = (orders as any[]).map((o) => {
            const stitchingItemsRaw = (o.items || []).filter((it: any) => Boolean(it?.stitchingDetails));

            return {
                _id: o._id?.toString?.() ?? String(o._id),
                orderNumber: o.orderNumber,
                customerName: o.shippingAddress?.fullName ?? 'Customer',
                customerPhone: o.shippingAddress?.phone ?? '',
                stitchingStatus: deriveOrderStitchingStatus(stitchingItemsRaw),
                createdAt: o.createdAt,
                stitchingItems: stitchingItemsRaw.map((it: any) => ({
                    garmentType:
                        it?.stitchingDetails?.specialInstructions
                            ?.match(/Garment:\s*([^|]+)/i)?.[1]
                            ?.trim?.() || 'Garment',
                    fabricName: it.productName,
                    meters: it.meters ?? 0,
                    measurements: it?.stitchingDetails?.measurements ?? {},
                })),
            };
        });

        return NextResponse.json({ orders: mapped });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Failed to load production orders' }, { status: 500 });
    }
}

