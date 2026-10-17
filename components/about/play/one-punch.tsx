'use client'

import { useState } from 'react'

/**
 * "Sometimes a man just punches things very hard, and that is enough."
 * One button. The section shakes, a hand drawn burst goes off. Original
 * drawing, no characters or logos from any show.
 */
export function OnePunch() {
  const [hits, setHits] = useState(0)
  const [boom, setBoom] = useState(0)

  const punch = (e: React.MouseEvent<HTMLButtonElement>) => {
    setHits((h) => h + 1)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setBoom((b) => b + 1)
    const section = e.currentTarget.closest('section')
    section?.classList.remove('is-punched')
    // Force a reflow so the shake can play again on every press.
    void section?.getBoundingClientRect()
    section?.classList.add('is-punched')
  }

  return (
    <div className="not-prose mt-6 flex flex-wrap items-center gap-4">
      <span className="relative inline-block">
        <button type="button" onClick={punch} className="btn-sign font-sign uppercase">
          One punch
        </button>
        {boom > 0 && (
          <svg key={boom} className="punch-burst" viewBox="0 0 120 120" aria-hidden="true">
            <polygon
              points="60,2 70,38 104,16 82,48 118,58 82,70 104,104 68,82 60,118 50,82 16,104 38,70 2,58 38,48 16,16 50,38"
              fill="#ffd23f"
              stroke="#111"
              strokeWidth="4"
            />
            <polygon points="60,30 66,50 86,44 72,60 86,76 66,70 60,90 54,70 34,76 48,60 34,44 54,50" fill="#d62828" stroke="#111" strokeWidth="3" />
          </svg>
        )}
      </span>
      <span className="font-mono text-sm text-muted" aria-live="polite">
        {hits === 0 ? 'Only needs one.' : hits === 1 ? 'One punch. Done.' : `${hits} punches. It only needed one.`}
      </span>
    </div>
  )
}
