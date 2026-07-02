import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

// ============================================================================
// GET /api/admin/customers
// Returns all users sorted newest-first.
// Admin-only: requires publicMetadata.role === 'admin'.
// ============================================================================
export async function GET() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const customers = await User.find()
            .sort({ createdAt: -1 })
            .select('name email phone role createdAt')
            .lean();

        return NextResponse.json({
            success: true,
            count: customers.length,
            data: customers,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch customers';
        console.error('[GET /api/admin/customers]', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
