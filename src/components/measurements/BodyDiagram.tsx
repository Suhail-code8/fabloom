// Pure SVG body diagram component — no external deps
// Props: highlightedMeasurement controls which line pulses gold

export type HighlightedMeasurement =
    | 'length'
    | 'shoulder'
    | 'sleeveLength'
    | 'loose1'
    | 'loose2'
    | 'chest'
    | 'waist'
    | 'bottom'
    | 'neck'
    | null;

interface BodyDiagramProps {
    highlighted: HighlightedMeasurement;
    onSelectPoint?: (point: HighlightedMeasurement) => void;
}

// ============================================================================
// COLOUR HELPERS
// ============================================================================

const GOLD   = '#D4A853';
const MUTED  = 'rgba(255,255,255,0.18)';
const BODY   = 'rgba(255,255,255,0.55)';

function lineColor(active: boolean) { return active ? GOLD : MUTED; }
function lineWidth(active: boolean) { return active ? 2.5 : 1.5; }

// ============================================================================
// PULSING DOT (rendered at measurement endpoints when active)
// ============================================================================

function PulseDot({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
    if (!active) return null;
    return (
        <g style={{ pointerEvents: 'none' }}>
            <circle cx={cx} cy={cy} r={4} fill={GOLD} opacity={0.9}>
                <animate attributeName="r"    values="4;7;4"   dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={cx} cy={cy} r={3} fill={GOLD} />
        </g>
    );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function BodyDiagram({ highlighted, onSelectPoint }: BodyDiagramProps) {
    const h = highlighted;

    const isLength   = h === 'length';
    const isShoulder = h === 'shoulder';
    const isSleeve   = h === 'sleeveLength';
    const isLoose1   = h === 'loose1';
    const isLoose2   = h === 'loose2';
    const isChest    = h === 'chest';
    const isWaist    = h === 'waist';
    const isBottom   = h === 'bottom';
    const isNeck     = h === 'neck';

    const handleClick = (point: HighlightedMeasurement) => {
        if (onSelectPoint) onSelectPoint(point);
    };

    return (
        <svg
            viewBox="0 0 140 280"
            width="140"
            height="280"
            aria-label="Kandora measurement diagram"
            role="img"
            style={{ overflow: 'visible' }}
        >
            {/* ── HEAD ── */}
            <ellipse cx="70" cy="22" rx="14" ry="17" stroke={BODY} strokeWidth="1.8" fill="none" />

            {/* ── NECK ── */}
            <line x1="63" y1="38" x2="63" y2="50" stroke={BODY} strokeWidth="1.5" />
            <line x1="77" y1="38" x2="77" y2="50" stroke={BODY} strokeWidth="1.5" />

            {/* 9. NECK measurement */}
            <g onClick={() => handleClick('neck')} style={{ cursor: 'pointer' }}>
                <path d="M 58 44 Q 70 36 82 44"
                    stroke={lineColor(isNeck)} strokeWidth={lineWidth(isNeck)}
                    fill="none" strokeDasharray={isNeck ? 'none' : '3 2'} strokeLinecap="round" />
                <PulseDot cx={58} cy={44} active={isNeck} />
                <PulseDot cx={82} cy={44} active={isNeck} />
                {/* Hitbox */}
                <rect x="53" y="34" width="34" height="15" fill="transparent" />
            </g>

            {/* ── KANDORA OUTLINE ── */}
            {/* Shoulders */}
            <path d="M 63 50 L 30 58 M 77 50 L 110 58" stroke={BODY} strokeWidth="1.8" />
            
            {/* Body flowing down to ankles */}
            <path d="M 30 58 C 25 80 25 150 20 255" stroke={BODY} strokeWidth="1.8" fill="none" />
            <path d="M 110 58 C 115 80 115 150 120 255" stroke={BODY} strokeWidth="1.8" fill="none" />
            
            {/* Bottom Hem */}
            <path d="M 20 255 Q 70 260 120 255" stroke={BODY} strokeWidth="1.8" fill="none" />

            {/* ── ARMS ── */}
            {/* Left arm */}
            <path d="M 30 58 L 15 110 L 12 140 L 22 140 L 25 110" stroke={BODY} strokeWidth="1.5" fill="none" />
            {/* Right arm */}
            <path d="M 110 58 L 125 110 L 128 140 L 118 140 L 115 110" stroke={BODY} strokeWidth="1.5" fill="none" />

            {/* 2. SHOULDER measurement */}
            <g onClick={() => handleClick('shoulder')} style={{ cursor: 'pointer' }}>
                <line x1="30" y1="55" x2="110" y2="55"
                    stroke={lineColor(isShoulder)} strokeWidth={lineWidth(isShoulder)}
                    strokeDasharray={isShoulder ? 'none' : '4 2'} strokeLinecap="round" />
                <PulseDot cx={30} cy={55} active={isShoulder} />
                <PulseDot cx={110} cy={55} active={isShoulder} />
                <rect x="25" y="45" width="90" height="20" fill="transparent" />
            </g>

            {/* 6. CHEST measurement */}
            <g onClick={() => handleClick('chest')} style={{ cursor: 'pointer' }}>
                <line x1="28" y1="75" x2="112" y2="75"
                    stroke={lineColor(isChest)} strokeWidth={lineWidth(isChest)}
                    strokeDasharray={isChest ? 'none' : '4 2'} strokeLinecap="round" />
                <PulseDot cx={28} cy={75} active={isChest} />
                <PulseDot cx={112} cy={75} active={isChest} />
                <rect x="20" y="65" width="100" height="20" fill="transparent" />
            </g>

            {/* 7. WAIST measurement */}
            <g onClick={() => handleClick('waist')} style={{ cursor: 'pointer' }}>
                <line x1="27" y1="105" x2="113" y2="105"
                    stroke={lineColor(isWaist)} strokeWidth={lineWidth(isWaist)}
                    strokeDasharray={isWaist ? 'none' : '4 2'} strokeLinecap="round" />
                <PulseDot cx={27} cy={105} active={isWaist} />
                <PulseDot cx={113} cy={105} active={isWaist} />
                <rect x="20" y="95" width="100" height="20" fill="transparent" />
            </g>

            {/* 8. BOTTOM measurement (across hem) */}
            <g onClick={() => handleClick('bottom')} style={{ cursor: 'pointer' }}>
                <line x1="20" y1="250" x2="120" y2="250"
                    stroke={lineColor(isBottom)} strokeWidth={lineWidth(isBottom)}
                    strokeDasharray={isBottom ? 'none' : '4 2'} strokeLinecap="round" />
                <PulseDot cx={20} cy={250} active={isBottom} />
                <PulseDot cx={120} cy={250} active={isBottom} />
                <rect x="15" y="240" width="110" height="20" fill="transparent" />
            </g>

            {/* 1. LENGTH measurement (full length neck to bottom) */}
            <g onClick={() => handleClick('length')} style={{ cursor: 'pointer' }}>
                <line x1="12" y1="44" x2="12" y2="255"
                    stroke={lineColor(isLength)} strokeWidth={lineWidth(isLength)}
                    strokeDasharray={isLength ? 'none' : '3 2'} strokeLinecap="round" />
                {isLength && (
                    <>
                        <line x1="8" y1="44"  x2="16" y2="44"  stroke={GOLD} strokeWidth="1.5" />
                        <line x1="8" y1="255" x2="16" y2="255" stroke={GOLD} strokeWidth="1.5" />
                    </>
                )}
                <PulseDot cx={12} cy={44}  active={isLength} />
                <PulseDot cx={12} cy={255} active={isLength} />
                <rect x="0" y="40" width="24" height="220" fill="transparent" />
            </g>

            {/* 3. SLEEVE LENGTH (arrow along right sleeve) */}
            <g onClick={() => handleClick('sleeveLength')} style={{ cursor: 'pointer' }}>
                <line x1="110" y1="58" x2="128" y2="140"
                    stroke={lineColor(isSleeve)} strokeWidth={lineWidth(isSleeve)}
                    strokeDasharray={isSleeve ? 'none' : '3 2'} strokeLinecap="round" />
                <PulseDot cx={110} cy={58} active={isSleeve} />
                <PulseDot cx={128} cy={140} active={isSleeve} />
                <polygon points="105,58 135,140 120,145 100,65" fill="transparent" />
            </g>

            {/* 4. LOOSE 1 (Upper Arm, circle on left sleeve) */}
            <g onClick={() => handleClick('loose1')} style={{ cursor: 'pointer' }}>
                <ellipse cx="23" cy="85" rx="9" ry="4" transform="rotate(-15 23 85)"
                    stroke={lineColor(isLoose1)} strokeWidth={lineWidth(isLoose1)}
                    fill="none" strokeDasharray={isLoose1 ? 'none' : '2 2'} />
                <PulseDot cx={14} cy={82} active={isLoose1} />
                <PulseDot cx={31} cy={87} active={isLoose1} />
                <circle cx="23" cy="85" r="15" fill="transparent" />
            </g>

            {/* 5. LOOSE 2 (Wrist/Cuff, circle on left sleeve) */}
            <g onClick={() => handleClick('loose2')} style={{ cursor: 'pointer' }}>
                <ellipse cx="17" cy="130" rx="6" ry="3" transform="rotate(-10 17 130)"
                    stroke={lineColor(isLoose2)} strokeWidth={lineWidth(isLoose2)}
                    fill="none" strokeDasharray={isLoose2 ? 'none' : '2 2'} />
                <PulseDot cx={11} cy={129} active={isLoose2} />
                <PulseDot cx={23} cy={131} active={isLoose2} />
                <circle cx="17" cy="130" r="15" fill="transparent" />
            </g>
        </svg>
    );
}
