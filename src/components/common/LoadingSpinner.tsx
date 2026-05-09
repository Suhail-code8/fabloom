// ============================================================================
// LoadingSpinner — Fabloom branded animated spinner
// Usage: <LoadingSpinner /> or <LoadingSpinner size="sm" label="Loading..." />
// ============================================================================

interface LoadingSpinnerProps {
    size?:  'sm' | 'md' | 'lg';
    label?: string;
    className?: string;
}

const sizeMap = {
    sm: { ring: 'w-6 h-6',  border: 'border-2' },
    md: { ring: 'w-10 h-10', border: 'border-2' },
    lg: { ring: 'w-16 h-16', border: 'border-[3px]' },
};

export default function LoadingSpinner({
    size  = 'md',
    label,
    className = '',
}: LoadingSpinnerProps) {
    const { ring, border } = sizeMap[size];

    return (
        <div
            role="status"
            aria-label={label || 'Loading'}
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
        >
            {/* Glassmorphism ring */}
            <div className="relative">
                {/* Glow backdrop */}
                <div
                    className={`absolute inset-0 rounded-full blur-md opacity-30`}
                    style={{ backgroundColor: '#D4A853' }}
                />
                {/* Spinning ring */}
                <div
                    className={`relative ${ring} ${border} rounded-full animate-spin`}
                    style={{
                        borderColor: 'rgba(212,168,83,0.2)',
                        borderTopColor: '#D4A853',
                    }}
                />
            </div>

            {label && (
                <p
                    className="text-xs font-medium animate-pulse"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    {label}
                </p>
            )}
        </div>
    );
}
