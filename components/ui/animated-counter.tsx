'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion, animate } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * Counts up to `end` when scrolled into view.
 *
 * The initial state is the FINAL value, not zero. This component renders on the
 * server, and starting at zero meant the served HTML said "R0+" and "0%" while
 * the real figures only ever existed after hydration: invisible to anything
 * reading the HTML, and a flash of wrong numbers for everyone else. Now the
 * truth ships in the markup and the animation is layered on top, which also
 * means reduced-motion users and non-JS readers simply see the number.
 */
export function AnimatedCounter({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(`${prefix}${end}${suffix}`)

  useEffect(() => {
    if (!isInView || reducedMotion) return

    // Rewind to zero and count up, but only once we know JS is driving.
    const controls = animate(0, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        setDisplay(`${prefix}${Math.round(value)}${suffix}`)
      },
      onComplete: () => {
        setDisplay(`${prefix}${end}${suffix}`)
      },
    })

    return () => controls.stop()
  }, [isInView, reducedMotion, end, duration, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
