import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getAllPosts, getAllTags } from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import { SubscribeForm } from '@/components/blog/subscribe-form'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing on AI systems, MLOps, open source engineering, and the craft of building real-world machine learning infrastructure.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

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
        The <span className="text-synapse">Blog</span>
      </h1>
      <p className="mt-3 text-muted text-xl leading-relaxed">
        Thinking out loud about AI systems, engineering craft, and the South
        African tech landscape.
      </p>

      {/* Subscribe */}
      <div className="mt-10">
        <SubscribeForm />
      </div>

      {/* Tag cloud */}
      <div className="mt-10 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
          >
            {tag.name}
            <span className="ml-1.5 text-synapse/60">{tag.count}</span>
          </Link>
        ))}
      </div>

      {/* Posts grouped by year */}
      <div className="mt-16 space-y-16">
        {Array.from(grouped.entries()).map(([year, yearPosts]) => (
          <div key={year}>
            <h2 className="font-display text-xl font-semibold text-muted/60 mb-6">
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
                        href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
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
