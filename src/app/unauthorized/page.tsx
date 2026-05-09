import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Access Denied — Fabloom',
    description: 'You do not have permission to access this area.',
};

export default function UnauthorizedPage() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{ backgroundColor: '#0f1035' }}
        >
            {/* Shield icon */}
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>

            <h1 className="text-3xl font-extrabold text-white mb-3">
                Access Denied
            </h1>
            <p
                className="text-base max-w-sm mb-10"
                style={{ color: 'rgba(255,255,255,0.5)' }}
            >
                This area is restricted to Fabloom administrators. If you believe this is a mistake, please contact support.
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
                    href="/account"
                    className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold text-center transition-all duration-200 active:scale-95"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    My Account
                </Link>
            </div>
        </div>
    );
}
