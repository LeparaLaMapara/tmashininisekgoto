'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Fades page content in on route changes.
 *
 * This wraps EVERY route, so `initial={{ opacity: 0 }}` meant the served HTML
 * for every page on the site had its entire body invisible until framer-motion
 * hydrated: the worst possible starting point for LCP, and a blank page to
 * anything that reads the markup without executing JavaScript.
 *
 * The transition only ever mattered for client-side navigation, so that is the
 * only place it runs now. The first page a visitor loads renders visible and
 * paints immediately; every navigation after that still fades.
 */

// Module scope, so it survives route changes but is fresh per server request.
let hasNavigated = false

export default function Template({ children }: { children: React.ReactNode }) {
  // True for the first render of a session, i.e. the server-rendered page and
  // its hydration. False for every client-side navigation after that.
  const [isFirstRender] = useState(() => !hasNavigated)

  useEffect(() => {
    hasNavigated = true
  }, [])

  return (
    <motion.div
      initial={isFirstRender ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
