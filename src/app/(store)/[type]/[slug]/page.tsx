import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ProductStructuredData from '@/components/seo/ProductStructuredData';
import BreadcrumbStructuredData from '@/components/seo/BreadcrumbStructuredData';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import type { AnyProduct } from '@/types/product';
import { getProductsAction } from '@/lib/dal';

interface Props {
    params: Promise<{ type: string; slug: string }>;
}

async function getProduct(slug: string) {
    const products = await getProductsAction({ slug });
    return products[0] || null;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return { title: 'Product Not Found' };
    }

    return {
        title: `${product.name} — Fabloom`,
        description: product.description.slice(0, 155),
        openGraph: {
            images: [product.images[0]],
            title: product.name,
            description: product.description,
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { type, slug } = await params;
    
    const product = await getProduct(slug);
    if (!product) notFound();

    const breadcrumbs = [
        { name: 'Home', url: 'https://fabloom.in' },
        { name: type.charAt(0).toUpperCase() + type.slice(1), url: `https://fabloom.in/${type}` },
        { name: product.name, url: `https://fabloom.in/${type}/${slug}` },
    ];

    return (
        <div className="min-h-screen bg-white store-pb-action-nav lg:store-pb-nav">
            <ProductStructuredData product={product as any} />
            <BreadcrumbStructuredData items={breadcrumbs} />
            
            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <ProductDetailClient product={product} />
            </div>
        </div>
    );
}
