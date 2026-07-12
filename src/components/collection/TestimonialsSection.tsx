import React from 'react';

interface TestimonialsSectionProps {
    show?: boolean;
}

export function TestimonialsSection({ show }: TestimonialsSectionProps) {
    if (!show) return null;

    return (
        <section className="py-16 border-t border-gray-100 mt-12">
            <h2 className="text-2xl font-light text-center mb-12">What our customers say</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto px-4">
                <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-50">
                    <p className="text-gray-600 italic mb-4">"The fit and finish is absolutely premium. Very satisfied with my purchase."</p>
                    <p className="text-sm font-medium">— Ahmed K.</p>
                </div>
                <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-50">
                    <p className="text-gray-600 italic mb-4">"Exceptional fabric quality that lasts. Will definitely buy again."</p>
                    <p className="text-sm font-medium">— Tariq M.</p>
                </div>
                <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-50">
                    <p className="text-gray-600 italic mb-4">"Fast shipping and luxurious packaging. A truly premium experience."</p>
                    <p className="text-sm font-medium">— Omar S.</p>
                </div>
            </div>
        </section>
    );
}
