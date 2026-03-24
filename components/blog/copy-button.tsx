'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      className="absolute right-3 top-3 rounded-md border border-border bg-void/80 px-2 py-1 text-xs font-mono text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-ivory hover:border-synapse/40"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
