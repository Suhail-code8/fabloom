import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const collections = await Collection.find().sort({ displayOrder: 1 }).lean();
        return NextResponse.json(collections);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        
        // Ensure slug is unique
        if (body.slug) {
            const existing = await Collection.findOne({ slug: body.slug });
            if (existing) {
                return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
            }
        }

        const newCollection = await Collection.create(body);
        return NextResponse.json(newCollection, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
