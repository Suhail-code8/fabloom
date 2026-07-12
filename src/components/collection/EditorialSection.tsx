import React from 'react';

interface EditorialSectionProps {
    content?: string;
}

export function EditorialSection({ content }: EditorialSectionProps) {
    if (!content) return null;

    return (
        <section className="max-w-3xl mx-auto py-12 px-4 text-center">
            <p className="text-lg md:text-xl text-gray-700 font-serif leading-relaxed">
                {content}
            </p>
        </section>
    );
}
