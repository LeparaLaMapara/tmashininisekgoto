import { NeuralHero } from '@/components/home/neural-hero'
import { HeroTypewriter } from '@/components/home/hero-typewriter'
import { ImpactCounters } from '@/components/home/impact-counters'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import Link from 'next/link'
import { Sparkles, ArrowDown } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero Section — full viewport */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <NeuralHero />

        {/* Content overlay */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <ScrollReveal delay={0.2}>
            <p className="text-base font-mono text-synapse tracking-widest uppercase mb-4">
              AI Systems Architect
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              Thabang
              <br />
              <span className="bg-gradient-to-r from-synapse via-accent to-signal bg-clip-text text-transparent">
                Mashinini-Sekgoto
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="h-8 mb-8">
              <HeroTypewriter />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-synapse text-void font-medium text-base hover:bg-synapse/90 transition-all glow-synapse"
              >
                <Sparkles className="w-4 h-4" />
                Talk to Thabang AI
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-signal/30 text-ivory font-medium text-base hover:bg-signal/10 hover:border-signal/50 transition-all"
              >
                Explore my work
              </Link>
            </div>
          </ScrollReveal>

          {/* Scroll indicator */}
          <ScrollReveal delay={1.2}>
            <div className="mt-16 animate-bounce">
              <ArrowDown className="w-5 h-5 text-muted mx-auto" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">
              Real impact, <span className="text-synapse">real numbers</span>
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
            <p className="text-xl sm:text-2xl text-ivory/80 leading-relaxed font-body">
              I&apos;m an AI researcher at the{' '}
              <span className="text-synapse font-medium">University of the Witwatersrand</span>,
              founder of{' '}
              <span className="text-signal font-medium">Ubunye AI Ecosystems</span>,
              and a systems architect who believes{' '}
              <span className="text-ivory font-medium">
                AI should work reliably in the real world
              </span>
              , not just as models or demos, but as systems that survive production.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex items-center justify-center gap-6 text-base text-muted">
              <span>Vodacom</span>
              <span className="w-1 h-1 rounded-full bg-synapse-dim" />
              <span>ABSA</span>
              <span className="w-1 h-1 rounded-full bg-synapse-dim" />
              <span>IBM Research</span>
              <span className="w-1 h-1 rounded-full bg-synapse-dim" />
              <span>Wits University</span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
