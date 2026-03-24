'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PROJECTS, PROJECT_CATEGORIES, type Project } from '@/lib/data'
import { cn } from '@/lib/utils'
import { ProjectCard } from './project-card'

type Category = Project['category'] | null

export function ProjectFilter() {
  const [active, setActive] = useState<Category>(null)

  const filtered = active
    ? PROJECTS.filter((p) => p.category === active)
    : PROJECTS

  const categories = Object.entries(PROJECT_CATEGORIES) as [
    Project['category'],
    string,
  ][]

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActive(null)}
          className={cn(
            'px-5 py-2 rounded-full text-[0.9375rem] font-medium border transition-colors',
            active === null
              ? 'bg-synapse/20 text-synapse border-synapse/30'
              : 'bg-surface text-muted border-border hover:text-ivory'
          )}
        >
          All
        </button>
        {categories.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              'px-5 py-2 rounded-full text-[0.9375rem] font-medium border transition-colors',
              active === key
                ? 'bg-synapse/20 text-synapse border-synapse/30'
                : 'bg-surface text-muted border-border hover:text-ivory'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
