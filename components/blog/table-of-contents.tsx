'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  // Parse headings from markdown content
  const headings: TOCItem[] = content
    .split('\n')
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/)
      if (!match) return null
      const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '')
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      return { id, text, level: match[1].length }
    })
    .filter(Boolean) as TOCItem[]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav className="mb-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-mono text-muted hover:text-synapse transition-colors"
      >
        <List className="h-4 w-4" />
        <span>Table of Contents</span>
        <span className="text-xs text-muted/60">({headings.length} sections)</span>
        <svg
          className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="mt-3 space-y-1 border-l border-border pl-4">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block py-1 text-sm transition-colors',
                  heading.level === 3 && 'pl-4',
                  activeId === heading.id
                    ? 'text-synapse font-medium'
                    : 'text-muted hover:text-ivory'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
