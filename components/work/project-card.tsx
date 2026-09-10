'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, ExternalLink, FileText, BookOpen, Package, Boxes, ArrowRight } from 'lucide-react'
import type { Project, Artifact } from '@/lib/data'
import { PROJECT_CATEGORIES } from '@/lib/data'
import { useEnterAnimation } from '@/lib/use-enter-animation'

/** Icon and default label per artifact kind. */
const ARTIFACT_META: Record<Artifact['kind'], { icon: typeof Github; label: string }> = {
  github: { icon: Github, label: 'GitHub' },
  pypi: { icon: Package, label: 'PyPI' },
  docs: { icon: BookOpen, label: 'Documentation' },
  examples: { icon: Boxes, label: 'Examples' },
  paper: { icon: FileText, label: 'Paper' },
  publication: { icon: FileText, label: 'Publication' },
  site: { icon: ExternalLink, label: 'Live site' },
  product: { icon: ExternalLink, label: 'Product' },
}

export function ProjectCard({ project }: { project: Project }) {
  // Cards present at page load render visible; cards that appear from a filter
  // change still fade in.
  const animateIn = useEnterAnimation()
  const href = `/work/${project.slug}`

  return (
    <motion.div
      layout
      layoutId={project.slug}
      initial={animateIn ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(32,25,17,0.18)]"
    >
      {/* Image, when the story has a fitting one. Confidential work does not, and
          gets a text-led card rather than an unrelated stock image. */}
      {project.image && (
        <Link href={href} className="relative block aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={`${project.cardTitle} — ${project.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {project.building && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent-ink text-void text-xs font-semibold uppercase tracking-wider">
              Building now
            </span>
          )}
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Category */}
        <span className="text-[11px] font-mono uppercase tracking-wider text-synapse-ink">
          {PROJECT_CATEGORIES[project.category] ?? project.category}
        </span>

        {/* Problem-oriented title */}
        <h2 className="mt-1.5 font-display text-xl font-bold text-ivory leading-snug">
          <Link href={href} className="transition-colors hover:text-synapse">
            {project.cardTitle}
          </Link>
        </h2>

        {/* One plain sentence */}
        <p className="mt-3 text-[0.9375rem] text-ivory/80 leading-relaxed">{project.oneLiner}</p>

        {/* Why it mattered */}
        <div className="mt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted">Why it mattered</span>
          <p className="mt-1 text-[0.9375rem] text-muted leading-relaxed">{project.why}</p>
        </div>

        {/* One verified outcome, only where one exists */}
        {project.outcome && (
          <div className="mt-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted">What changed</span>
            <p className="mt-1 text-[0.9375rem] text-synapse font-medium leading-relaxed">{project.outcome}</p>
          </div>
        )}

        {/* Topics, not skill badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-muted"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Public artifacts */}
        {project.artifacts.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
            {project.artifacts.map((art) => {
              const meta = ARTIFACT_META[art.kind]
              return (
                <a
                  key={art.href}
                  href={art.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-synapse transition-colors"
                >
                  <meta.icon className="h-4 w-4" />
                  {art.label ?? meta.label}
                </a>
              )
            })}
          </div>
        )}

        {/* Explore the deeper story */}
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-synapse hover:gap-2.5 transition-all"
        >
          Explore the work
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  )
}
