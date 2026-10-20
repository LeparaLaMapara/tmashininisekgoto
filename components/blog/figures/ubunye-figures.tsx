'use client'

import { useEffect, useRef, useState } from 'react'
import { C, FigButton, Figure, MONO, useInView, useReducedMotion } from './towers-shared'

/**
 * Figures for the Ubunye Engine series. Both are readable at rest: with motion
 * turned off they show the finished picture.
 */

const PLACES = [
  { name: 'Laptop, pandas', short: 'laptop' },
  { name: 'Laptop, Spark', short: 'laptop' },
  { name: 'Kubernetes', short: 'cluster' },
  { name: 'AWS Glue', short: 'cloud' },
  { name: 'Google Dataproc', short: 'cloud' },
  { name: 'Azure Container Apps', short: 'cloud' },
  { name: 'Databricks', short: 'cloud' },
]

/** Part 2: one folder, two files, and the engine carries it to wherever it runs. */
export function OneFolder() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [target, setTarget] = useState(0)
  const animate = inView && !reduced

  useEffect(() => {
    if (!animate) return
    const id = window.setInterval(() => setTarget((t) => (t + 1) % 3), 2600)
    return () => window.clearInterval(id)
  }, [animate])

  const targets = [
    { label: 'your laptop', note: 'small data, pandas, no Java' },
    { label: 'a big cluster', note: 'big data, Spark' },
    { label: 'the cloud', note: 'one command to send it' },
  ]
  const ty = [60, 150, 240]

  return (
    <Figure
      label="Figure · one folder, many places"
      caption="A task is one folder with two files: settings that say where the data comes from and where it goes, and a short Python file with the actual work. The folder never says which machine it runs on. The engine reads it and does the rest, on a laptop, a cluster or the cloud."
    >
      <div ref={ref}>
        <svg viewBox="0 0 600 300" className="h-auto w-full" role="img"
          aria-label="A folder holding config.yaml and transformations.py goes into the engine, which runs it on a laptop, a cluster or the cloud.">
          <g transform="translate(20 95)">
            <path d="M0 10 L0 120 L150 120 L150 22 L70 22 L58 10 Z" fill={C.sun} fillOpacity={0.18} stroke={C.ink} strokeWidth={2} />
            <text x={14} y={52} fontSize={15} fill={C.ink} style={MONO}>config.yaml</text>
            <text x={14} y={74} fontSize={11} fill={C.muted} style={MONO}>where from, where to</text>
            <text x={14} y={98} fontSize={15} fill={C.ink} style={MONO}>transformations.py</text>
            <text x={14} y={114} fontSize={11} fill={C.muted} style={MONO}>the actual work</text>
          </g>
          <line x1={175} y1={155} x2={245} y2={155} stroke={C.ink} strokeWidth={2} opacity={0.5} />
          <rect x={245} y={110} width={110} height={90} fill={C.ink} fillOpacity={0.06} stroke={C.ink} strokeWidth={2} />
          <text x={300} y={150} textAnchor="middle" fontSize={16} fill={C.ink} style={MONO}>ubunye</text>
          <text x={300} y={172} textAnchor="middle" fontSize={11} fill={C.muted} style={MONO}>reads, runs, records</text>
          {targets.map((t, i) => {
            const on = reduced || target === i
            return (
              <g key={t.label}>
                <line x1={355} y1={155} x2={410} y2={ty[i]} stroke={on ? C.up : C.dark} strokeWidth={2} opacity={on ? 0.9 : 0.35} />
                <rect x={410} y={ty[i] - 28} width={175} height={56} fill="none" stroke={on ? C.up : C.dark} strokeWidth={2} opacity={on ? 1 : 0.5} />
                <text x={422} y={ty[i] - 4} fontSize={15} fill={on ? C.ink : C.muted} style={MONO}>{t.label}</text>
                <text x={422} y={ty[i] + 16} fontSize={11} fill={C.muted} style={MONO}>{t.note}</text>
                {animate && on && (
                  <circle r={5} fill={C.up}>
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={`M355 155 L410 ${ty[i]}`} />
                  </circle>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </Figure>
  )
}

/** Part 5: the same work in seven places gives the same seal. */
export function SameSeal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (reduced) { setDone(PLACES.length); return }
    if (!inView || done >= PLACES.length) return
    const id = window.setTimeout(() => setDone((d) => d + 1), 650)
    return () => window.clearTimeout(id)
  }, [inView, done, reduced])

  return (
    <Figure
      label="Figure · seven kitchens, one seal"
      caption="The same small task, run in seven very different places on 30 September 2026. Each run writes down a fingerprint of every row it produced, like a seal on a jar. All seven seals match: bb08a7d7a9fd. Five other real workloads matched in all seven places too. A place that has not run is reported as not run, never as a pass."
    >
      <div ref={ref}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PLACES.map((p, i) => {
            const ok = i < done
            return (
              <div key={p.name} className={`flex items-center justify-between border p-3 transition-colors duration-500 ${ok ? 'border-signal' : 'border-border'}`}>
                <span className="text-sm text-ivory">{p.name}</span>
                <span className={`font-mono text-xs ${ok ? 'text-signal' : 'text-muted'}`}>{ok ? 'bb08a7d7a9fd ✓' : 'not run yet'}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-auto font-mono text-xs text-muted">{done} of {PLACES.length} places match</span>
          {!reduced && <FigButton onClick={() => setDone(0)}>Run again</FigButton>}
        </div>
      </div>
    </Figure>
  )
}
