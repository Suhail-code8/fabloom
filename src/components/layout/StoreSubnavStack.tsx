import type { ReactNode } from 'react';

interface StoreSubnavStackProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

/** Title + filter pills stick together directly below TopCategoryBar — no gap. */
export default function StoreSubnavStack({ title, subtitle, children }: StoreSubnavStackProps) {
    return (
        <div
            className="store-subnav-stack border-b border-white/10"
            style={{ backgroundColor: '#0f1035' }}
        >
            <div className="px-4 pt-3 pb-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}
