'use client'

import { BIO, IMPACT_NUMBERS, SOCIAL_LINKS } from '@/lib/data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { AnimatedCounter } from '@/components/ui/animated-counter'

function parseImpactValue(value: string) {
  if (value.includes('-')) {
    return { display: value, numericEnd: parseInt(value.split('-')[1]), isRange: true, prefix: '', unitSuffix: '' }
  }
  const match = value.match(/^R?(\d+)([BMK]?)$/)
  if (match) {
    return {
      display: value,
      numericEnd: parseInt(match[1]),
      prefix: value.startsWith('R') ? 'R' : '',
      unitSuffix: match[2] || '',
      isRange: false,
    }
  }
  return { display: value, numericEnd: parseInt(value) || 0, isRange: false, prefix: '', unitSuffix: '' }
}

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {/* Bio Card — spans 2 cols */}
      <ScrollReveal delay={0} className="md:col-span-2">
        <div className="glass border border-border rounded-2xl p-8 h-full">
          <span className="inline-block font-mono text-xs text-synapse tracking-wider uppercase mb-4">
            Who I Am
          </span>
          <h3 className="font-display text-2xl font-bold mb-4">
            {BIO.name}
          </h3>
          <p className="text-ivory/80 leading-relaxed mb-4">
            {BIO.shortBio}
          </p>
          <div className="space-y-4 mb-4">
            {[
              { label: 'Impact', color: 'text-synapse', text: 'Built AI systems that cut processing times by up to 90%, contributed to R1B+ in savings, and improved forecast accuracy for climate risk intelligence.' },
              { label: 'Open Source', color: 'text-signal', text: 'Creator of the Ubunye Engine, an open-source ML framework with declarative ETL, feature stores, and YAML-driven pipelines. I build tools so others can build faster.' },
              { label: 'Teaching', color: 'text-accent', text: 'Training the next generation in practical AI through hands-on courses, from zero-code AI agents for everyday professionals to advanced agentic engineering for developers.' },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-synapse/50 flex-shrink-0" />
                <div>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.label}</span>
                  <p className="text-sm text-ivory/70 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-ivory/60 leading-relaxed text-sm">
            I believe in building technology that uplifts communities
            and making AI knowledge accessible to everyone, not just those with PhDs.
          </p>
        </div>
      </ScrollReveal>

      {/* Impact Numbers Card — spans 1 col */}
      <ScrollReveal delay={0.1}>
        <div className="glass border border-border rounded-2xl p-8 h-full">
          <span className="inline-block font-mono text-xs text-synapse tracking-wider uppercase mb-6">
            Impact
          </span>
          <div className="space-y-6">
            {IMPACT_NUMBERS.map((item) => {
              const parsed = parseImpactValue(item.value)
              return (
                <div key={item.label}>
                  <div className="font-display text-3xl font-bold text-synapse mb-1">
                    {parsed.isRange ? (
                      <span>80-90{item.suffix}</span>
                    ) : (
                      <>
                        {parsed.prefix}
                        <AnimatedCounter end={parsed.numericEnd} duration={2.5} />
                        {parsed.unitSuffix}
                        {item.suffix}
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium text-ivory/80">{item.label}</p>
                  <p className="text-xs text-muted">{item.context}</p>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Hobbies Card — spans 1 col */}
      <ScrollReveal delay={0.2}>
        <div className="glass border border-border rounded-2xl p-8 h-full">
          <span className="inline-block font-mono text-xs text-signal tracking-wider uppercase mb-6">
            Beyond the Terminal
          </span>
          <ul className="space-y-4">
            {BIO.hobbies.map((hobby) => (
              <li
                key={hobby.label}
                className="flex items-center gap-3 text-ivory/80 hover:text-ivory hover:translate-x-1 transition-all duration-200 cursor-default"
              >
                <span className="text-xl">{hobby.emoji}</span>
                <span className="text-sm">{hobby.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>

      {/* Philosophy Quote Card — spans 1 col */}
      <ScrollReveal delay={0.25}>
        <div className="glass border border-border rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
          <svg
            className="w-10 h-10 text-synapse mb-4 drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.171 0-2.277-.566-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.171 0-2.277-.566-2.917-1.179z" />
          </svg>
          <blockquote className="font-display text-xl md:text-2xl font-semibold text-ivory leading-snug mb-4">
            {BIO.philosophy}
          </blockquote>
          <cite className="text-sm text-muted not-italic">
            — Thabang Mashinini-Sekgoto
          </cite>
        </div>
      </ScrollReveal>

      {/* Work With Me Card — spans 1 col */}
      <ScrollReveal delay={0.3}>
        <div className="glass border border-border rounded-2xl p-8 h-full flex flex-col justify-between">
          <div>
            <span className="inline-block font-mono text-xs text-accent tracking-wider uppercase mb-4">
              Collaborate
            </span>
            <h3 className="font-display text-xl font-bold mb-3">
              Work With Me
            </h3>
            <p className="text-sm text-ivory/70 leading-relaxed mb-6">
              I&apos;m open to consulting on AI systems architecture, ML
              platform engineering, and data strategy. I also do public
              speaking and advisory work. Whether you need a keynote,
              a technical advisor, or hands-on help scaling your AI
              infrastructure, let&apos;s talk.
            </p>
          </div>
          <a
            href={SOCIAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-synapse px-6 py-3 text-sm font-semibold text-void transition-all hover:bg-synapse/90 hover:shadow-lg hover:shadow-synapse/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book a Call
          </a>
        </div>
      </ScrollReveal>
    </div>
  )
}
