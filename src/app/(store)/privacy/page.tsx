import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy — Fabloom',
};

export default function PrivacyPage() {
    return (
        <div className="px-4 py-8 max-w-2xl mx-auto text-white">
            <h1 className="text-2xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
                Fabloom respects your privacy. We collect only the information needed to process orders,
                provide tailoring services, and improve your shopping experience. Contact us at{' '}
                <a href="mailto:support@fabloom.in" className="text-[#D4A853] underline">
                    support@fabloom.in
                </a>{' '}
                for privacy-related requests.
            </p>
            <Link href="/" className="text-sm font-bold text-[#D4A853]">
                ← Back to home
            </Link>
        </div>
    );
}
