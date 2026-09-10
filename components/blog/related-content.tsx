import Link from 'next/link'
import { BookOpen, FolderOpen, FileCode, Mic } from 'lucide-react'
import { getRelated, type RelatedItem, type RelatedType } from '@/lib/related'

const TYPE_META: Record<RelatedType, { icon: typeof BookOpen; label: string }> = {
  Post: { icon: BookOpen, label: 'Writing' },
  Project: { icon: FolderOpen, label: 'Work' },
  Publication: { icon: FileCode, label: 'Research' },
  Talk: { icon: Mic, label: 'Talk' },
}

/**
 * Related content across every type, not just other articles.
 *
 * Given the page's own identity, `getRelated` returns the strongest matches
 * from writing, work, research and talks, deterministically. Rendered
 * server-side, so it adds no client JavaScript.
 */
export function RelatedContent({
  type,
  contentKey,
  heading = 'Related',
  limit = 4,
}: {
  type: RelatedType
  contentKey: string
  heading?: string
  limit?: number
}) {
  const related: RelatedItem[] = getRelated({ type, key: contentKey }, limit)
  if (related.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="font-display text-2xl font-semibold text-ivory mb-6">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {related.map((item) => {
          const meta = TYPE_META[item.type]
          return (
            <Link
              key={`${item.type}:${item.href}:${item.title}`}
              href={item.href}
              className="group block bg-surface border border-border rounded-2xl p-5 hover:border-synapse/40 transition-colors"
            >
              <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted">
                <meta.icon className="h-3.5 w-3.5" />
                {meta.label}
              </span>
              <h3 className="font-medium text-ivory leading-snug group-hover:text-synapse transition-colors">
                {item.title}
              </h3>
              {item.blurb && (
                <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2">
                  {item.blurb}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/** Re-export so callers can build related sections without importing lib. */
export { getRelated }
