'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks whether the app has finished its first render. Module scope, so it
 * survives re-renders and route changes but starts fresh per server request.
 */
let appHasHydrated = false

/**
 * Should this component play its enter animation?
 *
 * `false` for the server-rendered tree and its hydration, `true` for anything
 * that mounts later (a filter change, a route change, an item appearing).
 *
 * Framer Motion's `initial={{ opacity: 0 }}` is server-rendered as inline
 * `opacity: 0`, so an enter animation on content that exists at page load ships
 * markup nobody can see until JavaScript runs. Gate `initial` on this hook and
 * the content renders visible on first paint while client-driven mounts keep
 * animating:
 *
 *     const animateIn = useEnterAnimation()
 *     <motion.div initial={animateIn ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} />
 */
export function useEnterAnimation(): boolean {
  const [animateIn] = useState(() => appHasHydrated)

  useEffect(() => {
    appHasHydrated = true
  }, [])

  return animateIn
}
