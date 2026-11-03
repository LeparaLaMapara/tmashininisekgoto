'use client'

import { useEffect, useRef, useState } from 'react'
import { C, FigButton, Figure, MONO, useInView, useReducedMotion } from './towers-shared'

/**
 * Figures for the Building a Data Team series. Like the towers figures, each
 * one reads at rest: with motion off it shows one honest still frame, and any
 * animation runs only while the figure is on screen.
 */

/** Counts 0, 1, 2 ... on a timer while running. Returns `still` with motion off. */
function useTicker(ref: React.RefObject<Element | null>, ms: number, still: number): number {
  const reduced = useReducedMotion()
  const inView = useInView(ref)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (reduced || !inView) return
    const id = setInterval(() => setTick((t) => t + 1), ms)
    return () => clearInterval(id)
  }, [reduced, inView, ms])
  return reduced ? still : tick
}

const OK = 'var(--color-signal)'
const BAD = C.down

/* Part 1: the order of the work. */
const STOPS = ['Stage 1: Find out what is true', 'Stage 2: One safe home for data', 'Stage 3: A clear path for work', 'Stage 4: Show, do not argue', 'Stage 5: Trust, then let go', 'Arrive: it outlives you']

export function TeamRoute() {
  const ref = useRef<HTMLDivElement>(null)
  const tick = useTicker(ref, 1100, STOPS.length - 1)
  const at = tick % (STOPS.length + 1)
  return (
    <Figure label="Figure 1 · The road, stage by stage" caption="Each stage makes the next one possible. Skip one and the later ones stop holding.">
      <div ref={ref}>
        <ol className="relative space-y-3">
          <span aria-hidden className="absolute bottom-4 left-[11px] top-4 w-0.5 bg-border" />
          {STOPS.map((s, i) => {
            const reached = i <= at
            return (
              <li key={s} className="relative flex min-h-8 items-center gap-3">
                <span
                  className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] transition-colors duration-500"
                  style={{ borderColor: reached ? OK : C.border, background: reached ? OK : 'var(--color-surface)', color: reached ? 'var(--color-void)' : C.muted }}
                >
                  {i + 1}
                </span>
                <span className="text-sm transition-colors duration-500 sm:text-base" style={{ color: reached ? C.ink : C.muted, fontWeight: i === STOPS.length - 1 && reached ? 600 : 400 }}>
                  {s}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </Figure>
  )
}

/* Part 2: what happens when someone leaves. */
const TASKS = ['Daily report', 'Customer model', 'Data feed', 'Monthly job']

export function KnowledgeInHeads() {
  const [written, setWritten] = useState(false)
  const [gone, setGone] = useState(false)
  return (
    <Figure
      label="Figure 1 · One person goes on leave"
      caption="A made up team, to show the idea. When the knowledge is only in one head, the work leaves with that person. When it is written down, anyone can carry on."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <FigButton active={!written} onClick={() => setWritten(false)}>In heads</FigButton>
        <FigButton active={written} onClick={() => setWritten(true)}>Written down</FigButton>
        <FigButton active={gone} onClick={() => setGone((g) => !g)}>{gone ? 'They are back' : 'Thandi goes on leave'}</FigButton>
      </div>
      <ul className="space-y-2">
        {TASKS.map((t, i) => {
          const hers = i === 0 || i === 1
          const broken = gone && hers && !written
          return (
            <li key={t} className="flex min-h-10 items-center justify-between gap-3 rounded-sm border px-3 py-2 transition-colors duration-300" style={{ borderColor: broken ? BAD : C.border }}>
              <span className="text-sm text-ivory">{t}</span>
              <span className="text-right font-mono text-[11px] uppercase tracking-wider" style={{ color: broken ? BAD : OK }}>
                {broken ? 'Stopped: only Thandi knows' : written ? 'Running: anyone can follow the guide' : hers && !gone ? 'Running: only while Thandi is here' : 'Running'}
              </span>
            </li>
          )
        })}
      </ul>
    </Figure>
  )
}

/* Part 3: data passing through a checkpoint on its way to one home. */
const SOURCES = ['Databases', 'Services', 'Files']
const DOTS = Array.from({ length: 9 }, (_, i) => ({ row: i % 3, bad: i % 4 === 3, phase: i / 9 }))

export function DataHome() {
  const ref = useRef<HTMLDivElement>(null)
  const tick = useTicker(ref, 50, 24)
  const p = (tick % 120) / 120
  const rowY = [36, 96, 156]
  return (
    <Figure
      label="Figure 1 · One way in, with a checkpoint"
      caption="Data from many places passes the same checks on the way in. Good data goes home. Bad data (red) stops at the checkpoint, where someone can see it and fix it."
    >
      <div ref={ref}>
        <svg viewBox="0 0 440 200" className="h-auto w-full" role="img" aria-label="Data from databases, outside services and files passes through a checkpoint into one data lake. Bad data stops at the checkpoint.">
          {SOURCES.map((s, i) => (
            <g key={s}>
              <rect x={2} y={rowY[i] - 18} width={102} height={36} rx={4} fill="none" stroke={C.border} />
              <text x={53} y={rowY[i] + 5} textAnchor="middle" fontSize={15} fill={C.ink} style={MONO}>{s}</text>
              <path d={`M104 ${rowY[i]} C 140 ${rowY[i]} 150 96 182 96`} fill="none" stroke={C.border} />
            </g>
          ))}
          <path d="M212 96 L 296 96" stroke={C.border} />
          {DOTS.map((d, i) => {
            const t = (p + d.phase) % 1
            let x: number
            let y: number
            if (t < 0.5) {
              const k = t / 0.5
              x = 104 + k * 78
              y = rowY[d.row] + (96 - rowY[d.row]) * k * k * (3 - 2 * k)
            } else if (d.bad) {
              x = 176
              y = 96 + (i % 3) * 9 - 9
            } else {
              x = 212 + ((t - 0.5) / 0.5) * 84
              y = 96
            }
            return <circle key={i} cx={x} cy={y} r={5} fill={d.bad ? BAD : OK} />
          })}
          <rect x={182} y={58} width={30} height={76} rx={4} fill="var(--color-surface)" stroke={C.ink} />
          <text x={197} y={156} textAnchor="middle" fontSize={15} fill={C.ink} style={MONO}>Checks</text>
          <rect x={296} y={42} width={142} height={108} rx={8} fill="none" stroke={OK} strokeWidth={2} />
          <text x={367} y={92} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.ink}>One safe</text>
          <text x={367} y={114} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.ink}>home</text>
        </svg>
      </div>
    </Figure>
  )
}

/* Part 4: the same six steps, about a year against two weeks. */
const STEPS = ['Idea', 'Try', 'Save', 'Check', 'Release', 'Look after']

function Track({ title, note, at, color }: { title: string; note: string; at: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-ivory">{title}</span>
        <span className="font-mono text-xs text-muted">{note}</span>
      </div>
      <div className="relative h-2 rounded-full bg-border">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${at * 100}%`, background: color }} />
      </div>
    </div>
  )
}

export function PathToProduction() {
  const ref = useRef<HTMLDivElement>(null)
  // A 12 second lap. The after bar fills in about 1 of those 26 parts, as two
  // weeks is to a year, then holds; the point is the ratio, not the speed.
  const tick = useTicker(ref, 60, 104)
  const lap = tick % 208
  const before = Math.min(1, lap / 200)
  const after = Math.min(1, lap / (200 / 26))
  return (
    <Figure
      label="Figure 1 · The same work, a different path"
      caption="Both bars run at the same speed, drawn to scale: two weeks against about a year. The steps did not change. The waiting and the rework did."
    >
      <div ref={ref} className="space-y-5">
        <Track title="Before" note="about a year" at={before} color={BAD} />
        <Track title="After" note="a two week sprint" at={after} color={OK} />
        <ol className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted">
          {STEPS.map((s, i) => <li key={s}>{i + 1}. {s}</li>)}
        </ol>
      </div>
    </Figure>
  )
}

/* Part 5: a backlog you can drain. Sums only: start plus arrivals minus processed. */
const START_M = 100
const IN_M = 1
// Stops rather than an even scale, so a thumb can land on 1 and reach the real result.
const RATES = [0.5, 1, 2, 3, 5, 10, 20, 50, 101]

export function BacklogTank() {
  const [stop, setStop] = useState(3)
  const rate = RATES[stop]
  const net = rate - IN_M
  const days = net > 0 ? Math.ceil(START_M / net) : null
  const level = net > 0 ? 45 : net === 0 ? 70 : 95
  const verdict =
    net < 0 ? 'The backlog keeps growing.' : net === 0 ? 'The backlog stops growing, but it never shrinks.' : `The backlog clears in about ${days} ${days === 1 ? 'day' : 'days'}.`
  return (
    <Figure
      label="Figure 1 · Try it: how fast must you go?"
      caption="The sum is simple: 100 million waiting, 1 million more every day. Only what you process above 1 million a day shrinks the backlog. The tank shows the direction, not an exact level."
    >
      <div className="flex items-stretch gap-5">
        <div aria-hidden className="relative w-20 shrink-0 overflow-hidden rounded-sm border-2 border-border sm:w-28" style={{ height: 150 }}>
          <div className="absolute inset-x-0 bottom-0 transition-all duration-500" style={{ height: `${level}%`, background: net > 0 ? OK : BAD, opacity: 0.75 }} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
          <label className="block text-sm text-ivory" htmlFor="backlog-rate">
            We process <strong>{rate === 0.5 ? 'half a million' : `${rate} million`}</strong> a day
          </label>
          <input
            id="backlog-rate"
            type="range"
            min={0}
            max={RATES.length - 1}
            step={1}
            value={stop}
            aria-valuetext={`${rate} million a day`}
            onChange={(e) => setStop(Number(e.target.value))}
            className="h-11 w-full accent-[var(--color-signal)]"
          />
          <p className="text-base font-semibold" style={{ color: net > 0 ? OK : BAD }} aria-live="polite">{verdict}</p>
        </div>
      </div>
    </Figure>
  )
}

/* Part 6: the same problem, seen late and seen early. */
const BEFORE_STEPS = ['Something breaks', 'A client complains', 'Money is lost', 'We start fixing it']
const AFTER_STEPS = ['A check spots it early', 'The team is alerted', 'We fix it', 'The client never notices']

export function ReactiveProactive() {
  const ref = useRef<HTMLDivElement>(null)
  const tick = useTicker(ref, 1200, 3)
  const at = tick % 5
  const Col = ({ title, steps, color }: { title: string; steps: string[]; color: string }) => (
    <div>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-wider" style={{ color }}>{title}</div>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className="min-h-10 rounded-sm border px-3 py-2 text-sm text-ivory transition-all duration-500"
            style={{ borderColor: i <= at ? color : C.border, opacity: i <= at ? 1 : 0.35 }}
          >
            {s}
          </li>
        ))}
      </ol>
    </div>
  )
  return (
    <Figure label="Figure 1 · The same problem, two endings" caption="The problem is the same on both sides. What changed is who finds it first: us, or the client.">
      <div ref={ref} className="grid gap-5 sm:grid-cols-2">
        <Col title="Reactive: before" steps={BEFORE_STEPS} color={BAD} />
        <Col title="Proactive: now" steps={AFTER_STEPS} color={OK} />
      </div>
    </Figure>
  )
}

/* Part 7: one foundation, many uses. The list is the same one the post walks through. */
const USES = ['Know each customer', 'Keep your customers', 'Understand how people drive', 'Understand the big risks', 'Protect money and work faster']

export function OneFoundation() {
  const ref = useRef<HTMLDivElement>(null)
  const tick = useTicker(ref, 1000, USES.length - 1)
  const at = tick % (USES.length + 1)
  return (
    <Figure label="Figure 1 · One foundation, many uses" caption="Each use stands on the same trusted data, clear path and shared way of working, so each new one costs less than the last.">
      <div ref={ref} className="space-y-2">
        {USES.map((u, i) => (
          <div
            key={u}
            className="flex min-h-10 items-center rounded-sm border px-3 py-2 text-sm text-ivory transition-all duration-500"
            style={{ borderColor: i <= at ? OK : C.border, opacity: i <= at ? 1 : 0.35 }}
          >
            {u}
          </div>
        ))}
        <div className="rounded-sm px-3 py-3 text-center text-sm font-semibold" style={{ background: OK, color: 'var(--color-void)' }}>
          Trusted data, a clear path and people who own the work
        </div>
      </div>
    </Figure>
  )
}
