import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scissors, ShoppingBag, Sparkles } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-white to-navy-50 py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-800 text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            Premium Islamic Clothing
                        </div>

                        {/* Heading */}
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-navy-900 leading-tight">
                            Modern Islamic Elegance
                            <span className="block text-emerald-600 mt-2">
                                For Every Occasion
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-navy-600 max-w-2xl mx-auto leading-relaxed">
                            Discover premium readymade garments, quality fabrics, and expert
                            custom stitching services for scholars and kids.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                                >
                                    Shop Readymade
                                    <ShoppingBag className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/fabrics">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-navy-300 text-navy-700 hover:bg-navy-50 px-8"
                                >
                                    Browse Fabrics
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center space-y-4 p-6 rounded-lg hover:bg-emerald-50 transition-colors">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                                <ShoppingBag className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy-900">
                                Readymade Garments
                            </h3>
                            <p className="text-navy-600">
                                Premium quality Islamic clothing with size-based inventory for
                                immediate delivery.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center space-y-4 p-6 rounded-lg hover:bg-gold-50 transition-colors">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-100">
                                <Sparkles className="h-8 w-8 text-gold-600" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy-900">
                                Premium Fabrics
                            </h3>
                            <p className="text-navy-600">
                                Sold by meter with detailed texture previews. Choose from linen,
                                cotton, silk, and more.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center space-y-4 p-6 rounded-lg hover:bg-navy-50 transition-colors">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-100">
                                <Scissors className="h-8 w-8 text-navy-600" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy-900">
                                Custom Stitching
                            </h3>
                            <p className="text-navy-600">
                                Expert tailoring with reusable measurement profiles for perfect
                                fit every time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-navy-800 text-white">
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold">
                        Ready to Experience Islamic Elegance?
                    </h2>
                    <p className="text-navy-200 max-w-2xl mx-auto">
                        Start shopping or explore our custom stitching services with saved
                        measurement profiles.
                    </p>
                    <Link href="/products">
                        <Button
                            size="lg"
                            className="bg-gold-600 hover:bg-gold-700 text-white px-8"
                        >
                            Start Shopping
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
