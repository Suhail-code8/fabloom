import React from 'react';
import ProductCard from '@/components/product/ProductCard';

interface FeaturedProductsProps {
    products: any[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100">
            <h2 className="text-2xl font-light mb-8 text-center">Featured</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
