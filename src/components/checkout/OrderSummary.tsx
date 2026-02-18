'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Scissors } from 'lucide-react';

interface OrderSummaryProps {
    items: any[];
    subtotal: number;
    tax: number;
    total: number;
}

export default function OrderSummary({
    items,
    subtotal,
    tax,
    total,
}: OrderSummaryProps) {
    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="font-serif text-xl text-navy-900">
                    Order Summary
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                            <div className="flex-1">
                                <p className="font-medium text-navy-900 line-clamp-1">
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    {item.type === 'readymade' && item.size && (
                                        <Badge variant="outline" className="text-xs">
                                            Size: {item.size}
                                        </Badge>
                                    )}
                                    {item.type === 'fabric' && (
                                        <span className="text-xs text-gray-600">
                                            {item.meters}m
                                        </span>
                                    )}
                                    {item.stitchingDetails && (
                                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                                            <Scissors className="h-3 w-3" />
                                            <span>{item.stitchingDetails.style}</span>
                                        </div>
                                    )}
                                    <span className="text-xs text-gray-600">
                                        Qty: {item.quantity}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    ${(
                                        item.type === 'fabric'
                                            ? (item.pricePerMeter * item.meters +
                                                (item.stitchingPrice || 0)) *
                                            item.quantity
                                            : item.price * item.quantity
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Tax (5%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-emerald-600">FREE</span>
                    </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-navy-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">
                        ${total.toFixed(2)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
