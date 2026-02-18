'use client';

import { useState } from 'react';
import { ShoppingCart, Scissors, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StitchingModal from './StitchingModal';
import { useCartStore, ReadymadeCartItem, FabricCartItem } from '@/store/useCartStore';

interface ProductInfoProps {
    product: any; // Will be typed based on Product model
}

export default function ProductInfo({ product }: ProductInfoProps) {
    // Readymade state
    const [selectedSize, setSelectedSize] = useState<string>('');

    // Fabric state
    const [meters, setMeters] = useState<number>(3);

    // Stitching modal state
    const [isStitchingModalOpen, setIsStitchingModalOpen] = useState(false);

    // Cart store
    const addItem = useCartStore((state) => state.addItem);

    // Get available sizes for readymade
    const getAvailableSizes = () => {
        if (product.type !== 'readymade' || !product.sizeStock) return [];
        return Object.entries(product.sizeStock)
            .filter(([_, stock]) => stock && (stock as number) > 0)
            .map(([size]) => size);
    };

    const availableSizes = getAvailableSizes();

    // Calculate fabric price
    const getFabricTotal = () => {
        if (product.type !== 'fabric') return 0;
        return (product.pricePerMeter || 0) * meters;
    };

    // Handle add to cart for readymade
    const handleAddReadymadeToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        const cartItem: ReadymadeCartItem = {
            id: '',
            productId: product._id,
            name: product.name,
            image: product.images[0] || '',
            type: 'readymade',
            size: selectedSize as any,
            price: product.price,
            quantity: 1,
            material: product.material,
            color: product.color,
        };

        addItem(cartItem);
        alert('Added to cart!');
    };

    // Handle add to cart for fabric (without stitching)
    const handleAddFabricToCart = () => {
        if (meters < 1) {
            alert('Please enter at least 1 meter');
            return;
        }

        const cartItem: FabricCartItem = {
            id: '',
            productId: product._id,
            name: product.name,
            image: product.images[0] || '',
            type: 'fabric',
            pricePerMeter: product.pricePerMeter || 0,
            meters: meters,
            quantity: 1,
            fabricType: product.fabricType,
        };

        addItem(cartItem);
        alert('Added to cart!');
    };

    // Handle add to cart for accessory
    const handleAddAccessoryToCart = () => {
        const cartItem = {
            id: '',
            productId: product._id,
            name: product.name,
            image: product.images[0] || '',
            type: 'accessory' as const,
            price: product.price,
            quantity: 1,
            material: product.material,
            color: product.color,
        };

        addItem(cartItem);
        alert('Added to cart!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                {/* Category & Type Badges */}
                <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                        {product.category}
                    </Badge>
                    {product.type === 'readymade' && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            Ready to Ship
                        </Badge>
                    )}
                    {product.type === 'fabric' && (
                        <Badge className="bg-gold-100 text-gold-700 text-xs">
                            Fabric
                        </Badge>
                    )}
                    {product.featured && (
                        <Badge className="bg-gold-600 text-white text-xs">
                            Featured
                        </Badge>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">
                    {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    {product.type === 'fabric' ? (
                        <>
                            <span className="text-3xl font-bold text-emerald-600">
                                ${product.pricePerMeter}
                            </span>
                            <span className="text-gray-600">per meter</span>
                        </>
                    ) : (
                        <span className="text-3xl font-bold text-emerald-600">
                            ${product.price}
                        </span>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="border-t border-b py-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="space-y-2 text-sm">
                {product.material && (
                    <div className="flex gap-2">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">{product.material}</span>
                    </div>
                )}
                {product.fabricType && (
                    <div className="flex gap-2">
                        <span className="text-gray-600">Fabric Type:</span>
                        <span className="font-medium">{product.fabricType}</span>
                    </div>
                )}
                {product.color && (
                    <div className="flex gap-2">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{product.color}</span>
                    </div>
                )}
                {product.type === 'fabric' && product.stockInMeters && (
                    <div className="flex gap-2">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{product.stockInMeters} meters</span>
                    </div>
                )}
            </div>

            {/* READYMADE: Size Selector */}
            {product.type === 'readymade' && (
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Size</Label>
                    <div className="flex gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                            const isAvailable = availableSizes.includes(size);
                            const isSelected = selectedSize === size;

                            return (
                                <button
                                    key={size}
                                    onClick={() => isAvailable && setSelectedSize(size)}
                                    disabled={!isAvailable}
                                    className={`
                    px-6 py-3 rounded-md border-2 font-medium transition-all
                    ${isSelected
                                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                            : isAvailable
                                                ? 'border-gray-300 hover:border-emerald-400'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }
                  `}
                                >
                                    {size}
                                    {isSelected && <Check className="inline ml-1 h-4 w-4" />}
                                </button>
                            );
                        })}
                    </div>
                    {availableSizes.length === 0 && (
                        <p className="text-sm text-red-600">Out of stock</p>
                    )}
                </div>
            )}

            {/* FABRIC: Meter Selector */}
            {product.type === 'fabric' && (
                <div className="space-y-3">
                    <Label htmlFor="meters" className="text-base font-semibold">
                        Select Meters
                    </Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="meters"
                            type="number"
                            step="0.5"
                            min="1"
                            max={product.stockInMeters || 100}
                            value={meters}
                            onChange={(e) => setMeters(parseFloat(e.target.value) || 1)}
                            className="w-32"
                        />
                        <span className="text-gray-600">meters</span>
                    </div>

                    {/* Dynamic Price Calculation */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                                ${product.pricePerMeter} × {meters}m
                            </span>
                            <span className="text-xl font-bold text-emerald-700">
                                = ${getFabricTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
                {/* Readymade: Add to Cart */}
                {product.type === 'readymade' && (
                    <Button
                        onClick={handleAddReadymadeToCart}
                        disabled={!selectedSize}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                )}

                {/* Fabric: Add to Cart + Custom Stitch */}
                {product.type === 'fabric' && (
                    <>
                        <Button
                            onClick={handleAddFabricToCart}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add Fabric to Cart
                        </Button>

                        {product.stitchingAvailable && (
                            <Button
                                onClick={() => setIsStitchingModalOpen(true)}
                                variant="outline"
                                className="w-full border-2 border-gold-600 text-gold-700 hover:bg-gold-50 text-lg py-6"
                            >
                                <Scissors className="mr-2 h-5 w-5" />
                                Custom Stitch (+${product.stitchingPrice})
                            </Button>
                        )}
                    </>
                )}

                {/* Accessory: Add to Cart */}
                {product.type === 'accessory' && (
                    <Button
                        onClick={handleAddAccessoryToCart}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                )}
            </div>

            {/* Stitching Modal */}
            {product.type === 'fabric' && product.stitchingAvailable && (
                <StitchingModal
                    isOpen={isStitchingModalOpen}
                    onClose={() => setIsStitchingModalOpen(false)}
                    product={product}
                />
            )}
        </div>
    );
}
