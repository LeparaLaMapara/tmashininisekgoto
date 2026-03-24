'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, Home, User, FolderOpen, BookOpen, Mic, Sparkles, FileText } from 'lucide-react'
import { PROJECTS, TALKS } from '@/lib/data'

const PAGES = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Work', href: '/work', icon: FolderOpen },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Talks', href: '/talks', icon: Mic },
  { name: 'Talk to Thabang AI', href: '/ai', icon: Sparkles },
  { name: 'Resume', href: '/resume', icon: FileText },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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

  const navigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command dialog */}
      <div className="relative flex items-start justify-center pt-[20vh] px-6">
        <Command
          className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl shadow-void/50 overflow-hidden"
          label="Search"
        >
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="w-4 h-4 text-muted" />
            <Command.Input
              placeholder="Search pages, projects, talks..."
              className="flex-1 py-4 bg-transparent text-ivory text-sm outline-none placeholder:text-muted"
              autoFocus
            />
            <kbd className="text-xs text-muted bg-void/50 px-1.5 py-0.5 rounded">ESC</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted">
              No results found.
            </Command.Empty>

            {/* Pages */}
            <Command.Group heading="Pages" className="mb-2">
              {PAGES.map((page) => (
                <Command.Item
                  key={page.href}
                  value={page.name}
                  onSelect={() => navigate(page.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted cursor-pointer data-[selected=true]:bg-synapse/10 data-[selected=true]:text-ivory"
                >
                  <page.icon className="w-4 h-4" />
                  {page.name}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Projects */}
            <Command.Group heading="Projects" className="mb-2">
              {PROJECTS.map((project) => (
                <Command.Item
                  key={project.slug}
                  value={project.title}
                  onSelect={() => navigate('/work')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted cursor-pointer data-[selected=true]:bg-synapse/10 data-[selected=true]:text-ivory"
                >
                  <FolderOpen className="w-4 h-4" />
                  {project.title}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Talks */}
            <Command.Group heading="Talks">
              {TALKS.map((talk) => (
                <Command.Item
                  key={talk.id}
                  value={talk.title}
                  onSelect={() => navigate('/talks')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted cursor-pointer data-[selected=true]:bg-synapse/10 data-[selected=true]:text-ivory"
                >
                  <Mic className="w-4 h-4" />
                  {talk.title}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
