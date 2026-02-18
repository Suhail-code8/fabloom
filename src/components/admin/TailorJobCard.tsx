'use client';

import { Scissors, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TailorJobCardProps {
    item: any;
    orderNumber: string;
    customerName: string;
}

export default function TailorJobCard({
    item,
    orderNumber,
    customerName,
}: TailorJobCardProps) {
    if (!item.stitchingDetails) return null;

    const handlePrint = () => {
        window.print();
    };

    const { measurements, specialInstructions } = item.stitchingDetails;

    return (
        <div className="space-y-4">
            {/* Print Button (hidden when printing) */}
            <div className="print:hidden">
                <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Job Card
                </Button>
            </div>

            {/* Printable Job Card */}
            <Card className="print:shadow-none print:border-2 print:border-black">
                <CardHeader className="print:pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="font-serif text-2xl print:text-3xl">
                            Tailor Job Card
                        </CardTitle>
                        <Scissors className="h-8 w-8 text-gold-600 print:h-10 print:w-10" />
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 print:space-y-8">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 print:gap-6 print:text-lg">
                        <div>
                            <p className="text-sm text-gray-600 print:text-base">Order Number</p>
                            <p className="font-bold text-lg print:text-2xl">{orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 print:text-base">Customer</p>
                            <p className="font-bold text-lg print:text-2xl">{customerName}</p>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <p className="text-sm text-gray-600 print:text-base">Product</p>
                        <p className="font-semibold text-lg print:text-2xl">{item.productName}</p>
                        <p className="text-sm text-gray-600 print:text-base mt-1">
                            {item.meters} meters
                        </p>
                    </div>

                    {/* Garment Style */}
                    <div>
                        <p className="text-sm text-gray-600 print:text-base mb-2">Garment Style</p>
                        <Badge className="bg-gold-600 text-white text-lg px-4 py-2 print:text-2xl print:px-6 print:py-3">
                            {item.stitchingDetails.style || 'Custom'}
                        </Badge>
                    </div>

                    {/* Measurements */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 print:text-2xl print:mb-6">
                            Measurements (inches)
                        </h3>
                        <div className="grid grid-cols-2 gap-4 print:gap-6">
                            <div className="border-l-4 border-emerald-600 pl-4 print:pl-6">
                                <p className="text-sm text-gray-600 print:text-lg">Neck</p>
                                <p className="text-3xl font-bold print:text-5xl">{measurements.neck}&quot;</p>
                            </div>
                            <div className="border-l-4 border-emerald-600 pl-4 print:pl-6">
                                <p className="text-sm text-gray-600 print:text-lg">Chest</p>
                                <p className="text-3xl font-bold print:text-5xl">{measurements.chest}&quot;</p>
                            </div>
                            <div className="border-l-4 border-emerald-600 pl-4 print:pl-6">
                                <p className="text-sm text-gray-600 print:text-lg">Waist</p>
                                <p className="text-3xl font-bold print:text-5xl">{measurements.waist}&quot;</p>
                            </div>
                            <div className="border-l-4 border-emerald-600 pl-4 print:pl-6">
                                <p className="text-sm text-gray-600 print:text-lg">Shoulder</p>
                                <p className="text-3xl font-bold print:text-5xl">{measurements.shoulder}&quot;</p>
                            </div>
                            <div className="border-l-4 border-emerald-600 pl-4 print:pl-6">
                                <p className="text-sm text-gray-600 print:text-lg">Sleeve Length</p>
                                <p className="text-3xl font-bold print:text-5xl">{measurements.sleeveLength}&quot;</p>
                            </div>
                            <div className="border-l-4 border-emerald-600 pl-4 print:pl-6">
                                <p className="text-sm text-gray-600 print:text-lg">Garment Length</p>
                                <p className="text-3xl font-bold print:text-5xl">{measurements.shirtLength}&quot;</p>
                            </div>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    {specialInstructions && (
                        <div className="border-t pt-4 print:pt-6">
                            <h3 className="font-semibold text-lg mb-2 print:text-2xl print:mb-4">
                                Special Instructions
                            </h3>
                            <p className="text-gray-700 print:text-xl">{specialInstructions}</p>
                        </div>
                    )}

                    {/* Signature Section (print only) */}
                    <div className="hidden print:block border-t pt-6 mt-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-lg mb-8">Tailor Signature:</p>
                                <div className="border-b-2 border-black"></div>
                            </div>
                            <div>
                                <p className="text-lg mb-8">Date Completed:</p>
                                <div className="border-b-2 border-black"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
