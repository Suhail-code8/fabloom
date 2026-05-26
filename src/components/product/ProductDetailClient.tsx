'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCartStore } from '@/store/useCartStore';
import MeasurementProfilePicker from '@/components/stitching/MeasurementProfilePicker';
import type { AnyProduct, IReadymadeProduct, IFabricProduct, IAccessoryProduct } from '@/types/product';

interface Props {
    product: AnyProduct;
}

export default function ProductDetailClient({ product }: Props) {
    const { addItem } = useCartStore();
    
    // UI State
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // Readymade specific
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Fabric specific
    const [meters, setMeters] = useState(3.5); // Default for Kurta
    const [wantsStitching, setWantsStitching] = useState(false);
    const [measurementProfile, setMeasurementProfile] = useState<any>(null);
    const [profiles, setProfiles] = useState<any[]>([]);

    const isFabric = product.type === 'fabric';
    const isReadymade = product.type === 'readymade';
    const isAccessory = product.type === 'accessory';

    useEffect(() => {
        if (isFabric) {
            fetch('/api/measurements')
                .then(res => res.ok ? res.json() : { profiles: [] })
                .then(data => {
                    setProfiles(data.profiles || []);
                })
                .catch(err => {
                    console.error('Failed to fetch profiles:', err);
                    setProfiles([]);
                });
        }
    }, [isFabric]);

    // Pricing
    const basePrice = isFabric 
        ? (product as IFabricProduct).pricePerMeter * meters 
        : product.price;
    const stitchingCharge = wantsStitching ? (product as IFabricProduct).stitchingPrice : 0;
    const totalPrice = (basePrice + stitchingCharge) * quantity;

    // Handlers
    const handleAddToCart = () => {
        if (isReadymade && !selectedSize) {
            toast.error('Please select a size');
            return;
        }
        if (isFabric && wantsStitching && !measurementProfile) {
            toast.error('Please select a measurement profile for stitching');
            return;
        }

        setIsAdding(true);
        
        const cartItem: any = {
            id: `${product._id}-${selectedSize || 'default'}-${wantsStitching ? 'stitched' : 'raw'}`,
            productId: product._id,
            name: product.name,
            price: basePrice,
            image: product.images[0],
            quantity,
        };

        if (isReadymade) {
            cartItem.itemType = 'readymade';
            cartItem.size = selectedSize;
        } else if (isFabric) {
            cartItem.itemType = 'fabric';
            cartItem.meters = meters;
            if (wantsStitching) {
                cartItem.itemType = 'stitching';
                cartItem.stitchingCharge = stitchingCharge;
                cartItem.measurementProfileId = measurementProfile._id;
                cartItem.measurementProfileName = measurementProfile.profileName;
                cartItem.measurementSnapshot = measurementProfile.measurements;
                cartItem.garmentType = (product as any).subcategory || 'Kurta';
                cartItem.fabricId = product._id;
                cartItem.fabricName = product.name;
                cartItem.fabricImage = product.images[0];
                cartItem.totalPrice = totalPrice;
            }
        } else {
            cartItem.itemType = 'accessory';
            cartItem.color = (product as IAccessoryProduct).color;
        }

        addItem(cartItem);
        toast.success(`${product.name} added to cart`);
        
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pb-32">
            
            {/* Left: Image Gallery (5/12 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-xl group">
                    <Image 
                        src={product.images[activeImage] || '/placeholder-product.png'} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    {product.featured && (
                        <span className="absolute top-4 left-4 bg-[#D4A853] text-[#0f1035] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Featured</span>
                    )}
                </div>
                {product.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {product.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#D4A853] scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Product Details (7/12 cols) */}
            <div className="lg:col-span-7 flex flex-col pt-2">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A853]">{product.category}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{product.subcategory || product.type}</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0f1035] leading-tight tracking-tight mb-4">{product.name}</h1>
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-extrabold text-[#0f1035]">₹{totalPrice.toLocaleString('en-IN')}</span>
                        {isFabric && <span className="text-sm font-bold text-gray-400"> (₹{(product as IFabricProduct).pricePerMeter}/m)</span>}
                    </div>
                    <p className="text-gray-500 leading-relaxed max-w-xl">{product.description}</p>
                </div>

                {/* TYPE SPECIFIC OPTIONS */}
                <div className="space-y-8 mb-10">
                    
                    {/* Readymade: Size Selection */}
                    {isReadymade && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-900">Select Size</h3>
                                <button className="text-[10px] font-bold text-[#D4A853] underline underline-offset-4">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries((product as IReadymadeProduct).sizeStock || {}).map(([size, stock]) => {
                                    const outOfStock = (stock as number) <= 0;
                                    return (
                                        <button
                                            key={size}
                                            disabled={outOfStock}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[56px] h-12 flex items-center justify-center rounded-xl border-2 font-bold text-sm transition-all ${
                                                selectedSize === size 
                                                    ? 'border-[#0f1035] bg-[#0f1035] text-white shadow-lg scale-95' 
                                                    : outOfStock 
                                                        ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50' 
                                                        : 'border-gray-100 text-gray-600 hover:border-gray-300 active:scale-95'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Fabric: Meter Selection & Stitching */}
                    {isFabric && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4">Quantity (Meters)</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner">
                                        <button onClick={() => setMeters(Math.max(0.5, meters - 0.5))} className="w-10 h-10 flex items-center justify-center font-bold text-lg active:scale-75 transition-transform">－</button>
                                        <span className="w-16 text-center font-extrabold text-gray-900">{meters}m</span>
                                        <button onClick={() => setMeters(meters + 0.5)} className="w-10 h-10 flex items-center justify-center font-bold text-lg active:scale-75 transition-transform">＋</button>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 max-w-[120px]">Recommended: 3.5m for standard Kurta</p>
                                </div>
                            </div>

                            {(product as IFabricProduct).stitchingAvailable && (
                                <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-sm font-extrabold text-[#92650a]">Custom Stitching</h3>
                                            <p className="text-[11px] font-bold text-amber-600 mt-0.5">+₹{(product as IFabricProduct).stitchingPrice.toLocaleString('en-IN')} stitching charge</p>
                                        </div>
                                        <button 
                                            onClick={() => setWantsStitching(!wantsStitching)}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${wantsStitching ? 'bg-[#D4A853]' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${wantsStitching ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    
                                    {wantsStitching && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <MeasurementProfilePicker 
                                                profiles={profiles}
                                                onSelect={setMeasurementProfile} 
                                                selectedProfileId={measurementProfile?._id}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quantity for Accessories / Shared */}
                    {!isFabric && (
                        <div>
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4">Quantity</h3>
                            <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner w-fit">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-lg active:scale-75 transition-transform">－</button>
                                <span className="w-12 text-center font-extrabold text-gray-900">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-lg active:scale-75 transition-transform">＋</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ADD TO CART ACTION */}
                <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-100 bg-white fixed bottom-20 left-0 right-0 z-40 px-4 pb-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.06)] lg:static lg:px-0 lg:pb-0 lg:rounded-none lg:shadow-none lg:pt-8 lg:bg-transparent">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="w-full h-16 bg-[#0f1035] text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-[#0f1035]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isAdding ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5 text-[#D4A853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                Add to Bag
                            </>
                        )}
                    </button>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Free Shipping Over ₹999</span>
                        </div>
                    </div>
                </div>

                {/* Additional Product Info / Specs */}
                <div className="mt-12 grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Technical Detail</h4>
                        <p className="text-xs font-bold text-gray-900">
                            {isFabric
                                ? `Width: ${(product as IFabricProduct).width}cm`
                                : isReadymade
                                ? `Material: ${(product as IReadymadeProduct).material}`
                                : `Item: ${product.type}`}
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Delivery</h4>
                        <p className="text-xs font-bold text-gray-900">{isFabric && wantsStitching ? '7-12 Business Days' : '3-5 Business Days'}</p>
                    </div>
                </div>
            </div>

            <style>{`.custom-scrollbar::-webkit-scrollbar { height: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D4A853; border-radius: 4px; }`}</style>
        </div>
    );
}
