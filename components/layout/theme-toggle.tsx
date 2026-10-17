'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Camera, Signpost } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeCurtain } from '@/components/layout/theme-curtain'

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
  const [curtain, setCurtain] = useState<{ to: 'light' | 'dark'; phase: 'cover' | 'reveal' } | null>(null)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-9 w-9" /> // placeholder to prevent layout shift
  }

  const isVision = theme === 'dark'
  const next = isVision ? THEME_NAMES.light : THEME_NAMES.dark

  const to = isVision ? 'light' : 'dark'

  const toggle = () => {
    if (curtain) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(to)
      return
    }
    // The aperture or the livery covers the screen, the theme switches behind
    // it, then it opens again (components/layout/theme-curtain.tsx).
    setCurtain({ to, phase: 'cover' })
  }

  return (
    <>
    {curtain && (
      <ThemeCurtain
        to={curtain.to}
        phase={curtain.phase}
        onCovered={() => {
          setTheme(curtain.to)
          window.setTimeout(() => setCurtain({ ...curtain, phase: 'reveal' }), 90)
        }}
        onDone={() => setCurtain(null)}
      />
    )}
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
    </>
  )
}
