import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const featured = searchParams.get('featured');

        // Build filter object
        const filter: any = { active: true };

        if (category) {
            filter.category = category;
        }

        if (type) {
            filter.type = type;
        }

        if (featured === 'true') {
            filter.featured = true;
        }

        // Fetch products with filter
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch products',
                message: error.message
            },
            { status: 500 }
        );
    }
}
