'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FigButton, Figure, useReducedMotion } from './towers-shared'

/**
 * A rough cost sheet for compute boxes in towers, with the assumptions on the
 * page so a reader can change the ones they disagree with. Every default is
 * written in the post next to its source; nothing here is a quote.
 */
export const COST = {
  zarPerUsd: 16.45,
  gridRandPerKwh: 4,
  dieselRandPerKwh: 18,
  boxWatts: 240,
  boxYears: 4,
  rentPerMonth: 1500,
  visitsPerYear: 2,
  randPerVisit: 2500,
  theftReservePct: 10,
}

const SIZES = [
  { name: 'Pilot, 10 towers', towers: 10 },
  { name: 'Region, 100 towers', towers: 100 },
  { name: 'Country, 1,000 towers', towers: 1000 },
]

const rand = (n: number) => `R${Math.round(n).toLocaleString('en-US')}`
const big = (n: number) => (n >= 1e6 ? `R${(n / 1e6).toFixed(1)} million` : rand(n))

export function TowerCosts() {
  const reduced = useReducedMotion()
  const [size, setSize] = useState(0)
  const [usd, setUsd] = useState(4000)
  const [gridShare, setGridShare] = useState(50)

  const sheet = useMemo(() => {
    const box = usd * COST.zarPerUsd
    const kwhYear = (COST.boxWatts / 1000) * 24 * 365 * 0.6 // boxes sleep about 40% of the day under the reserve rule
    const lines = [
      { label: 'The box, spread over its life', v: box / COST.boxYears },
      { label: 'Electricity from the grid', v: kwhYear * (gridShare / 100) * COST.gridRandPerKwh },
      { label: 'Space and power rent', v: COST.rentPerMonth * 12 },
      { label: 'Extra time on site visits', v: COST.visitsPerYear * COST.randPerVisit },
      { label: 'Theft and breakage reserve', v: (box * COST.theftReservePct) / 100 },
    ]
    const perTower = lines.reduce((n, l) => n + l.v, 0)
    return { box, lines, perTower, kwhYear }
  }, [usd, gridShare])

  const towers = SIZES[size].towers
  const max = Math.max(...sheet.lines.map((l) => l.v))

  return (
    <Figure
      label="Figure 6 · what it costs, roughly"
      caption="Rough numbers for one tower with one box, per year, and for a whole deployment. Solar power is counted as free because the panels are already paid for; only the share of hours on the grid costs money. Change the box price or the grid share and watch the totals move."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {SIZES.map((s, i) => (
          <FigButton key={s.name} onClick={() => setSize(i)} active={i === size}>{s.name}</FigButton>
        ))}
      </div>
      <div className="mb-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm text-ivory">
          <span className="w-36 shrink-0">Box price</span>
          <input type="range" min={1500} max={6000} step={250} value={usd} onChange={(e) => setUsd(Number(e.target.value))}
            className="h-11 w-full accent-[var(--color-synapse)]" aria-label="Box price in US dollars" />
          <span className="w-16 font-mono text-xs text-muted">${usd.toLocaleString('en-US')}</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-ivory">
          <span className="w-36 shrink-0">Hours on grid</span>
          <input type="range" min={0} max={100} step={10} value={gridShare} onChange={(e) => setGridShare(Number(e.target.value))}
            className="h-11 w-full accent-[var(--color-synapse)]" aria-label="Share of running hours paid from the grid" />
          <span className="w-16 font-mono text-xs text-muted">{gridShare}%</span>
        </label>
      </div>

      <div className="space-y-2">
        {sheet.lines.map((l) => (
          <div key={l.label}>
            <div className="flex justify-between text-sm text-ivory"><span>{l.label}</span><span className="font-mono">{rand(l.v)}</span></div>
            <div className="mt-1 h-2 w-full bg-border">
              <motion.div className="h-2 bg-signal" initial={false} animate={{ width: `${(l.v / max) * 100}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.45 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-border p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">one tower, per year</div>
          <div className="mt-1 font-mono text-xl text-ivory">{rand(sheet.perTower)}</div>
          <div className="text-xs text-muted">about {rand(sheet.perTower / 12)} a month</div>
        </div>
        <div className="border border-border p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">to start, {towers.toLocaleString('en-US')} boxes</div>
          <div className="mt-1 font-mono text-xl text-ivory">{big(sheet.box * towers)}</div>
          <div className="text-xs text-muted">hardware bought up front</div>
        </div>
        <div className="border border-signal p-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">to run, per year</div>
          <div className="mt-1 font-mono text-xl text-ivory">{big(sheet.perTower * towers)}</div>
          <div className="text-xs text-muted">{towers.toLocaleString('en-US')} towers, everything above</div>
        </div>
      </div>
    </Figure>
  )
}
