import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const collection = await Collection.findById(resolvedParams.id).lean();
        if (!collection) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(collection);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const body = await request.json();

        if (body.slug) {
            const existing = await Collection.findOne({ slug: body.slug, _id: { $ne: resolvedParams.id } });
            if (existing) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const updated = await Collection.findByIdAndUpdate(resolvedParams.id, body, { new: true, runValidators: true });
        if (!updated) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        
        // Ensure no children exist before deleting
        const children = await Collection.find({ parentId: resolvedParams.id }).lean();
        if (children.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete collection with children. Move or delete children first.' },
                { status: 400 }
            );
        }

        const deleted = await Collection.findByIdAndDelete(resolvedParams.id);
        if (!deleted) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Collection deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
