import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testAPI() {
    try {
        console.log('🔍 Testing API endpoint...\n');

        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.success && data.data) {
            console.log(`\n✅ Found ${data.count} products`);
            data.data.forEach((product: any, index: number) => {
                console.log(`\n${index + 1}. ${product.name} (${product.type})`);
                console.log(`   Price: $${product.price}`);
            });
        } else {
            console.log('\n❌ No products returned');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAPI();
