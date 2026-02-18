// Script to add _id fields to existing order items
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function migrateOrders() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const ordersCollection = db.collection('orders');

        // Find all orders
        const orders = await ordersCollection.find({}).toArray();
        console.log(`Found ${orders.length} orders`);

        let updatedCount = 0;

        for (const order of orders) {
            // Check if items already have _id
            const needsUpdate = order.items.some(item => !item._id);

            if (needsUpdate) {
                // Add _id to each item that doesn't have one
                const updatedItems = order.items.map(item => {
                    if (!item._id) {
                        return {
                            ...item,
                            _id: new mongoose.Types.ObjectId()
                        };
                    }
                    return item;
                });

                // Update the order
                await ordersCollection.updateOne(
                    { _id: order._id },
                    { $set: { items: updatedItems } }
                );

                updatedCount++;
                console.log(`Updated order ${order.orderNumber}`);
            }
        }

        console.log(`\nMigration complete! Updated ${updatedCount} orders.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateOrders();
