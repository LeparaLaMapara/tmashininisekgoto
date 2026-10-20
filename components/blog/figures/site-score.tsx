'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Figure, FigButton, useReducedMotion } from './towers-shared'

/**
 * Choosing which towers get a compute box is the same kind of decision as
 * choosing where the generator goes: several things matter, they pull against
 * each other, and you have to say out loud how much each one counts. This is a
 * weighted sum (the simplest multi criteria method) with the weights in the
 * reader's hands.
 */
type Site = { name: string; note: string; power: number; link: number; safety: number; alone: number }

const SITES: Site[] = [
  { name: 'Hill tower', note: 'fibre, solar, carries six towers', power: 0.8, link: 1, safety: 0.4, alone: 0.2 },
  { name: 'Rooftop in town', note: 'fibre, steady grid, no room for panels', power: 0.5, link: 1, safety: 0.9, alone: 1 },
  { name: 'Farm road tower', note: 'big solar, microwave link only', power: 0.95, link: 0.3, safety: 0.3, alone: 1 },
  { name: 'Taxi rank tower', note: 'busy, batteries stolen twice', power: 0.4, link: 0.8, safety: 0.2, alone: 0.6 },
  { name: 'Mine town hub', note: 'fibre, guarded yard, carries eight', power: 0.6, link: 1, safety: 0.8, alone: 0.1 },
  { name: 'School corner', note: 'solar, fibre nearby, quiet street', power: 0.7, link: 0.6, safety: 0.8, alone: 1 },
]

const CRITERIA = [
  { key: 'power', label: 'Spare power' },
  { key: 'link', label: 'Fibre connection' },
  { key: 'safety', label: 'Low theft risk' },
  { key: 'alone', label: 'Carries no other towers' },
] as const
type Key = (typeof CRITERIA)[number]['key']

const PRESETS: { name: string; w: Record<Key, number> }[] = [
  { name: 'Balanced', w: { power: 3, link: 3, safety: 3, alone: 2 } },
  { name: 'Power first', w: { power: 5, link: 1, safety: 1, alone: 1 } },
  { name: 'Safety first', w: { power: 1, link: 2, safety: 5, alone: 3 } },
]

export function SiteScore() {
  const reduced = useReducedMotion()
  const [w, setW] = useState<Record<Key, number>>(PRESETS[0].w)

  const ranked = useMemo(() => {
    const total = CRITERIA.reduce((n, c) => n + w[c.key], 0) || 1
    return SITES.map((s) => ({ ...s, score: CRITERIA.reduce((n, c) => n + w[c.key] * s[c.key], 0) / total }))
      .sort((a, b) => b.score - a.score)
  }, [w])

  return (
    <Figure
      label="Figure 4 · which towers get a compute box?"
      caption="Each tower is scored on four things, each between 0 and 1. Move the weights and watch the order change. Nothing here is clever. The value is that the trade off is written down, so an engineer, a security manager and a finance person can argue about the weights instead of arguing about the answer."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <FigButton key={p.name} onClick={() => setW(p.w)} active={CRITERIA.every((c) => w[c.key] === p.w[c.key])}>
            {p.name}
          </FigButton>
        ))}
      </div>
      <div className="mb-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {CRITERIA.map((c) => (
          <label key={c.key} className="flex items-center gap-3 text-sm text-ivory">
            <span className="w-44 shrink-0">{c.label}</span>
            <input type="range" min={0} max={5} step={1} value={w[c.key]}
              onChange={(e) => setW({ ...w, [c.key]: Number(e.target.value) })}
              className="h-11 w-full accent-[var(--color-synapse)]" aria-label={`Weight for ${c.label}`} />
            <span className="w-4 font-mono text-xs text-muted">{w[c.key]}</span>
          </label>
        ))}
      </div>
      <ol className="space-y-2">
        {ranked.map((s, i) => (
          <motion.li key={s.name} layout={!reduced} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-sm border p-3 ${i < 2 ? 'border-signal' : 'border-border'}`}>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-muted">{i + 1}</span>
              <span className="font-medium text-ivory">{s.name}</span>
              {i < 2 && <span className="font-mono text-[11px] uppercase tracking-wider text-signal">gets a box</span>}
              <span className="ml-auto font-mono text-sm text-ivory">{s.score.toFixed(2)}</span>
            </div>
            <div className="mt-1 text-xs text-muted">{s.note}</div>
            <div className="mt-2 h-2 w-full bg-border">
              <motion.div className={i < 2 ? 'h-2 bg-signal' : 'h-2 bg-muted'} initial={false}
                animate={{ width: `${Math.round(s.score * 100)}%` }} transition={reduced ? { duration: 0 } : { duration: 0.45 }} />
            </div>
          </motion.li>
        ))}
      </ol>
    </Figure>
  )
}
