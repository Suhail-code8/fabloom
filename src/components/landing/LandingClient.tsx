'use client';

import { useEffect } from 'react';

export default function LandingClient() {
    useEffect(() => {
        // ── Mobile Menu Toggle ──
        const openBtn = document.getElementById('lp-open-menu');
        const closeBtn = document.getElementById('lp-close-menu');
        const mobileNav = document.getElementById('lp-mobile-nav');

        const openMenu = () => mobileNav?.classList.remove('-translate-x-full');
        const closeMenu = () => mobileNav?.classList.add('-translate-x-full');

        openBtn?.addEventListener('click', openMenu);
        closeBtn?.addEventListener('click', closeMenu);

        // Close on backdrop click
        mobileNav?.addEventListener('click', (e) => {
            if (e.target === mobileNav) closeMenu();
        });

        // ── Top Nav Scroll Effect ──
        const topNav = document.getElementById('lp-top-nav');
        const handleScroll = () => {
            if (!topNav) return;
            if (window.scrollY > 60) {
                topNav.style.borderBottom = '1px solid rgba(72,70,76,0.2)';
                topNav.style.backgroundColor = 'rgba(5,4,15,0.85)';
            } else {
                topNav.style.borderBottom = '';
                topNav.style.backgroundColor = 'transparent';
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // ── Intersection Observer (fade-up) ──
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('lp-visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px', threshold: 0.12 }
        );
        document.querySelectorAll('.lp-fade').forEach((el) => observer.observe(el));

        // ── Counter Animation ──
        const counterEls = document.querySelectorAll<HTMLElement>('[data-count-target]');
        const counterObs = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target as HTMLElement;
                    const target = parseInt(el.dataset.countTarget || '0', 10);
                    const suffix = el.dataset.countSuffix || '';
                    const duration = 1800;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    obs.unobserve(el);
                });
            },
            { threshold: 0.5 }
        );
        counterEls.forEach((el) => counterObs.observe(el));

        // ── Custom cursor ──
        const dot = document.getElementById('lp-cursor-dot');
        const ring = document.getElementById('lp-cursor-ring');
        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;

        const moveCursor = (e: MouseEvent) => {
            dotX = e.clientX; dotY = e.clientY;
            if (dot) {
                dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
            }
        };
        window.addEventListener('mousemove', moveCursor, { passive: true });

        const animRing = () => {
            ringX += (dotX - ringX) * 0.12;
            ringY += (dotY - ringY) * 0.12;
            if (ring) ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
            requestAnimationFrame(animRing);
        };
        animRing();

        const hoverEls = document.querySelectorAll('a,button,.lp-hover');
        hoverEls.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                dot?.classList.add('lp-cursor-dot--hover');
                ring?.classList.add('lp-cursor-ring--hover');
            });
            el.addEventListener('mouseleave', () => {
                dot?.classList.remove('lp-cursor-dot--hover');
                ring?.classList.remove('lp-cursor-ring--hover');
            });
        });

        return () => {
            openBtn?.removeEventListener('click', openMenu);
            closeBtn?.removeEventListener('click', closeMenu);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', moveCursor);
            observer.disconnect();
            counterObs.disconnect();
        };
    }, []);

    return null;
}
