'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/** ThabangVision (dark) is the default since 2026-10-17, at Thabang's request. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
}
