import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { updateProductSchema } from '@/lib/validations/product';
import mongoose from 'mongoose';

// ============================================================================
// GET /api/admin/products/[id]
// ============================================================================

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    try {
        await dbConnect();
        const product = await Product.findById(id).lean();
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ============================================================================
// PATCH /api/admin/products/[id] — field edits only (no image re-upload this pass)
// ============================================================================

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        // Strip fields that must not be changed via this endpoint
        delete body._id;
        delete body.__v;
        delete body.type; // type cannot be changed after creation

        const parsed = updateProductSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const updated = await Product.findByIdAndUpdate(
            id,
            { $set: parsed.data },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        return NextResponse.json({ success: true, product: updated });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ============================================================================
// DELETE /api/admin/products/[id] — soft delete (active: false)
// ============================================================================

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    try {
        await dbConnect();

        // Soft delete — preserves order history
        const deleted = await Product.findByIdAndUpdate(
            id,
            { $set: { active: false } },
            { new: true }
        ).lean();

        if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Product deactivated' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
