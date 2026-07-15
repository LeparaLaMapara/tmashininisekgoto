'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/theme-toggle'

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/blog', label: 'Blog' },
  { href: '/publications', label: 'Publications' },
  { href: '/talks', label: 'Talks' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass shadow-lg shadow-void/50'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          href="/"
          className="group font-display text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-ivory"
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
                  'relative px-4 py-2.5 text-[0.9375rem] font-medium transition-colors rounded-lg',
                  isActive
                    ? 'text-synapse'
                    : 'text-muted hover:text-ivory'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-synapse rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}

          {/* AI CTA */}
          <Link
            href="/ai"
            className={cn(
              'ml-4 flex items-center gap-2 px-5 py-2.5 text-[0.9375rem] font-medium rounded-full transition-all',
              pathname === '/ai'
                ? 'bg-synapse text-void'
                : 'bg-synapse/10 text-synapse hover:bg-synapse/20 border border-synapse/20'
            )}
          >
            <Sparkles className="w-4 h-4" />
            Talk to Thabang AI Assist
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
            className="md:hidden glass border-t border-border overflow-hidden"
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
                      'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-synapse bg-synapse/10'
                        : 'text-muted hover:text-ivory'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/ai"
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 text-base font-medium rounded-full bg-synapse/10 text-synapse border border-synapse/20"
              >
                <Sparkles className="w-4 h-4" />
                Talk to Thabang AI Assist
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
