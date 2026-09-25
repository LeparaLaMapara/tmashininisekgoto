import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { personSchema, organizationsSchema } from '@/lib/schema'
import { getAllPosts } from '@/lib/blog'
import { SOCIAL_LINKS } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DestinationBoard, LiveryStripes } from '@/components/home/taxi-route'
import { ShortVersion } from '@/components/home/short-version'

// Title and description come from the root layout's defaults; this only pins the
// canonical so the homepage points at itself rather than inheriting anything.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: pageOpenGraph('/', 'Thabang Mashinini-Sekgoto, applied AI, data science and AI engineering'),
}

/**
 * The homepage, in the order Thabang asked for on 2026-09-25: the sign, then
 * the short version as small boards (components/home/short-version.tsx), then
 * the latest writing. Little text on purpose, the way sjnarmstrong.com does it.
 * The figures, roles and career route live on the CV; the longer story is on
 * the about page.
 */
const LINK = 'inline-flex items-center gap-2 font-semibold text-synapse-ink hover:underline underline-offset-4'

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ivory mb-5">{children}</h2>
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      <JsonLd data={[personSchema(), ...organizationsSchema()]} />

      {/* No reveal animation anywhere on this page: everything paints on load,
          so crawlers, link previews and fast scrollers all see the same page. */}
      <div className="px-6 pt-32 sm:pt-36 pb-24">
        <div className="mx-auto max-w-3xl">
          <DestinationBoard />
          <div className="my-8 -mx-6 sm:mx-0">
            <LiveryStripes />
          </div>
          <p className="font-mono text-sm text-muted mb-4">Thabang Mashinini-Sekgoto · Soshanguve</p>
          <div className="sign-board px-6 py-7 sm:px-8 sm:py-8">
            <h1 className="font-sign uppercase text-[1.9rem] leading-[1] sm:text-5xl text-balance">
              I build things, try them, see what breaks, and share what I find.
            </h1>
          </div>

          <ShortVersion />

          {posts.length > 0 && (
            <section className="mt-16">
              <Heading>Latest writing</Heading>
              <ul>
                {posts.map((post) => (
                  <li key={post.slug} className="border-t-2 border-border py-5">
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <p className="font-mono text-xs text-muted mb-2">
                        {formatDate(post.date)} · {post.readingTime}
                      </p>
                      <h3 className="font-display text-xl font-bold text-ivory group-hover:text-synapse-ink transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/blog" className={`mt-4 ${LINK}`}>
                All writing
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </section>
          )}

          <section className="mt-16 border-t-2 border-border pt-8">
            <p className="text-lg leading-relaxed text-ivory/85">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="font-semibold underline underline-offset-4">
                Say hello by email
              </a>
              . The longer story is on the{' '}
              <Link href="/about" className="font-semibold underline underline-offset-4">about page</Link>, the work is
              under <Link href="/work" className="font-semibold underline underline-offset-4">work</Link>, and the
              career detail is on my <Link href="/resume" className="font-semibold underline underline-offset-4">CV</Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
