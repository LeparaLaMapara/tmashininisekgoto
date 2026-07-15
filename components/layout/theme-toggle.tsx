'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-9 w-9" /> // placeholder to prevent layout shift
  }

  const isDark = theme === 'dark'

  const toggle = () => {
    const root = document.documentElement
    root.classList.add('theme-fade')
    setTheme(isDark ? 'light' : 'dark')
    window.setTimeout(() => root.classList.remove('theme-fade'), 600)
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
        'bg-surface border border-border',
        'hover:bg-surface-hover hover:border-synapse/30',
        'text-muted hover:text-ivory'
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
