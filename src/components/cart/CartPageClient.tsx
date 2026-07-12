'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import type { CartItem, StitchingCartItem, ReadymadeCartItem, AccessoryCartItem, FabricCartItem } from '@/store/useCartStore';

function fmtINR(n: number) {
    return n.toLocaleString('en-IN');
}

// ============================================================================
// STITCHING BUNDLE CARD (Section 1)
// ============================================================================
function StitchingBundleCard({ item, onRemove }: { item: StitchingCartItem; onRemove: () => void }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-transparent p-4 rounded-sm mb-3 shadow-sm border border-[rgba(255,255,255,0.08)]">
            <div className="flex gap-4">
                {/* Fabric Image */}
                <div className="w-[60px] h-[60px] rounded-sm bg-[rgba(255,255,255,0.05)] overflow-hidden flex-shrink-0 relative">
                    <Image src={item.fabricImage} alt={item.fabricName} fill className="object-cover" sizes="60px" />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[#92650a] bg-[#D4A853]/10">
                                {item.garmentType}
                            </span>
                            <h3 className="text-sm font-bold text-white mt-1">{item.fabricName}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{item.meters} meters</p>
                        </div>
                        <button onClick={onRemove} className="p-1 -mt-1 text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                        </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-400 flex justify-between items-center">
                        <div className="space-y-0.5">
                            <p>
                                {item.fabricName} × {item.meters}m
                            </p>
                            <p>
                                + {item.garmentType} Stitching
                            </p>
                        </div>
                        <span className="text-sm font-extrabold text-white">
                            ₹{fmtINR(item.totalPrice)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Accordion for Measurements */}
            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)]">
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#D4A853]"
                >
                    View measurements ({item.measurementProfileName})
                    <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                
                {expanded && (
                    <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs bg-[rgba(255,255,255,0.02)] p-3 rounded-sm border border-[rgba(255,255,255,0.08)]">
                        {Object.entries(item.measurementSnapshot).map(([key, val]) => (
                            <div key={key} className="flex justify-between pr-4">
                                <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="font-bold text-white">{val as number}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// REGULAR ITEM CARD (Section 2)
// ============================================================================
function RegularItemCard({ item, onRemove, onQty }: { item: ReadymadeCartItem | AccessoryCartItem | FabricCartItem; onRemove: () => void; onQty: (q: number) => void }) {
    const itemTotal = (() => {
        if (item.itemType === 'readymade' || item.itemType === 'accessory') {
            return item.price * item.quantity;
        }
        // FabricCartItem
        const fabricCost = item.pricePerMeter * item.meters;
        const stitchingCost = item.stitchingPrice || 0;
        return (fabricCost + stitchingCost) * item.quantity;
    })();

    return (
        <div className="flex gap-4 py-4 border-b border-[rgba(255,255,255,0.08)] last:border-0">
            <div className="w-[80px] h-[80px] rounded-sm bg-[rgba(255,255,255,0.05)] overflow-hidden flex-shrink-0 relative">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white truncate pr-2">{item.name}</h3>
                        <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                    {item.itemType === 'readymade' && <span className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 block">Size: {item.size}</span>}
                    {item.itemType === 'accessory' && item.color && <span className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 block">Color: {item.color}</span>}
                    {item.itemType === 'fabric' && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 block">
                            {item.name} × {item.meters}m = ₹{fmtINR(item.pricePerMeter * item.meters)}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onQty(item.quantity - 1)} className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center font-bold text-gray-600">−</button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onQty(item.quantity + 1)} className="w-6 h-6 rounded-full bg-[#D4A853] flex items-center justify-center font-bold text-white">+</button>
                    </div>
                    <span className="text-sm font-extrabold text-white">
                        ₹{fmtINR(itemTotal)}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EMPTY STATE
// ============================================================================
function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <svg className="w-24 h-24 text-gray-200 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="text-xl font-extrabold text-white mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">Looks like you haven't added anything yet. Discover our premium collections.</p>
            
            <div className="flex flex-col w-full max-w-xs gap-3">
                <Link href="/readymade" className="w-full py-3.5 rounded-sm text-sm font-bold text-center transition-all bg-[#0f1035] text-white">
                    Browse Readymade
                </Link>
                <Link href="/stitching" className="w-full py-3.5 rounded-sm text-sm font-bold text-center transition-all bg-[#D4A853] text-white">
                    Start Stitching
                </Link>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CartPageClient() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const stitchingItems = items.filter((i): i is StitchingCartItem => i.itemType === 'stitching');
    const regularItems = items.filter(
        (i): i is ReadymadeCartItem | AccessoryCartItem | FabricCartItem => i.itemType !== 'stitching'
    );
    
    const subtotal = getTotal();
    const stitchingCharges = stitchingItems.reduce((acc, curr) => acc + curr.stitchingCharge, 0);

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0f1035] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-transparent">
                <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    <h1 className="text-lg font-extrabold text-white">Shopping Cart</h1>
                </div>
                <EmptyCart />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[rgba(255,255,255,0.02)] store-pb-action-nav lg:pb-12">
            <div className="bg-transparent px-4 py-4 border-b border-[rgba(255,255,255,0.08)] flex justify-between items-center">
                <h1 className="text-xl font-extrabold text-white">Shopping Cart</h1>
                <button onClick={clearCart} className="text-xs font-bold text-gray-400 hover:text-white">Clear all</button>
            </div>

            <div className="max-w-4xl mx-auto lg:flex lg:gap-8 lg:p-6 lg:items-start">
                {/* Left Column - Cart Items */}
                <div className="flex-1">
                    {/* SECTION 1: Stitching */}
                    {stitchingItems.length > 0 && (
                        <div className="px-4 py-6">
                            <h2 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#D4A853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                                Custom Stitching Orders
                            </h2>
                            <div>
                                {stitchingItems.map(item => (
                                    <StitchingBundleCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: Regular Items */}
                    {regularItems.length > 0 && (
                        <div className="bg-transparent mt-2 lg:mt-0 lg:rounded-sm lg:shadow-sm px-4">
                            <h2 className="text-sm font-extrabold text-white pt-6 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
                                Regular Items
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {regularItems.map(item => (
                                    <RegularItemCard 
                                        key={item.id} 
                                        item={item} 
                                        onRemove={() => removeItem(item.id)}
                                        onQty={(q) => updateQuantity(item.id, q)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column / Bottom Sheet - Order Summary */}
                <div className="store-action-bar bg-transparent border-t border-[rgba(255,255,255,0.08)] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-4 rounded-t-3xl lg:static lg:w-96 lg:rounded-sm lg:shadow-sm lg:border lg:pb-0">
                    <h3 className="text-sm font-extrabold text-white mb-4 hidden lg:block">Order Summary</h3>
                    
                    <div className="flex gap-2 mb-4 h-11">
                        <input type="text" placeholder="Coupon code" className="flex-1 px-3 rounded-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] text-sm font-bold outline-none focus:border-[#D4A853]" />
                        <button className="ecom-btn px-4 text-xs font-bold active:scale-95 transition-transform">Apply</button>
                    </div>

                    <div className="space-y-2.5 text-sm text-gray-600 mb-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-white">₹{fmtINR(subtotal)}</span>
                        </div>
                        {stitchingCharges > 0 && (
                            <div className="flex justify-between">
                                <span>Stitching Charges</span>
                                <span className="font-bold text-white">Included (₹{fmtINR(stitchingCharges)})</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-gray-400 bg-[rgba(255,255,255,0.02)] p-2 rounded-lg mt-2">
                            <span>Est. Delivery</span>
                            <span className="font-bold">{stitchingItems.length > 0 ? '7-10 Days' : '3-5 Days'}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-base font-extrabold text-white">Total</span>
                        <span className="text-xl font-extrabold text-[#D4A853]">₹{fmtINR(subtotal)}</span>
                    </div>

                    <button 
                        onClick={() => router.push('/checkout')}
                        disabled={items.length === 0}
                        className="ecom-btn w-full h-14 text-sm font-extrabold shadow-xl disabled:opacity-50"
                    >
                        Checkout securely
                    </button>
                </div>
            </div>
        </div>
    );
}

