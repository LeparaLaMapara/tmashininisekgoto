'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FigButton, Figure, useInView, useReducedMotion } from './towers-shared'

/**
 * How big is one compute box next to the tower it lives in? An illustrative
 * 3 kW macro site (modelled sites sit between about 1 and 4 kW) against the
 * two unified memory machines named in the post.
 */
const SITE = [
  { label: 'Radios', w: 2000, cls: 'bg-signal' },
  { label: 'Cooling', w: 600, cls: 'bg-muted' },
  { label: 'Rectifiers and the rest', w: 400, cls: 'bg-border' },
]
const BOXES = [
  { name: '120 W box', w: 120, note: 'a small desktop with 128 GB of shared memory, enough for a 70B model at 4 bit' },
  { name: '240 W box', w: 240, note: '128 GB of shared memory, sold for models up to about 200B parameters' },
]
const MAX = 3400

export function CabinetBudget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [box, setBox] = useState(1)
  const b = BOXES[box]
  const shown = inView || reduced
  const t = (d: number) => (reduced ? { duration: 0 } : { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] as const })

  const bar = (withBox: boolean) => (
    <div className="flex h-9 w-full overflow-hidden border border-border">
      {SITE.map((s, i) => (
        <motion.div key={s.label} className={`${s.cls} h-full`} initial={{ width: 0 }}
          animate={{ width: shown ? `${(s.w / MAX) * 100}%` : 0 }} transition={t(i * 0.15)} title={`${s.label}: ${s.w} W`} />
      ))}
      {withBox && (
        <motion.div className="h-full bg-accent" initial={{ width: 0 }}
          animate={{ width: shown ? `${(b.w / MAX) * 100}%` : 0 }} transition={t(0.6)} title={`Compute: ${b.w} W`} />
      )}
    </div>
  )

  return (
    <Figure
      label="Figure 3 · one box next to one tower"
      caption="An illustrative 3 kW site. Modelled macro sites draw roughly 1 to 4 kW, and newer 5G sites more. The compute box adds around a tenth to the load, and it is the first thing switched off when the batteries are needed for calls."
    >
      <div ref={ref} className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {BOXES.map((x, i) => (
            <FigButton key={x.name} onClick={() => setBox(i)} active={i === box}>{x.name}</FigButton>
          ))}
        </div>
        <div>
          <div className="mb-1 flex justify-between font-mono text-xs text-muted"><span>tower today</span><span>3,000 W</span></div>
          {bar(false)}
        </div>
        <div>
          <div className="mb-1 flex justify-between font-mono text-xs text-muted">
            <span>tower with a compute box</span><span>{(3000 + b.w).toLocaleString('en-US')} W</span>
          </div>
          {bar(true)}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {SITE.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5"><span className={`inline-block h-3 w-3 ${s.cls}`} />{s.label}</span>
          ))}
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 bg-accent" />Compute</span>
        </div>
        <p className="text-sm text-ivory">
          <span className="font-mono text-2xl">+{((b.w / 3000) * 100).toFixed(0)}%</span>
          <span className="ml-2 text-muted">{b.note}</span>
        </p>
      </div>
    </Figure>
  )
}
