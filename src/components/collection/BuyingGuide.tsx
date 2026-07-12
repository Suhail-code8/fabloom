import React from 'react';
import Link from 'next/link';

interface BuyingGuideProps {
    guideLink?: string;
}

export function BuyingGuide({ guideLink }: BuyingGuideProps) {
    if (!guideLink) return null;

    return (
        <section className="py-16 bg-gray-50 mt-12 rounded-xl text-center">
            <h2 className="text-2xl font-serif mb-4">Need help choosing?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Read our comprehensive guide to understanding fabrics, fits, and styles.
            </p>
            <Link 
                href={guideLink}
                className="inline-block px-8 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
                Read the Buying Guide
            </Link>
        </section>
    );
}
