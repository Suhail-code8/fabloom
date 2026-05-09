'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function WishlistClient() {
    const { data, error, mutate, isLoading } = useSWR('/api/user/wishlist', fetcher);

    if (error) return <div className="p-8 text-center text-red-500">Failed to load wishlist.</div>;

    const handleRemove = async (productId: string) => {
        // Optimistic update
        mutate({ ...data, wishlist: data.wishlist.filter((p: any) => p._id !== productId) }, false);
        
        await fetch('/api/user/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
        
        mutate(); // Revalidate
    };

    const wishlist = data?.wishlist || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => window.history.back()} className="p-1 active:scale-90 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#0f1035]">My Wishlist</h1>
                <span className="text-xs font-bold text-gray-400 ml-auto">{wishlist.length} items</span>
            </div>

            <div className="max-w-5xl mx-auto p-4">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {wishlist.map((product: any) => (
                            <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                                <div className="relative aspect-[4/5] bg-gray-100">
                                    <Image src={product.images[0] || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                                    
                                    {/* Remove Button */}
                                    <button 
                                        onClick={(e) => { e.preventDefault(); handleRemove(product._id); }}
                                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                    </button>
                                </div>
                                
                                <div className="p-4 flex flex-col gap-2">
                                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{product.name}</h3>
                                    <p className="text-sm font-extrabold text-[#D4A853]">
                                        ₹{product.price?.toLocaleString('en-IN') || product.basePrice?.toLocaleString('en-IN')}
                                    </p>
                                    <Link href={`/${product.type}/${product._id}`} className="mt-2 w-full py-2.5 rounded-xl border-2 border-[#0f1035] text-[#0f1035] text-xs font-bold text-center hover:bg-[#0f1035] hover:text-white transition-colors active:scale-95">
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 p-6 max-w-md mx-auto mt-4">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        </div>
                        <h2 className="text-lg font-extrabold text-gray-900 mb-2">Save items you love</h2>
                        <p className="text-sm text-gray-500 mb-8">Your wishlist is empty. Tap the heart icon on any product to save it here for later.</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/readymade" className="w-full py-4 bg-[#0f1035] text-white font-bold text-sm rounded-xl active:scale-95 transition-transform">Browse Readymade</Link>
                            <Link href="/fabrics" className="w-full py-4 bg-white border border-gray-200 text-gray-900 font-bold text-sm rounded-xl active:scale-95 transition-transform">Explore Fabrics</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
