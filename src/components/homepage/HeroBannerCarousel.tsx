'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { HERO_BANNERS } from '@/lib/homepage';

import Image from 'next/image';

const AUTOPLAY_MS = 4500;

export default function HeroBannerCarousel() {
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchDeltaX = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const total = HERO_BANNERS.length;

    const goTo = useCallback((index: number) => {
        setCurrent((index + total) % total);
    }, [total]);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);

    // Autoplay
    useEffect(() => {
        timerRef.current = setInterval(next, AUTOPLAY_MS);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [next]);

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(next, AUTOPLAY_MS);
    };

    // Touch handlers
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
        setIsDragging(true);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const onTouchEnd = () => {
        setIsDragging(false);
        const delta = touchDeltaX.current;
        if (Math.abs(delta) > 40) {
            delta < 0 ? goTo(current + 1) : goTo(current - 1);
            resetTimer();
        }
    };

    return (
        <div className="relative w-full select-none overflow-hidden rounded-2xl" style={{ height: '220px' }}>

            {/* Slide track */}
            <div
                className="w-full h-full relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {HERO_BANNERS.map((banner, index) => {
                    const isActive = current === index;
                    return (
                        <div
                            key={banner.id}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                opacity: isActive ? 1 : 0,
                                pointerEvents: isActive ? 'auto' : 'none',
                                zIndex: isActive ? 1 : 0,
                                transition: 'opacity 0.75s cubic-bezier(0.22,1,0.36,1)',
                            }}
                        >
                            {banner.imageUrl && (
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    fill
                                    className="object-cover object-center"
                                    style={{
                                        transform: isActive ? 'scale(1.04)' : 'scale(1)',
                                        transition: 'transform 5s cubic-bezier(0.22,1,0.36,1)',
                                    }}
                                    priority={index === 0}
                                />
                            )}
                            {/* Gradient Overlay */}
                            <div
                                className="absolute inset-0"
                                style={{ background: banner.gradient }}
                            />

                            {/* Content */}
                            <div
                                className="relative z-10 flex flex-col justify-center h-full px-7 pt-2 pb-10 w-2/3"
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                                    transition: 'opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease',
                                }}
                            >
                                {/* Badge */}
                                <span
                                    className="inline-block self-start text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full mb-3"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: banner.textColor,
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    {banner.badge}
                                </span>

                                {/* Title */}
                                <h2
                                    className="text-xl font-extrabold leading-tight mb-1"
                                    style={{ color: banner.textColor, textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}
                                >
                                    {banner.title}
                                </h2>

                                {/* Subtitle */}
                                <p
                                    className="text-xs leading-snug mb-5 max-w-[220px] opacity-90"
                                    style={{ color: banner.textColor }}
                                >
                                    {banner.subtitle}
                                </p>

                                {/* CTA */}
                                <Link
                                    href={banner.ctaHref}
                                    className="self-start inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        color: '#0f1035',
                                        boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                                    }}
                                    onClick={resetTimer}
                                >
                                    {banner.cta}
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20 items-center">
                {HERO_BANNERS.map((_, i) => {
                    const isActive = i === current;
                    return (
                        <button
                            key={i}
                            onClick={() => { goTo(i); resetTimer(); }}
                            aria-label={`Go to slide ${i + 1}`}
                            className="transition-all duration-400 rounded-full relative overflow-hidden"
                            style={{
                                width: isActive ? '22px' : '6px',
                                height: '6px',
                                backgroundColor: isActive ? '#D4A853' : 'rgba(255,255,255,0.35)',
                                boxShadow: isActive ? '0 0 8px rgba(212,168,83,0.6)' : 'none',
                                transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1), background-color 0.3s, box-shadow 0.3s',
                            }}
                        >
                            {/* Shimmer pulse on active dot */}
                            {isActive && (
                                <span
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                                        backgroundSize: '200% 100%',
                                        animation: 'dot-shimmer 1.8s linear infinite',
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <style>{`
                @keyframes dot-shimmer {
                    from { background-position: -100% 0; }
                    to   { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}
