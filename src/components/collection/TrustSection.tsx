import React from 'react';
import Image from 'next/image';

interface TrustSectionProps {
    title?: string;
    description?: string;
}

export function TrustSection({ 
    title = "The Fabloom Heritage", 
    description = "Rooted in tradition and refined for the modern gentleman. Every garment is crafted with absolute precision, utilizing the world's finest fabrics and masterful tailoring techniques." 
}: TrustSectionProps) {
    return (
        <section className="py-20 bg-gray-50 mt-16">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-serif text-gray-900 mb-6">{title}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8 font-light">
                        {description}
                    </p>
                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Finest Fabrics</h4>
                            <p className="text-sm text-gray-500">Sourced from the world's premier mills.</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Master Tailoring</h4>
                            <p className="text-sm text-gray-500">Exquisite attention to every stitch.</p>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 w-full h-[400px] bg-gray-200 relative rounded-xl overflow-hidden">
                    {/* Placeholder for a luxury brand/atelier image */}
                    <div className="absolute inset-0 bg-gray-800 opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                        Atelier Image Placeholder
                    </div>
                </div>
            </div>
        </section>
    );
}
