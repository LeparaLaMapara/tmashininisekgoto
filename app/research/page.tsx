import type { Metadata } from 'next'
import Link from 'next/link'
import { Papers } from '@/components/research/papers'
import { RESEARCH } from '@/lib/graph/research'
import { getOrg } from '@/lib/graph/organizations'
import { PUBLICATIONS } from '@/lib/data'
import { JsonLd } from '@/components/seo/json-ld'
import { researchIndexSchema, breadcrumbSchema } from '@/lib/schema'
import { TopicLinks } from '@/components/graph/topic-links'
import { pageOpenGraph } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Research and publications: echo state networks, climate forecasting',
  description:
    'Research and papers by Thabang Mashinini-Sekgoto: echo state networks for image segmentation, ML for seasonal climate forecasting, and hearing loss in mine workers, with citations and BibTeX.',
  alternates: { canonical: '/research' },
  openGraph: pageOpenGraph('/research', 'Research by Thabang Mashinini-Sekgoto'),
}

const STATUS_LABEL = { completed: 'Completed', published: 'Published', proposed: 'Proposed, not started' } as const

export default function ResearchIndex() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          researchIndexSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Research', path: '/research' },
          ]),
        ]}
      />
      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">Research</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Each research line with the question it asked, how it was done, what was found and what was not,
        and the code behind it. The papers each line produced are listed under it, and in full, with
        citations, at the <a href="#papers" className="text-synapse underline underline-offset-2 hover:no-underline">bottom of this page</a>.
        The production work that grew out of some of this is under{' '}
        <Link href="/work" className="text-synapse underline underline-offset-2 hover:no-underline">Work</Link>.
      </p>
      <ol className="mt-14 space-y-8">
        {RESEARCH.map((r) => {
          const org = r.organization ? getOrg(r.organization) : undefined
          const papers = PUBLICATIONS.filter((p) => r.publications.includes(p.key))
          return (
            <li key={r.slug} id={r.slug} className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-synapse-ink">
                {STATUS_LABEL[r.status]} · {r.period}
                {org ? ` · ${org.name}` : ''}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-ivory">
                {r.page ? (
                  <Link href={`/research/${r.slug}`} className="transition-colors hover:text-synapse">{r.headline}</Link>
                ) : (
                  r.headline
                )}
              </h2>
              <p className="mt-3 leading-relaxed text-ivory/85">{r.summary}</p>
              <p className="mt-2 text-sm text-muted">
                {r.role}
                {r.software.length ? ` · code on GitHub` : ''}
              </p>
              {papers.length > 0 && (
                <ul className="mt-4 space-y-1.5 border-l-2 border-border pl-4">
                  {papers.map((p) => (
                    <li key={p.key} className="text-sm leading-snug">
                      <a href={`#${p.key}`} className="text-ivory/85 hover:text-synapse hover:underline underline-offset-2">
                        {p.title}
                      </a>
                      <span className="text-muted"> ({p.year})</span>
                    </li>
                  ))}
                </ul>
              )}
              <TopicLinks slugs={r.topics} className="mt-4" />
            </li>
          )
        })}
      </ol>

      <Papers />
    </section>
  )
}
