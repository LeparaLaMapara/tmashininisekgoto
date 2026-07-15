import { ImpactCounters } from '@/components/home/impact-counters'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

const AUDIENCES = [
  { label: 'For banks and telecoms', detail: 'production AI at enterprise scale' },
  { label: 'For research', detail: 'a PhD and published work at Wits' },
  { label: 'For my township', detail: 'schools and businesses in Soshanguve' },
  { label: 'For my family', detail: 'tools my own parents use' },
]

export default function Home() {
  return (
    <>
      {/* Hero — paper, ink, and one clear sentence */}
      <section className="relative min-h-[88vh] flex items-center px-6 pt-28 pb-16">
        <div className="mx-auto max-w-5xl w-full">
          <ScrollReveal delay={0.1}>
            <p className="text-sm font-mono text-synapse tracking-widest uppercase mb-6">
              Thabang means rejoice · Ubunye means unity
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-8">
              I build AI systems that work
              <br />
              in the real world<span className="text-synapse">.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl mb-10">
              {AUDIENCES.map((a) => (
                <p key={a.label} className="text-lg text-ivory/85 leading-snug">
                  <span className="font-medium">{a.label}</span>
                  <br />
                  <span className="text-muted">{a.detail}</span>
                </p>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.55}>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ivory text-void font-medium text-base hover:opacity-90 transition-all glow-synapse"
              >
                See the proof
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-synapse/40 text-synapse font-medium text-base hover:bg-synapse/10 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Talk to Thabang AI
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center mb-4">
              Real impact, real numbers
            </h2>
            <p className="text-muted text-lg text-center max-w-2xl mx-auto mb-16">
              Not demos. Not proofs of concept. Production systems that survive noisy data,
              organizational constraints, and real human use.
            </p>
          </ScrollReveal>
          <ImpactCounters />
        </div>
      </section>

      {/* Brief intro */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="font-display text-2xl sm:text-3xl text-ivory leading-snug">
              I&apos;m an AI researcher at the{' '}
              <span className="text-signal">University of the Witwatersrand</span> and the
              founder of <span className="text-synapse">Ubunye AI Ecosystems</span>.
            </p>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Ubunye means unity in isiZulu, and it is the thread through everything I make.
              The same hands that build machine learning platforms for banks build websites
              for schools and small businesses in Soshanguve, where I am from. Serious
              engineering, shared with everyone.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-10 flex items-center justify-center gap-6 text-base text-muted flex-wrap">
              <span>Vodacom</span>
              <span className="w-1 h-1 rounded-full bg-synapse" />
              <span>ABSA</span>
              <span className="w-1 h-1 rounded-full bg-synapse" />
              <span>IBM Research</span>
              <span className="w-1 h-1 rounded-full bg-synapse" />
              <span>Wits University</span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
