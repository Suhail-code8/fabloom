import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { UserMeasurementProfile } from '@/models/UserMeasurementProfile';

export async function GET() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // userId in UserMeasurementProfile is the Clerk ID (String).
        // We join with the 'users' collection where clerkId matches.
        const profiles = await UserMeasurementProfile.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'clerkId',
                    as: 'userInfo',
                },
            },
            {
                $unwind: {
                    path: '$userInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    profileName: 1,
                    measurements: 1,
                    preferences: 1,
                    garmentTypes: 1,
                    isDefault: 1,
                    createdAt: 1,
                    user: {
                        name: '$userInfo.name',
                        email: '$userInfo.email',
                        phone: '$userInfo.phone',
                    },
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            count: profiles.length,
            data: profiles,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch measurement profiles';
        console.error('[GET /api/admin/measurements]', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
