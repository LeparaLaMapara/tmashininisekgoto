import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Github, ExternalLink, FileText, BookOpen, Package, Boxes } from 'lucide-react'
import { getProjectBySlug, getProjectsOrdered, PROJECT_CATEGORIES, type Artifact } from '@/lib/data'
import { JsonLd } from '@/components/seo/json-ld'
import { projectSchema, breadcrumbSchema } from '@/lib/schema'
import { GraphConnections } from '@/components/graph/connections'
import { TopicLinks } from '@/components/graph/topic-links'
import { getOrg } from '@/lib/graph/organizations'
import { SITE_URL, ogImages } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getProjectsOrdered().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  // The title names what the thing is. It used to be the card's argument
  // ("You should not have to become a specialist to get a clean signal"),
  // which left the project's own name out of the strongest ranking signal.
  const url = `${SITE_URL}/work/${slug}`
  return {
    title: project.headline,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.headline,
      description: project.summary,
      url,
      type: 'article',
      siteName: 'Thabang Mashinini-Sekgoto',
      locale: 'en_ZA',
      images: ogImages(`${project.headline}, work by Thabang Mashinini-Sekgoto`, project.headline, project.cardTitle),
    },
  }
}

const ARTIFACT_META: Record<Artifact['kind'], { icon: typeof Github; label: string }> = {
  github: { icon: Github, label: 'GitHub' },
  pypi: { icon: Package, label: 'PyPI' },
  docs: { icon: BookOpen, label: 'Documentation' },
  examples: { icon: Boxes, label: 'Examples' },
  paper: { icon: FileText, label: 'Paper' },
  publication: { icon: FileText, label: 'Publication' },
  site: { icon: ExternalLink, label: 'Live site' },
  product: { icon: ExternalLink, label: 'Product' },
}

const KIND_LABEL = {
  software: 'Open source software',
  system: 'Production system',
  programme: 'Programme of work',
} as const

const STATUS_LABEL = { active: 'Active', maintained: 'Maintained', completed: 'Completed' } as const

/** The case-study sections, in reading order, each rendered only if it has content. */
const SECTIONS: { key: keyof NonNullable<ReturnType<typeof getProjectBySlug>>['caseStudy']; label: string }[] = [
  { key: 'problem', label: 'The problem' },
  { key: 'why', label: 'Why it mattered' },
  { key: 'context', label: 'The context' },
  { key: 'contribution', label: 'What I did' },
  { key: 'changed', label: 'What changed' },
  { key: 'benefited', label: 'Who benefited' },
  { key: 'remained', label: 'What remained' },
]

export default async function WorkCaseStudy({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const cs = project.caseStudy
  const org = project.organization ? getOrg(project.organization) : undefined
  const before = project.lineage?.filter((l) => l.relation === 'before') ?? []
  const after = project.lineage?.filter((l) => l.relation === 'after') ?? []

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: 'What it is', value: KIND_LABEL[project.kind] },
    { label: 'Role', value: project.role },
    ...(org ? [{ label: 'Organisation', value: org.name }] : []),
    { label: 'Period', value: project.period },
    { label: 'Status', value: STATUS_LABEL[project.status] },
    ...(project.license ? [{ label: 'Licence', value: project.license }] : []),
    ...(project.authors?.length ? [{ label: 'Package authors', value: project.authors.join(', ') }] : []),
    ...(project.technologies.length ? [{ label: 'Built with', value: <TopicLinks slugs={project.technologies} /> }] : []),
    { label: 'Topics', value: <TopicLinks slugs={project.graphTopics} /> },
  ]

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          projectSchema(project),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.headline, path: `/work/${slug}` },
          ]),
        ]}
      />

      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse mb-10"
      >
        <ArrowLeft className="h-4 w-4" />
        All work
      </Link>

      <header className="mb-10">
        <span className="text-[11px] font-mono uppercase tracking-wider text-synapse-ink">
          {PROJECT_CATEGORIES[project.category] ?? project.category}
          {org ? ` · ${org.name}` : ''}
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ivory leading-tight">
          {project.headline}
        </h1>
        {/* The argument the work makes, kept as the lede: it is the voice of
            the page, it is just no longer standing in for the name. */}
        <p className="mt-4 font-display text-xl italic text-ivory/90 leading-snug">{project.cardTitle}</p>
        <p className="mt-4 text-lg text-ivory/85 leading-relaxed">{project.oneLiner}</p>

        {/* At a glance: the facts a reader, or a machine, needs before the story. */}
        <dl className="mt-8 grid gap-x-6 gap-y-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-[9rem_1fr]">
          {facts.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="text-[11px] font-mono uppercase tracking-wider text-muted sm:pt-1">{label}</dt>
              <dd className="text-[0.9375rem] text-ivory/85">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Public proof */}
        {project.artifacts.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted">Inspect it</span>
            {project.artifacts.map((art) => {
              const meta = ARTIFACT_META[art.kind]
              return (
                <a
                  key={art.href}
                  href={art.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-synapse transition-colors"
                >
                  <meta.icon className="h-4 w-4" aria-hidden="true" />
                  {art.label ?? meta.label}
                </a>
              )
            })}
          </div>
        )}
      </header>

      {project.image && (
        <div className={`relative mb-12 aspect-video overflow-hidden rounded-2xl border border-border ${project.imageFit === 'contain' ? 'bg-white' : ''}`}>
          <Image
            src={project.image}
            alt={`${project.headline}: ${project.cardTitle}`}
            fill
            className={project.imageFit === 'contain' ? 'object-contain p-10' : 'object-cover'}
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* The case study */}
      <div className="space-y-10">
        {SECTIONS.map(({ key, label }) =>
          cs[key] ? (
            <section key={key}>
              <h2 className="font-display text-sm font-mono uppercase tracking-widest text-signal mb-3">
                {label}
              </h2>
              <p className="text-lg text-ivory/85 leading-relaxed whitespace-pre-line">{cs[key]}</p>
            </section>
          ) : null
        )}

        {/* Technical context, for readers who want the stack */}
        {cs.technicalContext && (
          <details className="rounded-2xl border border-border bg-surface p-5">
            <summary className="cursor-pointer text-sm font-mono uppercase tracking-wider text-muted">
              Technical context
            </summary>
            <p className="mt-3 text-[0.9375rem] text-ivory/80 leading-relaxed">{cs.technicalContext}</p>
          </details>
        )}
      </div>

      {/* Lineage: what this came from and what it led to, in the public record. */}
      {(before.length > 0 || after.length > 0) && (
        <section className="mt-12 border-t border-border pt-8" aria-labelledby="lineage">
          <h2 id="lineage" className="font-display text-2xl font-semibold text-ivory mb-5">Lineage</h2>
          <dl className="space-y-4">
            {[...before.map((l) => ({ ...l, label: 'Came before' })), ...after.map((l) => ({ ...l, label: 'Led to' }))].map((l) => (
              <div key={`${l.relation}:${l.name}`}>
                <dt className="text-[11px] font-mono uppercase tracking-wider text-muted">{l.label}</dt>
                <dd className="mt-1 text-ivory/85">
                  {l.href ? (
                    l.href.startsWith('/') ? (
                      <Link href={l.href} className="font-medium text-synapse hover:underline">{l.name}</Link>
                    ) : (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="font-medium text-synapse hover:underline">{l.name}</a>
                    )
                  ) : (
                    <span className="font-medium">{l.name}</span>
                  )}
                  <span className="text-muted">. {l.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Cross-link to the CV */}
      {project.resume && (
        <div className="mt-12 border-t border-border pt-6">
          <Link href="/resume" className="inline-flex items-center gap-1.5 text-sm text-synapse hover:gap-2.5 transition-all">
            See the full role: {project.resume.org} ({project.resume.period})
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Everything connected to this work, from the content graph */}
      <GraphConnections type="project" contentKey={project.slug} />
    </article>
  )
}
