'use client';

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[#0f1035] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
            <h1 className="text-4xl font-serif text-[#0f1035] mb-4">Fabloom</h1>
            <div className="w-16 h-1 bg-[#D4A853] mx-auto mb-8" />
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
                We're already fixing this. Please try refreshing the page or head back to the store.
            </p>

            <div className="flex flex-col gap-4">
                <button
                    onClick={() => reset()}
                    className="w-full bg-[#0f1035] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                    Try Again
                </button>
                <Link 
                    href="/"
                    className="w-full text-[#0f1035] py-4 rounded-xl font-bold border-2 border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    Back to Home
                </Link>
            </div>

            <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest">
                Error ID: {error.digest || 'unknown'}
            </p>
        </div>
      </body>
    </html>
  );
}
