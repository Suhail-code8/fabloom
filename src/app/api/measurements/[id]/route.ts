import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { UserMeasurementProfile } from '@/models/UserMeasurementProfile';
import mongoose from 'mongoose';

// ============================================================================
// PATCH /api/measurements/[id] — update a profile
// ============================================================================

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { profileName, garmentTypes, measurements, isDefault } = body;

        // If setting as default, clear other defaults for this user
        if (isDefault) {
            await UserMeasurementProfile.updateMany(
                { userId, isDefault: true, _id: { $ne: id } },
                { $set: { isDefault: false } }
            );
        }

        const updated = await UserMeasurementProfile.findOneAndUpdate(
            { _id: id, userId }, // scoped to current user only
            {
                $set: {
                    ...(profileName   && { profileName: profileName.trim() }),
                    ...(garmentTypes  && { garmentTypes: garmentTypes.map((g: string) => g.toLowerCase()) }),
                    ...(measurements  && { measurements }),
                    ...(isDefault !== undefined && { isDefault }),
                },
            },
            { new: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ error: 'Profile not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ profile: updated });
    } catch (error: any) {
        console.error('Error updating measurement profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ============================================================================
// DELETE /api/measurements/[id] — delete a profile
// ============================================================================

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }

    try {
        await dbConnect();

        const deleted = await UserMeasurementProfile.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!deleted) {
            return NextResponse.json({ error: 'Profile not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting measurement profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
