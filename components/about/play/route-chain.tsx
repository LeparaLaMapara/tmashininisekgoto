'use client'

import { useEffect, useRef } from 'react'

/**
 * A small chain of steps, read left to right. When it comes on screen the
 * steps light up one after another, like stops on a route; tap it to run it
 * again. Every step is visible at rest: the light is extra, never a reveal.
 */
export function RouteChain({ steps, label }: { steps: string[]; label: string }) {
  const ref = useRef<HTMLOListElement>(null)

  const run = () => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.remove('is-running')
    void el.getBoundingClientRect()
    el.classList.add('is-running')
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.8 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <ol ref={ref} aria-label={label} onClick={run} className="route-chain flex flex-wrap items-center gap-x-2 gap-y-2 not-prose">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2" style={{ '--i': i } as React.CSSProperties}>
          <span className="about-chip rounded-sm border-2 border-ivory px-2.5 py-0.5 font-mono text-sm text-ivory">{s}</span>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="route-arrow text-muted">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
