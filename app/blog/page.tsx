import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getAllPosts, getAllTags, getSeries } from '@/lib/blog'
import { slugifyTag } from '@/lib/topics'
import { formatDate } from '@/lib/utils'
import { SubscribeForm } from '@/components/blog/subscribe-form'

export const metadata: Metadata = {
  title: 'Writing: Applied AI, Data Science & Engineering',
  description:
    'Notes from inside the build: production AI and data systems, engineering craft, open source infrastructure, and applied research. Written while building, not after.',
  alternates: { canonical: '/blog' },
  openGraph: pageOpenGraph('/blog', 'Writing by Thabang Mashinini-Sekgoto'),
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const series = getSeries()

  // Group posts by year
  const grouped = new Map<string, typeof posts>()
  for (const post of posts) {
    const year = new Date(post.date).getFullYear().toString()
    if (!grouped.has(year)) grouped.set(year, [])
    grouped.get(year)!.push(post)
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      {/* Header */}
      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">
        <span className="text-synapse">Writing</span>
      </h1>
      <p className="mt-3 text-muted text-xl leading-relaxed">
        Notes from inside the build. What the engineering actually costs, where
        the received wisdom fails, and what I would do differently. Every example
        comes from a system that exists.
      </p>

      {/* Subscribe */}
      <div className="mt-10">
        <SubscribeForm />
      </div>

      {/* Tag cloud */}
      <div className="mt-10 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
          >
            {tag.name}
            <span className="ml-1.5 text-synapse/60">{tag.count}</span>
          </Link>
        ))}
      </div>

      {/* Series.
          Posts that are one argument split across several pieces read as
          disconnected fragments in a reverse chronological list. This presents
          them as the single body of work they are. Only published parts are
          listed and linked; the count states the planned length so a reader
          starting part one knows what they are starting. */}
      {series.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold text-muted mb-6">
            Series
          </h2>
          <div className="space-y-6">
            {series.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-border bg-surface/50 p-6"
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="font-display text-lg font-semibold text-ivory">
                    {s.name}
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {s.posts.length} of {s.total} published
                  </span>
                </div>
                <ol className="mt-4 space-y-2.5">
                  {s.posts.map((post) => (
                    <li key={post.slug} className="flex gap-3">
                      <span className="font-mono text-xs text-synapse pt-1 shrink-0">
                        {String(post.seriesPart).padStart(2, '0')}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-ivory/85 hover:text-synapse transition-colors leading-snug"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ol>
                {s.posts.length < s.total && (
                  <p className="mt-4 font-mono text-xs text-muted">
                    The remaining {s.total - s.posts.length} are being written.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts grouped by year */}
      <div className="mt-16 space-y-16">
        {Array.from(grouped.entries()).map(([year, yearPosts]) => (
          <div key={year}>
            <h2 className="font-display text-xl font-semibold text-muted mb-6">
              {year}
            </h2>
            <div className="space-y-10">
              {yearPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-surface/50 rounded-2xl border border-border p-6 hover:border-synapse/20 transition-all hover:-translate-y-0.5"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block space-y-2"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <time
                        dateTime={post.date}
                        className="text-xs font-mono text-synapse"
                      >
                        {formatDate(post.date)}
                      </time>
                      <span className="flex items-center gap-1 text-xs font-mono text-muted">
                        <Clock className="h-3 w-3" />
                        {post.readingTime}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-ivory transition-colors group-hover:text-synapse">
                      {post.title}
                    </h3>
                    <p className="text-muted text-[0.9375rem] leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${slugifyTag(tag)}`}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
