import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { PUBLICATIONS, PROJECTS } from '@/lib/data'
import { getResearch, getResearchWithPages } from '@/lib/graph/research'
import { getOrg } from '@/lib/graph/organizations'
import { JsonLd } from '@/components/seo/json-ld'
import { researchSchema, breadcrumbSchema } from '@/lib/schema'
import { GraphConnections } from '@/components/graph/connections'
import { TopicLinks } from '@/components/graph/topic-links'
import { SITE_URL, ogImages } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getResearchWithPages().map((r) => ({ slug: r.slug }))
}

// Only lines with enough evidence for a page are routes; the rest live on /research.
export const dynamicParams = false

const STATUS_LABEL = { completed: 'Completed', published: 'Published', proposed: 'Proposed' } as const

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const r = getResearch(slug)
  if (!r || !r.page) return {}
  const url = `${SITE_URL}/research/${slug}`
  return {
    title: r.headline,
    description: r.summary,
    alternates: { canonical: `/research/${slug}` },
    openGraph: {
      title: r.headline,
      description: r.summary,
      url,
      type: 'article',
      siteName: 'Thabang Mashinini-Sekgoto',
      locale: 'en_ZA',
      images: ogImages(`${r.headline}, research by Thabang Mashinini-Sekgoto`, r.headline, 'Research'),
    },
  }
}

export default async function ResearchPage({ params }: PageProps) {
  const { slug } = await params
  const r = getResearch(slug)
  if (!r || !r.page) notFound()

  const org = r.organization ? getOrg(r.organization) : undefined
  const pubs = PUBLICATIONS.filter((p) => r.publications.includes(p.key))
  const projects = PROJECTS.filter((p) => r.relatedProjects.includes(p.slug))

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: 'Status', value: STATUS_LABEL[r.status] },
    { label: 'Period', value: r.period },
    ...(org ? [{ label: 'Institution', value: org.name }] : []),
    { label: 'Role', value: r.role },
    ...(r.collaborators?.length ? [{ label: 'Co-authors', value: r.collaborators.join(', ') }] : []),
    { label: 'Topics', value: <TopicLinks slugs={r.topics} /> },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          researchSchema(r),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Research', path: '/research' },
            { name: r.headline, path: `/research/${slug}` },
          ]),
        ]}
      />

      <Link href="/research" className="mb-10 inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All research
      </Link>

      <header className="mb-10">
        <span className="text-[11px] font-mono uppercase tracking-wider text-synapse-ink">
          Research{org ? ` · ${org.name}` : ''}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-ivory sm:text-4xl">
          {r.headline}
        </h1>
        {r.name !== r.headline && <p className="mt-3 font-display text-xl italic text-ivory/90">{r.name}</p>}
        <p className="mt-4 text-lg leading-relaxed text-ivory/85">{r.summary}</p>

        <dl className="mt-8 grid gap-x-6 gap-y-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-[9rem_1fr]">
          {facts.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="text-[11px] font-mono uppercase tracking-wider text-muted sm:pt-1">{label}</dt>
              <dd className="text-[0.9375rem] text-ivory/85">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="space-y-10">
        {r.question && (
          <section>
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-signal">The question</h2>
            <p className="text-lg leading-relaxed text-ivory/85">{r.question}</p>
          </section>
        )}
        {r.approach && (
          <section>
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-signal">How it was done</h2>
            <p className="text-lg leading-relaxed text-ivory/85">{r.approach}</p>
          </section>
        )}
        {r.datasets?.length ? (
          <section>
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-signal">Data</h2>
            <ul className="list-disc space-y-1 pl-6 text-lg text-ivory/85">
              {r.datasets.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </section>
        ) : null}
        {r.findings?.length ? (
          <section>
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-signal">What was found</h2>
            <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed text-ivory/85">
              {r.findings.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </section>
        ) : null}
        {r.limitations && (
          <section>
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-signal">Limitations</h2>
            <p className="text-lg leading-relaxed text-ivory/85">{r.limitations}</p>
          </section>
        )}
        {r.implications && (
          <section>
            {/* Labelled separately so a possibility is never read as a result. */}
            <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-signal">What it might mean</h2>
            <p className="text-lg leading-relaxed text-ivory/85">{r.implications}</p>
          </section>
        )}

        {pubs.length > 0 && (
          <section aria-labelledby="publications">
            <h2 id="publications" className="mb-4 font-display text-2xl font-semibold text-ivory">Publications</h2>
            <ul className="space-y-4">
              {pubs.map((p) => (
                <li key={p.key} className="rounded-2xl border border-border bg-surface p-5">
                  <Link href={`/publications#${p.key}`} className="font-medium text-ivory hover:text-synapse">{p.title}</Link>
                  <p className="mt-1 text-sm text-muted">{p.authors}. {p.venue}, {p.year}.</p>
                  {p.doi && (
                    <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-mono text-synapse hover:underline">
                      doi:{p.doi}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {r.software.length > 0 && (
          <section aria-labelledby="code">
            <h2 id="code" className="mb-4 font-display text-2xl font-semibold text-ivory">Code</h2>
            <ul className="space-y-3">
              {r.software.map((sw) => (
                <li key={sw.href}>
                  <a href={sw.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-synapse hover:underline">
                    <Github className="h-4 w-4" aria-hidden="true" />
                    {sw.name}
                  </a>
                  <span className="text-muted">. {sw.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {projects.length > 0 && (
          <section aria-labelledby="applied">
            <h2 id="applied" className="mb-4 font-display text-2xl font-semibold text-ivory">Where it was applied</h2>
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="font-medium text-synapse hover:underline">{p.headline}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {r.lineage && (
          <section aria-labelledby="lineage">
            <h2 id="lineage" className="mb-4 font-display text-2xl font-semibold text-ivory">Lineage</h2>
            <dl className="space-y-3 text-ivory/85">
              {r.lineage.before && (<div><dt className="text-[11px] font-mono uppercase tracking-wider text-muted">Came before</dt><dd className="mt-1">{r.lineage.before}</dd></div>)}
              {r.lineage.after && (<div><dt className="text-[11px] font-mono uppercase tracking-wider text-muted">Led to</dt><dd className="mt-1">{r.lineage.after}</dd></div>)}
            </dl>
          </section>
        )}

        <section aria-labelledby="sources" className="border-t border-border pt-6">
          <h2 id="sources" className="mb-3 font-mono text-sm uppercase tracking-widest text-muted">Sources for this page</h2>
          <ul className="space-y-1 text-sm">
            {r.provenance.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-synapse">
                  {s.label}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <GraphConnections type="research" contentKey={r.slug} exclude={['publication']} />
    </article>
  )
}
