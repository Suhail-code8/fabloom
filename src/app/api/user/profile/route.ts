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

        const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.local`;
        const name = clerkUser.fullName || clerkUser.firstName || 'User';

        let user = await User.findOne({ clerkId: userId }).lean();

        if (!user) {
            // Check if a user with this email already exists (e.g., from before Clerk was added)
            const existingUserByEmail = await User.findOne({ email: email });

            if (existingUserByEmail) {
                // Link the Clerk ID to the existing user
                existingUserByEmail.clerkId = userId;
                if (!existingUserByEmail.name) existingUserByEmail.name = name;
                await existingUserByEmail.save();
                user = existingUserByEmail.toObject();
            } else {
                // Create a new user
                const newUser = new User({
                    clerkId: userId,
                    email: email,
                    name: name,
                    role: 'customer',
                });
                await newUser.save();
                user = newUser.toObject();
            }
        }

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
        console.error("API /api/user/profile ERROR:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
