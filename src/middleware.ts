import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/account(.*)',
    '/wishlist(.*)',
    '/checkout(.*)',
    '/api/user(.*)',
    '/api/measurements(.*)'
]);

const isAdminRoute = createRouteMatcher([
    '/admin(.*)',
    '/api/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    // Basic User Protection
    if (isProtectedRoute(req)) {
        const authObj = await auth();
        if (!authObj.userId) {
            if (req.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            // For non-API routes, continue with default redirect-to-signin protection
            await auth.protect();
        }
    }

    // Admin Protection
    if (isAdminRoute(req)) {
        const authObj = await auth();
        
        // If not logged in at all, protect() will redirect to sign-in
        if (!authObj.userId) {
            await auth.protect();
        }

        // Role check
        const role = (authObj.sessionClaims as any)?.metadata?.role;
        if (role !== 'admin') {
            // Return 403 Forbidden or redirect to unauthorized
            if (req.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
            } else {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
