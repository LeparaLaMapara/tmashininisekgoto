'use client'

import { useRef, useState } from 'react'

/**
 * "My grandfather called me Why." A button that asks why, and keeps count.
 * Each press lets a small "why?" float up and away. Nothing on the page
 * depends on it; it is a toy.
 */
const LINES = [
  'Go on, ask.',
  'That is how it starts.',
  'Now you are getting it.',
  'Most people stop here.',
  'My grandfather would have a name for you.',
]

type Bubble = { id: number; x: number; r: number }

export function WhyButton() {
  const [count, setCount] = useState(0)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const id = useRef(0)

  const ask = () => {
    setCount((c) => c + 1)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const b = { id: id.current++, x: Math.random() * 140 - 70, r: Math.random() * 30 - 15 }
    setBubbles((all) => [...all.slice(-8), b])
    window.setTimeout(() => setBubbles((all) => all.filter((x) => x.id !== b.id)), 1600)
  }

  const line = count < LINES.length ? LINES[count] : `You have asked why ${count} times. Welcome to the family.`

  return (
    <div className="why-play not-prose mt-6 flex flex-wrap items-center gap-4">
      <span className="relative inline-block">
        <button type="button" onClick={ask} className="btn-sign font-sign text-lg uppercase">
          Why?
        </button>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {bubbles.map((b) => (
            <span key={b.id} className="why-bubble" style={{ '--x': `${b.x}px`, '--r': `${b.r}deg` } as React.CSSProperties}>
              why?
            </span>
          ))}
        </span>
      </span>
      <span className="font-mono text-sm text-muted" aria-live="polite">
        {line}
      </span>
    </div>
  )
}
