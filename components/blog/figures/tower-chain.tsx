'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { C, FigButton, Figure, Mast, MONO, useInView, useReducedMotion } from './towers-shared'

/**
 * The smart generator problem in one picture. Towers hand their traffic up a
 * chain to the one that has fibre, so a tower is only useful when it AND every
 * tower above it has power. Four towers have lost power and there is one
 * generator. Sending it to the wrong one lights nothing; the graph knows which.
 */
type Tower = { id: string; x: number; y: number; parent: string | null; people: number; dead?: boolean }

const TOWERS: Tower[] = [
  { id: 'H', x: 300, y: 150, parent: null, people: 9, dead: true },
  { id: 'A', x: 185, y: 92, parent: 'H', people: 6 },
  { id: 'A1', x: 70, y: 58, parent: 'A', people: 4 },
  { id: 'A2', x: 92, y: 168, parent: 'A', people: 3, dead: true },
  { id: 'B', x: 420, y: 84, parent: 'H', people: 7 },
  { id: 'B1', x: 532, y: 46, parent: 'B', people: 5 },
  { id: 'B2', x: 545, y: 150, parent: 'B', people: 2, dead: true },
  { id: 'C', x: 410, y: 228, parent: 'H', people: 5 },
  { id: 'C1', x: 525, y: 258, parent: 'C', people: 4 },
  { id: 'S', x: 250, y: 262, parent: null, people: 3, dead: true },
  { id: 'R', x: 110, y: 262, parent: null, people: 6 },
]
const BY_ID = new Map(TOWERS.map((t) => [t.id, t]))
const DEPOT = { x: 585, y: 300 }

function upSet(gen: string | null): Set<string> {
  const powered = (t: Tower) => !t.dead || t.id === gen
  const up = new Set<string>()
  // A tower carries calls when it has power and so does every tower above it.
  for (const t of TOWERS) {
    let cur: Tower | undefined = t
    let ok = true
    while (cur) {
      if (!powered(cur)) { ok = false; break }
      cur = cur.parent ? BY_ID.get(cur.parent) : undefined
    }
    if (ok) up.add(t.id)
  }
  return up
}

const people = (s: Set<string>) => [...s].reduce((n, id) => n + (BY_ID.get(id)?.people ?? 0), 0)

export function TowerChain() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [gen, setGen] = useState<string | null>(null)
  const [asked, setAsked] = useState(false)

  const base = useMemo(() => upSet(null), [])
  const up = useMemo(() => upSet(gen), [gen])
  const scores = useMemo(
    () => TOWERS.filter((t) => t.dead).map((t) => ({ id: t.id, gain: upSet(t.id).size - base.size })),
    [base],
  )
  const best = scores.reduce((a, b) => (b.gain > a.gain ? b : a))
  const target = gen ? BY_ID.get(gen)! : null
  const animate = inView && !reduced

  const status = (t: Tower) => (up.has(t.id) ? 'up' : t.dead && t.id !== gen ? 'down' : 'dark')
  const colour = { up: C.up, down: C.down, dark: C.dark }

  let message = 'Load shedding. Four towers have lost power (red). The grey ones still have power, but the tower they hand their calls to is dead. Tap a red tower to send your only generator there.'
  if (gen) {
    const gain = up.size - base.size
    message =
      gain === 0
        ? `The generator is running at tower ${gen} all night, and nothing came back. The tower above it is still dead, so its calls have nowhere to go.`
        : gain === 1
          ? `Tower ${gen} is back, on its own. One tower, ${BY_ID.get(gen)!.people} thousand people.`
          : `One generator, ${gain} towers back. Tower ${gen} carries the others, so powering it brought ${people(up) - people(base)} thousand people back online.`
  }

  return (
    <Figure
      label="Figure 2 · one generator, which tower?"
      caption="Towers pass their traffic along a chain until it reaches a tower with fibre. Counting what lights up when you power each dead tower is a simple walk down that tree. Do it for every dead tower, add how far the generator must drive and how many people each tower serves, and you have the dispatch decision."
    >
      <div ref={ref}>
        <svg viewBox="0 0 600 320" className="h-auto w-full" role="img" aria-label="A network of eleven towers. Four have lost power. Powering the hub tower restores seven towers; powering a leaf tower restores none.">
          {TOWERS.map((t) => {
            if (!t.parent) {
              return <line key={`f${t.id}`} x1={t.x} y1={t.y + 38} x2={t.x} y2={318} stroke={C.ink} strokeWidth={3} opacity={0.35} />
            }
            const p = BY_ID.get(t.parent)!
            const live = up.has(t.id)
            return (
              <line key={`l${t.id}`} x1={p.x} y1={p.y - 18} x2={t.x} y2={t.y - 18} stroke={live ? C.up : C.dark}
                strokeWidth={2} strokeDasharray="5 5" opacity={live ? 0.9 : 0.4}>
                {animate && live && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />}
              </line>
            )
          })}
          <text x={4} y={312} fontSize={16} fill={C.muted} style={MONO}>fibre</text>

          {TOWERS.map((t) => {
            const s = status(t)
            const clickable = !!t.dead
            const score = asked ? scores.find((x) => x.id === t.id) : undefined
            return (
              <g key={t.id} transform={`translate(${t.x} ${t.y})`}
                onClick={clickable ? () => setGen(t.id) : undefined}
                onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') setGen(t.id) } : undefined}
                role={clickable ? 'button' : undefined} tabIndex={clickable ? 0 : undefined}
                aria-label={clickable ? `Send the generator to tower ${t.id}` : undefined}
                style={{ cursor: clickable ? 'pointer' : 'default', outline: 'none' }}>
                {clickable && <circle r={26} cy={-4} fill="transparent" />}
                {s === 'up' && animate && (
                  <circle cy={-18} r={6} fill="none" stroke={C.up} strokeWidth={1.5}>
                    <animate attributeName="r" from="6" to="22" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <Mast color={colour[s]} opacity={s === 'dark' ? 0.5 : 1} />
                <text y={32} textAnchor="middle" fontSize={19} fill={colour[s]} style={MONO}>{t.id}</text>
                {score && (
                  <text y={-32} textAnchor="middle" fontSize={20} fontWeight={700} style={MONO}
                    fill={score.id === best.id ? C.up : C.muted}>+{score.gain}</text>
                )}
              </g>
            )
          })}

          <motion.g
            initial={false}
            animate={{ x: target ? target.x + 16 : DEPOT.x, y: target ? target.y + 4 : DEPOT.y }}
            transition={reduced ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <rect x={-9} y={-7} width={18} height={12} fill={C.sun} stroke={C.ink} strokeWidth={1.5} />
            <text x={0} y={3} textAnchor="middle" fontSize={9} fontWeight={700} fill="#111" style={MONO}>G</text>
          </motion.g>
        </svg>

        <p className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-ivory" aria-live="polite">{message}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="mr-auto font-mono text-xs text-muted">
            towers carrying calls: {up.size} of {TOWERS.length}
          </span>
          <FigButton onClick={() => setAsked(true)} active={asked}>Ask the graph</FigButton>
          <FigButton onClick={() => { setGen(null); setAsked(false) }}>Reset</FigButton>
        </div>
      </div>
    </Figure>
  )
}
