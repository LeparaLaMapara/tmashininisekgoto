'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The destination on the amber dot board, changing the way a real taxi board
 * does: every letter rolls through the alphabet and settles, left to right.
 *
 * The server renders the first destination, so crawlers, link previews and
 * people who turned motion off all see "PRODUCTION". The board pauses while it
 * is off screen or the tab is hidden.
 */
const DESTINATIONS = ['PRODUCTION', 'RESEARCH', 'OPEN SOURCE', 'CLASSROOM', 'THE CLOUD']
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const HOLD_MS = 5200
const FRAME_MS = 45

export function BoardDestination() {
  const [text, setText] = useState(DESTINATIONS[0])
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let index = 0
    let visible = true
    let roll: number | undefined
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    if (ref.current) io.observe(ref.current)

    const next = () => {
      if (!visible || document.hidden) return
      const from = DESTINATIONS[index]
      index = (index + 1) % DESTINATIONS.length
      const to = DESTINATIONS[index]
      const width = Math.max(from.length, to.length)
      let frame = 0
      window.clearInterval(roll)
      roll = window.setInterval(() => {
        frame++
        let out = ''
        for (let i = 0; i < width; i++) {
          // Each letter settles a little after the one before it.
          const settle = 6 + i * 2
          const target = to[i] ?? ' '
          if (frame >= settle || target === ' ') out += target
          else out += GLYPHS[(frame * 7 + i * 13) % GLYPHS.length]
        }
        setText(out.trimEnd())
        if (frame >= 6 + width * 2) window.clearInterval(roll)
      }, FRAME_MS)
    }

    const timer = window.setInterval(next, HOLD_MS)
    return () => {
      window.clearInterval(timer)
      window.clearInterval(roll)
      io.disconnect()
    }
  }, [])

  return (
    <span ref={ref} className="board-dest">
      {text}
    </span>
  )
}
