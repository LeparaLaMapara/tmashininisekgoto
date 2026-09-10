'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  Search, Home, User, FolderOpen, BookOpen, Mic, Sparkles, FileText,
  GraduationCap, FileCode, Pencil,
} from 'lucide-react'
import type { SearchKind, SearchResult } from '@/lib/search'

/** Static quick-nav, shown when the search box is empty. */
const PAGES = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Work', href: '/work', icon: FolderOpen },
  { name: 'Writing', href: '/blog', icon: BookOpen },
  { name: 'Publications', href: '/publications', icon: FileCode },
  { name: 'Talks', href: '/talks', icon: Mic },
  { name: 'Talk to Thabang AI Assist', href: '/ai', icon: Sparkles },
  { name: 'CV', href: '/resume', icon: FileText },
]

/** Icon and display order per result type. */
const KIND_META: Record<SearchKind, { icon: typeof Home; label: string; order: number }> = {
  Post:        { icon: BookOpen,       label: 'Writing',      order: 0 },
  Project:     { icon: FolderOpen,     label: 'Work',         order: 1 },
  Publication: { icon: FileCode,       label: 'Publications', order: 2 },
  Talk:        { icon: Mic,            label: 'Talks',        order: 3 },
  Course:      { icon: GraduationCap,  label: 'Courses',      order: 4 },
  Writing:     { icon: Pencil,         label: 'Press',        order: 5 },
  Page:        { icon: Home,           label: 'Pages',        order: 6 },
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Reset state each time the dialog closes, so it opens clean.
  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setLoading(false)
    }
  }, [open])

  // Debounced search against the real engine. A trailing timer plus an
  // AbortController means only the latest keystroke's request can land, so
  // results never arrive out of order.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data.results ?? [])
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setResults([])
      } finally {
        setLoading(false)
      }
    }, 120)
    return () => clearTimeout(timer)
  }, [query])

  const navigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  if (!open) return null

  const searching = query.trim().length >= 2

  // Group results by kind, preserving the engine's score order within a group.
  const grouped = new Map<SearchKind, SearchResult[]>()
  for (const r of results) {
    const list = grouped.get(r.kind) ?? []
    list.push(r)
    grouped.set(r.kind, list)
  }
  const groups = Array.from(grouped.entries()).sort(
    (a, b) => KIND_META[a[0]].order - KIND_META[b[0]].order
  )

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-void/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative flex items-start justify-center pt-[20vh] px-6">
        <Command
          shouldFilter={false}
          className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl shadow-void/50 overflow-hidden"
          label="Search the site"
        >
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="w-4 h-4 text-muted" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search writing, work, talks, publications..."
              className="flex-1 py-4 bg-transparent text-ivory text-sm outline-none placeholder:text-muted"
              autoFocus
            />
            <kbd className="text-xs text-muted bg-void/50 px-1.5 py-0.5 rounded">ESC</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            {searching && !loading && results.length === 0 && (
              <Command.Empty className="py-8 text-center text-sm text-muted">
                No results for &ldquo;{query.trim()}&rdquo;.
              </Command.Empty>
            )}

            {/* Static quick-nav until the user types. */}
            {!searching && (
              <Command.Group heading="Go to" className="mb-2">
                {PAGES.map((page) => (
                  <Command.Item
                    key={page.href}
                    value={page.name}
                    onSelect={() => navigate(page.href)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted cursor-pointer data-[selected=true]:bg-synapse/10 data-[selected=true]:text-ivory"
                  >
                    <page.icon className="w-4 h-4 shrink-0" />
                    {page.name}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Live results, grouped by content type. */}
            {searching &&
              groups.map(([kind, items]) => {
                const meta = KIND_META[kind]
                return (
                  <Command.Group key={kind} heading={meta.label} className="mb-2">
                    {items.map((r) => (
                      <Command.Item
                        key={`${r.kind}:${r.href}:${r.title}`}
                        value={`${r.kind}:${r.href}:${r.title}`}
                        onSelect={() => navigate(r.href)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm text-muted cursor-pointer data-[selected=true]:bg-synapse/10 data-[selected=true]:text-ivory"
                      >
                        <meta.icon className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="flex flex-col min-w-0">
                          <span className="text-ivory truncate">{r.title}</span>
                          {r.description && (
                            <span className="text-xs text-muted truncate">{r.description}</span>
                          )}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )
              })}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
