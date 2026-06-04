/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
    // Expose cloud name to client even if only CLOUDINARY_CLOUD_NAME is set in .env.local
    env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            process.env.CLOUDINARY_CLOUD_NAME,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },
    async redirects() {
        return [
            { source: '/admin', destination: '/dashboard', permanent: false },
            { source: '/admin/dashboard', destination: '/dashboard', permanent: false },
            { source: '/admin/orders', destination: '/orders', permanent: false },
            { source: '/admin/orders/:id', destination: '/orders/:id', permanent: false },
            { source: '/admin/production', destination: '/production', permanent: false },
            { source: '/admin/inventory', destination: '/inventory', permanent: false },
            // Legacy admin URLs → active pages
            { source: '/admin/products/new', destination: '/inventory', permanent: false },
            { source: '/admin/products', destination: '/inventory', permanent: false },
            { source: '/admin/analytics', destination: '/dashboard', permanent: false },
            { source: '/admin/stitching', destination: '/production', permanent: false },
            { source: '/admin/stitching/pending', destination: '/production', permanent: false },
            { source: '/admin/customers', destination: '/dashboard', permanent: false },
            { source: '/admin/measurements', destination: '/dashboard', permanent: false },
            { source: '/admin/settings', destination: '/dashboard', permanent: false },
            { source: '/admin/settings/:path*', destination: '/dashboard', permanent: false },
            { source: '/products', destination: '/readymade', permanent: false },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.accounts.dev *.razorpay.com https://upload-widget.cloudinary.com https://widget.cloudinary.com blob:; connect-src 'self' *.clerk.accounts.dev *.razorpay.com clerk-telemetry.com *.clerk.com https://api.cloudinary.com https://*.cloudinary.com; img-src * data: blob: 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; frame-src 'self' *.razorpay.com https://widget.cloudinary.com https://upload-widget.cloudinary.com; worker-src 'self' blob:;",
                    },
                ],
            },
        ];
    },
};

module.exports = withSentryConfig(
    withPWA(nextConfig),
    {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during bundling
        silent: !process.env.CI,
        org: "muhammad-suhail",
        project: "fabloom-production",
    },
    {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: true,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
        // tunnelRoute: "/monitoring",

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors.
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,

        webpack: {
            treeshake: {
                removeDebugLogging: true,
            },
        },
    }
);
