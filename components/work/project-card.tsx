'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, ExternalLink, FileText } from 'lucide-react'
import type { Project } from '@/lib/data'
import { SKILL_ICON_MAP } from '@/lib/data'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      layout
      layoutId={project.slug}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(32,25,17,0.18)]"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        <h3 className="font-display text-xl font-bold text-ivory leading-snug">
          {project.title}
        </h3>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-synapse/70">
              Why it was built
            </span>
            <p className="text-[0.9375rem] text-muted mt-1 leading-relaxed">{project.problem}</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-synapse/70">
              What it is
            </span>
            <p className="text-[0.9375rem] text-ivory/80 mt-1 leading-relaxed">{project.solution}</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-synapse/70">
              Impact
            </span>
            <p className="text-[0.9375rem] text-synapse font-medium mt-1 leading-relaxed">
              {project.impact}
            </p>
          </div>
        </div>

        {/* Tech Stack Logos */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-synapse/70">
            Built with
          </span>
          <div className="flex flex-wrap gap-2.5 mt-2">
            {project.skills.map((skill) => {
              const iconName = SKILL_ICON_MAP[skill]
              return (
                <div
                  key={skill}
                  className="group/skill relative flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-border hover:border-synapse/30 hover:bg-synapse/10 transition-all"
                  title={skill}
                >
                  {iconName ? (
                    <Image
                      src={`/icons/${iconName}.svg`}
                      alt={skill}
                      width={22}
                      height={22}
                      className="opacity-70 group-hover/skill:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="text-xs text-muted font-medium">
                      {skill.slice(0, 2)}
                    </span>
                  )}
                  {/* Tooltip */}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-void text-ivory text-xs whitespace-nowrap opacity-0 group-hover/skill:opacity-100 transition-opacity pointer-events-none border border-border shadow-lg">
                    {skill}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Links */}
        {(project.ghLink || project.productLink || project.paperLink) && (
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            {project.ghLink && (
              <a
                href={project.ghLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-ivory transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {project.productLink && (
              <a
                href={project.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-synapse transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Product
              </a>
            )}
            {project.paperLink && (
              <a
                href={project.paperLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-synapse transition-colors"
              >
                <FileText className="w-4 h-4" />
                Paper
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
