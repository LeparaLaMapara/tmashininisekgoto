import type { Metadata } from 'next'
import { ChatInterface } from '@/components/ai/chat-interface'

export const metadata: Metadata = {
  title: 'Talk to Thabang AI',
  description:
    'Chat with an AI representation of Thabang Mashinini-Sekgoto. Ask about his projects, philosophy, career, and technical work.',
}

export default function AIPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-24 pb-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
          Talk to{' '}
          <span className="bg-gradient-to-r from-synapse to-accent bg-clip-text text-transparent">
            Thabang AI
          </span>
        </h1>
        <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
          An AI trained on my work, writing, and philosophy. Ask about my
          projects, career, tech stack, or anything you&apos;d want to know
          before working together.
        </p>
      </div>
      <ChatInterface />
    </section>
  )
}
