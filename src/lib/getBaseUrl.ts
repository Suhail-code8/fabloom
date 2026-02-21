/**
 * Returns the correct base URL for server-side fetch calls.
 * - In production on Vercel: uses VERCEL_URL (auto-set by Vercel)
 * - If NEXT_PUBLIC_APP_URL is explicitly set: uses that
 * - Fallback for local dev: http://localhost:3000
 */
export function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
}
