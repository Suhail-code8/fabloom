'use client';

import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
    variant?: 'button' | 'dropzone';
}

export default function ImageUpload({
    onUploadSuccess,
    variant = 'button',
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    async function uploadFile(file: File) {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPG, PNG, or WebP)');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onUploadSuccess(data.url);
            toast.success('Image uploaded');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            toast.error(message);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    }

    const fileInput = (
        <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onInputChange}
            disabled={uploading}
        />
    );

    if (variant === 'dropzone') {
        return (
            <>
                {fileInput}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => !uploading && inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!uploading) inputRef.current?.click();
                        }
                    }}
                    className="p-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50 text-xs text-gray-400 font-bold cursor-pointer hover:border-[#D4A853] hover:bg-amber-50/20 transition-all disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                    ) : (
                        <svg
                            className="w-8 h-8 text-gray-300 mb-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    )}
                    {uploading ? 'Uploading…' : 'Click to Upload Images'}
                </div>
            </>
        );
    }

    return (
        <>
            {fileInput}
            <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-lg text-sm text-gray-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading…
                    </>
                ) : (
                    '📷 Upload Product Photo'
                )}
            </button>
        </>
    );
}
