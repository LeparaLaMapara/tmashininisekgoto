'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const QUESTION_GROUPS: { key: string; label: string; questions: string[] }[] = [
  {
    key: 'recruiters',
    label: 'Recruiters & Companies',
    questions: [
      'What kind of AI/data roles is Thabang suited for?',
      'What enterprise AI and data science work has Thabang done?',
      'How can a company work with Thabang?',
    ],
  },
  {
    key: 'businesses',
    label: 'Businesses & Organisations',
    questions: [
      'How can Thabang help my business understand and apply AI?',
      'Can Thabang run AI workshops or training?',
      'What AI systems or agents can Thabang help build?',
    ],
  },
  {
    key: 'learners',
    label: 'Learners & Job Seekers',
    questions: [
      'How can I start learning AI or data science?',
      'What should I learn first: Python, SQL, Power BI, or machine learning?',
      "Where can I find Thabang's AI learning resources?",
    ],
  },
  {
    key: 'collaborators',
    label: 'Collaborators & Builders',
    questions: [
      'What is Thabang building with SekhotoMultiversity?',
      'What is ThabangVision Applied AI / research-to-product work?',
      'How can I collaborate with Thabang?',
    ],
  },
  {
    key: 'research',
    label: 'Research & Technical',
    questions: [
      'What is Ubunye Engine?',
      "What is Thabang's philosophy on AI systems?",
      "What are Thabang's research interests?",
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
      <p className="mb-5 text-sm text-muted">Pick what describes you — try one of these:</p>

      {/* Audience tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {QUESTION_GROUPS.map((g) => (
          <button
            key={g.key}
            onClick={() => setActive(g.key)}
            aria-pressed={g.key === active}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
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
