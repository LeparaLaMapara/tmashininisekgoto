'use client'

import { useEffect, useRef } from 'react'

/**
 * The banner on /research: level sets of a surface that keeps moving.
 *
 * A few soft hills drift across the strip, and the canvas draws the lines where
 * their height is equal (marching squares), like contours on a map. A level set
 * is exactly that line, and it is what the MSc was about. Pure decoration, so
 * it is hidden from screen readers. It pauses off screen and in hidden tabs,
 * and with motion turned off it draws one still frame.
 */
const COLS = 96
const ROWS = 28
const LEVELS = [0.35, 0.6, 0.9, 1.25, 1.65, 2.1]

const HILLS = [
  { x: 0.12, y: 0.5, r: 0.15, sx: 0.11, sy: 0.17, p: 0 },
  { x: 0.38, y: 0.4, r: 0.18, sx: 0.08, sy: 0.13, p: 1.7 },
  { x: 0.62, y: 0.6, r: 0.14, sx: 0.14, sy: 0.19, p: 3.1 },
  { x: 0.86, y: 0.35, r: 0.16, sx: 0.09, sy: 0.15, p: 4.4 },
]

export function LevelLines() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const field = new Float32Array((COLS + 1) * (ROWS + 1))
    let visible = true
    let raf = 0

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = c.clientWidth * dpr
      c.height = c.clientHeight * dpr
    }

    const draw = (t: number) => {
      const w = c.width
      const h = c.height
      const aspect = w / h
      for (let j = 0; j <= ROWS; j++) {
        for (let i = 0; i <= COLS; i++) {
          const x = i / COLS
          const y = j / ROWS
          let v = 0
          for (const hl of HILLS) {
            const hx = hl.x + 0.12 * Math.sin(t * hl.sx + hl.p)
            const hy = hl.y + 0.25 * Math.cos(t * hl.sy + hl.p)
            const dx = (x - hx) * Math.min(aspect, 4) * 0.34
            const dy = (y - hy) * 0.6
            v += Math.exp(-(dx * dx + dy * dy) / (hl.r * hl.r))
          }
          field[j * (COLS + 1) + i] = v * 2.4
        }
      }
      const style = getComputedStyle(c)
      const ink = style.getPropertyValue('--line').trim() || '#ffd23f'
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = ink
      ctx.lineCap = 'round'
      const cw = w / COLS
      const ch = h / ROWS
      LEVELS.forEach((level, li) => {
        ctx.globalAlpha = 0.35 + 0.15 * li
        ctx.lineWidth = (li === LEVELS.length - 1 ? 2.4 : 1.4) * (w / c.clientWidth)
        ctx.beginPath()
        for (let j = 0; j < ROWS; j++) {
          for (let i = 0; i < COLS; i++) {
            const a = field[j * (COLS + 1) + i]
            const b = field[j * (COLS + 1) + i + 1]
            const d = field[(j + 1) * (COLS + 1) + i]
            const e = field[(j + 1) * (COLS + 1) + i + 1]
            // Where the level crosses each edge of the cell, by straight interpolation.
            const pts: [number, number][] = []
            const cross = (p: number, q: number, x0: number, y0: number, x1: number, y1: number) => {
              if (p < level === q < level) return
              const f = (level - p) / (q - p)
              pts.push([(x0 + (x1 - x0) * f) * cw, (y0 + (y1 - y0) * f) * ch])
            }
            cross(a, b, i, j, i + 1, j)
            cross(b, e, i + 1, j, i + 1, j + 1)
            cross(d, e, i, j + 1, i + 1, j + 1)
            cross(a, d, i, j, i, j + 1)
            for (let k = 0; k + 1 < pts.length; k += 2) {
              ctx.moveTo(pts[k][0], pts[k][1])
              ctx.lineTo(pts[k + 1][0], pts[k + 1][1])
            }
          }
        }
        ctx.stroke()
      })
      ctx.globalAlpha = 1
    }

    const start = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      draw((now - start) / 450)
    }

    fit()
    draw(8)
    const ro = new ResizeObserver(() => {
      fit()
      draw(reduced ? 8 : (performance.now() - start) / 450)
    })
    ro.observe(c)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(c)
    if (!reduced) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="level-lines" />
}
