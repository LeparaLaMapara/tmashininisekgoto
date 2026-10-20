'use client'

import { useEffect, useState, type ReactNode, type RefObject } from 'react'

/**
 * Pieces shared by the figures in the towers post. Every figure is readable at
 * rest: with motion turned off it shows one honest still frame, and the
 * animations only run while the figure is on screen.
 */

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(q.matches)
    const on = () => setReduced(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return reduced
}

export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return inView
}

export function Figure({ label, caption, children }: { label: string; caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="not-prose my-10 rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">{label}</div>
      {children}
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  )
}

export function FigButton({ onClick, children, active }: { onClick: () => void; children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-sm border px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
        active ? 'border-synapse bg-synapse text-void' : 'border-border text-ivory hover:bg-surface-hover'
      }`}
    >
      {children}
    </button>
  )
}

/** A lattice mast, drawn around (0, 0) with its base on y = 12. */
export function Mast({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return (
    <g stroke={color} strokeWidth={2} fill="none" opacity={opacity} strokeLinejoin="round">
      <path d="M0 -16 L-8 12 M0 -16 L8 12 M-5 1 L5 1 M-6.5 6.5 L6.5 6.5 M-3.5 -5 L3.5 -5" />
      <circle cx={0} cy={-18} r={2.6} fill={color} />
    </g>
  )
}

export const C = {
  up: 'var(--color-signal)',
  // A fixed red: the dark theme's accent is orange, and the prose says red.
  down: '#e03131',
  dark: 'var(--color-muted)',
  ink: 'var(--color-ivory)',
  muted: 'var(--color-muted)',
  sun: 'var(--color-accent)',
  border: 'var(--color-border)',
}

export const MONO = { fontFamily: 'var(--font-mono)' }
