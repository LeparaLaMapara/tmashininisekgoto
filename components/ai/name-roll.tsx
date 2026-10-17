'use client'

import { useEffect, useState } from 'react'

/**
 * The assistant's name, rolling in once like the destination on the dot board:
 * each letter spins through the alphabet and settles, left to right. The
 * server renders the plain name, and with motion turned off it never moves.
 */
const NAME = 'LeparaLaMapara'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const FRAME_MS = 40

export function NameRoll() {
  const [text, setText] = useState(NAME)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const timer = window.setInterval(() => {
      frame++
      let out = ''
      for (let i = 0; i < NAME.length; i++) {
        const settle = 4 + i * 2
        out += frame >= settle ? NAME[i] : GLYPHS[(frame * 11 + i * 7) % GLYPHS.length]
      }
      setText(out)
      if (frame >= 4 + NAME.length * 2) window.clearInterval(timer)
    }, FRAME_MS)
    return () => window.clearInterval(timer)
  }, [])

  // The settled name reserves its own width (CSS ::before from data-name), so
  // the heading does not shuffle sideways while letters roll.
  return (
    <span className="name-roll" data-name={NAME}>
      <span>{text}</span>
    </span>
  )
}
