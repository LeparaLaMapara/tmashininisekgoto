import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CursorSpotlight } from '@/components/layout/cursor-spotlight'
import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { StarField } from '@/components/layout/star-field'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tmashininisekgoto.vercel.app'),
  title: {
    default: 'Thabang Mashinini-Sekgoto | AI Systems Architect',
    template: '%s | Thabang M-S',
  },
  description:
    'AI Systems Architect & Researcher. Building reliable AI at scale across telecoms, banking, and research. Founder of Ubunye AI Ecosystems.',
  openGraph: {
    images: ['/og-default.png'],
    type: 'website',
    siteName: 'Thabang Mashinini-Sekgoto',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@thabangline',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-void text-ivory font-body antialiased dark:bg-void dark:text-ivory">
        <ThemeProvider>
          <StarField />
          <CursorSpotlight />
          <CommandPalette />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
