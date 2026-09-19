import Link from 'next/link'
import { BookOpen, FlaskConical, FolderOpen, FileText, Mic } from 'lucide-react'
import { getConnections, type NodeType } from '@/lib/graph'

const SECTIONS: { type: NodeType; heading: string; icon: typeof BookOpen }[] = [
  { type: 'research', heading: 'Related research', icon: FlaskConical },
  { type: 'publication', heading: 'Publications', icon: FileText },
  { type: 'project', heading: 'Related work', icon: FolderOpen },
  { type: 'post', heading: 'Related writing', icon: BookOpen },
  { type: 'talk', heading: 'Talks', icon: Mic },
]

/**
 * What this page is connected to, grouped by kind, from the content graph.
 *
 * A stated relationship (a research line listing its paper, a post naming the
 * project it is about) always ranks first; after that, items are ranked by the
 * topics they share, rarest first. Each card says why it is here, so the
 * relationship is visible to readers and crawlers alike. Server rendered, no
 * client JavaScript.
 */
export function GraphConnections({
  type,
  contentKey,
  exclude = [],
  perType = 4,
}: {
  type: NodeType
  contentKey: string
  /** Sections already rendered elsewhere on the page. */
  exclude?: NodeType[]
  perType?: number
}) {
  const connections = getConnections(type, contentKey, perType)
  const sections = SECTIONS.filter((s) => !exclude.includes(s.type) && connections[s.type].length > 0)
  if (sections.length === 0) return null

  return (
    <div className="mt-14 border-t border-border pt-10 space-y-10">
      {sections.map(({ type: t, heading, icon: Icon }) => (
        <section key={t} aria-labelledby={`connections-${t}`}>
          <h2 id={`connections-${t}`} className="font-display text-2xl font-semibold text-ivory mb-5">
            {heading}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {connections[t].map(({ node, via, stated }) => (
              <li key={`${node.type}:${node.key}`}>
                <Link
                  href={node.href}
                  className="group block h-full rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-synapse/40"
                >
                  <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {stated ? 'Directly connected' : via.length ? `Shares ${via.slice(0, 2).map((v) => v.name.toLowerCase()).join(', ')}` : heading}
                  </span>
                  <span className="block font-medium leading-snug text-ivory transition-colors group-hover:text-synapse">
                    {node.title}
                  </span>
                  {node.blurb && (
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted line-clamp-2">{node.blurb}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
