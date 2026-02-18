'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, ShoppingBag } from "lucide-react";
import StitchingModal from "./StitchingModal";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        description: string;
        type: 'readymade' | 'fabric' | 'accessory';
        price: number;
        images: string[];
        category: string;
        featured?: boolean;
        // Readymade specific
        sizeStock?: {
            S?: number;
            M?: number;
            L?: number;
            XL?: number;
            XXL?: number;
        };
        material?: string;
        color?: string;
        // Fabric specific
        pricePerMeter?: number;
        stockInMeters?: number;
        stitchingAvailable?: boolean;
        stitchingPrice?: number;
        fabricType?: string;
        // Accessory specific
        stock?: number;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isStitchingModalOpen, setIsStitchingModalOpen] = useState(false);

    // Get available sizes for readymade products
    const getAvailableSizes = () => {
        if (product.type !== 'readymade' || !product.sizeStock) return [];
        return Object.entries(product.sizeStock)
            .filter(([_, stock]) => stock && stock > 0)
            .map(([size]) => size);
    };

    const availableSizes = getAvailableSizes();

    // Determine price display based on product type
    const getPriceDisplay = () => {
        if (product.type === 'fabric' && product.pricePerMeter) {
            return (
                <div className="space-y-1">
                    <p className="text-2xl font-bold text-emerald-600">
                        ${product.pricePerMeter}
                        <span className="text-sm font-normal text-gray-600"> / meter</span>
                    </p>
                    <p className="text-xs text-gray-500">
                        {product.stockInMeters} meters available
                    </p>
                </div>
            );
        }
        return (
            <p className="text-2xl font-bold text-emerald-600">
                ${product.price}
            </p>
        );
    };

    // Get product type badge
    const getTypeBadge = () => {
        const badges = {
            readymade: { label: 'Ready to Ship', className: 'bg-emerald-100 text-emerald-700' },
            fabric: { label: 'Fabric', className: 'bg-gold-100 text-gold-700' },
            accessory: { label: 'Accessory', className: 'bg-navy-100 text-navy-700' }
        };
        const badge = badges[product.type];
        return (
            <Badge className={`${badge.className} hover:${badge.className}`}>
                {badge.label}
            </Badge>
        );
    };

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image */}
            <CardHeader className="p-0 relative">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Featured badge */}
                    {product.featured && (
                        <div className="absolute top-2 left-2">
                            <Badge className="bg-gold-600 text-white">Featured</Badge>
                        </div>
                    )}
                    {/* Type badge */}
                    <div className="absolute top-2 right-2">
                        {getTypeBadge()}
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-navy-900 line-clamp-1">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                </p>

                {/* Type-specific info */}
                <div className="space-y-2">
                    {/* Readymade: Show available sizes */}
                    {product.type === 'readymade' && availableSizes.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sizes:</span>
                            <div className="flex gap-1">
                                {availableSizes.map((size) => (
                                    <Badge
                                        key={size}
                                        variant="outline"
                                        className="text-xs px-2 py-0"
                                    >
                                        {size}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fabric: Show stitching availability */}
                    {product.type === 'fabric' && product.stitchingAvailable && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600">
                            <Scissors className="h-3 w-3" />
                            <span>Custom stitching available</span>
                        </div>
                    )}

                    {/* Accessory: Show stock */}
                    {product.type === 'accessory' && product.stock !== undefined && (
                        <p className="text-xs text-gray-500">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>
                    )}

                    {/* Material/Color info */}
                    {(product.material || product.color || product.fabricType) && (
                        <div className="flex gap-2 text-xs text-gray-500">
                            {product.material && <span>• {product.material}</span>}
                            {product.fabricType && <span>• {product.fabricType}</span>}
                            {product.color && <span>• {product.color}</span>}
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="pt-2 border-t">
                    {getPriceDisplay()}
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4 pt-0">
                {product.type === 'fabric' && product.stitchingAvailable ? (
                    <div className="w-full flex gap-2">
                        <Link href={`/products/${product._id}`} className="flex-1">
                            <Button
                                variant="outline"
                                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                            >
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsStitchingModalOpen(true)}
                            className="flex-1 bg-gold-600 hover:bg-gold-700"
                        >
                            <Scissors className="mr-2 h-4 w-4" />
                            Custom Stitch (+${product.stitchingPrice})
                        </Button>
                    </div>
                ) : (
                    <Link href={`/products/${product._id}`} className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Details
                        </Button>
                    </Link>
                )}
            </CardFooter>

            {/* Stitching Modal */}
            {product.type === 'fabric' && product.stitchingAvailable && (
                <StitchingModal
                    isOpen={isStitchingModalOpen}
                    onClose={() => setIsStitchingModalOpen(false)}
                    product={product}
                />
            )}
        </Card>
    );
}
