import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { UserMeasurementProfile } from '@/models/UserMeasurementProfile';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const profiles = await UserMeasurementProfile.find({ clerkId: userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
        return NextResponse.json({ success: true, profiles });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { profileId, isDefault } = await req.json();
        await dbConnect();

        if (isDefault) {
            // Unset other defaults
            await UserMeasurementProfile.updateMany({ clerkId: userId }, { $set: { isDefault: false } });
        }

        const updated = await UserMeasurementProfile.findOneAndUpdate(
            { _id: profileId, clerkId: userId },
            { $set: { isDefault } },
            { new: true }
        ).lean();

        return NextResponse.json({ success: true, profile: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        
        await dbConnect();
        await UserMeasurementProfile.findOneAndDelete({ _id: id, clerkId: userId });
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
