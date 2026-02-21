import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getProducts() {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`, {
            cache: 'no-store' // Always fetch fresh data
        });

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900">
                                Readymade Garments
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Premium Islamic clothing ready for immediate delivery
                            </p>
                        </div>
                        <Button variant="outline" className="w-fit">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter Products
                        </Button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8">
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Filter className="h-8 w-8 text-gray-400" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">
                            No Products Found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Please run the seed script to populate the database with sample products.
                        </p>
                        <div className="bg-navy-50 border border-navy-200 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-navy-700 font-mono">
                                npm run seed
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Product count */}
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-navy-900">{products.length}</span> products
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* CTA Section */}
            {products.length > 0 && (
                <div className="bg-emerald-50 border-t border-emerald-100 mt-16">
                    <div className="container mx-auto px-4 py-12 text-center">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-4">
                            Looking for Custom Stitching?
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Browse our premium fabrics and add custom stitching with your saved measurement profiles.
                        </p>
                        <Button
                            size="lg"
                            className="bg-gold-600 hover:bg-gold-700 text-white"
                        >
                            Browse Fabrics
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
