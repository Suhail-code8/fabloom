import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId }).lean();
        return NextResponse.json({ 
            success: true, 
            preferences: (user as any)?.notificationPreferences || { whatsapp: true, email: true, promotional: false } 
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const updates = await req.json(); // e.g. { whatsapp: false }
        await dbConnect();

        // Dynamically build the $set payload
        const setPayload: any = {};
        for (const [key, value] of Object.entries(updates)) {
            setPayload[`notificationPreferences.${key}`] = value;
        }

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: setPayload },
            { new: true }
        ).lean();

        return NextResponse.json({ success: true, preferences: (user as any)?.notificationPreferences });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
