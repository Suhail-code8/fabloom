import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    const logFile = path.join(process.cwd(), 'update-test-log.txt');

    try {
        await dbConnect();

        const { orderId, itemId, newStatus } = await request.json();

        fs.appendFileSync(logFile, `\n\n=== TEST UPDATE ${new Date().toISOString()} ===\n`);
        fs.appendFileSync(logFile, `Order ID: ${orderId}\n`);
        fs.appendFileSync(logFile, `Item ID: ${itemId}\n`);
        fs.appendFileSync(logFile, `New Status: ${newStatus}\n`);

        // Get the order
        const order = await Order.findById(orderId);

        if (!order) {
            fs.appendFileSync(logFile, 'ERROR: Order not found\n');
            return NextResponse.json({ success: false, error: 'Order not found' });
        }

        fs.appendFileSync(logFile, `Order found: ${order.orderNumber}\n`);

        // Find item index
        const itemIndex = order.items.findIndex((i: any) => i._id.toString() === itemId.toString());

        fs.appendFileSync(logFile, `Item index: ${itemIndex}\n`);

        if (itemIndex === -1) {
            fs.appendFileSync(logFile, 'ERROR: Item not found\n');
            return NextResponse.json({ success: false, error: 'Item not found' });
        }

        fs.appendFileSync(logFile, `Current status: ${order.items[itemIndex].stitchingDetails.status}\n`);

        // Perform update
        const updateResult = await Order.updateOne(
            { _id: orderId },
            { $set: { [`items.${itemIndex}.stitchingDetails.status`]: newStatus } }
        );

        fs.appendFileSync(logFile, `Update result: ${JSON.stringify(updateResult)}\n`);
        fs.appendFileSync(logFile, `Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}\n`);

        // Verify the update
        const updatedOrder = await Order.findById(orderId);
        const verifyStatus = updatedOrder.items[itemIndex].stitchingDetails.status;

        fs.appendFileSync(logFile, `Verified status after update: ${verifyStatus}\n`);
        fs.appendFileSync(logFile, `Update successful: ${verifyStatus === newStatus}\n`);

        return NextResponse.json({
            success: true,
            updateResult,
            verifiedStatus: verifyStatus,
            updateWorked: verifyStatus === newStatus
        });

    } catch (error: any) {
        fs.appendFileSync(logFile, `ERROR: ${error.message}\n${error.stack}\n`);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
