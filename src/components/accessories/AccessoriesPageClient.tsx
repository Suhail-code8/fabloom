'use client';

import type { IAccessoryProduct, AccessorySubcategory } from '@/types/product';
import SectionRow from '@/components/products/SectionRow';
import AccessoryCard from '@/components/products/AccessoryCard';

// ============================================================================
// SECTION DEFINITIONS
// ============================================================================

const SECTIONS: {
    id: AccessorySubcategory;
    title: string;
    subtitle: string;
}[] = [
    { id: 'hijab',         title: 'Hijabs & Scarves',   subtitle: 'Chiffon, jersey, satin, and silk' },
    { id: 'belt',          title: 'Belts',              subtitle: 'Leather, braided, and canvas' },
    { id: 'socks',         title: 'Socks',              subtitle: 'Bamboo, cotton, crew, and no-show' },
    { id: 'wallet',        title: 'Wallets',            subtitle: 'Slim leather and card holders' },
    { id: 'watch',         title: 'Watches',            subtitle: 'Classic dials and minimalist designs' },
    { id: 'pocket-square', title: 'Pocket Squares',     subtitle: 'Silk, cotton, and embroidered' },
];

// ============================================================================
// PAGE CLIENT
// ============================================================================

export default function AccessoriesPageClient({ accessories }: { accessories: IAccessoryProduct[] }) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0f1035' }}>
            {/* Header */}
            <div className="px-4 pt-5 pb-4">
                <h1 className="text-2xl font-extrabold text-white leading-tight">Accessories</h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {accessories.length} items · Hijabs, Belts, Socks & more
                </p>
            </div>

            {/* Horizontal scroll section rows */}
            <div className="flex flex-col gap-8 pb-8">
                {SECTIONS.map((section) => {
                    const items = accessories.filter((a) => a.subcategory === section.id);
                    if (!items.length) return null;

                    return (
                        <SectionRow
                            key={section.id}
                            title={section.title}
                            subtitle={section.subtitle}
                            products={items}
                            viewAllHref={`/accessories/${section.id}`}
                            cardWidth="148px"
                            renderCard={(product) => (
                                <AccessoryCard
                                    product={product}
                                    aspectClass="aspect-square"
                                    href={`/products/${product._id}`}
                                />
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
}
