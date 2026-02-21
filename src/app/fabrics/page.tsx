import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Scissors, Sparkles } from "lucide-react";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getFabrics() {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products?type=fabric`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch fabrics');
        }

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching fabrics:', error);
        return [];
    }
}

export default async function FabricsPage() {
    const fabrics = await getFabrics();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-gold-50 via-white to-emerald-50 border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-800 text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            Premium Quality Fabrics
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
                            Browse Our Fabric Collection
                        </h1>
                        <p className="text-lg text-gray-600">
                            Sold by the meter with optional custom stitching services
                        </p>
                    </div>
                </div>
            </div>

            {/* Stitching Info Banner */}
            <div className="bg-emerald-600 text-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-3 text-sm">
                        <Scissors className="h-5 w-5" />
                        <p>
                            <span className="font-semibold">Custom Stitching Available:</span>{" "}
                            Save your measurements for quick reordering
                        </p>
                    </div>
                </div>
            </div>

            {/* Fabrics Grid */}
            <div className="container mx-auto px-4 py-8">
                {fabrics.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Sparkles className="h-8 w-8 text-gray-400" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">
                            No Fabrics Available
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Please run the seed script to populate the database.
                        </p>
                        <div className="bg-navy-50 border border-navy-200 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-navy-700 font-mono">
                                npm run seed
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-navy-900">{fabrics.length}</span> fabrics
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fabrics.map((fabric: any) => (
                                <ProductCard key={fabric._id} product={fabric} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* How It Works Section */}
            {fabrics.length > 0 && (
                <div className="bg-white border-t mt-16">
                    <div className="container mx-auto px-4 py-12">
                        <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-8">
                            How Custom Stitching Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xl">
                                    1
                                </div>
                                <h3 className="font-semibold text-navy-900">Choose Fabric</h3>
                                <p className="text-sm text-gray-600">
                                    Select your preferred fabric and quantity in meters
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 font-bold text-xl">
                                    2
                                </div>
                                <h3 className="font-semibold text-navy-900">Add Measurements</h3>
                                <p className="text-sm text-gray-600">
                                    Use saved profiles or enter custom measurements
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy-100 text-navy-600 font-bold text-xl">
                                    3
                                </div>
                                <h3 className="font-semibold text-navy-900">Receive Garment</h3>
                                <p className="text-sm text-gray-600">
                                    Get your custom-stitched garment delivered
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
