import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
    title: 'About Us - Fabloom',
    description: 'Where tradition meets precision tailoring. Learn about Fabloom.',
};

export default function AboutPage() {
    return <AboutClient />;
}
