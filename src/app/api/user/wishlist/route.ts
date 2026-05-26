import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Product } from '@/models/Product'; // needed for population
import mongoose from 'mongoose';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        // Populate the wishlist array with actual Product documents
        const user = await User.findOne({ clerkId: userId })
            .populate({ path: 'wishlist', model: Product })
            .lean();

        return NextResponse.json({ success: true, wishlist: (user as any)?.wishlist || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { productId } = await req.json();
        if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
        }

        await dbConnect();
        
        const user = await User.findOne({ clerkId: userId });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const isLiked = user.wishlist.some(
            (id: mongoose.Types.ObjectId) => id.toString() === productId
        );

        if (isLiked) {
            // Remove
            user.wishlist = user.wishlist.filter(
                (id: mongoose.Types.ObjectId) => id.toString() !== productId
            );
        } else {
            // Add
            user.wishlist.push(new mongoose.Types.ObjectId(productId));
        }

        await user.save();

        return NextResponse.json({ success: true, isLiked: !isLiked });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
