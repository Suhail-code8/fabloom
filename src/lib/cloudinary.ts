import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// ============================================================================
// CLOUDINARY SDK CONFIGURATION
// ============================================================================

cloudinary.config({
    cloud_name:
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// ============================================================================
// UPLOAD IMAGE FROM BUFFER
// ============================================================================

export interface UploadImageOptions {
    folder?:         string;
    publicId?:       string;
    transformation?: object[];
}

export async function uploadImage(
    buffer: Buffer,
    options: UploadImageOptions = {}
): Promise<UploadApiResponse> {
    const { folder = 'fabloom', publicId, transformation } = options;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id:      publicId,
                transformation,
                resource_type:  'image',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('No result from Cloudinary'));
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
}

// ============================================================================
// UPLOAD IMAGE FROM URL (for seeding / migration)
// ============================================================================

export async function uploadImageFromUrl(
    url: string,
    options: UploadImageOptions = {}
): Promise<UploadApiResponse> {
    const { folder = 'fabloom', publicId } = options;
    return cloudinary.uploader.upload(url, { folder, public_id: publicId, resource_type: 'image' });
}

// ============================================================================
// DELETE IMAGE
// ============================================================================

export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

// ============================================================================
// GET OPTIMIZED URL
// Returns a WebP-converted, quality-auto URL for any stored asset
// ============================================================================

export function getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    const transforms: object[] = [
        { quality: 'auto' },
        { fetch_format: 'auto' },
    ];

    if (width || height) {
        transforms.push({ width, height, crop: 'fill', gravity: 'auto' });
    }

    return cloudinary.url(publicId, {
        transformation: transforms,
        secure: true,
    });
}

export { cloudinary };
