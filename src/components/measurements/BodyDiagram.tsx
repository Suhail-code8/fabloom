// Pure SVG body diagram component — no external deps
// Props: highlightedMeasurement controls which line pulses gold

export type HighlightedMeasurement =
    | 'chest'
    | 'waist'
    | 'hip'
    | 'shoulder'
    | 'sleeve'
    | 'neck'
    | 'length'
    | 'inseam'
    | 'thobeLength'
    | null;

interface BodyDiagramProps {
    highlighted: HighlightedMeasurement;
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
        <g>
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

export default function BodyDiagram({ highlighted }: BodyDiagramProps) {
    const h = highlighted;

    const isChest    = h === 'chest';
    const isWaist    = h === 'waist';
    const isHip      = h === 'hip';
    const isShoulder = h === 'shoulder';
    const isSleeve   = h === 'sleeve';
    const isNeck     = h === 'neck';
    const isLength   = h === 'length' || h === 'thobeLength';
    const isInseam   = h === 'inseam';

    return (
        <svg
            viewBox="0 0 120 280"
            width="120"
            height="280"
            aria-label="Body measurement diagram"
            role="img"
            style={{ overflow: 'visible' }}
        >
            {/* ── HEAD ── */}
            <ellipse cx="60" cy="22" rx="14" ry="17"
                stroke={BODY} strokeWidth="1.8" fill="none" />

            {/* ── NECK ── */}
            <line x1="53" y1="38" x2="53" y2="50" stroke={BODY} strokeWidth="1.5" />
            <line x1="67" y1="38" x2="67" y2="50" stroke={BODY} strokeWidth="1.5" />

            {/* Neck measurement arc */}
            <path d="M 48 44 Q 60 36 72 44"
                stroke={lineColor(isNeck)} strokeWidth={lineWidth(isNeck)}
                fill="none" strokeDasharray={isNeck ? 'none' : '3 2'} strokeLinecap="round" />
            <PulseDot cx={48} cy={44} active={isNeck} />
            <PulseDot cx={72} cy={44} active={isNeck} />

            {/* ── TORSO OUTLINE ── */}
            {/* Shoulders */}
            <line x1="53" y1="50" x2="20" y2="58" stroke={BODY} strokeWidth="1.8" />
            <line x1="67" y1="50" x2="100" y2="58" stroke={BODY} strokeWidth="1.8" />

            {/* Torso sides */}
            <path d="M 20 58 C 16 80 18 100 22 130" stroke={BODY} strokeWidth="1.8" fill="none" />
            <path d="M 100 58 C 104 80 102 100 98 130" stroke={BODY} strokeWidth="1.8" fill="none" />

            {/* Hips */}
            <path d="M 22 130 Q 30 140 35 155" stroke={BODY} strokeWidth="1.8" fill="none" />
            <path d="M 98 130 Q 90 140 85 155" stroke={BODY} strokeWidth="1.8" fill="none" />

            {/* Crotch */}
            <path d="M 35 155 Q 60 160 85 155" stroke={BODY} strokeWidth="1.8" fill="none" />

            {/* ── SHOULDER measurement ── */}
            <line x1="20" y1="55" x2="100" y2="55"
                stroke={lineColor(isShoulder)} strokeWidth={lineWidth(isShoulder)}
                strokeDasharray={isShoulder ? 'none' : '4 2'} strokeLinecap="round" />
            <PulseDot cx={20} cy={55} active={isShoulder} />
            <PulseDot cx={100} cy={55} active={isShoulder} />

            {/* ── CHEST measurement ── */}
            <line x1="21" y1="73" x2="99" y2="73"
                stroke={lineColor(isChest)} strokeWidth={lineWidth(isChest)}
                strokeDasharray={isChest ? 'none' : '4 2'} strokeLinecap="round" />
            <PulseDot cx={21} cy={73} active={isChest} />
            <PulseDot cx={99} cy={73} active={isChest} />

            {/* ── WAIST measurement ── */}
            <line x1="20" y1="100" x2="100" y2="100"
                stroke={lineColor(isWaist)} strokeWidth={lineWidth(isWaist)}
                strokeDasharray={isWaist ? 'none' : '4 2'} strokeLinecap="round" />
            <PulseDot cx={20} cy={100} active={isWaist} />
            <PulseDot cx={100} cy={100} active={isWaist} />

            {/* ── HIP measurement ── */}
            <line x1="22" y1="122" x2="98" y2="122"
                stroke={lineColor(isHip)} strokeWidth={lineWidth(isHip)}
                strokeDasharray={isHip ? 'none' : '4 2'} strokeLinecap="round" />
            <PulseDot cx={22} cy={122} active={isHip} />
            <PulseDot cx={98} cy={122} active={isHip} />

            {/* ── ARMS ── */}
            {/* Left arm */}
            <path d="M 20 58 L 8 100 L 10 130" stroke={BODY} strokeWidth="1.5" fill="none" />
            {/* Right arm */}
            <path d="M 100 58 L 112 100 L 110 130" stroke={BODY} strokeWidth="1.5" fill="none" />

            {/* ── SLEEVE measurement ── */}
            <line x1="20" y1="58" x2="10" y2="130"
                stroke={lineColor(isSleeve)} strokeWidth={lineWidth(isSleeve)}
                strokeDasharray={isSleeve ? 'none' : '3 2'} strokeLinecap="round" />
            <PulseDot cx={20} cy={58} active={isSleeve} />
            <PulseDot cx={10} cy={130} active={isSleeve} />

            {/* ── LEGS ── */}
            {/* Left leg */}
            <line x1="35" y1="155" x2="32" y2="255" stroke={BODY} strokeWidth="1.8" />
            <line x1="32" y1="255" x2="38" y2="255" stroke={BODY} strokeWidth="1.5" />
            {/* Right leg */}
            <line x1="85" y1="155" x2="88" y2="255" stroke={BODY} strokeWidth="1.8" />
            <line x1="88" y1="255" x2="82" y2="255" stroke={BODY} strokeWidth="1.5" />

            {/* ── SHIRT/KURTA LENGTH ── (vertical line on right) */}
            <line x1="108" y1="50" x2="108" y2="155"
                stroke={lineColor(isLength)} strokeWidth={lineWidth(isLength)}
                strokeDasharray={isLength ? 'none' : '3 2'} strokeLinecap="round" />
            {isLength && (
                <>
                    <line x1="103" y1="50"  x2="113" y2="50"  stroke={GOLD} strokeWidth="1.5" />
                    <line x1="103" y1="155" x2="113" y2="155" stroke={GOLD} strokeWidth="1.5" />
                </>
            )}
            <PulseDot cx={108} cy={50}  active={isLength} />
            <PulseDot cx={108} cy={155} active={isLength} />

            {/* ── INSEAM ── (inside right leg) */}
            <line x1="85" y1="155" x2="88" y2="255"
                stroke={lineColor(isInseam)} strokeWidth={lineWidth(isInseam)}
                strokeDasharray={isInseam ? 'none' : '3 2'} strokeLinecap="round" />
            <PulseDot cx={85} cy={155} active={isInseam} />
            <PulseDot cx={88} cy={255} active={isInseam} />
        </svg>
    );
}
