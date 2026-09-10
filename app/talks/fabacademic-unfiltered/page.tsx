import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { TALKS } from '@/lib/data'
import { pageOpenGraph } from '@/lib/site'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { JsonLd } from '@/components/seo/json-ld'
import { talksSchema, breadcrumbSchema } from '@/lib/schema'
import { TalkCard, formatTalkDate } from '@/components/talks/talk-card'

const SERIES = 'FabAcademic Unfiltered'
const CHANNEL = 'https://www.youtube.com/@Fabacademic'

export const metadata: Metadata = {
  title: 'FabAcademic Unfiltered',
  description:
    'A continuing series of practical conversations about AI, learning, research and building things, co-hosted with Prof. Mamokgethi Phakeng.',
  alternates: { canonical: '/talks/fabacademic-unfiltered' },
  openGraph: pageOpenGraph(
    '/talks/fabacademic-unfiltered',
    'FabAcademic Unfiltered, a series with Prof. Mamokgethi Phakeng'
  ),
}

export default function FabAcademicSeriesPage() {
  const episodes = TALKS.filter((t) => t.series === SERIES).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const topics = Array.from(new Set(episodes.flatMap((e) => e.topics))).sort()
  const first = episodes[episodes.length - 1]
  const latest = episodes[0]

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <JsonLd
        data={[
          talksSchema(episodes),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Talks', path: '/talks' },
            { name: SERIES, path: '/talks/fabacademic-unfiltered' },
          ]),
        ]}
      />

      <div className="mx-auto max-w-6xl">
        <Link
          href="/talks"
          className="mb-10 inline-flex items-center gap-1.5 text-base text-muted transition-colors hover:text-synapse"
        >
          <ArrowLeft className="h-4 w-4" />
          All talks
        </Link>

        <ScrollReveal>
          <header className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-wider text-synapse-ink">
              Series · {episodes.length} episodes · Co-host
            </span>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-ivory">
              FabAcademic <span className="text-synapse">Unfiltered</span>
            </h1>
            <p className="mt-2 text-muted">With Prof. Mamokgethi Phakeng</p>
            <p className="mt-6 text-lg text-ivory/85 leading-relaxed">
              A continuing series of practical conversations about AI, learning,
              research and building things. Less about what the technology might do
              one day, more about what someone can actually do with it this week.
            </p>
            {latest && first && (
              <p className="mt-4 text-sm text-muted">
                {formatTalkDate(first.date)} to {formatTalkDate(latest.date)}
              </p>
            )}

            {topics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/search?q=${encodeURIComponent(topic)}`}
                    className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            )}

            <a
              href={CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-synapse transition-colors hover:underline"
            >
              The channel on YouTube
              <ExternalLink className="h-4 w-4" />
            </a>
          </header>
        </ScrollReveal>

        {/* Every episode, newest first. */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ivory">All episodes</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {episodes.map((talk, i) => (
              <ScrollReveal key={talk.id} delay={Math.min(i, 5) * 0.05}>
                <TalkCard talk={talk} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
