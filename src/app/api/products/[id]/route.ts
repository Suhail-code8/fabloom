import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid product ID format',
                },
                { status: 400 }
            );
        }

        // Fetch product by ID
        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Product not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch product',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
