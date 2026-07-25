import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Topics: MLOps, Agentic AI, Python',
  description:
    'Browse the writing by topic: MLOps, agentic AI, Python packaging, data science leadership, and production machine learning engineering.',
  alternates: { canonical: '/tags' },
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">
        Topics
      </h1>
      <p className="mt-3 text-muted text-lg">
        Every topic written about here, from MLOps and Python tooling to leading a
        data science team. Each one is its own page.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="group rounded-full border border-border bg-surface px-4 py-2 text-sm font-mono text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
          >
            {tag.name}
            <span className="ml-2 text-synapse/60 group-hover:text-synapse">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
