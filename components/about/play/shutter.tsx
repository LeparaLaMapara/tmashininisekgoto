'use client'

import { useRef, useState } from 'react'

/**
 * A camera you can press. Each press flashes, closes the shutter for a moment,
 * and drops one of his own photographs (the ThabangVision tiles in
 * /public/vision) onto a small pile of prints. Below it, what is in his bag,
 * as he listed it on 2026-09-24. Names only, no brand logos.
 */
const COUNT = 50
const BAG = [
  'Canon 250D',
  'Nikon D5300',
  'Fujifilm X-T1',
  'Sony FE 50mm f/1.8',
  'Sony FE 85mm f/1.8',
  'GoPro HERO9',
  'DJI Mini 4K',
  'DJI RS 5',
]

type Print = { id: number; n: number; r: number; x: number; y: number }

export function ShutterPlay() {
  const [prints, setPrints] = useState<Print[]>([])
  const [shots, setShots] = useState(0)
  const [firing, setFiring] = useState(false)
  const order = useRef<number[]>([])
  const id = useRef(0)

  const nextPhoto = () => {
    if (!order.current.length) {
      // A fresh shuffle each roll, so a print does not repeat until all 50 are out.
      order.current = Array.from({ length: COUNT }, (_, i) => i).sort(() => Math.random() - 0.5)
    }
    return order.current.pop()!
  }

  const shoot = () => {
    if (firing) return
    setFiring(true)
    window.setTimeout(() => setFiring(false), 260)
    setShots((s) => s + 1)
    const p = {
      id: id.current++,
      n: nextPhoto(),
      r: Math.random() * 24 - 12,
      x: Math.random() * 40 - 20,
      y: Math.random() * 24 - 12,
    }
    setPrints((all) => [...all.slice(-5), p])
  }

  return (
    <div className="play-card not-prose">
      <p className="play-kicker">Play · take a picture</p>
      <div className="grid gap-6 sm:grid-cols-2 items-center">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={shoot}
            className={`shutter-cam ${firing ? 'is-firing' : ''}`}
            aria-label="Press the shutter to see one of my photographs"
          >
            <svg viewBox="0 0 220 150" aria-hidden="true">
              {/* body, grip, hot shoe and the shutter button */}
              <rect x="70" y="14" width="60" height="22" fill="#2b2b2b" stroke="#111" strokeWidth="4" />
              <rect x="34" y="18" width="26" height="12" fill="#d62828" stroke="#111" strokeWidth="4" className="shutter-btn" />
              <rect x="10" y="30" width="200" height="110" rx="6" fill="#1c1c1c" stroke="#111" strokeWidth="5" />
              <rect x="10" y="30" width="44" height="110" rx="6" fill="#2b2b2b" stroke="#111" strokeWidth="5" />
              <rect x="10" y="62" width="200" height="8" fill="#333" />
              {/* lens */}
              <circle cx="122" cy="88" r="46" fill="#2b2b2b" stroke="#111" strokeWidth="5" />
              <circle cx="122" cy="88" r="34" fill="#0d0d0d" stroke="#555" strokeWidth="3" />
              <g className="shutter-iris">
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <path key={a} d="M122,88 L122,54 A34,34 0 0 1 151.4,71 Z" fill="#3a3a3a" stroke="#111" strokeWidth="1.5" transform={`rotate(${a} 122 88)`} />
                ))}
              </g>
              <circle cx="122" cy="88" r="14" fill="#1d2a36" className="shutter-glass" />
              <circle cx="116" cy="82" r="4" fill="#fff" opacity="0.6" />
              <circle cx="190" cy="44" r="5" fill="#ffd23f" stroke="#111" strokeWidth="2" />
            </svg>
            <span className="shutter-flash" aria-hidden="true" />
          </button>
          <span className="font-mono text-xs text-muted" aria-live="polite">
            {shots === 0 ? 'Press the camera.' : `${shots} ${shots === 1 ? 'shot' : 'shots'} · ${Math.min(shots, COUNT)} of my photos seen`}
          </span>
        </div>

        <div className="print-pile" aria-hidden="true">
          {prints.length === 0 && <span className="print-empty">Your prints land here.</span>}
          {prints.map((p) => (
            <span
              key={p.id}
              className="print"
              style={{ '--r': `${p.r}deg`, '--x': `${p.x}px`, '--y': `${p.y}px` } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/vision/v${String(p.n).padStart(2, '0')}.jpg`} alt="" width={180} height={189} />
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">In my bag</p>
        <ul className="flex flex-wrap gap-2">
          {BAG.map((g) => (
            <li key={g} className="play-chip">{g}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
