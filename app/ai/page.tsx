import type { Metadata } from 'next'
import { ChatInterface } from '@/components/ai/chat-interface'
import { WorkWithMe } from '@/components/ai/work-with-me'

export const metadata: Metadata = {
  title: 'Thabang AI Assist: Ask About My Work',
  description:
    'Ask an AI assistant grounded on the real work, writing, talks, and projects of Thabang Mashinini-Sekgoto. Every answer cites its sources.',
  alternates: { canonical: '/ai' },
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
              Thabang AI Assist
            </span>
          </h1>
          <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
            My AI assistant, grounded on my work, writing, talks and projects. It
            knows what I have built and how I think, but it is not me. Ask it about
            my experience or how we could work together, then take the next step below.
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
    </>
  )
}
