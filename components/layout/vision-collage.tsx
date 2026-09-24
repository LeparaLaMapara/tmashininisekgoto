'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * The ThabangVision theme: Thabang's own photographs as a very small collage
 * behind every page, in black and white, with one of his orange or yellow
 * frames burning back into colour every few seconds (his selective colour
 * editing). It sits behind everything and changes no text, font or layout.
 *
 * Only mounted in ThabangVision (the dark theme), so the light Sosha Plata Jo
 * theme never downloads a single photo. The tiles were cut from his Instagram
 * (thabanglukhetho); photos with brand logos, crowds and protest scenes were
 * left out on purpose.
 */
const COUNT = 50
/** Frames whose colour is the point: sunsets, the sodium yellow, the Wits banners in snow. */
const POP = [7, 9, 36, 37, 38, 39, 46, 47]
const TILE = 48

export function VisionCollage() {
  const { resolvedTheme } = useTheme()
  const [cells, setCells] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const on = resolvedTheme === 'dark'

  useEffect(() => {
    if (!on) return
    const fit = () => {
      const cols = Math.ceil(window.innerWidth / (TILE + 3))
      const rows = Math.ceil(window.innerHeight / (TILE * 1.25 + 3))
      setCells(cols * rows)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [on])

  useEffect(() => {
    if (!on || !cells || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      const pops = ref.current?.querySelectorAll<HTMLElement>('[data-pop]')
      if (!pops?.length) return
      const tile = pops[Math.floor(Math.random() * pops.length)]
      tile.classList.add('lit')
      window.setTimeout(() => tile.classList.remove('lit'), 4200)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [on, cells])

  if (!on || !cells) return null

  return (
    <>
      <div className="vision-veil" aria-hidden="true" />
      <div ref={ref} className="vision-collage" aria-hidden="true">
        {Array.from({ length: cells }, (_, i) => {
          // A fixed scramble, so neighbouring tiles are rarely the same photo.
          const n = (i * 17 + Math.floor(i / 7) * 5) % COUNT
          return (
            <i
              key={i}
              data-pop={POP.includes(n) ? '' : undefined}
              style={{ backgroundImage: `url(/vision/v${String(n).padStart(2, '0')}.jpg)` }}
            />
          )
        })}
      </div>
    </>
  )
}
