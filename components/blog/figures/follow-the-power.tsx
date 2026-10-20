'use client'

import { useEffect, useRef, useState } from 'react'
import { C, FigButton, Figure, Mast, MONO, useInView, useReducedMotion } from './towers-shared'

/**
 * One day on five towers. The radios always come first: a compute job may only
 * run where the grid is on, where the sun covers it, or where the battery is
 * above the reserve line. When a tower drops below the line its jobs move to a
 * tower that can carry them, or wait. Instead of driving power to the work, the
 * work moves to the power.
 */
type Site = { name: string; solar: number; off: [number, number][] }

const SITES: Site[] = [
  { name: 'Hill', solar: 0.9, off: [[17, 19.5]] },
  { name: 'Town', solar: 0, off: [[6, 8.5], [20, 22.5]] },
  { name: 'Farm', solar: 1, off: [[10, 12.5], [22, 24]] },
  { name: 'Rank', solar: 0.3, off: [[14, 16.5]] },
  { name: 'School', solar: 0.7, off: [[0, 2.5], [18, 20]] },
]
const JOBS = 8
const PER_SITE = 2
const RESERVE = 70
const RADIO = 1.1 // battery points per 10 minutes the radios use with no supply
const COMPUTE = 0.7
const STEP_H = 1 / 6

const sunAt = (h: number) => (h > 6 && h < 18 ? Math.sin((Math.PI * (h - 6)) / 12) : 0)
const gridOn = (s: Site, h: number) => !s.off.some(([a, b]) => h >= a && h < b)

type State = { hour: number; battery: number[]; jobs: number[]; done: number }

function initial(): State {
  return { hour: 5, battery: SITES.map(() => 92), jobs: Array.from({ length: JOBS }, (_, i) => i % SITES.length), done: 0 }
}

function canCompute(s: Site, h: number, battery: number) {
  const solar = s.solar * sunAt(h) * 3
  return gridOn(s, h) || solar >= RADIO + COMPUTE || battery > RESERVE
}

function step(st: State): State {
  const hour = (st.hour + STEP_H) % 24
  const allowed = SITES.map((s, i) => canCompute(s, hour, st.battery[i]))
  // Jobs stay where they are while that tower can carry them; the rest look
  // for the tower with the most battery that still has room, or wait (-1).
  const count = SITES.map(() => 0)
  const jobs = st.jobs.map((j) => (j >= 0 && allowed[j] && count[j] < PER_SITE ? (count[j]++, j) : -1))
  for (let k = 0; k < jobs.length; k++) {
    if (jobs[k] >= 0) continue
    let pick = -1
    for (let i = 0; i < SITES.length; i++) {
      if (allowed[i] && count[i] < PER_SITE && (pick < 0 || st.battery[i] > st.battery[pick])) pick = i
    }
    if (pick >= 0) count[pick]++
    jobs[k] = pick
  }
  const battery = SITES.map((s, i) => {
    const supply = gridOn(s, hour) ? 99 : s.solar * sunAt(hour) * 3
    const load = RADIO + count[i] * COMPUTE
    const next = supply >= load ? st.battery[i] + Math.min(3, supply - load) : st.battery[i] - (load - supply)
    return Math.max(0, Math.min(100, next))
  })
  return { hour, battery, jobs, done: st.done + jobs.filter((j) => j >= 0).length }
}

const X = (i: number) => 70 + i * 115
const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60) % 60).padStart(2, '0')}`

export function FollowThePower() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [st, setSt] = useState<State>(initial)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!inView || !playing || reduced) return
    const id = window.setInterval(() => setSt(step), 110)
    return () => window.clearInterval(id)
  }, [inView, playing, reduced])

  // With motion off, show a single moment that tells the story: early evening,
  // two towers in load shedding, jobs gathered on the towers that can carry them.
  useEffect(() => {
    if (!reduced) return
    let s = initial()
    for (let i = 0; i < 6 * 13 + 3; i++) s = step(s)
    setSt(s)
  }, [reduced])

  const h = st.hour
  const sun = sunAt(h)
  const sunX = 30 + ((h - 6) / 12) * 540
  const waiting = st.jobs.filter((j) => j < 0).length

  return (
    <Figure
      label="Figure 5 · move the work to the power"
      caption="A simulated day. Bars are batteries; the dashed line is the reserve that belongs to the radios. Yellow squares are compute jobs. A job runs only where the grid is on, the sun covers it, or the battery is above the reserve. When a tower loses that, its jobs hop to one that has it, or wait. Calls never pay for compute."
    >
      <div ref={ref}>
        <svg viewBox="0 0 600 300" className="h-auto w-full" role="img" aria-label={`Five towers at ${fmt(h)}. ${waiting} jobs waiting.`}>
          <rect x={0} y={0} width={600} height={300} fill={C.ink} opacity={0.04 + (1 - sun) * 0.1} />
          {sun > 0 ? (
            <circle cx={sunX} cy={70 - sun * 45} r={13} fill={C.sun} />
          ) : (
            <circle cx={30 + (((h + 6) % 24) / 12) * 540} cy={36} r={9} fill="none" stroke={C.muted} strokeWidth={2} />
          )}
          <text x={590} y={22} textAnchor="end" fontSize={18} fill={C.ink} style={MONO}>{fmt(h)}</text>
          <text x={10} y={22} fontSize={13} fill={C.muted} style={MONO}>jobs waiting: {waiting}</text>

          {SITES.map((s, i) => {
            const on = gridOn(s, h)
            const b = st.battery[i]
            const ok = canCompute(s, h, b)
            const x = X(i)
            const jobsHere = st.jobs.filter((j) => j === i).length
            return (
              <g key={s.name}>
                <g transform={`translate(${x} 150)`}><Mast color={b > 0 ? C.up : C.down} /></g>
                {Array.from({ length: jobsHere }).map((_, k) => (
                  <rect key={k} x={x - 15 + k * 17} y={102} width={13} height={13} fill={C.sun} stroke={C.ink} strokeWidth={1} />
                ))}
                <text x={x} y={182} textAnchor="middle" fontSize={14} fill={C.ink} style={MONO}>{s.name}</text>
                <text x={x} y={200} textAnchor="middle" fontSize={11} fill={on ? C.muted : C.down} style={MONO}>
                  {on ? 'grid on' : 'grid off'}
                </text>
                <rect x={x - 14} y={210} width={28} height={70} fill="none" stroke={C.ink} strokeWidth={1.5} opacity={0.6} />
                <rect x={x - 12} y={212 + 66 * (1 - b / 100)} width={24} height={66 * (b / 100)}
                  fill={ok ? C.up : C.dark} opacity={0.85} />
                <line x1={x - 20} x2={x + 20} y1={212 + 66 * (1 - RESERVE / 100)} y2={212 + 66 * (1 - RESERVE / 100)}
                  stroke={C.down} strokeWidth={1.5} strokeDasharray="3 3" />
                <text x={x} y={295} textAnchor="middle" fontSize={11} fill={C.muted} style={MONO}>{Math.round(b)}%</text>
              </g>
            )
          })}
        </svg>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-auto font-mono text-xs text-muted">compute hours done: {Math.round(st.done / 6)}</span>
          {!reduced && <FigButton onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</FigButton>}
          {!reduced && <FigButton onClick={() => setSt(initial())}>Restart day</FigButton>}
        </div>
      </div>
    </Figure>
  )
}
