import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { getBaseUrl } from '@/lib/getBaseUrl';

async function getProduct(id: string) {
    try {
        const res = await fetch(
            `${getBaseUrl()}/api/products/${id}`,
            {
                cache: 'no-store', // Always fetch fresh data
            }
        );

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                href="/products"
                className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Link>

            {/* Product Grid: Gallery (Left) + Info (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Product Gallery */}
                <div>
                    <ProductGallery images={product.images} productName={product.name} />
                </div>

                {/* Right: Product Info */}
                <div>
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* Additional Information Sections */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Shipping Info */}
                <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-emerald-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-2">Free Shipping</h3>
                    <p className="text-sm text-gray-600">On orders over $100</p>
                </div>

                {/* Quality Guarantee */}
                <div className="text-center p-6 border rounded-lg">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-gold-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-2">Quality Guaranteed</h3>
                    <p className="text-sm text-gray-600">Premium materials only</p>
                </div>

                {/* Custom Tailoring */}
                {product.type === 'fabric' && product.stitchingAvailable && (
                    <div className="text-center p-6 border rounded-lg">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg
                                className="h-6 w-6 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-navy-900 mb-2">Custom Tailoring</h3>
                        <p className="text-sm text-gray-600">Expert stitching available</p>
                    </div>
                )}

                {/* Returns (if not custom tailoring) */}
                {!(product.type === 'fabric' && product.stitchingAvailable) && (
                    <div className="text-center p-6 border rounded-lg">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
                            <svg
                                className="h-6 w-6 text-navy-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-navy-900 mb-2">Easy Returns</h3>
                        <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>
                )}
            </div>
        </div>
    );
}
