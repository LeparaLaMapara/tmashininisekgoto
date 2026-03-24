import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((t) => ({ tag: t.name }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  return {
    title: `Posts tagged "${decoded}"`,
    description: `Blog posts about ${decoded}.`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = getPostsByTag(decoded)

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      {/* Back link */}
      <Link
        href="/tags"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-synapse mb-10"
      >
        <span aria-hidden="true">&larr;</span>
        All tags
      </Link>

      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">
        <span className="text-synapse">#</span> {decoded}
      </h1>
      <p className="mt-3 text-muted">
        {posts.length} post{posts.length !== 1 ? 's' : ''}
      </p>

      <div className="mt-12 space-y-10">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-semibold text-ivory transition-colors group-hover:text-synapse">
                  {post.title}
                </h3>
                <time
                  dateTime={post.date}
                  className="shrink-0 text-sm text-muted font-mono"
                >
                  {formatDate(post.date)}
                </time>
              </div>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {post.summary}
              </p>
            </Link>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t.toLowerCase())}`}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
                >
                  {t}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
