import { NextResponse } from 'next/server';
import { CollectionService } from '@/lib/services/collection.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slugsParam = searchParams.get('slugs');

        if (!slugsParam) {
            return NextResponse.json({ error: 'Missing slugs parameter' }, { status: 400 });
        }

        const slugs = slugsParam.split('/').filter(Boolean);
        const collection = await CollectionService.resolvePath(slugs);

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        const breadcrumbs = await CollectionService.getBreadcrumbs(collection._id.toString());
        const children = await CollectionService.getChildCollections(collection._id.toString());

        return NextResponse.json({
            collection,
            breadcrumbs,
            children
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to resolve collection path', details: error.message },
            { status: 500 }
        );
    }
}
