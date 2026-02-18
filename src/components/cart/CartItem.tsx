'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2, ChevronDown, Scissors, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CartItem as CartItemType } from '@/store/useCartStore';
import { useState } from 'react';

interface CartItemProps {
    item: CartItemType;
    onRemove: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export default function CartItem({
    item,
    onRemove,
    onUpdateQuantity,
}: CartItemProps) {
    const [isStitchingOpen, setIsStitchingOpen] = useState(false);

    // Calculate item total
    const getItemTotal = () => {
        if (item.type === 'readymade') {
            return item.price * item.quantity;
        } else if (item.type === 'fabric') {
            const fabricCost = item.pricePerMeter * item.meters;
            const stitchingCost =
                item.stitchingDetails && item.stitchingPrice ? item.stitchingPrice : 0;
            return (fabricCost + stitchingCost) * item.quantity;
        } else {
            return item.price * item.quantity;
        }
    };

    return (
        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden bg-gray-100">
                    <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-semibold text-navy-900 line-clamp-1">
                        {item.name}
                    </h3>

                    {/* Type-specific details */}
                    <div className="mt-2 space-y-2">
                        {/* Readymade: Show size */}
                        {item.type === 'readymade' && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Size:</span>
                                <Badge variant="outline" className="text-xs">
                                    {item.size}
                                </Badge>
                                {item.material && (
                                    <span className="text-xs text-gray-500">• {item.material}</span>
                                )}
                                {item.color && (
                                    <span className="text-xs text-gray-500">• {item.color}</span>
                                )}
                            </div>
                        )}

                        {/* Fabric: Show meters and stitching */}
                        {item.type === 'fabric' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Ruler className="h-3 w-3" />
                                    <span>{item.meters} meters</span>
                                    {item.fabricType && (
                                        <span className="text-xs text-gray-500">
                                            • {item.fabricType}
                                        </span>
                                    )}
                                </div>

                                {/* Stitching Details Collapsible */}
                                {item.stitchingDetails && (
                                    <Collapsible
                                        open={isStitchingOpen}
                                        onOpenChange={setIsStitchingOpen}
                                    >
                                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700">
                                            <Scissors className="h-3 w-3" />
                                            <span>Custom Stitching Details</span>
                                            <ChevronDown
                                                className={`h-3 w-3 transition-transform ${isStitchingOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-2 p-3 bg-emerald-50 rounded-md border border-emerald-200">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-navy-900">
                                                        Style:
                                                    </span>
                                                    <Badge className="bg-gold-600 text-white text-xs">
                                                        {item.stitchingDetails.style}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div>
                                                        <span className="text-gray-600">Neck:</span>{' '}
                                                        <span className="font-medium">
                                                            {item.stitchingDetails.measurements.neck}&quot;
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Chest:</span>{' '}
                                                        <span className="font-medium">
                                                            {item.stitchingDetails.measurements.chest}&quot;
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Waist:</span>{' '}
                                                        <span className="font-medium">
                                                            {item.stitchingDetails.measurements.waist}&quot;
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Shoulder:</span>{' '}
                                                        <span className="font-medium">
                                                            {item.stitchingDetails.measurements.shoulder}&quot;
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Sleeve:</span>{' '}
                                                        <span className="font-medium">
                                                            {item.stitchingDetails.measurements.sleeveLength}&quot;
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Length:</span>{' '}
                                                        <span className="font-medium">
                                                            {item.stitchingDetails.measurements.shirtLength}&quot;
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.stitchingDetails.notes && (
                                                    <div className="pt-2 border-t border-emerald-300">
                                                        <span className="text-gray-600">Notes:</span>
                                                        <p className="text-gray-700 mt-1">
                                                            {item.stitchingDetails.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="pt-2 border-t border-emerald-300 flex items-center justify-between">
                                                    <span className="text-gray-600">Stitching Fee:</span>
                                                    <span className="font-semibold text-emerald-700">
                                                        +${item.stitchingPrice}
                                                    </span>
                                                </div>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                )}
                            </div>
                        )}

                        {/* Accessory: Show material/color */}
                        {item.type === 'accessory' && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                {item.material && <span>• {item.material}</span>}
                                {item.color && <span>• {item.color}</span>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Price & Controls */}
                <div className="flex flex-col items-end justify-between">
                    {/* Price */}
                    <div className="text-right">
                        <p className="text-lg font-bold text-navy-900">
                            ${getItemTotal().toFixed(2)}
                        </p>
                        {item.type === 'fabric' && (
                            <p className="text-xs text-gray-500">
                                ${item.pricePerMeter}/meter × {item.meters}m
                            </p>
                        )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}
