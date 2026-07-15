import type { Metadata } from 'next'
import { BentoGrid } from '@/components/about/bento-grid'
import { Testimonials } from '@/components/about/testimonials'
import { TechStack } from '@/components/about/tech-stack'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about Thabang Mashinini-Sekgoto. AI Systems Architect, researcher at Wits University, and founder of Ubunye AI Ecosystems.',
}

export default function AboutPage() {
  return (
    <section className="relative min-h-screen py-24 md:py-32">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-6 mb-16">
        <p className="font-mono text-base text-synapse tracking-widest uppercase mb-3">
          Who I am
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
          About{' '}
          <span className="text-synapse">
            Me
          </span>
        </h1>
        <p className="text-xl text-muted max-w-2xl leading-relaxed">
          I am an AI researcher and builder from Soshanguve. I make AI systems
          that survive the real world, for banks, for research, and for the
          people and places I come from.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="mx-auto max-w-6xl px-6 mb-24">
        <BentoGrid />
      </div>

      {/* Testimonials */}
      <div className="mx-auto max-w-6xl px-6 mb-24">
        <p className="font-mono text-base text-synapse tracking-widest uppercase mb-3">
          What People Say
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-10">
          From{' '}
          <span className="text-synapse">
            Colleagues
          </span>
        </h2>
        <Testimonials />
      </div>

      {/* Tech Stack + GitHub Calendar */}
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-base text-synapse tracking-widest uppercase mb-3">
          Tools &amp; Technologies
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-10">
          Tech{' '}
          <span className="text-synapse">
            Stack
          </span>
        </h2>
        <TechStack />
      </div>
    </section>
  )
}
