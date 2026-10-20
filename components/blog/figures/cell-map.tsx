'use client'

import { useEffect, useRef, useState } from 'react'
import { C, FigButton, Figure, MONO, useInView, useReducedMotion } from './towers-shared'

/**
 * Where phones have reported mobile cells, from OpenCelliD's open data, on a
 * grid of squares. Each dot is one square with at least one reported cell; its
 * colour is the newest generation seen there. Built by
 * scripts/our-version/cells.py; the data is crowdsourced, so it shows where
 * cells were seen, never how big a network is.
 */
type MapData = {
  width: number
  height: number
  lon: [number, number]
  lat: [number, number]
  stepDegrees: number
  landSquares: number
  outline: string
  points: [number, number, number, number][]
}

const PLACES = {
  sa: [
    ['Johannesburg', 28.04, -26.2], ['Cape Town', 18.42, -33.92], ['Durban', 31.02, -29.86],
    ['Gqeberha', 25.6, -33.96], ['Bloemfontein', 26.21, -29.12], ['Polokwane', 29.45, -23.9],
    ['Upington', 21.26, -28.45], ['Mthatha', 28.78, -31.59],
  ],
  africa: [
    ['Cairo', 31.24, 30.04], ['Lagos', 3.38, 6.52], ['Nairobi', 36.82, -1.29], ['Kinshasa', 15.27, -4.44],
    ['Addis Ababa', 38.75, 9.03], ['Dakar', -17.45, 14.69], ['Johannesburg', 28.04, -26.2],
  ],
} as const

const GENS = [
  { g: 2, label: '2G', colour: C.muted },
  { g: 3, label: '3G', colour: C.sun },
  { g: 4, label: '4G', colour: C.up },
]

export function CellMap({ which, figure }: { which: 'sa' | 'africa'; figure: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [data, setData] = useState<MapData | null>(null)
  const [layer, setLayer] = useState(2)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!inView || data) return
    fetch(`/data/our-version/${which}.json`).then((r) => r.json()).then(setData).catch(() => {})
  }, [inView, data, which])

  // Step through 2G, 3G and 4G so the reader sees the map thin out.
  useEffect(() => {
    if (!inView || !playing || reduced || !data) return
    const id = window.setInterval(() => setLayer((l) => (l >= 4 ? 2 : l + 1)), 2200)
    return () => window.clearInterval(id)
  }, [inView, playing, reduced, data])

  const isSa = which === 'sa'
  const proj = (lon: number, lat: number) =>
    data
      ? [((lon - data.lon[0]) / (data.lon[1] - data.lon[0])) * data.width, ((data.lat[1] - lat) / (data.lat[1] - data.lat[0])) * data.height]
      : [0, 0]
  const shown = data ? data.points.filter((p) => p[3] >= layer).length : 0
  const share = data ? (shown / data.landSquares) * 100 : 0
  const km = data ? Math.round(data.stepDegrees * 111) : 0
  const r = isSa ? 3.4 : 3.2

  return (
    <Figure
      label={`Figure ${figure} · ${isSa ? 'where the cells are, South Africa' : 'where the cells are, Africa'}`}
      caption={
        <>
          Each dot is a square of land about {km || (isSa ? 11 : 33)} km across where phones have reported at least one mobile cell. Its colour is the newest
          generation seen there. Source: <a className="underline" href="https://opencellid.org" target="_blank" rel="noopener noreferrer">OpenCelliD</a>, open data under CC BY-SA 4.0, downloaded 20 October 2026. It is crowdsourced, so quiet rural places are undercounted, and it cannot compare the size of one network with another.
        </>
      }
    >
      <div ref={ref}>
        <div className="relative w-full" style={{ aspectRatio: data ? `${data.width} / ${data.height}` : isSa ? '1000 / 891' : '1000 / 1050' }}>
          {data ? (
            <svg viewBox={`0 0 ${data.width} ${data.height}`} className="absolute inset-0 h-full w-full" role="img"
              aria-label={`${shown} squares of land show a ${layer}G cell or newer, ${share.toFixed(1)}% of the land.`}>
              <path d={data.outline} fill={C.ink} fillOpacity={0.05} stroke={C.ink} strokeOpacity={0.35} strokeWidth={isSa ? 1.5 : 1.2} />
              {data.points.map(([x, y, , g], i) => (
                <circle key={i} cx={x} cy={y} r={r} fill={GENS[g - 2].colour}
                  style={{ opacity: g >= layer ? 0.9 : 0.06, transition: reduced ? undefined : 'opacity 600ms ease' }} />
              ))}
              {PLACES[which].map(([name, lon, lat]) => {
                const [x, y] = proj(lon, lat)
                return (
                  <g key={name}>
                    <circle cx={x} cy={y} r={isSa ? 4 : 5} fill="none" stroke={C.ink} strokeWidth={1.5} />
                    <text x={x + 8} y={y + 5} fontSize={isSa ? 28 : 30} fill={C.ink} style={MONO} paintOrder="stroke"
                      stroke="var(--color-surface)" strokeWidth={5}>{name}</text>
                  </g>
                )
              })}
            </svg>
          ) : (
            <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">loading the map</div>
          )}
        </div>
        <p className="mt-3 text-sm text-ivory" aria-live="polite">
          <span className="font-mono text-2xl">{share.toFixed(1)}%</span>
          <span className="ml-2 text-muted">of the land has a reported {layer}G cell or newer</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {GENS.map((x) => (
            <FigButton key={x.g} onClick={() => { setLayer(x.g); setPlaying(false) }} active={layer === x.g}>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 align-middle" style={{ background: x.colour }} />
              {x.label} and newer
            </FigButton>
          ))}
          {!reduced && <FigButton onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</FigButton>}
        </div>
      </div>
    </Figure>
  )
}

type Row = { country: string; cells: number; g2: number; g3: number; g4: number }

export function CountryCells() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [rows, setRows] = useState<Row[] | null>(null)

  useEffect(() => {
    if (!inView || rows) return
    fetch('/data/our-version/countries.json').then((r) => r.json()).then(setRows).catch(() => {})
  }, [inView, rows])

  const top = rows?.slice(0, 12) ?? []
  const max = top[0]?.cells ?? 1
  const total = rows?.reduce((n, r) => n + r.cells, 0) ?? 0

  return (
    <Figure
      label="Figure 4 · reported cells by country"
      caption="Cells reported to OpenCelliD in the twelve countries with the most reports, split by generation. This measures how many phones contribute data in each country as much as it measures networks, so read it as a map of where data exists, not a ranking of networks."
    >
      <div ref={ref} className="space-y-2">
        {top.map((r) => (
          <div key={r.country}>
            <div className="flex justify-between text-sm text-ivory">
              <span>{r.country}</span><span className="font-mono text-xs text-muted">{r.cells.toLocaleString('en-US')}</span>
            </div>
            <div className="mt-1 flex h-2.5 bg-border" style={{ width: `${(r.cells / max) * 100}%` }}>
              <div style={{ width: `${(r.g2 / r.cells) * 100}%`, background: C.muted }} />
              <div style={{ width: `${(r.g3 / r.cells) * 100}%`, background: C.sun }} />
              <div style={{ width: `${(r.g4 / r.cells) * 100}%`, background: C.up }} />
            </div>
          </div>
        ))}
        {rows && (
          <p className="pt-2 font-mono text-xs text-muted">
            {total.toLocaleString('en-US')} cells across {rows.length} countries and territories. Grey 2G, yellow 3G, green 4G and newer.
          </p>
        )}
      </div>
    </Figure>
  )
}

export function LandVsPeople() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const bars = [
    { label: 'People covered by 4G in South Africa (ICASA, 2024)', v: 99.07, colour: C.up },
    { label: 'Squares of land with a reported 4G cell (OpenCelliD)', v: 4.3, colour: C.sun },
  ]
  return (
    <Figure
      label="Figure 2 · people are not land"
      caption="Both numbers are true at once. Towers are built where people live, and people live close together. A tower reaches several kilometres, so land without a reported cell can still have signal, but the towers themselves, the places a compute box could live, sit on a small part of the map."
    >
      <div ref={ref} className="space-y-5">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between gap-3 text-sm text-ivory">
              <span>{b.label}</span><span className="font-mono">{b.v}%</span>
            </div>
            <div className="h-6 w-full bg-border">
              <div className="h-6" style={{
                width: inView || reduced ? `${b.v}%` : 0, background: b.colour,
                transition: reduced ? undefined : `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.3}s`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </Figure>
  )
}
