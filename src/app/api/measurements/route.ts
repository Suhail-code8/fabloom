import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { UserMeasurementProfile } from '@/models/UserMeasurementProfile';

// ============================================================================
// GET /api/measurements — list profiles for authenticated user
// ============================================================================

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const profiles = await UserMeasurementProfile
            .find({ userId })
            .sort({ isDefault: -1, createdAt: -1 })
            .lean();

        return NextResponse.json({ profiles });
    } catch (error) {
        console.error('GET Measurements Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ============================================================================
// POST /api/measurements — create a new profile
// Body: { profileName, garmentType, measurements, isDefault }
// ============================================================================

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { profileName, garmentTypes, measurements, preferences, isDefault = false } = body;

        // Basic validation
        if (!profileName || !garmentTypes || !Array.isArray(garmentTypes) || garmentTypes.length === 0 || !measurements) {
            return NextResponse.json(
                { error: 'profileName, garmentTypes array, and measurements are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // If this is set as default, clear existing default for this user
        if (isDefault) {
            await UserMeasurementProfile.updateMany(
                { userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const profile = await UserMeasurementProfile.create({
            userId,
            profileName: profileName.trim(),
            garmentTypes: garmentTypes.map(g => g.toLowerCase()),
            measurements,
            preferences,
            isDefault,
        });

        return NextResponse.json({ profile }, { status: 201 });
    } catch (error: any) {
        console.error('POST Measurements Error:', error);
        
        // Return specific validation error if it's a Mongoose ValidationError
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
