import type { Metadata } from 'next'
import { Bungee, Work_Sans, JetBrains_Mono, Doto, Barlow_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { JsonLd } from '@/components/seo/json-ld'
import { webSiteSchema } from '@/lib/schema'
import { SITE_URL, ogImages } from '@/lib/site'
import './globals.css'

// The signwriter system. Bungee is a typeface drawn for street signage, used
// only where a hand painted board would put words: the logo, the homepage
// sign and the short section labels. Bungee has no lowercase, so it never
// sets a long title. Work Sans carries every heading and all reading text.
const bungee = Bungee({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sign',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Taxi rank faces, used only by components/home/taxi-route.tsx: Doto for the
// dot matrix destination board, Barlow Condensed for the livery lettering.
const doto = Doto({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-dot',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-livery',
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
    default: 'Thabang Mashinini-Sekgoto | Applied AI, Data Science & AI Engineering',
    template: '%s | Thabang M-S',
  },
  description:
    'I build production AI and data systems, reusable open source infrastructure, and applied research grounded in real problems. Nine years across insurance, telecommunications, applied research and higher education. Author of Ubunye Engine.',
  openGraph: {
    images: ogImages('Thabang Mashinini-Sekgoto, applied AI, data science and AI engineering'),
    type: 'website',
    siteName: 'Thabang Mashinini-Sekgoto',
    locale: 'en_ZA',
  },
  // The card type still gives a decent preview wherever a link is pasted. No
  // creator handle: the X profile is no longer linked from the site.
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
  // Search-engine ownership verification. Both read from env vars so that when
  // the codes arrive from Google Search Console and Bing Webmaster Tools, they
  // are set in Vercel and the site redeploys, with no code change. Absent env
  // vars emit nothing, which is correct: an empty verification tag is worse
  // than none.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
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
      className={`${bungee.variable} ${workSans.variable} ${jetbrainsMono.variable} ${doto.variable} ${barlowCondensed.variable}`}
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
