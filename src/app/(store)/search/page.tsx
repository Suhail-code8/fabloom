'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';

    const { data, error, isLoading } = useSWR(
        q ? `/api/products?search=${encodeURIComponent(q)}&limit=50` : null,
        fetcher
    );

    const products: any[] = data?.data || [];

    return (
        <div className="min-h-screen bg-[#0f1035]">
            <div className="px-4 pt-5 pb-4 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-extrabold text-white">Search</h1>
                <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {q ? `Results for “${q}”` : 'Type a query'}
                </span>
            </div>

            <div className="px-4 pb-8">
                {!q && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white/80 text-sm">
                        Add a query like <span className="font-extrabold text-white">/search?q=kurta</span> to see products.
                    </div>
                )}

                {q && isLoading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {q && !isLoading && error && (
                    <div className="bg-white/5 border border-red-500/30 rounded-2xl p-5 text-red-200 text-sm">
                        Failed to search products.
                    </div>
                )}

                {q && !isLoading && !error && products.length === 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white/80 text-sm">
                        No results found for “{q}”.
                    </div>
                )}

                {q && !isLoading && !error && products.length > 0 && (
                    <div className="store-product-grid">
                        {products.map((p: any) => {
                            const href =
                                p.type === 'readymade'
                                    ? `/readymade/${p.slug || p._id}`
                                    : p.type === 'fabric'
                                    ? `/fabrics/${p.slug || p._id}`
                                    : `/accessories/${p.slug || p._id}`;

                            const priceLabel =
                                p.type === 'fabric' && p.pricePerMeter
                                    ? `₹${p.pricePerMeter}/m`
                                    : `₹${p.price}`;

                            return (
                                <Link
                                    key={p._id}
                                    href={href}
                                    className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
                                    aria-label={p.name}
                                >
                                    <div className="relative aspect-[3/4] flex-shrink-0 bg-gray-50">
                                        <Image
                                            src={p.images?.[0] || '/placeholder-product.jpg'}
                                            alt={p.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 p-3 min-h-0">
                                        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug flex-1">
                                            {p.name}
                                        </p>
                                        <p className="text-sm font-extrabold text-[#D4A853] mt-auto pt-2">{priceLabel}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

