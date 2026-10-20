'use client'

import { useRef } from 'react'
import { C, Figure, Mast, MONO, useInView, useReducedMotion } from './towers-shared'

/**
 * The opening picture. On the left, the plan the big companies are testing:
 * computers on satellites, in sunlight nearly all the time, with radiators
 * because there is no air to carry heat away. On the right, what we already
 * have: towers across the land, each with power, cooling, a fence and a link
 * back to the network.
 */
const ORBIT = 'M 40 150 A 105 60 0 1 1 250 150 A 105 60 0 1 1 40 150'
const FIBRE = 'M 330 228 L 395 228 L 470 228 L 545 228 L 600 228'
const TOWERS = [{ x: 345, y: 190 }, { x: 420, y: 168 }, { x: 495, y: 184 }, { x: 565, y: 172 }]

export function UpThereOutHere() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const animate = inView && !reduced

  return (
    <Figure
      label="Figure 1 · up there, out here"
      caption="Left: computers on satellites, in sunlight almost all the time, carrying radiators because in space there is no air to take the heat away. Right: towers already standing across the country, each with a power supply, batteries, a cooled cabinet, a fence and a link to the network."
    >
      <div ref={ref}>
        <svg viewBox="0 0 600 260" className="h-auto w-full" role="img"
          aria-label="Left, a satellite carrying a computer orbits the Earth. Right, a row of towers joined by fibre on the ground.">
          <rect x={0} y={0} width={290} height={260} fill="#05060a" />
          {[[30, 30], [120, 18], [200, 44], [260, 22], [70, 70], [240, 90], [150, 60]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.2} fill="#f5f1e6" opacity={0.7} />
          ))}
          <path d="M -20 260 Q 145 190 310 260 Z" fill="#1d4f7a" />
          <path d={ORBIT} fill="none" stroke="#f5f1e6" strokeWidth={1} strokeDasharray="2 5" opacity={0.35} />
          <g key={animate ? 'orbit' : 'still'} transform={animate ? undefined : 'translate(145 90)'}>
            <rect x={-4} y={-4} width={8} height={8} fill="#f5f1e6" />
            <rect x={-26} y={-3} width={20} height={6} fill="#ffd23f" />
            <rect x={6} y={-3} width={20} height={6} fill="#ffd23f" />
            <rect x={-3} y={4} width={6} height={14} fill="#9aa4b1" />
            {animate && <animateMotion dur="14s" repeatCount="indefinite" path={ORBIT} />}
          </g>
          <text x={12} y={248} fontSize={15} fill="#f5f1e6" style={MONO}>up there</text>

          <rect x={290} y={0} width={310} height={260} fill={C.ink} opacity={0.03} />
          <circle cx={560} cy={44} r={14} fill={C.sun} />
          <path d="M 290 210 Q 380 170 450 200 T 600 190 L 600 260 L 290 260 Z" fill={C.up} opacity={0.18} />
          <path id="fibre" d={FIBRE} fill="none" stroke={C.ink} strokeWidth={2.5} opacity={0.35} />
          {TOWERS.map((t, i) => (
            <g key={i}>
              <line x1={t.x} y1={t.y + 12} x2={t.x} y2={228} stroke={C.ink} strokeWidth={1.5} opacity={0.35} />
              <g transform={`translate(${t.x} ${t.y})`}><Mast color={C.up} /></g>
              {animate && (
                <circle cx={t.x} cy={t.y - 18} r={5} fill="none" stroke={C.up} strokeWidth={1.5}>
                  <animate attributeName="r" from="5" to="20" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              )}
              <rect x={t.x - 7} y={t.y + 14} width={14} height={8} fill={C.sun} stroke={C.ink} strokeWidth={1} />
            </g>
          ))}
          {animate && [0, 1.1, 2.2].map((d) => (
            <circle key={d} r={3.5} fill={C.sun}>
              <animateMotion dur="3.3s" begin={`${d}s`} repeatCount="indefinite" path={FIBRE} />
            </circle>
          ))}
          <text x={302} y={248} fontSize={15} fill={C.ink} style={MONO}>out here</text>
        </svg>
      </div>
    </Figure>
  )
}
