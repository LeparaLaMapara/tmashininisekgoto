'use client'

import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SourceRef {
  title: string
  url: string | null
  source_type: string
  similarity: number
}

/** Chip row of cited KB sources rendered under an assistant message. */
export function SourceCitations({ sources }: { sources: SourceRef[] }) {
  if (!sources?.length) return null

  const chip = cn(
    'inline-flex items-center gap-1 rounded-full border border-border bg-surface',
    'px-2 py-0.5 text-[11px] text-synapse',
    'hover:text-accent hover:border-synapse/40 transition-colors'
  )

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-wide text-muted/60">Sources</span>
      {sources.map((s, i) => {
        const isInternal = s.url?.startsWith('/')
        const label = (
          <>
            <span className="max-w-[220px] truncate">{s.title}</span>
            {s.url && !isInternal && <ExternalLink className="h-3 w-3 shrink-0" />}
          </>
        )
        return s.url ? (
          <a
            key={i}
            href={s.url}
            {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={chip}
          >
            {label}
          </a>
        ) : (
          <span key={i} className={chip}>
            {label}
          </span>
        )
      })}
    </div>
  )
}
