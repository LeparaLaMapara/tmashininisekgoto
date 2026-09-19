import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPICS, type TopicKind } from '@/lib/graph/topics'
import { getTopicHub } from '@/lib/graph'
import { JsonLd } from '@/components/seo/json-ld'
import { topicSetSchema, breadcrumbSchema } from '@/lib/schema'
import { pageOpenGraph } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Topics: the subjects the work is about',
  description:
    'Every subject across the projects, research, publications, writing and talks, from echo state networks and Kalman filtering to MLOps and AI education.',
  alternates: { canonical: '/topics' },
  openGraph: pageOpenGraph('/topics', 'Topics across the work of Thabang Mashinini-Sekgoto'),
}

const KIND_HEADING: Record<TopicKind, string> = {
  field: 'Fields',
  method: 'Methods',
  domain: 'Domains and problems',
  technology: 'Technologies',
}

export default function TopicsIndex() {
  const hubs = TOPICS.map((t) => ({ t, hub: getTopicHub(t.slug)! })).filter((x) => x.hub.count > 0)
  const withPages = hubs.filter((x) => x.hub.hasHub).sort((a, b) => b.hub.count - a.hub.count)

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          topicSetSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Topics', path: '/topics' },
          ]),
        ]}
      />
      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory">Topics</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        The subjects the work is about, across projects, research, publications, writing and talks. A
        subject gets its own page once there is enough work behind it to be worth reading; the rest are
        listed so the full range is visible, and each links to wherever that work lives.
      </p>

      <h2 className="mt-14 mb-5 font-display text-2xl font-semibold text-ivory">Topic pages</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {withPages.map(({ t, hub }) => (
          <li key={t.slug}>
            <Link href={`/topics/${t.slug}`} className="group block h-full rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-synapse/40">
              <span className="block font-medium text-ivory group-hover:text-synapse">{t.heading ?? t.name}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-muted line-clamp-3">{t.description}</span>
              <span className="mt-2 block text-xs font-mono text-muted">{hub.count} items</span>
            </Link>
          </li>
        ))}
      </ul>

      {(Object.keys(KIND_HEADING) as TopicKind[]).map((kind) => {
        const rest = hubs.filter((x) => x.t.kind === kind && !x.hub.hasHub)
        if (!rest.length) return null
        return (
          <section key={kind} aria-labelledby={`kind-${kind}`} className="mt-12">
            <h2 id={`kind-${kind}`} className="mb-4 font-display text-xl font-semibold text-ivory">
              More {KIND_HEADING[kind].toLowerCase()}
            </h2>
            <ul className="space-y-2">
              {rest.map(({ t, hub }) => {
                const where = [...hub.items.project, ...hub.items.research, ...hub.items.post, ...hub.items.publication, ...hub.items.talk]
                const first = where[0]
                return (
                  <li key={t.slug} className="text-ivory/85">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted">: </span>
                    {where.slice(0, 3).map((n, i) => (
                      <span key={`${n.type}:${n.key}`}>
                        {i > 0 && <span className="text-muted">, </span>}
                        <Link href={n.href} className="text-synapse underline underline-offset-2 hover:no-underline">{n.title}</Link>
                      </span>
                    ))}
                    {!first && <span className="text-muted">no linked work yet</span>}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </section>
  )
}
