'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

/**
 * The clickable anchor beside a section heading.
 *
 * The heading itself stays a server component; only this small control is
 * client-side. Clicking it copies the absolute URL to that section to the
 * clipboard and updates the browser's address bar, so a reader can link
 * straight to the paragraph they are looking at rather than the top of the
 * article. It falls back to a plain in-page jump if the clipboard API is
 * unavailable (older browsers, insecure contexts).
 *
 * Hidden until the heading is hovered or this control is focused, so it adds no
 * visual clutter but stays keyboard reachable.
 */
export function HeadingAnchor({ id, label }: { id: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy(e: React.MouseEvent) {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    history.replaceState(null, '', `#${id}`)
    try {
      e.preventDefault()
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // No clipboard access: let the anchor's default in-page jump stand.
    }
  }

  return (
    <a
      href={`#${id}`}
      onClick={copy}
      aria-label={copied ? 'Link copied' : `Copy link to “${label}”`}
      className="ml-2 inline-flex align-middle text-synapse/0 transition-colors group-hover:text-synapse/60 focus-visible:text-synapse focus-visible:opacity-100"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
    </a>
  )
}
