'use client'

import { useEffect, useState } from 'react'

/**
 * A slim progress bar showing how far through the article the reader is.
 *
 * Driven by scroll position over the document height, updated inside
 * requestAnimationFrame so it never blocks the scroll. It animates `transform:
 * scaleX` only, which the compositor handles off the main thread and which
 * causes no layout shift, so it costs nothing on CLS or INP. Respects
 * prefers-reduced-motion by dropping the width transition.
 *
 * Fixed to the top of the viewport, above the content, so it is visible at rest
 * without waiting on an observer.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(1, Math.max(0, pct)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full origin-left bg-synapse motion-safe:transition-transform motion-safe:duration-100"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
