'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
    const [mounted, setMounted] = useState(false);
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const cartTotal = useCartStore((state) => state.cartTotal);
    const totalItems = useCartStore((state) => state.totalItems);

    // Avoid hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Calculate stitching fees
    const stitchingFees = items.reduce((total, item) => {
        if (item.type === 'fabric' && item.stitchingDetails && item.stitchingPrice) {
            return total + item.stitchingPrice * item.quantity;
        }
        return total;
    }, 0);

    // Empty cart state
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-navy-900 mb-4">
                        Your Cart is Empty
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Looks like you haven't added any items to your cart yet. Start
                        shopping to find your perfect garment!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Browse Readymade
                            </Button>
                        </Link>
                        <Link href="/fabrics">
                            <Button variant="outline">Browse Fabrics</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Filled cart state
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/products"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                </Link>
                <h1 className="text-3xl font-serif font-bold text-navy-900">
                    Shopping Cart
                </h1>
                <p className="text-gray-600 mt-2">
                    {totalItems()} {totalItems() === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={removeItem}
                            onUpdateQuantity={updateQuantity}
                        />
                    ))}
                </div>

                {/* Right: Cart Summary */}
                <div className="lg:col-span-1">
                    <CartSummary
                        subtotal={cartTotal()}
                        stitchingFees={stitchingFees}
                        itemCount={totalItems()}
                    />
                </div>
            </div>
        </div>
    );
}
