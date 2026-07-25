'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
}

const directionOffsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
}

/**
 * Fades content in when it scrolls into view.
 *
 * Important: this renders VISIBLE on the server and hides itself only after
 * hydration. It used to server-render `opacity: 0` and wait for a scroll, which
 * meant any renderer that never scrolls saw blank space where the content
 * should be. On the homepage that hid the entire "Real impact, real numbers"
 * section and the Wits/Ubunye intro, so the markup carried the text but nothing
 * that rendered the page without scrolling could see it.
 *
 * The sequence is now:
 *   server / no JS  -> visible (content is always readable)
 *   after hydration -> anything off-screen snaps to hidden (no transition)
 *   on scroll in    -> fades up into view as before
 *
 * Users see the same animation; crawlers and no-JS readers see the content.
 */
export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
}: ScrollRevealProps) {
  const offset = directionOffsets[direction]
  const reducedMotion = useReducedMotion()

  // False during SSR and the first client render, so the initial HTML is visible.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (reducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const variants: Variants = {
    // Snap, do not animate, into the hidden state. This only ever runs for
    // off-screen content just after hydration, and animating it would show a
    // pointless fade-out on anything sitting near the fold.
    hidden: { opacity: 0, ...offset, transition: { duration: 0 } },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      // `initial={false}` keeps framer-motion from painting a hidden first
      // frame; the element starts wherever `animate` points, which is visible.
      initial={false}
      animate={hydrated ? 'hidden' : 'visible'}
      // whileInView outranks animate, so on-screen content stays/becomes visible.
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
