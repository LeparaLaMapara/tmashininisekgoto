import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getSeries, totalReadingMinutes } from '@/lib/blog'
import { getSeriesCopy } from '@/lib/series'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema } from '@/lib/schema'
import { pageOpenGraph } from '@/lib/site'
import { SubscribeForm } from '@/components/blog/subscribe-form'

export const metadata: Metadata = {
  title: 'Series',
  description:
    'The writing that runs as one argument across several posts, collected into series you can read in order from the start.',
  alternates: { canonical: '/blog/series' },
  openGraph: pageOpenGraph('/blog/series', 'Series by Thabang Mashinini-Sekgoto'),
}

/**
 * The parent of every series page.
 *
 * It exists partly so trimming a shared URL back to `/blog/series` lands
 * somewhere rather than on a 404, and partly because "read the whole argument
 * in order" is a different offer from the reverse chronological list on /blog.
 */
export default function SeriesIndexPage() {
  const series = getSeries()

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: 'Series', path: '/blog/series' },
        ])}
      />

      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse"
      >
        <span aria-hidden="true">&larr;</span>
        Back to blog
      </Link>

      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">
        <span className="text-synapse">Series</span>
      </h1>
      <p className="mt-3 text-xl leading-relaxed text-muted">
        Some arguments are too long for one post. These are the ones that run
        across several, in the order they were meant to be read.
      </p>

      {series.length > 0 ? (
        <div className="mt-12 space-y-6">
          {series.map((s) => (
            <Link
              key={s.slug}
              href={`/blog/series/${s.slug}`}
              className="group block rounded-2xl border border-border bg-surface/50 p-6 transition-all hover:-translate-y-0.5 hover:border-synapse/20"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-xl font-semibold text-ivory transition-colors group-hover:text-synapse">
                  {s.name}
                </h2>
                <span className="font-mono text-xs text-muted">
                  {s.posts.length} of {s.total} published
                </span>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {getSeriesCopy(s.name)?.description ??
                  `A series in ${s.total} parts.`}
              </p>
              <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-muted">
                <Clock className="h-3 w-3" />
                {totalReadingMinutes(s.posts)} min read in total
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-muted">
          Nothing is running as a series at the moment.{' '}
          <Link href="/blog" className="text-synapse hover:text-ivory">
            The individual posts are here.
          </Link>
        </p>
      )}

      <div className="mt-16">
        <SubscribeForm />
      </div>
    </section>
  )
}
