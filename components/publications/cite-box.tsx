'use client'

import { useState } from 'react'
import { Check, Copy, Quote } from 'lucide-react'
import type { CitationFormat } from '@/lib/citations'

const FORMATS: CitationFormat[] = ['BibTeX', 'APA', 'Chicago']

/**
 * "Cite this" for one publication: three formats, one click to copy.
 *
 * Collapsed by default. A citation block is useless to almost every visitor and
 * essential to a small, valuable minority, so it sits behind a single line of
 * text rather than adding three code blocks to every card on the page.
 *
 * The strings are generated on the server in lib/citations.ts and passed in, so
 * this component only handles the toggling and the clipboard.
 */
export function CiteBox({
  citations,
}: {
  citations: Record<CitationFormat, string>
}) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<CitationFormat>('BibTeX')
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(citations[format])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access is denied in some browsers over http and in some
      // embedded webviews. The text is selectable either way, so failing
      // quietly is better than an error the reader cannot act on.
    }
  }

  return (
    <div className="mt-5 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-synapse"
      >
        <Quote className="h-4 w-4" aria-hidden="true" />
        {open ? 'Hide citation' : 'Cite this'}
      </button>

      {open && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            {FORMATS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormat(option)}
                aria-pressed={format === option}
                className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                  format === option
                    ? 'border-synapse/40 bg-synapse/10 text-synapse-ink'
                    : 'border-border bg-surface text-muted hover:text-ivory'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              type="button"
              onClick={copy}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-synapse/30 hover:text-ivory"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy
                </>
              )}
            </button>
          </div>

          <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-void p-4 font-mono text-xs leading-relaxed text-ivory/80">
            <code>{citations[format]}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
