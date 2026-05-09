import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { UserMeasurementProfile } from '@/models/UserMeasurementProfile';

export async function GET() {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Ensure user exists
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $setOnInsert: {
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    name: clerkUser.fullName || clerkUser.firstName || 'User',
                    role: 'customer',
                }
            },
            { upsert: true, new: true }
        ).lean();

        // Fetch counts concurrently
        const [ordersCount, profilesCount] = await Promise.all([
            Order.countDocuments({ userId }),
            UserMeasurementProfile.countDocuments({ userId })
        ]);

        return NextResponse.json({
            success: true,
            user: {
                name: (user as any)?.name,
                email: (user as any)?.email,
                avatar: clerkUser.imageUrl,
                createdAt: (user as any)?.createdAt,
                role: clerkUser.publicMetadata?.role || 'customer',
            },
            stats: {
                ordersCount,
                profilesCount,
                wishlistCount: (user as any)?.wishlist?.length || 0
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
