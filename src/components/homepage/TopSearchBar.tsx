'use client';

import { useState } from 'react';

// ============================================================================
// INLINE SVG ICONS
// ============================================================================

const SearchIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const CameraIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const MicIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================

export default function TopSearchBar() {
    const [focused, setFocused] = useState(false);

    return (
        <div
            className="sticky top-[var(--store-header-h)] z-30 px-4 py-3"
            style={{ backgroundColor: '#0f1035' }}
        >
            {/* Greeting row */}
            <div className="flex items-center justify-between mb-2.5">
                <div>
                    <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Welcome to
                    </p>
                    <p className="text-lg font-bold leading-tight tracking-tight" style={{ color: '#D4A853' }}>
                        Fabloom
                    </p>
                </div>
                {/* Camera — visual search placeholder */}
                <button
                    aria-label="Visual search"
                    className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-90"
                    style={{ backgroundColor: 'rgba(212, 168, 83, 0.15)', color: '#D4A853' }}
                >
                    <CameraIcon />
                </button>
            </div>

            {/* Search pill */}
            <div
                className="flex items-center gap-3 px-4 h-12 rounded-full transition-all duration-300"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: focused ? '1.5px solid #D4A853' : '1.5px solid rgba(255,255,255,0.12)',
                    boxShadow: focused ? '0 0 0 3px rgba(212,168,83,0.15)' : 'none',
                }}
            >
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <SearchIcon />
                </span>

                <input
                    type="search"
                    placeholder="Search kurtas, fabrics, thobes…"
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: 'rgba(255,255,255,0.9)', caretColor: '#D4A853' }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label="Search products"
                />

                {/* Mic — voice search placeholder */}
                <button
                    aria-label="Voice search"
                    className="flex-shrink-0 transition-all duration-200 active:scale-90"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                    <MicIcon />
                </button>
            </div>
        </div>
    );
}
