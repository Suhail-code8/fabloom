import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/products(.*)",
    "/fabrics(.*)",
    "/cart",
    "/checkout(.*)",
    "/api(.*)",
]);

const isProtectedRoute = createRouteMatcher([
    "/admin(.*)",
    "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Run on all routes except static files
        "/((?!.*\..*|_next).*)",
        "/",
        "/(api|trpc)(.*)",
    ],
};
