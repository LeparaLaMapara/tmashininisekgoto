import type { Metadata } from 'next'
import Link from 'next/link'
import { pageOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { publicationsSchema, breadcrumbSchema } from '@/lib/schema'
import { citations } from '@/lib/citations'
import { citationTotal, citationsFetchedAt, getPublications } from '@/lib/publications'
import { CiteBox } from '@/components/publications/cite-box'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { formatDate } from '@/lib/utils'
import { ExternalLink, GraduationCap, Brain, Sparkles, FileDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Publications: ML & Deep Learning Research',
  description:
    'Journal papers, a NeurIPS workshop paper, a conference abstract and an MSc thesis: hearing loss in mine workers, climate forecasting, echo state networks.',
  alternates: { canonical: '/publications' },

  openGraph: pageOpenGraph('/publications', 'Publications by Thabang Mashinini-Sekgoto'),
}

export default function PublicationsPage() {
  const publications = getPublications()
  const sorted = [...publications].sort((a, b) => b.year - a.year)
  const totalCitations = citationTotal()

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <JsonLd
        data={[
          ...publicationsSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Publications', path: '/publications' },
          ]),
        ]}
      />
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <ScrollReveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-synapse">Publications</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mb-6">
            Research in occupational health, seasonal climate forecasting and computer
            vision: two journal papers, a workshop paper, a conference abstract and a
            thesis. Each belongs to a research line described in full, with its
            question, method and findings, under{' '}
            <Link href="/research" className="text-synapse underline underline-offset-2 hover:no-underline">Research</Link>.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-muted mb-4">
            <span className="rounded-full border border-border bg-surface px-4 py-1.5">
              {publications.length} publications
            </span>
            <span className="rounded-full border border-border bg-surface px-4 py-1.5">
              {totalCitations} citations (highest observed per paper)
            </span>
            {/* Plain <a>: /publications.bib is a route handler, not a page, so a
                soft navigation would have nothing to render. */}
            <a
              href="/publications.bib"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 transition-colors hover:border-synapse/30 hover:text-ivory"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              BibTeX for all
            </a>
          </div>
          {/* Where the numbers come from, stated rather than implied. The providers
              disagree, and no one of them is exact, so the figure is labelled as the
              highest observed, with its source, and the retrieval date is stated
              only for the counts a script actually retrieved. */}
          <p className="text-xs font-mono text-muted mb-16 max-w-2xl leading-relaxed">
            Each paper shows the highest citation count observed across Google Scholar,
            Semantic Scholar and Crossref, labelled with its source; hover for all three.
            The providers disagree and none is treated as exact. Semantic Scholar and
            Crossref counts were retrieved on {formatDate(citationsFetchedAt())}. Google
            Scholar counts were recorded by hand from the Scholar profile and carry no
            retrieval date.
          </p>
        </ScrollReveal>

        {/* Publications list */}
        <div className="space-y-8">
          {sorted.map((pub, i) => {
            const isThesis = pub.venue.includes('MSc Thesis')
            return (
              <ScrollReveal key={pub.title} delay={i * 0.05}>
                <article
                  id={pub.key}
                  className={`relative scroll-mt-28 rounded-2xl border p-6 sm:p-8 transition-colors ${
                    isThesis
                      ? 'border-signal/30 bg-signal/[0.03]'
                      : 'border-border bg-surface/50 hover:border-synapse/20'
                  }`}
                >
                  {/* Thesis badge */}
                  {isThesis && (
                    <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-signal/15 border border-signal/30 px-3 py-1 text-xs font-mono text-signal">
                      <GraduationCap className="w-3.5 h-3.5" />
                      MSc Thesis
                    </div>
                  )}

                  {/* Year and venue */}
                  <div className="flex items-center gap-3 text-sm font-mono text-muted mb-3">
                    <span className="text-synapse-ink font-semibold">{pub.year}</span>
                    <span className="text-border">|</span>
                    <span className="line-clamp-1">{pub.venue}</span>
                    {pub.bestCitation && (
                      <>
                        <span className="text-border">|</span>
                        <span
                          title={pub.citationCounts
                            .map((c) => `${c.source}: ${c.count}`)
                            .join(' · ')}
                        >
                          {/* No opacity on the source label: dimming small text
                              below full --color-muted is what caused the two
                              contrast failures fixed in SEO-AUDIT.md. */}
                          {pub.bestCitation.count} citations, highest observed ({pub.bestCitation.source})
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-xl font-semibold text-ivory mb-2 leading-snug">
                    {pub.title}
                  </h2>

                  {/* Authors */}
                  <p className="text-sm text-muted mb-5">{pub.authors}</p>

                  {/* AI Summary */}
                  <div className="rounded-xl border border-synapse/15 bg-synapse/[0.04] p-4 mb-5">
                    <div className="flex items-center gap-2 text-synapse-ink text-sm font-medium mb-2">
                      <Brain className="w-4 h-4" aria-hidden="true" />
                      What the abstract reports
                    </div>
                    <p className="text-[0.9375rem] text-ivory/80 leading-relaxed">
                      {pub.aiSummary}
                    </p>
                  </div>

                  {/* Applications */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 text-muted text-sm font-medium mb-2.5">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      Possible applications (not results)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pub.applications.map((app) => (
                        <span
                          key={app}
                          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-muted"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scholar link */}
                  <a
                    href={pub.scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-synapse-ink hover:text-synapse transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {pub.scholarUrl.includes('scholar.google')
                      ? 'View on Google Scholar'
                      : pub.scholarUrl.includes('wiredspace') || pub.scholarUrl.includes('hdl.handle.net')
                        ? 'View on WIReDSpace'
                        : 'View the abstract'}
                  </a>
                  {pub.arxiv && (
                    <a
                      href={`https://arxiv.org/abs/${pub.arxiv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-5 inline-flex items-center gap-2 text-sm font-medium text-synapse-ink hover:text-synapse transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      arXiv:{pub.arxiv}
                    </a>
                  )}
                  <Link
                    href={`/research/${pub.research}`}
                    className="ml-5 inline-flex items-center gap-2 text-sm font-medium text-synapse-ink hover:text-synapse transition-colors"
                  >
                    The research behind it
                  </Link>

                  {/* Generated on the server so the strings are deterministic;
                      the client component only toggles and copies. */}
                  <CiteBox citations={citations(pub)} />
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}
