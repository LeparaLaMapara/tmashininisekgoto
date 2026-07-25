import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { JsonLd } from '@/components/seo/json-ld'
import { webSiteSchema } from '@/lib/schema'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  // `opsz` only. SOFT and WONK were requested but never used: nothing in the
  // codebase sets font-variation-settings, so they were shipping extra bytes in
  // the one font the LCP element depends on. `opsz` stays because browsers apply
  // optical sizing automatically, which is what makes Fraunces look right at
  // display sizes.
  axes: ['opsz'],
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Thabang Mashinini-Sekgoto | Data Scientist & AI Engineer',
    template: '%s | Thabang M-S',
  },
  description:
    'Data Science and AI leader with 10+ years building enterprise-scale ML across banking, telecoms, research, and education. Founder of Ubunye AI Ecosystems.',
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
  // Without an explicit icon the browser falls back to requesting /favicon.ico,
  // which does not exist here, so every page load logged a 404. Google also
  // shows the favicon next to mobile search results, so it is worth declaring.
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon.png', type: 'image/png' }],
  },
  // No `canonical` here on purpose. Next merges parent metadata into children,
  // so a canonical set in the root layout is inherited by every route, which
  // told crawlers that all ten pages were duplicates of the homepage. Each
  // route declares its own self-referencing canonical instead.
  alternates: {
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
        {/* WebSite is site-wide. The Person entity lives on the homepage and is
            referenced from here and elsewhere by @id, so it is defined once. */}
        <JsonLd data={webSiteSchema()} />
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
