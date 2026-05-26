import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { uploadImage } from '@/lib/cloudinary';

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json(
            { error: 'Cloudinary API credentials are not configured on the server' },
            { status: 500 }
        );
    }

    const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        return NextResponse.json(
            { error: 'Cloudinary cloud name is not configured' },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'Image must be under 10MB' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadImage(buffer, { folder: 'fabloom/products' });

        return NextResponse.json({ url: result.secure_url });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        console.error('Admin image upload error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
