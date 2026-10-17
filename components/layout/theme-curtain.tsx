'use client'

import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'

/**
 * What you see for under a second while the theme changes.
 *
 *   into ThabangVision   a camera aperture: six blades close, the street goes
 *                        dark behind them, and they open on the photographs
 *   into Sosha Plata Jo  the taxi's livery stripes sweep across like a minibus
 *                        going past, and the painted street is there after it
 *
 * `onCovered` fires when the screen is fully covered, which is when the theme
 * actually switches, so the change itself is never seen. `onDone` removes it.
 */
type Props = { to: 'light' | 'dark'; phase: 'cover' | 'reveal'; onCovered: () => void; onDone: () => void }

const BLADES = [0, 1, 2, 3, 4, 5]

function Aperture({ phase, onCovered, onDone }: Omit<Props, 'to'>) {
  const closed = phase === 'cover'
  return (
    <div className="theme-curtain" aria-hidden="true">
      {BLADES.map((i) => (
        <motion.div
          key={i}
          className="aperture-blade"
          style={{ originX: 0, originY: 0.5 }}
          // Rotate first, then slide out along the blade's own axis.
          transformTemplate={({ rotate, x }) => `rotate(${typeof rotate === 'number' ? `${rotate}deg` : rotate}) translateX(${x})`}
          initial={{ rotate: i * 60 - 30, x: '75vmax' }}
          animate={closed ? { rotate: i * 60, x: '0vmax' } : { rotate: i * 60 + 30, x: '75vmax' }}
          transition={{ duration: closed ? 0.38 : 0.45, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => {
            if (i !== 0) return
            if (closed) onCovered()
            else onDone()
          }}
        />
      ))}
    </div>
  )
}

const STRIPES = ['#e03a1e', '#1f6fd6', '#f0b400']

function Livery({ phase, onCovered, onDone }: Omit<Props, 'to'>) {
  const cover = phase === 'cover'
  return (
    <div className="theme-curtain" aria-hidden="true">
      {STRIPES.map((c, i) => (
        <motion.div
          key={c}
          className="livery-band"
          style={{ background: c, top: `${i * 34 - 2}%` }}
          initial={{ x: '-120%' }}
          animate={{ x: cover ? '0%' : '120%' }}
          transition={{ duration: cover ? 0.32 : 0.4, delay: i * 0.06, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => {
            if (i !== STRIPES.length - 1) return
            if (cover) onCovered()
            else onDone()
          }}
        />
      ))}
    </div>
  )
}

export function ThemeCurtain(props: Props) {
  const { to, ...rest } = props
  return createPortal(to === 'dark' ? <Aperture {...rest} /> : <Livery {...rest} />, document.body)
}
