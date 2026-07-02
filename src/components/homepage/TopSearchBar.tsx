'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export default function TopSearchBar() {
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="px-4 py-2"
            style={{ backgroundColor: '#0f1035' }}
        >
            <div
                className="flex items-center gap-2.5 px-3 h-11 rounded-full transition-all duration-250"
                style={{
                    backgroundColor: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.05)',
                    border: focused
                        ? '1.5px solid rgba(212,168,83,0.7)'
                        : '1.5px solid rgba(255,255,255,0.1)',
                    boxShadow: focused ? '0 0 16px rgba(212,168,83,0.12)' : 'none',
                    transition: 'border-color 0.25s, box-shadow 0.25s, background-color 0.25s',
                }}
            >
                <span style={{ color: focused ? 'rgba(212,168,83,0.8)' : 'rgba(255,255,255,0.35)', transition: 'color 0.25s' }}>
                    <SearchIcon />
                </span>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search kurtas, fabrics, thobes…"
                    className="flex-1 bg-transparent outline-none text-sm min-w-0"
                    style={{ color: 'rgba(255,255,255,0.92)', caretColor: '#D4A853' }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label="Search products"
                />
            </div>

            <style>{`
                input::placeholder { color: rgba(255,255,255,0.35); }
                input:focus::placeholder { color: rgba(255,255,255,0.25); }
            `}</style>
        </form>
    );
}
