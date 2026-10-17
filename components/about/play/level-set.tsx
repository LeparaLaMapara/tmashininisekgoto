'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * His MSc, live: a curve finding the shape in one of his photographs.
 *
 * The MSc (2020) taught echo state networks to predict how a level set curve
 * evolves across an image. This is the classic method those networks learned
 * from, the Chan and Vese model, run here with a threshold scheme (MBO) that is
 * stable in a few lines: blur the region, add the image force, threshold.
 * Updates are kept to a band around the current edge, so the curve grows and
 * shrinks like a front instead of jumping.
 *
 * Tap the photo to drop a new curve. It only runs while on screen. With motion
 * turned off it jumps straight to the settled result.
 */
const PHOTOS = [
  { src: '/vision/v05.jpg', label: 'the Union Buildings' },
  { src: '/vision/v15.jpg', label: 'a lighthouse' },
  { src: '/vision/v36.jpg', label: 'a silhouette in yellow' },
  { src: '/vision/v27.jpg', label: 'a balancing rock' },
]
const LAMBDA = 3
const STEP_MS = 70

function blur(src: Float32Array, w: number, h: number, tmp: Float32Array, out: Float32Array) {
  // Two passes of a radius 2 box blur, close enough to a Gaussian here.
  const r = 2
  const n = 2 * r + 1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0
      for (let k = -r; k <= r; k++) s += src[y * w + Math.min(w - 1, Math.max(0, x + k))]
      tmp[y * w + x] = s / n
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0
      for (let k = -r; k <= r; k++) s += tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x]
      out[y * w + x] = s / n
    }
  }
}

export function LevelSetPlay() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef<{
    w: number
    h: number
    img: Float32Array
    rgb: Uint8ClampedArray
    u: Float32Array
    tmp: Float32Array
    b: Float32Array
    steps: number
    still: number
  } | null>(null)
  const [photo, setPhoto] = useState(0)
  const [steps, setSteps] = useState(0)
  const [settled, setSettled] = useState(false)

  /** A new curve: a big circle to start with (the classic set up), smaller where you tap. */
  const seed = (cx: number, cy: number, big = false) => {
    const s = state.current
    if (!s) return
    const r = Math.round(Math.min(s.w, s.h) * (big ? 0.4 : 0.16))
    for (let y = 0; y < s.h; y++)
      for (let x = 0; x < s.w; x++) s.u[y * s.w + x] = (x - cx) ** 2 + (y - cy) ** 2 < r * r ? 1 : 0
    s.steps = 0
    s.still = 0
    setSteps(0)
    setSettled(false)
  }

  /** One step of the scheme. Returns how many pixels changed. */
  const step = () => {
    const s = state.current!
    const { w, h, img, u, tmp, b } = s
    let in1 = 0, n1 = 0, in2 = 0, n2 = 0
    for (let i = 0; i < u.length; i++) {
      if (u[i] > 0.5) { in1 += img[i]; n1++ } else { in2 += img[i]; n2++ }
    }
    const c1 = n1 ? in1 / n1 : 0
    const c2 = n2 ? in2 / n2 : 1
    blur(u, w, h, tmp, b)
    let changed = 0
    for (let i = 0; i < u.length; i++) {
      // Only pixels near the edge may change: the front moves, it does not teleport.
      if (b[i] < 0.02 || b[i] > 0.98) continue
      const force = (img[i] - c2) ** 2 - (img[i] - c1) ** 2
      const next = b[i] - 0.5 + LAMBDA * force > 0 ? 1 : 0
      if (next !== u[i]) { u[i] = next; changed++ }
    }
    s.steps++
    return changed
  }

  const draw = () => {
    const s = state.current
    const c = canvas.current
    if (!s || !c) return
    const ctx = c.getContext('2d')!
    const out = ctx.createImageData(s.w, s.h)
    const { w, h, u, rgb } = s
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        const g = s.img[i] * 255
        const inside = u[i] > 0.5
        const edge =
          inside &&
          (x === 0 || y === 0 || x === w - 1 || y === h - 1 || !(u[i - 1] && u[i + 1] && u[i - w] && u[i + w]))
        const o = i * 4
        if (edge) {
          out.data[o] = 255; out.data[o + 1] = 210; out.data[o + 2] = 63
        } else if (inside) {
          // Inside the curve, the photo comes back in its own colour.
          out.data[o] = rgb[o]; out.data[o + 1] = rgb[o + 1]; out.data[o + 2] = rgb[o + 2]
        } else {
          out.data[o] = g * 0.55; out.data[o + 1] = g * 0.55; out.data[o + 2] = g * 0.6
        }
        out.data[o + 3] = 255
      }
    }
    ctx.putImageData(out, 0, 0)
  }

  // Load the photo into grey levels and seed a curve in the middle.
  useEffect(() => {
    let cancelled = false
    const im = new Image()
    im.src = PHOTOS[photo].src
    im.onload = () => {
      if (cancelled || !canvas.current) return
      const w = im.naturalWidth
      const h = im.naturalHeight
      canvas.current.width = w
      canvas.current.height = h
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d')!
      octx.drawImage(im, 0, 0)
      const rgb = octx.getImageData(0, 0, w, h).data
      const img = new Float32Array(w * h)
      for (let i = 0; i < w * h; i++) img[i] = (0.299 * rgb[i * 4] + 0.587 * rgb[i * 4 + 1] + 0.114 * rgb[i * 4 + 2]) / 255
      state.current = {
        w, h, img, rgb,
        u: new Float32Array(w * h),
        tmp: new Float32Array(w * h),
        b: new Float32Array(w * h),
        steps: 0,
        still: 0,
      }
      seed(w / 2, h / 2, true)
      draw()
    }
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo])

  // Run while on screen.
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(c)
    const timer = window.setInterval(() => {
      const s = state.current
      if (!s || !visible || document.hidden || s.still > 3) return
      const rounds = reduced ? 400 : 1
      for (let k = 0; k < rounds && s.still <= 3; k++) {
        const changed = step()
        s.still = changed === 0 ? s.still + 1 : 0
        if (s.steps > 600) s.still = 4
      }
      draw()
      setSteps(s.steps)
      if (s.still > 3) setSettled(true)
    }, STEP_MS)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = state.current
    if (!s) return
    const rect = e.currentTarget.getBoundingClientRect()
    seed(((e.clientX - rect.left) / rect.width) * s.w, ((e.clientY - rect.top) / rect.height) * s.h)
    draw()
  }

  return (
    <figure className="play-card not-prose">
      <p className="play-kicker">Play · my MSc in your browser</p>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,240px)_1fr] items-start">
        <canvas
          ref={canvas}
          onPointerDown={onTap}
          className="w-full cursor-crosshair border-[3px] border-ivory [image-rendering:pixelated] touch-manipulation"
          role="img"
          aria-label={`A curve growing to find the shape in my photograph of ${PHOTOS[photo].label}`}
        />
        <figcaption className="space-y-3 text-base text-ivory/85 leading-relaxed">
          <p>
            My MSc taught neural networks to predict how a curve like this moves across a picture until
            it wraps around a shape. This is the classic method they learned from (Chan and Vese),
            running on one of my photographs, right here in your browser.
          </p>
          <p className="font-semibold text-ivory">Tap the photo to drop a new curve.</p>
          <div className="flex flex-wrap gap-2">
            {PHOTOS.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setPhoto(i)}
                aria-pressed={photo === i}
                className={`play-chip ${photo === i ? 'is-on' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-muted" aria-live="polite">
            step {steps}
            {settled ? ' · settled' : ''} ·{' '}
            <a
              href="https://github.com/LeparaLaMapara/esn-levelset-study"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              the code, and my 2026 rerun of the MSc
            </a>
          </p>
        </figcaption>
      </div>
    </figure>
  )
}
