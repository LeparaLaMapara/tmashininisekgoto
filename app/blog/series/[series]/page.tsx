import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'
import {
  cardSubtitle,
  getSeries,
  getSeriesBySlug,
  partTitle,
  totalReadingMinutes,
  type Series,
} from '@/lib/blog'
import { getSeriesCopy } from '@/lib/series'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/schema'
import { SITE_URL, ogImages } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import { ShareButtons } from '@/components/blog/share-buttons'
import { SubscribeForm } from '@/components/blog/subscribe-form'

interface PageProps {
  params: Promise<{ series: string }>
}

export async function generateStaticParams() {
  return getSeries().map((s) => ({ series: s.slug }))
}

/**
 * The one line that describes a series everywhere it is quoted: the meta
 * description, the share card, the JSON-LD.
 *
 * Prefers the written copy. A series with none still has to say something, so
 * the fallback states what it is and how long it is, which is the minimum a
 * reader needs to decide whether to start.
 */
function seriesDescription(series: Series): string {
  const copy = getSeriesCopy(series.name)
  if (copy) return copy.description

  const parts =
    series.posts.length === series.total
      ? `A series in ${series.total} parts`
      : `A series in ${series.total} parts, ${series.posts.length} published so far`
  return `${parts}, by Thabang Mashinini-Sekgoto.`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series: slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) return {}

  const url = `${SITE_URL}/blog/series/${series.slug}`
  const description = seriesDescription(series)

  return {
    title: series.name,
    description,
    alternates: { canonical: `/blog/series/${series.slug}` },
    openGraph: {
      // Repeated rather than inherited: a child's `openGraph` replaces the
      // parent's rather than merging into it, so the site name, locale and
      // card image have to be named here or the card loses them.
      type: 'website',
      title: series.name,
      description,
      url,
      siteName: 'Thabang Mashinini-Sekgoto',
      locale: 'en_ZA',
      images: ogImages(
        `${series.name}, a ${series.total} part series by Thabang Mashinini-Sekgoto`,
        series.name,
        cardSubtitle(description)
      ),
    },
  }
}

export default async function SeriesPage({ params }: PageProps) {
  const { series: slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) notFound()

  const copy = getSeriesCopy(series.name)
  const description = seriesDescription(series)
  const minutes = totalReadingMinutes(series.posts)
  const first = series.posts[0]
  const remaining = series.total - series.posts.length

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          collectionPageSchema({
            name: series.name,
            description,
            path: `/blog/series/${series.slug}`,
            items: series.posts.map((post) => ({ title: post.title, slug: post.slug })),
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: series.name, path: `/blog/series/${series.slug}` },
          ]),
        ]}
      />

      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse"
      >
        <span aria-hidden="true">&larr;</span>
        Back to blog
      </Link>

      <header className="mb-12">
        <p className="text-[11px] font-mono uppercase tracking-wider text-signal">
          Series · {series.posts.length} of {series.total} published
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ivory sm:text-4xl">
          {series.name}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {copy?.intro ?? description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.9375rem] text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {minutes} min read in total
          </span>
          {first && (
            <>
              <span className="text-border">|</span>
              <Link
                href={`/blog/${first.slug}`}
                className="text-synapse transition-colors hover:text-ivory"
              >
                Start at part {first.seriesPart ?? 1}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* The parts, in reading order rather than by date. A series read
          newest first is a series read backwards. */}
      <ol className="space-y-4">
        {series.posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex gap-4 rounded-2xl border border-border bg-surface/50 p-6 transition-all hover:-translate-y-0.5 hover:border-synapse/20"
            >
              <span className="shrink-0 pt-1 font-mono text-xs text-synapse">
                {String(post.seriesPart ?? i + 1).padStart(2, '0')}
              </span>
              <span className="block space-y-2">
                <span className="block font-display text-xl font-semibold text-ivory transition-colors group-hover:text-synapse">
                  {partTitle(post)}
                </span>
                <span className="block text-[0.9375rem] leading-relaxed text-muted">
                  {post.summary}
                </span>
                <span className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {remaining > 0 && (
        <p className="mt-6 font-mono text-xs text-muted">
          The remaining {remaining} {remaining === 1 ? 'part is' : 'parts are'} being
          written.
        </p>
      )}

      {/* Share the whole series, not one part of it. */}
      <ShareButtons
        title={series.name}
        url={`${SITE_URL}/blog/series/${series.slug}`}
      />

      <div className="mt-16">
        <SubscribeForm />
      </div>
    </section>
  )
}
