import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { TALKS, WRITINGS, SOCIAL_LINKS } from '@/lib/data'
import { pageOpenGraph } from '@/lib/site'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { JsonLd } from '@/components/seo/json-ld'
import { talksSchema, breadcrumbSchema } from '@/lib/schema'
import { TalkCard, formatTalkDate } from '@/components/talks/talk-card'

export const metadata: Metadata = {
  title: 'Talks, Teaching & Media',
  description:
    'Talks, conversations, demonstrations and interviews about AI, research, technology and learning, including the FabAcademic Unfiltered series with Prof. Mamokgethi Phakeng.',
  alternates: { canonical: '/talks' },
  openGraph: pageOpenGraph('/talks', 'Talks, teaching and media by Thabang Mashinini-Sekgoto'),
}

const byNewest = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()

/** Every distinct topic across the archive, for the browse strip. */
function allTopics() {
  return Array.from(new Set(TALKS.flatMap((t) => t.topics))).sort()
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ivory">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-muted leading-relaxed">{subtitle}</p>}
    </>
  )
}

export default function TalksPage() {
  const sorted = [...TALKS].sort(byNewest)
  const featured = sorted.filter((t) => t.featured)
  const series = sorted.filter((t) => t.series === 'FabAcademic Unfiltered')
  const interviews = sorted.filter((t) => t.kind === 'interview')
  const archive = sorted.filter((t) => t.kind === 'archive')
  // Standalone talks that are not part of a series. Empty today; the section
  // hides itself rather than sitting there as a promise.
  const standalone = sorted.filter((t) => t.kind === 'talk')

  const seriesLatest = series[0]
  const seriesPicks = series.filter((t) => t.featured).slice(0, 3)
  const seriesTopics = Array.from(new Set(series.flatMap((t) => t.topics))).slice(0, 6)

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <JsonLd
        data={[
          talksSchema(sorted),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Talks', path: '/talks' },
          ]),
        ]}
      />

      <div className="mx-auto max-w-6xl">
        {/* Introduction */}
        <ScrollReveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Talks, Teaching &amp; <span className="text-synapse">Media</span>
          </h1>
          <p className="mb-16 max-w-2xl text-lg text-muted leading-relaxed">
            Conversations, demonstrations and interviews about AI, research and
            learning. I like explaining things, so most of what I have understood
            properly ends up here in one form or another.
          </p>
        </ScrollReveal>

        {/* Featured: chosen to show range, not ranking. */}
        {featured.length > 0 && (
          <section className="mb-24">
            <ScrollReveal>
              <SectionHeading
                title="Featured"
                subtitle="A few that show the range, from teaching people to build with AI to talking about galaxies on the news."
              />
            </ScrollReveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((talk, i) => (
                <ScrollReveal key={talk.id} delay={i * 0.06}>
                  <TalkCard talk={talk} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* The series, as one body of work rather than fourteen loose cards. */}
        {series.length > 0 && (
          <section className="mb-24">
            <ScrollReveal>
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <span className="font-mono text-[11px] uppercase tracking-wider text-synapse-ink">
                  Series · {series.length} episodes
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ivory">
                  FabAcademic Unfiltered
                </h2>
                <p className="mt-1 text-muted">With Prof. Mamokgethi Phakeng</p>
                <p className="mt-4 max-w-2xl text-lg text-ivory/85 leading-relaxed">
                  A continuing series of practical conversations about AI, learning,
                  research and building things. Less about what the technology might
                  do one day, more about what someone can actually do with it this
                  week.
                </p>

                {seriesTopics.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {seriesTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {seriesLatest && (
                  <p className="mt-5 text-sm text-muted">
                    Latest:{' '}
                    <span className="text-ivory">{seriesLatest.title}</span>{' '}
                    <span className="text-muted">· {formatTalkDate(seriesLatest.date)}</span>
                  </p>
                )}

                <Link
                  href="/talks/fabacademic-unfiltered"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-synapse transition-all hover:gap-2.5"
                >
                  Explore the series
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>

            {seriesPicks.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {seriesPicks.map((talk, i) => (
                  <ScrollReveal key={talk.id} delay={i * 0.06}>
                    <TalkCard talk={talk} compact />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Standalone talks and teaching, when there are any. */}
        {standalone.length > 0 && (
          <section className="mb-24">
            <ScrollReveal>
              <SectionHeading title="Talks & teaching" />
            </ScrollReveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {standalone.map((talk, i) => (
                <ScrollReveal key={talk.id} delay={i * 0.06}>
                  <TalkCard talk={talk} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Interviews and media */}
        {interviews.length > 0 && (
          <section className="mb-24">
            <ScrollReveal>
              <SectionHeading
                title="Interviews & media"
                subtitle="Appearances where somebody else was asking the questions."
              />
            </ScrollReveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((talk, i) => (
                <ScrollReveal key={talk.id} delay={i * 0.06}>
                  <TalkCard talk={talk} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Third-party coverage. Explicitly about, not by. */}
        {WRITINGS.length > 0 && (
          <section className="mb-24">
            <ScrollReveal>
              <SectionHeading
                title="Press & coverage"
                subtitle="Written by other people, about work I was part of."
              />
            </ScrollReveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {WRITINGS.map((writing, i) => (
                <ScrollReveal key={writing.id} delay={i * 0.06}>
                  <a
                    href={writing.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-synapse/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-synapse-ink">
                          {writing.outlet} ·{' '}
                          {writing.authorship === 'about' ? 'About the work' : 'Written by me'}
                        </span>
                        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-ivory transition-colors group-hover:text-synapse">
                          {writing.title}
                        </h3>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                          {writing.description}
                        </p>
                        <span className="mt-3 block text-sm text-muted">{writing.date}</span>
                      </div>
                      <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-muted transition-colors group-hover:text-synapse" />
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Older material keeps its place, without equal billing. */}
        {archive.length > 0 && (
          <section className="mb-24">
            <ScrollReveal>
              <SectionHeading
                title="From the archive"
                subtitle="Earlier talks and student projects. Kept because they are part of the record."
              />
            </ScrollReveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {archive.map((talk, i) => (
                <ScrollReveal key={talk.id} delay={i * 0.06}>
                  <TalkCard talk={talk} compact />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Topics, wired to the site-wide search so they lead somewhere real. */}
        <section className="mb-24">
          <ScrollReveal>
            <SectionHeading
              title="Explore by topic"
              subtitle="Each one searches everything on the site, not only this page."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {allTopics().map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-sm text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Closing invitation, reusing the existing booking link. */}
        <ScrollReveal>
          <section className="border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold text-ivory">Invite me to speak</h2>
            <p className="mt-3 max-w-2xl text-muted leading-relaxed">
              I enjoy conversations about AI, research, building things and making
              complicated ideas easier to understand. If that is useful to your
              event, class or team, get in touch.
            </p>
            <a
              href={SOCIAL_LINKS.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-synapse transition-all hover:gap-2.5"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
