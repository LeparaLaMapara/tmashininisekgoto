import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getHubTopics, getTopicHub, type GraphNode, type NodeType } from '@/lib/graph'
import { JsonLd } from '@/components/seo/json-ld'
import { topicHubSchema, breadcrumbSchema } from '@/lib/schema'
import { pageOpenGraph } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getHubTopics().map((t) => ({ slug: t.slug }))
}

// A topic without a hub is not a page. Unknown slugs 404 rather than render thin.
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const hub = getTopicHub(slug)
  if (!hub?.hasHub) return {}
  const heading = hub.topic.heading ?? hub.topic.name
  return {
    title: heading,
    description: hub.topic.description,
    alternates: { canonical: `/topics/${slug}` },
    openGraph: pageOpenGraph(`/topics/${slug}`, `${heading}: work by Thabang Mashinini-Sekgoto`),
  }
}

const GROUPS: { type: NodeType; heading: string }[] = [
  { type: 'project', heading: 'Work' },
  { type: 'research', heading: 'Research' },
  { type: 'publication', heading: 'Publications' },
  { type: 'post', heading: 'Writing' },
  { type: 'talk', heading: 'Talks and sessions' },
]

/** Talks in one series link to one page; list each series page once. */
function dedupe(nodes: GraphNode[]): GraphNode[] {
  const seen = new Set<string>()
  return nodes.filter((n) => {
    const id = n.type === 'talk' ? n.href : `${n.type}:${n.key}`
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params
  const hub = getTopicHub(slug)
  if (!hub?.hasHub) notFound()

  const { topic } = hub
  const heading = topic.heading ?? topic.name
  const all = GROUPS.flatMap((g) => hub.items[g.type])
  const talks = hub.items.talk

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          ...topicHubSchema(slug, all),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Topics', path: '/topics' },
            { name: heading, path: `/topics/${slug}` },
          ]),
        ]}
      />

      <Link href="/topics" className="mb-10 inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All topics
      </Link>

      <header>
        <p className="text-[11px] font-mono uppercase tracking-wider text-synapse-ink">Topic</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ivory">{heading}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ivory/85">{topic.intro}</p>
        <p className="mt-4 text-sm font-mono text-muted">
          {GROUPS.filter((g) => hub.items[g.type].length)
            .map((g) => `${hub.items[g.type].length} ${g.heading.toLowerCase()}`)
            .join(' · ')}
          {topic.wikidata && (
            <>
              {' · '}
              <a href={`https://www.wikidata.org/wiki/${topic.wikidata}`} target="_blank" rel="noopener noreferrer" className="hover:text-synapse">
                Wikidata {topic.wikidata}
              </a>
            </>
          )}
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {GROUPS.map(({ type, heading: groupHeading }) => {
          const nodes = type === 'talk' ? dedupe(talks) : hub.items[type]
          if (!nodes.length) return null
          // A long run of sessions from one series reads as one item, not twelve.
          const seriesCounts = type === 'talk' ? talks.filter((t) => t.href === '/talks/fabacademic-unfiltered').length : 0
          return (
            <section key={type} aria-labelledby={`group-${type}`}>
              <h2 id={`group-${type}`} className="mb-5 font-display text-2xl font-semibold text-ivory">{groupHeading}</h2>
              <ul className="space-y-4">
                {(type === 'talk' ? talks.filter((t) => t.href !== '/talks/fabacademic-unfiltered').slice(0, 4) : nodes).map((n) => (
                  <li key={`${n.type}:${n.key}`}>
                    <Link href={n.href} className="group block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-synapse/40">
                      <span className="block font-medium leading-snug text-ivory group-hover:text-synapse">{n.title}</span>
                      {n.blurb && <span className="mt-1.5 block text-sm leading-relaxed text-muted line-clamp-3">{n.blurb}</span>}
                    </Link>
                  </li>
                ))}
                {seriesCounts > 0 && (
                  <li>
                    <Link href="/talks/fabacademic-unfiltered" className="group block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-synapse/40">
                      <span className="block font-medium leading-snug text-ivory group-hover:text-synapse">
                        FabAcademic Unfiltered: {seriesCounts} session{seriesCounts === 1 ? '' : 's'} on this topic
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                        {talks.filter((t) => t.href === '/talks/fabacademic-unfiltered').slice(0, 3).map((t) => t.title).join('; ')}
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          )
        })}

        {(hub.related.length > 0 || hub.broader.length > 0) && (
          <section aria-labelledby="related-topics" className="border-t border-border pt-8">
            <h2 id="related-topics" className="mb-4 font-display text-2xl font-semibold text-ivory">Related topics</h2>
            <p className="mb-4 text-sm text-muted">Subjects that share work with this one. Those with their own page are linked.</p>
            <ul className="flex flex-wrap gap-2">
              {[...hub.broader.map((t) => ({ topic: t, hasHub: hub.related.find((r) => r.topic.slug === t.slug)?.hasHub ?? false })), ...hub.related]
                .filter((r, i, arr) => arr.findIndex((x) => x.topic.slug === r.topic.slug) === i)
                .map(({ topic: t, hasHub }) => (
                  <li key={t.slug}>
                    {hasHub ? (
                      <Link href={`/topics/${t.slug}`} className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-sm font-mono text-muted transition-colors hover:border-synapse/40 hover:text-ivory">
                        {t.name}
                      </Link>
                    ) : (
                      <span className="inline-block rounded-full border border-border/60 px-3 py-1 text-sm font-mono text-muted">{t.name}</span>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
