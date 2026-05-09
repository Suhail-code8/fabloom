import Image from 'next/image';
import { useState } from 'react';

interface OptimizedProductImageProps {
    src: string;
    alt: string;
    type?: 'listing' | 'detail' | 'thumbnail';
    className?: string;
}

export default function OptimizedProductImage({ 
    src, 
    alt, 
    type = 'listing',
    className = ''
}: OptimizedProductImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Dynamic sizes based on display type
    const sizes = {
        listing: '50vw',
        detail: '100vw',
        thumbnail: '80px'
    }[type];

    // Generate Cloudinary blur thumbnail
    const blurUrl = src.replace('/upload/', '/upload/w_10,h_10,q_auto,f_auto,e_blur:1000/');

    return (
        <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
            {/* Skeleton Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-10 animate-pulse bg-gray-200" />
            )}
            
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className={`object-cover transition-all duration-500 ${
                    isLoading ? 'scale-110 blur-xl' : 'scale-100 blur-0'
                }`}
                placeholder="blur"
                blurDataURL={blurUrl}
                onLoadingComplete={() => setIsLoading(false)}
            />
        </div>
    );
}
