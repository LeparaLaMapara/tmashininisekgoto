import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { ChatInterface } from '@/components/ai/chat-interface'
import { WorkWithMe } from '@/components/ai/work-with-me'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

export const metadata: Metadata = {
  title: 'Talk to Thabang AI',
  description:
    'Chat with an AI representation of Thabang Mashinini-Sekgoto, grounded on his work, writing, talks, and projects — then explore how to work together: talks, consulting, hiring, collaboration, and SekhotoMultiversity.',
}

export default function AIPage() {
  return (
    <>
      {/* Hero + assistant */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
            Talk to{' '}
            <span className="text-synapse">
              Thabang AI
            </span>
          </h1>
          <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
            An AI grounded on my work, writing, talks, and projects. Ask about my
            experience, philosophy, or how we could work together — then take the
            next step below.
          </p>
        </div>

        <ChatInterface />

        {/* Trust & boundary note */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted">
          Responses are based on Thabang&apos;s public work and writing. For formal
          opportunities, collaborations, or employer-related matters, please contact
          Thabang directly. Any current-employer-related conversations must follow
          appropriate official processes.
        </p>
      </section>

      {/* Work With Me + lead form */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <WorkWithMe />
        </div>
      </section>

      {/* SekhotoMultiversity */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="glass rounded-2xl border border-border p-8 sm:p-10">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Also building</p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ivory sm:text-3xl">
                SekhotoMultiversity
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                Thabang is also building SekhotoMultiversity, an AI-powered learning and
                opportunity platform for African families, students, workers, and communities.
              </p>
              <a
                href="https://sekhotomultiversity.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-synapse px-6 py-3 text-sm font-semibold text-void transition-all hover:bg-synapse/90"
              >
                Explore SekhotoMultiversity
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
