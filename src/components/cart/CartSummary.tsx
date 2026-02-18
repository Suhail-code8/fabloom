'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

interface CartSummaryProps {
    subtotal: number;
    stitchingFees: number;
    itemCount: number;
}

export default function CartSummary({
    subtotal,
    stitchingFees,
    itemCount,
}: CartSummaryProps) {
    const TAX_RATE = 0.05; // 5% tax
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="font-serif text-xl text-navy-900">
                    Order Summary
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Item Count */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({itemCount})</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Stitching Fees */}
                {stitchingFees > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Custom Stitching</span>
                        <span className="font-medium text-emerald-600">
                            +${stitchingFees.toFixed(2)}
                        </span>
                    </div>
                )}

                <Separator />

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Tax (5%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between">
                    <span className="text-lg font-semibold text-navy-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">
                        ${total.toFixed(2)}
                    </span>
                </div>

                {/* Savings Info */}
                {stitchingFees > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-xs text-emerald-700">
                            ✨ You&apos;re getting custom tailoring for ${stitchingFees.toFixed(2)}!
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>

                <Link href="/products" className="w-full">
                    <Button variant="outline" className="w-full">
                        Continue Shopping
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
