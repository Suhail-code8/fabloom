import { getProductsAction } from './src/lib/dal';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testDAL() {
    console.log('Testing DAL for Readymade...');
    const readymade = await getProductsAction({ type: 'readymade', limit: 100 });
    console.log('Readymade count:', readymade.length);
    readymade.forEach((p: any) => console.log(`- ${p.name} (${p.subcategory})`));

    console.log('\nTesting DAL for Accessories...');
    const accessories = await getProductsAction({ type: 'accessory', limit: 100 });
    console.log('Accessories count:', accessories.length);
    accessories.forEach((p: any) => console.log(`- ${p.name} (${p.subcategory})`));
}

testDAL().then(() => process.exit(0));
