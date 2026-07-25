import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { getAllTags, getPostsBySlug, getTagNameBySlug } from '@/lib/blog'
import { getTopic, slugifyTag } from '@/lib/topics'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbSchema, collectionPageSchema } from '@/lib/schema'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: slug } = await params
  const name = getTagNameBySlug(slug)
  if (!name) return {}

  const topic = getTopic(name)
  const heading = topic?.heading ?? name

  return {
    title: topic ? heading : `Posts tagged “${name}”`,
    description: topic?.description ?? `Writing by Thabang Mashinini-Sekgoto about ${name}.`,
    alternates: { canonical: `/tags/${slug}` },
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag: slug } = await params
  const name = getTagNameBySlug(slug)

  if (!name) {
    // Tag pages used to be addressed by the raw tag, so `/tags/open source`
    // and `/tags/ci/cd` were live and linked. Send those to the slug rather
    // than 404ing, and do it here so any future tag with punctuation is
    // handled without touching config.
    const asSlug = slugifyTag(slug)
    if (asSlug !== slug && getTagNameBySlug(asSlug)) {
      permanentRedirect(`/tags/${asSlug}`)
    }
    notFound()
  }

  const posts = getPostsBySlug(slug)
  const topic = getTopic(name)
  const heading = topic?.heading ?? name

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          collectionPageSchema({
            name: heading,
            description: topic?.description ?? `Posts about ${name}.`,
            path: `/tags/${slug}`,
            items: posts.map((post) => ({ title: post.title, slug: post.slug })),
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Topics', path: '/tags' },
            { name: heading, path: `/tags/${slug}` },
          ]),
        ]}
      />

      {/* Back link */}
      <Link
        href="/tags"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-synapse mb-10"
      >
        <span aria-hidden="true">&larr;</span>
        All topics
      </Link>

      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">
        <span className="text-synapse">#</span> {heading}
      </h1>

      {/* An intro paragraph is what makes this a landing page rather than a
          bare list of links. Topics without copy yet fall back to the count. */}
      {topic ? (
        <p className="mt-5 text-lg text-ivory/85 leading-relaxed">{topic.intro}</p>
      ) : null}

      <p className="mt-4 text-muted text-sm font-mono">
        {posts.length} post{posts.length !== 1 ? 's' : ''}
      </p>

      <div className="mt-12 space-y-10">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-xl font-semibold text-ivory transition-colors group-hover:text-synapse">
                  {post.title}
                </h2>
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
                  href={`/tags/${slugifyTag(t)}`}
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
