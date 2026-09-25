import Link from 'next/link'
import { JsonLd } from '@/components/seo/json-ld'
import { publicationsSchema } from '@/lib/schema'
import { citations } from '@/lib/citations'
import { citationTotal, citationsFetchedAt, getPublications } from '@/lib/publications'
import { CiteBox } from '@/components/publications/cite-box'
import { formatDate } from '@/lib/utils'
import { ExternalLink, GraduationCap, Brain, Sparkles, FileDown } from 'lucide-react'

/**
 * The papers, as the body of /research: the overall citation count on top, then
 * every paper newest first, with or without citations.
 *
 * This was the /publications page until 2026-09-24, when Thabang asked why the
 * research and the papers behind it were two menu items. The paper cards, their
 * anchors (`#<key>`), the citation notes and the Scholarly JSON-LD are unchanged;
 * /publications now redirects here (next.config.mjs), and browsers carry the
 * `#<key>` fragment across the redirect so old deep links still land on a paper.
 */
export function Papers() {
  const publications = getPublications()
  const sorted = [...publications].sort((a, b) => b.year - a.year)
  const totalCitations = citationTotal()

  return (
    <section id="papers" className="mt-10 scroll-mt-28">
      <JsonLd data={publicationsSchema()} />
      <div>
        {/* Header */}
        <div>
          {/* The overall citation count leads, as Thabang asked (2026-09-25). */}
          <div className="papers-total flex flex-wrap items-end gap-x-8 gap-y-3 mb-4">
            <p className="leading-none">
              <span className="font-sign text-5xl sm:text-6xl text-synapse-ink">{totalCitations}</span>
              <span className="ml-3 font-display text-xl font-bold text-ivory">citations</span>
            </p>
            <p className="font-mono text-sm text-muted pb-1">
              across {publications.length} papers
            </p>
            {/* Plain <a>: /publications.bib is a route handler, not a page, so a
                soft navigation would have nothing to render. */}
            <a
              href="/publications.bib"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-4 py-1.5 font-mono text-sm text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
            >
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
              BibTeX for all
            </a>
          </div>
          <h2 className="sr-only">Papers, newest first</h2>
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
        </div>

        {/* Publications list */}
        <div className="space-y-8">
          {sorted.map((pub) => {
            const isThesis = pub.venue.includes('MSc Thesis')
            return (
              <div key={pub.title}>
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
                    <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-sm bg-signal/15 border border-signal/30 px-3 py-1 text-xs font-mono text-signal">
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
                  <h3 className="font-display text-xl font-semibold text-ivory mb-2 leading-snug">
                    {pub.title}
                  </h3>

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
                          className="rounded-sm border border-border bg-surface px-3 py-1 text-xs font-mono text-muted"
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
