import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service — Fabloom',
};

export default function TermsPage() {
    return (
        <div className="px-4 py-8 max-w-2xl mx-auto text-white">
            <h1 className="text-2xl font-extrabold mb-4">Terms of Service</h1>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
                By using Fabloom you agree to our standard terms for purchases, custom stitching orders, and
                returns as described at checkout and on product pages. For questions, contact{' '}
                <a href="mailto:support@fabloom.in" className="text-[#D4A853] underline">
                    support@fabloom.in
                </a>
                .
            </p>
            <Link href="/" className="text-sm font-bold text-[#D4A853]">
                ← Back to home
            </Link>
        </div>
    );
}
