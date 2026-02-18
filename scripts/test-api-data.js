// Direct test of the exact API endpoint
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testAPI() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const ordersCollection = db.collection('orders');

        // Get the order exactly as the API would
        const order = await ordersCollection.findOne({
            _id: new mongoose.Types.ObjectId('69944097ac334ef1d28fee68')
        });

        console.log('RAW ORDER FROM DATABASE:');
        console.log('Order Number:', order.orderNumber);
        console.log('\nItems:');
        order.items.forEach((item, i) => {
            console.log(`\nItem ${i}:`);
            console.log('  _id:', item._id);
            console.log('  _id type:', typeof item._id);
            console.log('  productName:', item.productName);
            if (item.stitchingDetails) {
                console.log('  stitchingStatus:', item.stitchingDetails.status);
            }
        });

        // Now test with lean()
        const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }), 'orders');
        const leanOrder = await Order.findById('69944097ac334ef1d28fee68').lean();

        console.log('\n\nORDER WITH .lean():');
        console.log('Order Number:', leanOrder.orderNumber);
        console.log('\nItems:');
        leanOrder.items.forEach((item, i) => {
            console.log(`\nItem ${i}:`);
            console.log('  _id:', item._id);
            console.log('  _id type:', typeof item._id);
            console.log('  productName:', item.productName);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testAPI();
