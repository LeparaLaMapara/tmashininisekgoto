import type { Metadata } from 'next'
import Link from 'next/link'
import { existsSync } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getAllPosts, getPostBySlug, metaDescription } from '@/lib/blog'
import { JsonLd } from '@/components/seo/json-ld'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema'
import { slugifyTag } from '@/lib/topics'
import { SITE_URL } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import { mdxComponents } from '@/components/blog/mdx-components'
import { Comments } from '@/components/blog/comments'
import { SubscribeForm } from '@/components/blog/subscribe-form'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { ShareButtons } from '@/components/blog/share-buttons'
import { RelatedPosts } from '@/components/blog/related-posts'
import { AudioPlayer } from '@/components/blog/audio-player'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${slug}`
  const description = metaDescription(post)

  return {
    // seoTitle shortens the SERP title only; the H1 below still uses post.title.
    title: post.seoTitle ?? post.title,
    description,
    // `post.canonical` only applies when a post was first published elsewhere.
    // Originals stay self-referencing so the ranking credit lands here.
    alternates: { canonical: post.canonical ?? url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: ['Thabang Mashinini-Sekgoto'],
      tags: post.tags,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.summary.slice(0, 100))}`],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const hasAudio = existsSync(path.join(process.cwd(), 'public', 'audio', `${slug}.mp3`))

  // Posts open with their own H1; the page header already shows the title.
  const content = post.content.trimStart().replace(/^# .*\r?\n/, '')

  // Newest-first, so the "previous" post is the next one down the list.
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  const newer = index > 0 ? posts[index - 1] : null
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          blogPostingSchema({
            slug,
            title: post.title,
            description: metaDescription(post),
            datePublished: post.date,
            dateModified: post.lastModified,
            tags: post.tags,
            imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse mb-10"
      >
        <span aria-hidden="true">&larr;</span>
        Back to blog
      </Link>

      {/* Post header */}
      <header className="mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ivory leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] text-muted font-mono">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-border">|</span>
          <span>{post.readingTime}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slugifyTag(tag)}`}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Listen to this post */}
      {hasAudio && <AudioPlayer src={`/audio/${slug}.mp3`} />}

      {/* Table of Contents */}
      <TableOfContents content={content} />

      {/* MDX content */}
      <article className="prose prose-lg max-w-3xl mx-auto">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </article>

      {/* Share */}
      <ShareButtons title={post.title} url={`${SITE_URL}/blog/${slug}`} />

      {/* Previous / next: sequential internal links, so every post is reachable
          from its neighbours rather than only from the index. */}
      {(older || newer) && (
        <nav
          aria-label="More posts"
          className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {older ? (
            <Link href={`/blog/${older.slug}`} className="group block">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                Previous
              </span>
              <span className="mt-1 block font-display text-lg font-semibold text-ivory transition-colors group-hover:text-synapse">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className="group block sm:text-right">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                Next
              </span>
              <span className="mt-1 block font-display text-lg font-semibold text-ivory transition-colors group-hover:text-synapse">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      {/* Related posts */}
      <RelatedPosts slug={slug} tags={post.tags} />

      {/* Subscribe CTA */}
      <div className="mt-16">
        <SubscribeForm />
      </div>

      {/* Comments */}
      <Comments slug={slug} />
    </section>
  )
}
