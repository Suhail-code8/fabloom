'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const WHY_FEATURES = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, title: 'Premium Fabrics' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3M12 3v18"/></svg>, title: 'Saved Measurements' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, title: 'Expert Tailors (10+ yrs)' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Real-time Tracking' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>, title: 'Fast India Delivery' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, title: 'WhatsApp Support' },
];

const WORK_STEPS = [
    { num: '1', title: 'Browse Fabrics', desc: 'Select from our curated premium collection.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3M12 3v18"/></svg> },
    { num: '2', title: 'Enter Measurements', desc: 'Save your profile for perfect fits.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> },
    { num: '3', title: 'We Stitch', desc: 'Expert tailors craft your garment.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 2v20M17 12c0-3-2-5-5-5s-5 2-5 5 2 5 5 5 5-2 5-5z"/></svg> },
    { num: '4', title: 'Delivered', desc: 'Track your order right to your door.', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg> },
];

const TESTIMONIALS = [
    { name: 'Anjali Menon', loc: 'Kochi, Kerala', type: 'Custom Lehenga', text: 'The fit was absolutely perfect on the first try. I have never felt more comfortable and beautiful.' },
    { name: 'Priya Sharma', loc: 'Mumbai', type: 'Silk Saree Blouse', text: 'Tracking the stitching progress via the app gave me so much peace of mind. Excellent finish!' },
    { name: 'Kavya R.', loc: 'Bangalore', type: 'Salwar Suit', text: 'The fabric quality is exactly as pictured, and the tailoring is impeccable. Fabloom is my new go-to.' },
];

const FAQS = [
    { q: 'How accurate is custom stitching?', a: 'Our expert tailors strictly follow the inch-by-inch measurements you provide. We guarantee a 98% accuracy rate on the first fit.' },
    { q: 'How do I measure myself?', a: 'We provide detailed visual guides. You can create a new profile by following the step-by-step instructions on our <a href="/account/measurements/new" class="text-[#D4A853] underline font-bold">measurements page</a>.' },
    { q: 'What fabrics are available?', a: 'We source premium cottons, silks, linens, and blends directly from authentic weavers across India.' },
    { q: 'How long does stitching take?', a: 'Typically, a custom-stitched garment is ready to ship within 7-10 business days from the order date.' },
    { q: 'Can I return/exchange?', a: 'Since custom stitched items are made precisely for you, we cannot accept returns unless there is a manufacturing defect. Readymade items have a 7-day return policy.' },
    { q: 'Do you ship outside India?', a: 'Currently, we only ship within India. We plan to expand internationally soon!' },
    { q: 'What payment methods do you accept?', a: 'We accept all major Credit/Debit Cards, UPI, Net Banking, and offer Cash on Delivery (COD) for orders under ₹5000.' },
    { q: 'How do I track my order?', a: 'You can track the exact status of your garment—from cutting to dispatch—in the "My Orders" section of your account.' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function AboutClient() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            
            {/* 1. HERO SECTION */}
            <section className="relative bg-[#0f1035] text-white py-24 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
                {/* CSS Geometric Pattern Background */}
                <div 
                    className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ backgroundImage: 'linear-gradient(45deg, #D4A853 25%, transparent 25%, transparent 75%, #D4A853 75%, #D4A853), linear-gradient(45deg, #D4A853 25%, transparent 25%, transparent 75%, #D4A853 75%, #D4A853)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/50 to-transparent" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Image
                        src="/logo.jpeg"
                        alt="Fabloom Kandoras"
                        width={80}
                        height={80}
                        className="rounded-full mx-auto mb-6 object-cover border-2 border-[#D4A853]"
                    />
                    <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-[#D4A853] mb-6">Fabloom Kandoras</h1>
                    <p className="text-lg md:text-xl font-medium text-gray-300 tracking-wide">Premium Islamic Fashion · Delivered Across India</p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/50 to-transparent" />
            </section>

            <div className="max-w-4xl mx-auto">
                {/* 2. OUR STORY */}
                <section className="py-16 px-6">
                    <div className="pl-6 border-l-4 border-[#D4A853] max-w-2xl mx-auto">
                        <h2 className="text-xs font-extrabold text-[#D4A853] uppercase tracking-widest mb-3">Our Story</h2>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Born in Koduvally. <br/>Crafted for the modern wardrobe.</h3>
                        <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-medium">
                            <p>
                                Fabloom Kandoras brings the finest Islamic fashion from the heart of Koduvally, Kerala — straight to your door. From handcrafted Saudi and Emirati kandoras to premium fabrics with expert stitching, every piece reflects our commitment to quality and authenticity.
                            </p>
                            <p>
                                Shop online and get it delivered across India with absolute ease. Our online-first store is designed to give you a seamless shopping experience, from choosing premium fabrics to entering your measurements.
                            </p>
                            <p>
                                Prefer to visit us? Our Koduvally store welcomes walk-in customers every day 9AM-9PM.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. WHY FABLOOM */}
                <section className="py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 mx-4 md:mx-6 mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Why choose us?</h2>
                        <div className="w-10 h-1 bg-[#D4A853] mx-auto mt-4 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                        {WHY_FEATURES.map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-[#D4A853] mb-4 group-hover:scale-110 group-hover:bg-[#0f1035] transition-all duration-300">
                                    <div className="w-6 h-6">{feature.icon}</div>
                                </div>
                                <h3 className="text-xs font-bold text-gray-900 px-2">{feature.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. HOW IT WORKS */}
                <section className="py-16 px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">From fabric to your doorstep.</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row relative max-w-3xl mx-auto gap-8 md:gap-0">
                        {/* Connecting Line (Mobile Vertical, Desktop Horizontal) */}
                        <div className="absolute top-0 bottom-0 left-[31px] md:left-0 md:right-0 md:top-[31px] md:bottom-auto md:h-0.5 w-0.5 md:w-full border-l-2 md:border-l-0 md:border-t-2 border-dashed border-[#D4A853]/30 -z-10" />

                        {WORK_STEPS.map((step, idx) => (
                            <div key={idx} className="flex md:flex-col items-center md:flex-1 relative bg-gray-50 md:bg-transparent">
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-[#D4A853] flex items-center justify-center shadow-md flex-shrink-0 z-10 text-[#D4A853]">
                                    <span className="text-2xl font-serif font-bold">{step.num}</span>
                                </div>
                                <div className="ml-6 md:ml-0 md:mt-6 text-left md:text-center">
                                    <div className="flex items-center md:justify-center gap-2 text-[#0f1035] mb-1">
                                        {step.icon}
                                        <h3 className="text-sm font-extrabold">{step.title}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium md:max-w-[150px] mx-auto leading-snug">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. TESTIMONIALS */}
                <section className="py-16 px-0 overflow-hidden">
                    <div className="px-6 mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Loved by many</h2>
                            <div className="w-10 h-1 bg-[#D4A853] mt-4 rounded-full" />
                        </div>
                    </div>
                    
                    {/* Horizontal Scroll Container */}
                    <div className="flex overflow-x-auto gap-4 px-6 pb-8 snap-x snap-mandatory no-scrollbar">
                        {TESTIMONIALS.map((test, idx) => (
                            <div key={idx} className="w-[85vw] md:w-[300px] flex-shrink-0 snap-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex text-[#D4A853] mb-4">
                                    {[1,2,3,4,5].map(star => (
                                        <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">"{test.text}"</p>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">{test.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">{test.loc} · {test.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. FAQ ACCORDION */}
                <section className="py-16 px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {FAQS.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                    <button 
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left active:bg-gray-50 transition-colors"
                                    >
                                        <span className={`text-sm font-bold ${isOpen ? 'text-[#D4A853]' : 'text-gray-900'}`}>{faq.q}</span>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#D4A853]/10 text-[#D4A853]' : 'bg-gray-50 text-gray-400'}`}>
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div 
                                            className="p-5 pt-0 text-sm text-gray-600 leading-relaxed font-medium border-t border-gray-50 mt-1"
                                            dangerouslySetInnerHTML={{ __html: faq.a }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 7. CONTACT */}
                <section className="py-16 px-6 mb-10">
                    <div className="bg-[#0f1035] rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full translate-x-20 -translate-y-20 blur-3xl pointer-events-none" />
                        
                        <h2 className="text-2xl font-serif text-[#D4A853] mb-4">Still have questions?</h2>
                        <p className="text-sm text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">Our support team is here to help you measure, track, or customize your order.</p>
                        
                        <a 
                            href="https://wa.me/919544073317" 
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm px-8 py-4 rounded-full active:scale-95 transition-transform hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/20 w-full md:w-auto"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                            Message on WhatsApp
                        </a>

                        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-xs text-gray-400 gap-4 text-left">
                            <div>
                                <p className="font-bold text-white mb-1">Email Support</p>
                                <a href="mailto:support@fabloom.in" className="hover:text-[#D4A853] transition-colors">support@fabloom.in</a>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">Working Hours</p>
                                <p>Every day, 9:00 AM - 9:00 PM</p>
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">Headquarters</p>
                                <p>Koduvally, Kerala, India</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
