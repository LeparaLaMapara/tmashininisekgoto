'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const QUESTION_GROUPS: { key: string; label: string; questions: string[] }[] = [
  {
    key: 'thinking',
    label: 'How he thinks',
    questions: [
      'What is Thabang curious about?',
      'What does he mean by access?',
      'What is the mother test?',
    ],
  },
  {
    key: 'building',
    label: 'What he builds',
    questions: [
      'What is the fundamental scientific research engine?',
      'What is Ubunye Engine?',
      'What is the global market research engine?',
    ],
  },
  {
    key: 'help',
    label: 'Getting help',
    questions: [
      'How do I get a free website for my business?',
      'How can I start learning AI?',
      'Can Thabang give a talk or workshop?',
    ],
  },
]

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const [active, setActive] = useState(QUESTION_GROUPS[0].key)
  const group = QUESTION_GROUPS.find((g) => g.key === active) ?? QUESTION_GROUPS[0]

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="mb-5 text-sm text-muted">Not sure what to ask? Try one of these:</p>

      {/* Audience tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {QUESTION_GROUPS.map((g) => (
          <button
            key={g.key}
            onClick={() => setActive(g.key)}
            aria-pressed={g.key === active}
            className={cn(
              'rounded-sm border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
              'focus:outline-none focus:ring-1 focus:ring-synapse/40',
              g.key === active
                ? 'border-synapse/30 bg-synapse/15 text-synapse'
                : 'border-border text-muted hover:text-ivory hover:border-synapse/20'
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Questions for the active audience */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.questions.map((question) => (
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
