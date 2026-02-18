// Check if order items have _id fields
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkOrders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const ordersCollection = db.collection('orders');

        const order = await ordersCollection.findOne({ orderNumber: 'FB260200001' });

        if (order) {
            console.log('Order found:', order.orderNumber);
            console.log('\nItems:');
            order.items.forEach((item, index) => {
                console.log(`\nItem ${index + 1}:`);
                console.log('  Name:', item.productName);
                console.log('  Has _id:', !!item._id);
                console.log('  _id value:', item._id);
            });
        } else {
            console.log('Order not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkOrders();
