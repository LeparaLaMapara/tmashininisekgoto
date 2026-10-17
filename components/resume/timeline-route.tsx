'use client'

import { useEffect, useRef } from 'react'

/**
 * The CV timeline as a road. A minibus drives down the line as you scroll, the
 * road paints yellow behind it, and each stop lights up once the taxi reaches
 * it. Every stop is fully visible at rest; the light is extra. With motion
 * turned off the taxi parks at the top and nothing moves.
 */
export function TimelineRoute({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('is-live')
    let raf = 0
    const update = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      // The taxi sits at 60% of the screen height, travelling with the reader.
      const eye = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (eye - box.top) / box.height))
      el.style.setProperty('--p', p.toFixed(4))
      const at = box.top + p * box.height
      el.querySelectorAll<HTMLElement>('[data-stop]').forEach((stop) => {
        const r = stop.getBoundingClientRect()
        stop.classList.toggle('is-passed', r.top + r.height / 2 <= at + 2)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className="timeline-route relative">
      <div className="timeline-road absolute left-[19px] top-0 bottom-0 w-px bg-border" aria-hidden="true">
        <div className="timeline-paint" />
      </div>
      <svg className="timeline-taxi" viewBox="0 0 28 40" aria-hidden="true">
        {/* A minibus seen from above, nose down the road. */}
        <rect x="3" y="2" width="22" height="36" rx="5" fill="#f2efe6" stroke="#111" strokeWidth="2" />
        <rect x="6" y="28" width="16" height="7" rx="2" fill="#2b3a4a" />
        <rect x="6" y="6" width="16" height="4" rx="1.5" fill="#2b3a4a" />
        <rect x="3" y="15" width="22" height="3" fill="#e03a1e" />
        <rect x="3" y="18" width="22" height="3" fill="#1f6fd6" />
        <rect x="3" y="21" width="22" height="3" fill="#f0b400" />
      </svg>
      {children}
    </div>
  )
}
