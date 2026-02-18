'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({
    images,
    productName,
}: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    // Ensure we have at least one image
    const galleryImages = images.length > 0 ? images : ['/placeholder.png'];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 border">
                <Image
                    src={galleryImages[selectedImage]}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${selectedImage === index
                                    ? 'border-emerald-600 ring-2 ring-emerald-200'
                                    : 'border-gray-200 hover:border-emerald-300'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="120px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
