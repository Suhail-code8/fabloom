import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Cart } from '@/models/Cart';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    const { userId: authId } = await auth();
    if (!authId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const { items: localItems } = await req.json();

        // 1. Get or create server cart
        let cart = await Cart.findOne({ userId: authId });
        
        if (!cart) {
            cart = new Cart({ userId: authId, items: localItems });
            await cart.save();
            return NextResponse.json({ success: true, mergedItems: cart.items });
        }

        // 2. Simple merge logic: For now, we'll just prioritize local items 
        // if they differ, or combine them. In a real app, you'd match by productId+size
        // Here we'll just replace with local items if local has anything, 
        // or return server items if local is empty.
        
        if (localItems && localItems.length > 0) {
            cart.items = localItems;
            await cart.save();
        }

        return NextResponse.json({ 
            success: true, 
            mergedItems: cart.items 
        });

    } catch (error: any) {
        console.error('Cart sync error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
