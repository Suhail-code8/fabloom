'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function StoreError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('[StoreError boundary]', error);
    }, [error]);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ backgroundColor: '#0f1035' }}
        >
            {/* Icon */}
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
                <svg
                    className="w-9 h-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgb(239,68,68)"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-3">
                Something went wrong
            </h1>
            <p
                className="text-sm max-w-sm mb-8"
                style={{ color: 'rgba(255,255,255,0.5)' }}
            >
                {error.message || 'An unexpected error occurred. Our team has been notified.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                    onClick={reset}
                    className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95"
                    style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold text-center transition-all duration-200 active:scale-95"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    Go Home
                </Link>
            </div>

            {process.env.NODE_ENV === 'development' && error.digest && (
                <p className="mt-6 text-xs font-mono text-red-400/60">
                    Digest: {error.digest}
                </p>
            )}
        </div>
    );
}
