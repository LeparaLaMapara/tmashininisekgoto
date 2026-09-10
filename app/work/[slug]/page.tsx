import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Github, ExternalLink, FileText, BookOpen, Package, Boxes } from 'lucide-react'
import { getProjectBySlug, getProjectsOrdered, PROJECT_CATEGORIES, type Artifact } from '@/lib/data'
import { JsonLd } from '@/components/seo/json-ld'
import { creativeWorkSchema, breadcrumbSchema } from '@/lib/schema'
import { RelatedContent } from '@/components/blog/related-content'
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

  const url = `${SITE_URL}/work/${slug}`
  return {
    title: project.cardTitle,
    description: project.oneLiner,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.cardTitle,
      description: project.oneLiner,
      url,
      type: 'article',
      siteName: 'Thabang Mashinini-Sekgoto',
      locale: 'en_ZA',
      images: ogImages(
        `${project.cardTitle} — work by Thabang Mashinini-Sekgoto`,
        project.cardTitle,
        project.oneLiner.slice(0, 100)
      ),
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

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          creativeWorkSchema({
            slug: project.slug,
            name: project.cardTitle,
            description: project.oneLiner,
            topics: project.topics,
            artifactUrls: project.artifacts.map((a) => a.href),
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.cardTitle, path: `/work/${slug}` },
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
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ivory leading-tight">
          {project.cardTitle}
        </h1>
        <p className="mt-4 text-lg text-ivory/85 leading-relaxed">{project.oneLiner}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.topics.map((topic) => (
            <span key={topic} className="rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-muted">
              {topic}
            </span>
          ))}
        </div>

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
                  <meta.icon className="h-4 w-4" />
                  {art.label ?? meta.label}
                </a>
              )
            })}
          </div>
        )}
      </header>

      {project.image && (
        <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border border-border">
          <Image
            src={project.image}
            alt={`${project.cardTitle} — ${project.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* The case study */}
      <div className="space-y-10">
        {SECTIONS.map(({ key, label }) =>
          cs[key] ? (
            <div key={key}>
              <h2 className="font-display text-sm font-mono uppercase tracking-widest text-signal mb-3">
                {label}
              </h2>
              <p className="text-lg text-ivory/85 leading-relaxed whitespace-pre-line">{cs[key]}</p>
            </div>
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

      {/* Cross-link to the CV */}
      {project.resume && (
        <div className="mt-12 border-t border-border pt-6">
          <Link href="/resume" className="inline-flex items-center gap-1.5 text-sm text-synapse hover:gap-2.5 transition-all">
            See the full role: {project.resume.org} ({project.resume.period})
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Related across writing, work, research and talks */}
      <RelatedContent type="Project" contentKey={project.slug} heading="Related" />
    </section>
  )
}
