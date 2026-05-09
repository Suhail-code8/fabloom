import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 — Page Not Found | Fabloom',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ backgroundColor: '#0f1035' }}
        >
            {/* Decorative glow */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: '#D4A853' }}
            />

            {/* 404 number */}
            <p
                className="text-[120px] font-black leading-none tracking-tighter select-none"
                style={{ color: 'rgba(212,168,83,0.15)' }}
            >
                404
            </p>

            {/* Icon */}
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 -mt-8"
                style={{ backgroundColor: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.3)' }}
            >
                <svg
                    className="w-9 h-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4A853"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>

            <h1
                className="text-3xl font-extrabold mb-3"
                style={{ color: '#fff' }}
            >
                Page Not Found
            </h1>
            <p
                className="text-base max-w-sm mb-10"
                style={{ color: 'rgba(255,255,255,0.5)' }}
            >
                This page has wandered off like a stray thread. Let&apos;s get you back to the collection.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Link
                    href="/"
                    className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold text-center transition-all duration-200 active:scale-95"
                    style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                >
                    Go Home
                </Link>
                <Link
                    href="/readymade"
                    className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold text-center transition-all duration-200 active:scale-95"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
}
