import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Product, ReadymadeProduct, FabricProduct, AccessoryProduct } from '@/models/Product';

// ============================================================================
// GET ALL PRODUCTS
// ============================================================================
export async function GET() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ products });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ============================================================================
// POST - CREATE NEW PRODUCT
// ============================================================================
export async function POST(req: NextRequest) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        
        // Base Validation
        if (!body.name || !body.description || !body.type || !body.price || !body.category) {
            return NextResponse.json({ error: 'Missing base required fields' }, { status: 400 });
        }

        let newProduct;

        // Use discriminator models based on type
        switch (body.type) {
            case 'readymade':
                newProduct = await ReadymadeProduct.create(body);
                break;
            case 'fabric':
                newProduct = await FabricProduct.create(body);
                break;
            case 'accessory':
                newProduct = await AccessoryProduct.create(body);
                break;
            default:
                return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
