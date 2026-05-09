import React from 'react';

interface ProductStructuredDataProps {
    product: any;
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
    if (!product) return null;

    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.[0],
        description: product.description,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.active ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://fabloom.in/${product.type}/${product._id}`
        }
    };

    if (product.type === 'fabric') {
        schema.offers.unitPricingMeasure = 'MTR';
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
