import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Download, MapPin, GraduationCap, Briefcase, Code, Sparkles, MessageCircle, Gamepad2 } from 'lucide-react'
import Link from 'next/link'
import { CAREER_TIMELINE, type MilestoneKind } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume and career timeline of Thabang Mashinini-Sekgoto.',
}

const KIND_ICON: Record<MilestoneKind, typeof GraduationCap> = {
  education: GraduationCap,
  work: Briefcase,
  research: Code,
}

const ACCENT_TEXT: Record<string, string> = {
  synapse: 'text-synapse',
  signal: 'text-signal',
  accent: 'text-accent',
}

const DOT_STYLES: Record<string, string> = {
  signal: 'border-signal/30 bg-signal/10 hover:shadow-[0_0_12px_-2px] hover:shadow-signal/30 transition-all',
  synapse: 'border-synapse/30 bg-synapse/10 hover:shadow-[0_0_12px_-2px] hover:shadow-synapse/30 transition-all',
  accent: 'border-accent/30 bg-accent/10 hover:shadow-[0_0_12px_-2px] hover:shadow-accent/30 transition-all',
}

export default function ResumePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">
                <span className="text-synapse">Curriculum Vitae</span>
              </h1>
              <div className="flex items-center gap-2 text-muted">
                <MapPin className="w-4 h-4" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-synapse text-void font-medium text-sm hover:bg-synapse/90 transition-all glow-synapse"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg text-ivory/80 leading-relaxed mb-8 max-w-2xl">
            Data Science and AI leader with 10+ years of experience delivering enterprise-scale analytics,
            machine learning, and AI solutions across banking, telecommunications, research, and higher education.
          </p>
        </ScrollReveal>

        {/* Talk to AI CTA */}
        <ScrollReveal delay={0.15}>
          <Link
            href="/ai"
            className="mb-16 flex items-center gap-4 rounded-2xl border border-synapse/20 bg-synapse/5 p-5 transition-all hover:bg-synapse/10 hover:border-synapse/30 group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-synapse/10 group-hover:bg-synapse/20 transition-colors">
              <Sparkles className="w-5 h-5 text-synapse" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-ivory text-[0.9375rem]">
                Want to know more? Talk to Thabang AI Assist
              </p>
              <p className="text-sm text-muted mt-0.5">
                Ask about my experience, projects, or download my latest CV, all through a conversation.
              </p>
            </div>
            <MessageCircle className="w-5 h-5 text-synapse/50 group-hover:text-synapse transition-colors shrink-0" />
          </Link>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {CAREER_TIMELINE.map((item, i) => {
              const Icon = KIND_ICON[item.kind]
              return (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="relative flex gap-6">
                  {/* Dot */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${DOT_STYLES[item.accent] ?? 'bg-surface border-border'}`}>
                    <Icon className={`w-4 h-4 ${ACCENT_TEXT[item.accent]}`} />
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <span className="text-xs font-mono text-muted">{item.period}</span>
                    <h3 className="font-display font-bold text-lg text-ivory mt-1">
                      {item.role}
                    </h3>
                    <p className="text-sm text-synapse mb-2">{item.org}</p>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/career"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-signal/10 text-signal font-medium text-sm hover:bg-signal/20 border border-signal/20 transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              Walk through my journey
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-synapse/10 text-synapse font-medium text-sm hover:bg-synapse/20 border border-synapse/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Talk to Thabang AI Assist
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
