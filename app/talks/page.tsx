import type { Metadata } from 'next'
import { TALKS, WRITINGS } from '@/lib/data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ExternalLink, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Talks & Press',
  description: 'Talks, interviews, and press coverage featuring Thabang Mashinini-Sekgoto.',
}

export default function TalksPage() {
  // Sort talks by date, newest first
  const sortedTalks = [...TALKS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <ScrollReveal>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Talks &{' '}<span className="text-synapse">Press</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mb-16">
            Conversations about AI, distributed systems, and making technology accessible.
            From SABC News to FabAcademic with Prof Mamokgethi Phakeng.
          </p>
        </ScrollReveal>

        {/* Talks Grid */}
        <section className="mb-24">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold mb-8">
              Talks & Interviews
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {sortedTalks.map((talk, i) => (
              <ScrollReveal key={talk.id} delay={i * 0.1}>
                <div className="bg-surface rounded-2xl border border-border overflow-hidden hover:border-synapse/20 transition-colors">
                  {/* Video embed */}
                  <div className="aspect-video">
                    <iframe
                      src={talk.videoUrl}
                      title={talk.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl mb-2 text-ivory">
                      {talk.title}
                    </h3>
                    <p className="text-[0.9375rem] text-muted mb-4 leading-relaxed">{talk.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted">
                        <span className="text-synapse">{talk.event}</span>
                        <span className="mx-2">&middot;</span>
                        <span>
                          {new Date(talk.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {talk.slidesUrl && (
                        <a
                          href={talk.slidesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-synapse hover:text-synapse/80 flex items-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4" />
                          {talk.slidesLabel || 'Slides'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section>
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold mb-8">
              Press & Publications
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {WRITINGS.map((writing, i) => (
              <ScrollReveal key={writing.id} delay={i * 0.1}>
                <a
                  href={writing.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-surface rounded-2xl border border-border p-6 hover:border-synapse/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-bold text-xl mb-2 text-ivory group-hover:text-synapse transition-colors">
                        {writing.title}
                      </h3>
                      <p className="text-[0.9375rem] text-muted mb-3 leading-relaxed">
                        {writing.description}
                      </p>
                      <span className="text-sm text-muted">{writing.date}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted group-hover:text-synapse transition-colors flex-shrink-0 mt-1" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
