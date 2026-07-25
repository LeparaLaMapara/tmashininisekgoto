import type { Metadata } from 'next'
import Link from 'next/link'
import { Search as SearchIcon } from 'lucide-react'
import { search } from '@/lib/search'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search across the writing, projects, publications, talks, and courses of Thabang Mashinini-Sekgoto.',
  alternates: { canonical: '/search' },
  // Internal search results should not be indexed: they are thin and endlessly
  // variable. `follow` still lets crawlers walk through to the real pages, and
  // the route exists so the WebSite SearchAction in lib/schema.ts is truthful.
  robots: { index: false, follow: true },
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = (q ?? '').trim()
  const results = search(query)

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">Search</h1>
      <p className="mt-3 text-muted">
        Writing, projects, publications, talks, and courses.
      </p>

      <form action="/search" method="get" className="mt-8">
        <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 focus-within:border-synapse/40">
          <SearchIcon className="w-4 h-4 shrink-0 text-muted" aria-hidden="true" />
          <label htmlFor="q" className="sr-only">
            Search this site
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Try MLOps, Spark, flood mapping, agents…"
            className="flex-1 bg-transparent text-ivory outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ivory px-4 py-1.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="mt-8 text-sm text-muted font-mono">
          {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
        </p>
      )}

      {query && results.length === 0 && (
        <p className="mt-6 text-muted">
          Nothing matched. Try a broader term, or{' '}
          <Link href="/ai" className="text-synapse hover:underline">
            ask Thabang AI Assist
          </Link>
          .
        </p>
      )}

      <div className="mt-8 space-y-8">
        {results.map((result) => (
          <article key={`${result.kind}-${result.href}-${result.title}`}>
            <Link href={result.href} className="group block space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                {result.kind}
              </span>
              <h2 className="font-display text-xl font-semibold text-ivory transition-colors group-hover:text-synapse">
                {result.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {result.description}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
