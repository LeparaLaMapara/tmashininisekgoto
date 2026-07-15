import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeProvider } from '@/components/layout/theme-provider'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
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

const SITE_URL = 'https://tmashininisekgoto.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Thabang Mashinini-Sekgoto | Lead Data Scientist · AI & Analytics Engineering Leader',
    template: '%s | Thabang M-S',
  },
  description:
    'Data Science and AI leader with 10+ years of experience delivering enterprise-scale analytics, ML, and AI solutions across banking, telecoms, research, and education. Founder of Ubunye AI Ecosystems.',
  openGraph: {
    images: ['/api/og'],
    type: 'website',
    siteName: 'Thabang Mashinini-Sekgoto',
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@thabangline',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': '/feed.xml' },
  },
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
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-void text-ivory font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Thabang Mashinini-Sekgoto',
              url: SITE_URL,
              jobTitle: 'Lead Data Scientist · AI & Analytics Engineering Leader',
              worksFor: [
                { '@type': 'Organization', name: 'ABSA Insurance' },
                { '@type': 'Organization', name: 'University of the Witwatersrand' },
              ],
              alumniOf: { '@type': 'Organization', name: 'University of the Witwatersrand' },
              sameAs: [
                'https://github.com/LeparaLaMapara',
                'https://www.linkedin.com/in/thabang-mashinini-0081b5b6/',
                'https://scholar.google.com/citations?hl=en&authuser=1&user=aLjffFkAAAAJ',
                'https://x.com/thabangline',
                'https://www.youtube.com/@tmashininisekgoto',
              ],
              knowsAbout: ['Machine Learning', 'Data Science', 'AI Systems', 'Distributed Systems', 'MLOps'],
            }),
          }}
        />
        <ThemeProvider>
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
