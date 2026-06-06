import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair"
});

export const metadata: Metadata = {
    title: {
        template: '%s | Fabloom Kandoras',
        default: 'Fabloom Kandoras — Premium Islamic Fashion',
    },
    description: 'Shop premium kandoras, thobes, kurthas and quality fabrics online. Custom stitching available. Fast delivery across India. Based in Koduvally, Kerala.',
    keywords: ['custom tailoring', 'kurta', 'thobe', 'kandora', 'kandoora', 'linen fabric', 'Kerala tailoring', 'Muslim fashion', 'Koduvally tailoring'],
    icons: {
        icon: '/logo.jpeg',
        apple: '/logo.jpeg',
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://fablooom.vercel.app',
        siteName: 'Fabloom Kandoras',
        images: [
            {
                url: '/logo.jpeg',
                width: 512,
                height: 512,
                alt: 'Fabloom Kandoras Logo',
            }
        ]
    },
    robots: {
        index: true,
        follow: true,
    },
};

// Root layout is a BARE shell.
// Navigation chrome is owned by each route group:
//   (store)/layout.tsx    → TopCategoryBar + BottomNav
//   (admin)/layout.tsx    → Admin sidebar
//   (auth)/layout.tsx     → Plain centered wrapper
import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <head>
                    <link rel="manifest" href="/manifest.json" />
                    <meta name="theme-color" content="#0f1035" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                    <link rel="apple-touch-icon" href="/logo.jpeg" />
                    <link rel="icon" href="/logo.jpeg" />
                </head>
                <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0f1035]`} suppressHydrationWarning>
                    {children}
                    <Toaster position="top-center" richColors theme="dark" />
                    <InstallPrompt />
                </body>
            </html>
        </ClerkProvider>
    );
}
