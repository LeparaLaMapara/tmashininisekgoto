'use client'

import { useEffect, useRef, useState } from 'react'
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

/** How far inside the viewport an element must come before it counts as seen. */
const VIEWPORT_MARGIN = 80

/**
 * `pending` is the server render and the first client frame, where content is
 * always visible. After that the observer decides, once, and only ever moves
 * an element in one direction: to `shown`, which is final.
 */
type RevealState = 'pending' | 'hidden' | 'shown'

/**
 * Fades content in when it scrolls into view.
 *
 * Two things this has to get right, both learned the hard way.
 *
 * 1. It renders VISIBLE on the server, so crawlers and readers without
 *    JavaScript see the content rather than blank space where a scroll was
 *    expected.
 *
 * 2. Exactly one mechanism decides visibility. An earlier version ran two:
 *    an `animate` prop flipped by an effect, and `whileInView` flipped by an
 *    IntersectionObserver with `once: true`. Which one landed first depended on
 *    how the page was reached. On a hard load the effect went first and the
 *    observer revealed the content afterwards. On a client-side navigation the
 *    order reversed: the observer fired while the element was still visible and
 *    unobserved it immediately, so when the effect then flipped `animate` to
 *    hidden, nothing was left watching to undo it. Every heading on the page sat
 *    at opacity 0 until the visitor reloaded.
 *
 * Now the observer is the only authority. Its first callback runs after layout,
 * so it also judges position more accurately than a measurement taken at mount,
 * before images and fonts have settled.
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

  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<RevealState>('pending')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Seen. This is terminal: nothing hides it again.
          setState('shown')
          observer.disconnect()
        } else {
          setState('hidden')
        }
      },
      { rootMargin: `-${VIEWPORT_MARGIN}px` }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (reducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const variants: Variants = {
    // Snap, do not animate, into the hidden state. This only ever runs for
    // off-screen content, and animating it would mean a pointless fade-out on
    // anything sitting just past the fold.
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
      ref={ref}
      // `initial={false}` keeps framer-motion from painting a hidden first
      // frame; the element starts wherever `animate` points, which is visible.
      initial={false}
      animate={state === 'hidden' ? 'hidden' : 'visible'}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
