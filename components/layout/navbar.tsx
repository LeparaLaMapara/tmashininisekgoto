'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/theme-toggle'

// Five items, trimmed on 2026-09-24 so the bar stops listing everything at once.
// Publications became a section of /research; Talks, Topics, Teaching and the
// rest stay reachable from the footer and the search palette.
const NAV_LINKS = [
  { href: '/blog', label: 'Writing' },
  { href: '/work', label: 'Work' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'CV' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-void border-b-4 border-ivory transition-shadow duration-300',
        scrolled && 'shadow-[0_4px_0_rgba(0,0,0,0.06)]'
      )}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group font-sign text-xl sm:text-2xl tracking-wide text-ivory"
        >
          Thabang<span className="text-synapse group-hover:text-signal transition-colors duration-300">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3.5 py-2.5 text-[0.9375rem] font-semibold transition-colors',
                  isActive
                    ? 'text-ivory'
                    : 'text-muted hover:text-ivory'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2.5 right-2.5 h-1 bg-synapse"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}

          {/* The assistant, as a quiet link rather than a button. */}
          <Link
            href="/ai"
            className={cn(
              'ml-2 mr-1 px-3.5 py-2.5 text-[0.9375rem] font-medium transition-colors',
              pathname === '/ai' ? 'text-ivory' : 'text-muted hover:text-ivory'
            )}
          >
            Ask my AI
          </Link>

          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-ivory hover:text-synapse transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-void border-t-2 border-ivory overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 text-base font-semibold transition-colors',
                      isActive
                        ? 'text-ivory bg-surface-hover border-l-4 border-synapse'
                        : 'text-muted hover:text-ivory'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/ai"
                className="px-4 py-3 text-base font-medium text-muted hover:text-ivory transition-colors"
              >
                Ask my AI
              </Link>
              <div className="mt-3 flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
