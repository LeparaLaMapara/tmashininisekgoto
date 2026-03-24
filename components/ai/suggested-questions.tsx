'use client'

import { cn } from '@/lib/utils'

const QUESTIONS = [
  'What did you build at Vodacom?',
  'Tell me about Ubunye Engine',
  "What's your take on vibe coding?",
  'How can I work with you?',
  "What's your philosophy on AI systems?",
  'Can I download your CV?',
]

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="mb-6 text-sm text-muted">Try asking one of these:</p>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUESTIONS.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className={cn(
              'rounded-xl border border-border bg-surface p-4',
              'text-left text-sm text-muted',
              'hover:text-ivory hover:border-synapse/30',
              'transition-all duration-200',
              'focus:outline-none focus:ring-1 focus:ring-synapse/40'
            )}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
