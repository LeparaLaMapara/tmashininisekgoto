/**
 * Sosha Plata Jo: the street around the sign.
 *
 * A row of RDP houses, each painted its own colour, under corrugated iron, a
 * spaza with its painted board, street lamps, power lines with birds on them,
 * and a minibus taxi in the site's livery driving past. It sits above the footer
 * on every page, holds no words, and is hidden in ThabangVision (the dark theme).
 * The taxi respects prefers-reduced-motion and simply parks.
 */
const HOUSES = [
  { x: 0, w: 120, h: 58, c: '#e9c46a' },
  { x: 132, w: 104, h: 52, c: '#8fb8a8' },
  { x: 248, w: 128, h: 60, c: '#d98c8c' },
  { x: 560, w: 116, h: 54, c: '#c9d6e3' },
  { x: 688, w: 124, h: 58, c: '#f2a65a' },
  { x: 824, w: 108, h: 52, c: '#9fc27a' },
  { x: 1040, w: 122, h: 57, c: '#e9c46a' },
  { x: 1174, w: 110, h: 54, c: '#d98c8c' },
]

function House({ x, w, h, c }: { x: number; w: number; h: number; c: string }) {
  const base = 150
  const top = base - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={c} stroke="#111" strokeWidth="2.5" />
      {/* a low pitched corrugated iron roof */}
      <polygon points={`${x - 6},${top + 2} ${x + w / 2},${top - 16} ${x + w + 6},${top + 2}`} fill="url(#zinc)" stroke="#111" strokeWidth="2.5" />
      <rect x={x + 14} y={top + 14} width="22" height="18" fill="#1d2a36" stroke="#111" strokeWidth="2" />
      <line x1={x + 25} y1={top + 14} x2={x + 25} y2={top + 32} stroke="#f7f7f2" strokeWidth="1.5" />
      <rect x={x + w - 34} y={base - 34} width="20" height="34" fill="#5a3a26" stroke="#111" strokeWidth="2" />
    </g>
  )
}

function Lamp({ x }: { x: number }) {
  return (
    <g>
      <line x1={x} y1="150" x2={x} y2="44" stroke="#111" strokeWidth="3" />
      <path d={`M${x},46 q14,-8 26,0`} fill="none" stroke="#111" strokeWidth="3" />
      <rect x={x + 20} y="44" width="14" height="6" fill="#ffd23f" stroke="#111" strokeWidth="1.5" className="kasi-lamp" />
    </g>
  )
}

export function KasiStreet() {
  return (
    <div className="kasi-street" aria-hidden="true">
      <svg viewBox="0 0 1300 170" preserveAspectRatio="xMidYMax slice" role="presentation">
        <defs>
          <pattern id="zinc" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#9aa3a8" />
            <rect width="3" height="6" fill="#7d868b" />
          </pattern>
        </defs>

        {/* power lines, sagging from pole to pole, with a few birds */}
        <path d="M0,40 Q220,62 440,40 T880,40 T1320,40" fill="none" stroke="#111" strokeWidth="1.4" />
        <path d="M0,50 Q220,72 440,50 T880,50 T1320,50" fill="none" stroke="#111" strokeWidth="1.1" />
        {[300, 318, 334, 972, 990].map((bx) => (
          <path key={bx} d={`M${bx},${bx < 600 ? 55 : 57} q4,-5 8,0 q4,-5 8,0`} fill="none" stroke="#111" strokeWidth="1.6" />
        ))}

        {HOUSES.map((h) => <House key={h.x} {...h} />)}

        {/* the spaza: a bigger box, a painted board, a serving hatch */}
        <g>
          <rect x="396" y="78" width="148" height="72" fill="#f7f7f2" stroke="#111" strokeWidth="2.5" />
          <rect x="396" y="78" width="148" height="12" fill="#d62828" />
          <rect x="406" y="96" width="128" height="22" fill="#ffd23f" stroke="#111" strokeWidth="2.5" />
          <rect x="414" y="102" width="44" height="4" fill="#111" />
          <rect x="414" y="109" width="70" height="4" fill="#111" />
          <rect x="430" y="124" width="54" height="26" fill="#1d2a36" stroke="#111" strokeWidth="2" />
          <line x1="430" y1="132" x2="484" y2="132" stroke="#9aa3a8" strokeWidth="2" />
          <line x1="430" y1="140" x2="484" y2="140" stroke="#9aa3a8" strokeWidth="2" />
          <polygon points="390,80 470,62 550,80" fill="url(#zinc)" stroke="#111" strokeWidth="2.5" />
        </g>

        {/* a washing line between two houses */}
        <path d="M944,100 Q990,112 1036,100" fill="none" stroke="#111" strokeWidth="1.2" />
        <rect x="958" y="104" width="12" height="16" fill="#1f6fd6" stroke="#111" strokeWidth="1" />
        <rect x="978" y="106" width="14" height="12" fill="#e03a1e" stroke="#111" strokeWidth="1" />
        <rect x="1000" y="105" width="10" height="17" fill="#ffd23f" stroke="#111" strokeWidth="1" />

        <Lamp x={380} />
        <Lamp x={940} />

        {/* the road */}
        <rect x="0" y="150" width="1300" height="20" fill="#2b2b2b" />
        <line x1="0" y1="160" x2="1300" y2="160" stroke="#ffd23f" strokeWidth="2" strokeDasharray="22 18" />

        {/* the taxi, in the site's livery */}
        <g className="kasi-taxi">
          <path d="M0,146 L0,118 Q2,108 14,106 L78,104 Q96,104 104,120 L110,134 L110,146 Z" fill="#f7f7f2" stroke="#111" strokeWidth="2.5" />
          <path d="M18,110 L64,109 L64,122 L16,123 Z" fill="#1d2a36" />
          <path d="M70,109 L84,109 Q94,110 98,122 L70,122 Z" fill="#1d2a36" />
          <rect x="2" y="128" width="106" height="4" fill="#e03a1e" />
          <rect x="2" y="133" width="106" height="4" fill="#1f6fd6" />
          <rect x="2" y="138" width="106" height="3" fill="#f0b400" />
          <circle cx="24" cy="148" r="8" fill="#111" /><circle cx="24" cy="148" r="3" fill="#9aa3a8" />
          <circle cx="88" cy="148" r="8" fill="#111" /><circle cx="88" cy="148" r="3" fill="#9aa3a8" />
          <rect x="104" y="124" width="6" height="5" fill="#ffd23f" />
        </g>
      </svg>
    </div>
  )
}
