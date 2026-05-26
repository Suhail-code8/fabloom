import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ReadymadeProduct, FabricProduct, AccessoryProduct } from '@/models/Product';
import { getProductsAction } from '@/lib/dal';
import { ensureUniqueProductSlug } from '@/lib/slugify';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category') || undefined;
        const type = searchParams.get('type') || undefined;
        const featured = searchParams.get('featured') === 'true' ? true : undefined;
        const slug = searchParams.get('slug') || undefined;
        const search = searchParams.get('search') || undefined;
        const limit = parseInt(searchParams.get('limit') || '0') || undefined;

        const products = await getProductsAction({
            category,
            type,
            featured,
            slug,
            search,
            limit,
            sort: searchParams.get('sort') || undefined
        });

        return NextResponse.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products', message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { type } = body;

        if (!body.slug && body.name) {
            body.slug = await ensureUniqueProductSlug(body.name);
        }

        if (!type || !['readymade', 'fabric', 'accessory'].includes(type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing product type' },
                { status: 400 }
            );
        }

        let product;
        if (type === 'readymade') {
            product = new ReadymadeProduct(body);
        } else if (type === 'fabric') {
            product = new FabricProduct(body);
        } else {
            product = new AccessoryProduct(body);
        }

        await product.save();

        return NextResponse.json(
            { success: true, data: product },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product', message: error.message },
            { status: 500 }
        );
    }
}
