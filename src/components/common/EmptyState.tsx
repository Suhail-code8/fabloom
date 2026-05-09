import type { ReactNode } from 'react';

// ============================================================================
// EmptyState — reusable empty state for lists, wishlists, orders, etc.
// Usage: <EmptyState icon={<Icon />} title="No orders" cta={<Button />} />
// ============================================================================

interface EmptyStateProps {
    icon?:        ReactNode;
    title:        string;
    description?: string;
    cta?:         ReactNode;
    className?:   string;
}

// Default illustration — abstract fabric spool
function DefaultIcon() {
    return (
        <svg
            viewBox="0 0 80 80"
            fill="none"
            className="w-20 h-20"
        >
            {/* Outer ring */}
            <circle cx="40" cy="40" r="32" stroke="rgba(212,168,83,0.25)" strokeWidth="2" strokeDasharray="6 4" />
            {/* Spool body */}
            <ellipse cx="40" cy="30" rx="14" ry="5" fill="rgba(212,168,83,0.15)" stroke="rgba(212,168,83,0.4)" strokeWidth="1.5" />
            <rect x="26" y="30" width="28" height="20" fill="rgba(212,168,83,0.08)" stroke="rgba(212,168,83,0.4)" strokeWidth="1.5" />
            <ellipse cx="40" cy="50" rx="14" ry="5" fill="rgba(212,168,83,0.15)" stroke="rgba(212,168,83,0.4)" strokeWidth="1.5" />
            {/* Thread lines */}
            <line x1="33" y1="30" x2="33" y2="50" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
            <line x1="40" y1="30" x2="40" y2="50" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
            <line x1="47" y1="30" x2="47" y2="50" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
        </svg>
    );
}

export default function EmptyState({
    icon,
    title,
    description,
    cta,
    className = '',
}: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
        >
            {/* Icon area */}
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.15)' }}
            >
                {icon ?? <DefaultIcon />}
            </div>

            {/* Text */}
            <h3
                className="text-lg font-bold mb-2"
                style={{ color: 'rgba(255,255,255,0.9)' }}
            >
                {title}
            </h3>

            {description && (
                <p
                    className="text-sm max-w-xs mb-6"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                    {description}
                </p>
            )}

            {cta && <div>{cta}</div>}
        </div>
    );
}
