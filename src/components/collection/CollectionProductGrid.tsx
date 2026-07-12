import React from 'react';
import ProductCard from '@/components/product/ProductCard';

interface CollectionProductGridProps {
    products: any[];
}

export function CollectionProductGrid({ products }: CollectionProductGridProps) {
    if (!products || products.length === 0) {
        return (
            <div className="py-20 text-center text-gray-500">
                <p>No products available in this collection yet.</p>
            </div>
        );
    }

    return (
        <section className="py-12 border-t border-gray-100">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-light">All Products</h2>
                <span className="text-sm text-gray-500">{products.length} items</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
