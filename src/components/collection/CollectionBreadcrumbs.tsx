import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
    name: string;
    slug: string;
    path: string;
}

interface CollectionBreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function CollectionBreadcrumbs({ items }: CollectionBreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="py-4 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.path} className="flex items-center space-x-2">
                            <span>/</span>
                            {isLast ? (
                                <span className="text-gray-900 font-medium" aria-current="page">{item.name}</span>
                            ) : (
                                <Link href={item.path} className="hover:text-gray-900 transition-colors">
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
