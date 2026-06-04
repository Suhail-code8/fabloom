'use client';

import React, { useState, useEffect } from 'react';
import { Camera, X, UploadCloud, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
    const [urlInput, setUrlInput] = useState('');
    const [urlError, setUrlError] = useState('');
    const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

    // Load Cloudinary widget script
    useEffect(() => {
        if (!document.getElementById('cloudinary-widget-script')) {
            const script = document.createElement('script');
            script.id = 'cloudinary-widget-script';
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.onload = () => setIsWidgetLoaded(true);
            document.body.appendChild(script);
        } else {
            setIsWidgetLoaded(true);
        }
    }, []);

    const openCloudinaryWidget = () => {
        if (!isWidgetLoaded || typeof window === 'undefined' || !(window as any).cloudinary) {
            alert('Image upload widget is still loading, please try again in a moment.');
            return;
        }

        const widget = (window as any).cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo', // Fallback for safety
                uploadPreset: 'fabloom_products',
                multiple: true,
                maxFiles: maxImages - images.length,
                sources: ['local', 'camera'],
                folder: 'fabloom/products',
                cropping: false,
                resourceType: 'image'
            },
            (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    onChange([...images, result.info.secure_url].slice(0, maxImages));
                }
            }
        );
        widget.open();
    };

    const handleAddUrl = () => {
        setUrlError('');
        if (!urlInput) return;

        if (!urlInput.startsWith('http')) {
            setUrlError('URL must start with http or https');
            return;
        }

        if (images.length >= maxImages) {
            setUrlError(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Test if image loads
        const img = new window.Image();
        img.onload = () => {
            onChange([...images, urlInput]);
            setUrlInput('');
        };
        img.onerror = () => {
            setUrlError('Invalid image URL or image cannot be loaded');
        };
        img.src = urlInput;
    };

    const removeImage = (indexToRemove: number) => {
        onChange(images.filter((_, idx) => idx !== indexToRemove));
    };

    // Reorder simple implementation (move left/right)
    const moveImage = (index: number, direction: 'left' | 'right') => {
        if (
            (direction === 'left' && index === 0) || 
            (direction === 'right' && index === images.length - 1)
        ) return;

        const newImages = [...images];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        
        // Swap
        const temp = newImages[index];
        newImages[index] = newImages[targetIndex];
        newImages[targetIndex] = temp;
        
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex bg-navy-800 p-1 rounded-lg border border-white/10">
                <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'upload' ? 'bg-gold-500 text-navy-900 shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <UploadCloud className="w-4 h-4" />
                    Upload from device
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'url' ? 'bg-gold-500 text-navy-900 shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    Paste image URL
                </button>
            </div>

            {/* Content area based on tab */}
            <div className="p-4 border border-white/10 rounded-lg bg-navy-800/50">
                {activeTab === 'upload' ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <UploadCloud className="w-10 h-10 text-gold-500 mb-3 opacity-80" />
                        <p className="text-sm text-gray-300 mb-4">
                            Upload high quality photos of the product.
                        </p>
                        <button
                            type="button"
                            onClick={openCloudinaryWidget}
                            disabled={images.length >= maxImages}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                                images.length >= maxImages
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-md'
                            }`}
                        >
                            {images.length >= maxImages ? 'Max images reached' : 'Choose Photos'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 bg-navy-900 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddUrl();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAddUrl}
                                disabled={!urlInput || images.length >= maxImages}
                                className="px-4 py-2 bg-gold-500 text-navy-900 font-bold text-sm rounded-md hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        {urlError && <p className="text-red-400 text-xs mt-1">{urlError}</p>}
                    </div>
                )}
            </div>

            {/* PREVIEW SECTION */}
            <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center justify-between">
                    <span>Product Images ({images.length}/{maxImages})</span>
                    {images.length > 0 && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">First image is main</span>
                    )}
                </h4>

                {images.length === 0 ? (
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                        <Camera className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400">No images added yet.</p>
                        <p className="text-xs text-gray-500 mt-1">Upload or paste URLs above</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {images.map((src, index) => (
                            <div 
                                key={`${src}-${index}`}
                                className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                    index === 0 ? 'border-gold-500 shadow-md shadow-gold-500/20 w-[100px] h-[100px]' : 'border-white/10 hover:border-white/30 w-[80px] h-[80px]'
                                }`}
                            >
                                {/* Image */}
                                <img
                                    src={src}
                                    alt={`Product preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Overlay controls */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                    <div className="flex gap-1">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => moveImage(index, 'left')}
                                                className="p-1 bg-white/20 hover:bg-white/40 rounded text-white"
                                                title="Move left"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                        )}
                                        {index < images.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => moveImage(index, 'right')}
                                                className="p-1 bg-white/20 hover:bg-white/40 rounded text-white"
                                                title="Move right"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-1 mt-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
                                        title="Remove"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Main photo badge */}
                                {index === 0 && (
                                    <div className="absolute bottom-0 inset-x-0 bg-gold-500 text-navy-900 text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                                        Main Photo
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
