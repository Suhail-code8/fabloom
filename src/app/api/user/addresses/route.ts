import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        
        // Upsert the user securely in case they don't exist yet
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

        return NextResponse.json({ addresses: (user as any)?.addresses || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        
        // Basic validation
        if (!body.fullName || !body.phone || !body.addressLine1 || !body.city || !body.state || !body.postalCode) {
            return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
        }

        await dbConnect();

        // If this is set to default, we must unset all others first
        if (body.isDefault) {
            await User.updateOne(
                { clerkId: userId },
                { $set: { 'addresses.$[].isDefault': false } }
            );
        }

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $push: { 
                    addresses: {
                        fullName: body.fullName,
                        phone: body.phone,
                        addressLine1: body.addressLine1,
                        addressLine2: body.addressLine2,
                        city: body.city,
                        state: body.state,
                        postalCode: body.postalCode,
                        country: body.country || 'India',
                        isDefault: body.isDefault || false
                    }
                }
            },
            { new: true }
        ).lean();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, addresses: (user as any).addresses });
    } catch (error: any) {
        console.error('Error saving address:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get('id');

        if (!addressId) {
            return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
        }

        await dbConnect();
        
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        ).lean();

        return NextResponse.json({ success: true, addresses: (user as any)?.addresses || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { addressId, ...updateFields } = body;

        if (!addressId) {
            return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
        }

        // Basic validation for required fields
        if (!updateFields.fullName || !updateFields.phone || !updateFields.addressLine1 || !updateFields.city || !updateFields.state || !updateFields.postalCode) {
            return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
        }

        await dbConnect();

        // If this is set to default, we must unset all others first
        if (updateFields.isDefault) {
            await User.updateOne(
                { clerkId: userId },
                { $set: { 'addresses.$[].isDefault': false } }
            );
        }

        const user = await User.findOneAndUpdate(
            { clerkId: userId, 'addresses._id': addressId },
            {
                $set: {
                    'addresses.$': {
                        _id: addressId,
                        fullName: updateFields.fullName,
                        phone: updateFields.phone,
                        addressLine1: updateFields.addressLine1,
                        addressLine2: updateFields.addressLine2,
                        city: updateFields.city,
                        state: updateFields.state,
                        postalCode: updateFields.postalCode,
                        country: updateFields.country || 'India',
                        isDefault: updateFields.isDefault || false
                    }
                }
            },
            { new: true }
        ).lean();

        if (!user) {
            return NextResponse.json({ error: 'User or Address not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, addresses: (user as any).addresses });
    } catch (error: any) {
        console.error('Error updating address:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

