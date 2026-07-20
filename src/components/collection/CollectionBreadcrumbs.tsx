'use client';
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
        <nav aria-label="Breadcrumb" className="py-6 border-b border-gray-100/50 mb-8">
            <ol className="flex flex-wrap items-center space-x-2 text-xs md:text-sm text-gray-400 tracking-[0.1em] uppercase font-medium">
                <li>
                    <Link href="/" className="hover:text-gray-900 transition-colors duration-300">Home</Link>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.path} className="flex items-center space-x-2">
                            <span className="text-gray-300 font-light">/</span>
                            {isLast ? (
                                <span className="text-gray-900" aria-current="page">{item.name}</span>
                            ) : (
                                <Link href={item.path} className="hover:text-gray-900 transition-colors duration-300">
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
