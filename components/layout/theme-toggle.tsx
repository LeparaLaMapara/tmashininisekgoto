'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Camera, Signpost } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The two themes, laid over the same site. Only the look changes, never the words.
 *
 *   Sosha Plata Jo  (next-themes "light")  the Soshanguve street sign: yellow boards, Bungee
 *   ThabangVision   (next-themes "dark")   the street at night, with his photographs behind it
 *
 * The internal names stay light and dark so every existing `dark:` style and
 * everyone's saved choice keep working.
 */
export const THEME_NAMES = { light: 'Sosha Plata Jo', dark: 'ThabangVision' } as const

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-9 w-9" /> // placeholder to prevent layout shift
  }

  const isVision = theme === 'dark'
  const next = isVision ? THEME_NAMES.light : THEME_NAMES.dark

  const toggle = () => {
    const root = document.documentElement
    root.classList.add('theme-fade')
    setTheme(isVision ? 'light' : 'dark')
    window.setTimeout(() => root.classList.remove('theme-fade'), 600)
  }

  return (
    <button
      onClick={toggle}
      title={`Switch to ${next}`}
      className={cn(
        'flex h-9 items-center justify-center gap-2 rounded-full transition-colors',
        withLabel ? 'px-4' : 'w-9',
        'bg-surface border border-border',
        'hover:bg-surface-hover hover:border-synapse/30',
        'text-muted hover:text-ivory'
      )}
      aria-label={`Switch to the ${next} theme`}
    >
      {isVision ? <Signpost className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
      {withLabel && <span className="text-sm font-medium">{next}</span>}
    </button>
  )
}
