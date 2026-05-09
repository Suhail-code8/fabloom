'use client';

import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result) => {
                if (result?.info && typeof result.info === 'object') {
                    const url = (result.info as { secure_url: string }).secure_url;
                    onUploadSuccess(url);
                }
            }}
        >
            {({ open }) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        open();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-lg text-sm text-gray-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                    📷 Upload Product Photo
                </button>
            )}
        </CldUploadWidget>
    );
}
