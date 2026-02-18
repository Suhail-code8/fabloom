'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCartStore } from '@/store/useCartStore';
import { ShippingAddress } from '@/lib/validations/order';
import { useUser } from '@clerk/nextjs';

export default function CheckoutPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();

    const items = useCartStore((state) => state.items);
    const cartTotal = useCartStore((state) => state.cartTotal);

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

    // Redirect if cart is empty
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
                        Add some items to your cart before checking out.
                    </p>
                    <Link href="/products">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate totals
    const subtotal = cartTotal();
    const TAX_RATE = 0.05;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const handleSubmit = async (shippingAddress: ShippingAddress) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shippingAddress,
                    cartItems: items,
                    subtotal,
                    tax,
                    total,
                    paymentMethod: 'cod',
                    email: user?.primaryEmailAddress?.emailAddress || null,
                }),
            });

            const data = await response.json();

            console.log('API Response:', { status: response.status, data });

            if (!response.ok || !data.success) {
                console.error('Order creation failed:', data);
                throw new Error(data.message || data.error || 'Failed to create order');
            }

            // Redirect to success page
            router.push(`/checkout/success/${data.data.orderId}`);
        } catch (error: any) {
            console.error('Error creating order:', error);
            alert(error.message || 'Failed to place order. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/cart"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Cart
                </Link>
                <h1 className="text-3xl font-serif font-bold text-navy-900">
                    Checkout
                </h1>
                <p className="text-gray-600 mt-2">
                    Complete your order by providing shipping details
                </p>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Checkout Form */}
                <div className="lg:col-span-2">
                    <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        items={items}
                        subtotal={subtotal}
                        tax={tax}
                        total={total}
                    />
                </div>
            </div>
        </div>
    );
}
