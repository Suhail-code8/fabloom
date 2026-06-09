'use client';

import { useEffect } from 'react';

export default function LandingClient() {
    useEffect(() => {
        // ─── CANVAS GEOMETRIC PATTERN ───
        const canvas = document.querySelector('.lp-canvas') as HTMLCanvasElement;
        let rafCanvas: number;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                let t = 0;
                const resize = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };
                resize();
                window.addEventListener('resize', resize);

                const drawStar = (cx: number, cy: number, r: number, alpha: number) => {
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = 'rgba(201,153,42,1)';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    for (let i = 0; i < 8; i++) {
                        const a = (i / 8) * Math.PI * 2;
                        const ar = a + Math.PI / 8;
                        const x1 = cx + r * Math.cos(a);
                        const y1 = cy + r * Math.sin(a);
                        const x2 = cx + r * 0.4 * Math.cos(ar);
                        const y2 = cy + r * 0.4 * Math.sin(ar);
                        if (i === 0) ctx.moveTo(x1, y1);
                        else ctx.lineTo(x1, y1);
                        ctx.lineTo(x2, y2);
                    }
                    ctx.closePath();
                    ctx.stroke();
                    ctx.restore();
                };

                const draw = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    t += 0.015;
                    const spacingX = 90;
                    const spacingY = 80;
                    const cols = Math.ceil(canvas.width / spacingX) + 2;
                    const rows = Math.ceil(canvas.height / spacingY) + 2;
                    for (let row = -1; row < rows; row++) {
                        for (let col = -1; col < cols; col++) {
                            const cx = col * spacingX + (row % 2 === 0 ? 0 : spacingX / 2);
                            const cy = row * spacingY;
                            const offset = (col + row * 3) * 0.4;
                            const alpha = (Math.sin(t + offset) * 0.5 + 0.5) * 0.1;
                            drawStar(cx, cy, 22, alpha);
                        }
                    }
                    rafCanvas = requestAnimationFrame(draw);
                };
                draw();
            }
        }

        // ─── CUSTOM CURSOR ───
        const dot = document.querySelector('.lp-cursor-dot') as HTMLDivElement;
        const ring = document.querySelector('.lp-cursor-ring') as HTMLDivElement;
        let rafCursor: number;
        if (dot && ring) {
            let mx = -100, my = -100;
            let rx = -100, ry = -100;

            const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
            document.addEventListener('mousemove', onMove);

            const tick = () => {
                dot.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
                rx += (mx - rx) * 0.12;
                ry += (my - ry) * 0.12;
                ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
                rafCursor = requestAnimationFrame(tick);
            };
            tick();

            const hover = () => { dot.classList.add('lp-cursor-dot--hover'); ring.classList.add('lp-cursor-ring--hover'); };
            const leave = () => { dot.classList.remove('lp-cursor-dot--hover'); ring.classList.remove('lp-cursor-ring--hover'); };
            const els = document.querySelectorAll('a,button,[data-hover]');
            els.forEach(el => { el.addEventListener('mouseenter', hover); el.addEventListener('mouseleave', leave); });
        }

        // ─── COUNT-UP ANIMATION ───
        const statEls = document.querySelectorAll('.lp-stat-num');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    const target = parseInt(el.dataset.target || '0', 10);
                    const suffix = el.dataset.suffix || '';
                    if (target > 0) {
                        const duration = 1800;
                        const start = performance.now();
                        const tick = (now: number) => {
                            const p = Math.min((now - start) / duration, 1);
                            const ease = 1 - Math.pow(1 - p, 4);
                            el.innerText = Math.round(ease * target) + suffix;
                            if (p < 1) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        statEls.forEach(el => observer.observe(el));

        return () => {
            if (rafCanvas) cancelAnimationFrame(rafCanvas);
            if (rafCursor) cancelAnimationFrame(rafCursor);
            document.removeEventListener('mousemove', () => {});
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div className="lp-cursor-dot" />
            <div className="lp-cursor-ring" />
        </>
    );
}
