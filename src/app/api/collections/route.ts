import { NextResponse } from 'next/server';
import { CollectionService } from '@/lib/services/collection.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const moduleId = searchParams.get('moduleId');

        const tree = await CollectionService.getCollectionTree(moduleId || undefined);
        return NextResponse.json(tree);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch collection tree', details: error.message },
            { status: 500 }
        );
    }
}
