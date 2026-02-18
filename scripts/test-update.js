// Test updating order status directly in database
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testUpdate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const ordersCollection = db.collection('orders');

        // Get the order
        const order = await ordersCollection.findOne({ orderNumber: 'FB260200001' });

        if (!order) {
            console.log('Order not found');
            process.exit(1);
        }

        console.log('BEFORE UPDATE:');
        console.log('Order status:', order.status);
        console.log('\nItems:');
        order.items.forEach((item, index) => {
            console.log(`Item ${index + 1}: ${item.productName}`);
            console.log(`  _id: ${item._id}`);
            if (item.stitchingDetails) {
                console.log(`  Stitching status: ${item.stitchingDetails.status}`);
            }
        });

        // Update first item's stitching status
        if (order.items[0]._id && order.items[0].stitchingDetails) {
            const itemId = order.items[0]._id;
            console.log(`\n\nUPDATING item with _id: ${itemId}`);
            console.log(`Setting stitching status to: in_progress`);

            // Find and update the item
            const updatedItems = order.items.map(item => {
                if (item._id.toString() === itemId.toString()) {
                    return {
                        ...item,
                        stitchingDetails: {
                            ...item.stitchingDetails,
                            status: 'in_progress'
                        }
                    };
                }
                return item;
            });

            await ordersCollection.updateOne(
                { _id: order._id },
                { $set: { items: updatedItems } }
            );

            console.log('Update complete!');

            // Fetch again to verify
            const updatedOrder = await ordersCollection.findOne({ orderNumber: 'FB260200001' });
            console.log('\nAFTER UPDATE:');
            console.log('Item 1 stitching status:', updatedOrder.items[0].stitchingDetails.status);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testUpdate();
