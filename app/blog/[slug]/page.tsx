import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import { mdxComponents } from '@/components/blog/mdx-components'
import { Comments } from '@/components/blog/comments'
import { SubscribeForm } from '@/components/blog/subscribe-form'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { ShareButtons } from '@/components/blog/share-buttons'
import { RelatedPosts } from '@/components/blog/related-posts'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

const SITE_URL = 'https://tmashininisekgoto.vercel.app'

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${slug}`

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Thabang Mashinini-Sekgoto', url: SITE_URL },
    url: `${SITE_URL}/blog/${slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
              href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Table of Contents */}
      <TableOfContents content={post.content} />

      {/* MDX content */}
      <article className="prose prose-lg max-w-3xl mx-auto">
        <MDXRemote
          source={post.content}
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
