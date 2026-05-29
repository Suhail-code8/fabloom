'use client';

import React from 'react';
import Link from 'next/link';

export default function MeasureGuidePage() {
    const measurements = [
        {
            num: 1,
            title: 'LENGTH',
            instruction: 'Stand straight. Measure from the base of your neck (where collar sits) down to your desired garment length.',
            tip: 'For kandoras, this is typically 130-145cm depending on your height.',
            illustration: 'A vertical measurement along the body from the neck to the ankles.'
        },
        {
            num: 2,
            title: 'SHOULDER',
            instruction: 'Measure across your back from one shoulder edge to the other.',
            tip: 'Ask someone to help — stand naturally, don\'t raise your arms.',
            illustration: 'A horizontal line across the shoulder blades on the back.'
        },
        {
            num: 3,
            title: 'SLEEVE LENGTH',
            instruction: 'With arm slightly bent, measure from the shoulder seam point to your wrist bone.',
            tip: 'Measure your dominant arm for best fit.',
            illustration: 'A line following the arm from the shoulder to the wrist.'
        },
        {
            num: 4,
            title: 'LOOSE 1 (Upper Arm)',
            instruction: 'Wrap the tape measure around the fullest part of your upper arm, just below the shoulder.',
            tip: 'Keep the tape snug but not tight — you should fit one finger underneath.',
            illustration: 'A tape measure wrapped around the bicep/upper arm.'
        },
        {
            num: 5,
            title: 'LOOSE 2 (Lower Arm / Wrist)',
            instruction: 'Measure around your forearm just above the wrist bone.',
            tip: 'This determines your cuff width.',
            illustration: 'A tape measure wrapped around the lower arm near the wrist.'
        },
        {
            num: 6,
            title: 'CHEST',
            instruction: 'Measure around the fullest part of your chest, keeping the tape parallel to the ground.',
            tip: 'Breathe normally — don\'t puff up or hold your breath.',
            illustration: 'A tape measure wrapped horizontally around the chest.'
        },
        {
            num: 7,
            title: 'WAIST',
            instruction: 'Measure around your natural waistline — the narrowest part of your torso.',
            tip: 'Measure over a thin shirt for most accurate results.',
            illustration: 'A tape measure wrapped around the waist.'
        },
        {
            num: 8,
            title: 'BOTTOM WIDTH',
            instruction: 'Measure the desired width across the bottom hem of your garment — how wide you want the opening at the bottom.',
            tip: 'This is a garment dimension, not a body measurement. Typically 60-90cm.',
            illustration: 'A horizontal line across the very bottom edge of the garment.'
        },
        {
            num: 9,
            title: 'NECK',
            instruction: 'Measure around the base of your neck where the collar sits.',
            tip: 'Keep one finger between the tape and your neck for comfort.',
            illustration: 'A tape measure wrapped around the base of the neck.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f1035] pb-24">
            <div className="px-4 pt-12 pb-8">
                <h1 className="text-3xl font-black text-white leading-tight mb-2 uppercase tracking-wide">
                    How to Take Your Measurements
                </h1>
                <p className="text-white/60 text-sm">
                    Follow this step-by-step guide to get accurate measurements for a perfect fit.
                </p>
                
                <button 
                    onClick={() => document.getElementById('guide-start')?.scrollIntoView({ behavior: 'smooth' })}
                    className="mt-6 px-6 py-3 bg-[#D4A853]/10 text-[#D4A853] font-bold text-sm uppercase tracking-wider rounded-xl border border-[#D4A853]/30"
                >
                    Step by Step Guide ↓
                </button>
            </div>

            <div id="guide-start" className="px-4 flex flex-col gap-8">
                {measurements.map((m) => (
                    <div key={m.num} className="bg-white/5 border border-white/10 rounded-3xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A853]/5 rounded-bl-full pointer-events-none" />
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center text-[#0f1035] font-black text-lg">
                                {m.num}
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-widest">{m.title}</h2>
                        </div>
                        
                        <div className="mb-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                            <p className="text-xs text-white/50 italic mb-2">Visual Reference:</p>
                            <p className="text-sm font-semibold text-white/80">{m.illustration}</p>
                        </div>
                        
                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                            {m.instruction}
                        </p>
                        
                        <div className="p-3 bg-[#D4A853]/10 border-l-2 border-[#D4A853] rounded-r-xl">
                            <p className="text-xs text-[#D4A853] font-bold uppercase tracking-widest mb-1">Pro Tip</p>
                            <p className="text-xs text-white/80">{m.tip}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 mt-12 mb-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">Ready to add your measurements?</h3>
                <div className="flex flex-col gap-3">
                    <Link href="/account/measurements/new" className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center bg-[#D4A853] text-[#0f1035] transition-transform active:scale-95">
                        Add My Measurements →
                    </Link>
                    <Link href="/stitching" className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center bg-white/5 text-white border border-white/10 transition-transform active:scale-95">
                        Start Stitching →
                    </Link>
                </div>
            </div>
        </div>
    );
}
