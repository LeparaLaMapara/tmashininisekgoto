'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, BookOpen, Users, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import type { Course } from '@/lib/data'
import { cn } from '@/lib/utils'
import { RegisterForm } from './register-form'

interface CourseCardProps {
  course: Course
}

const levelColors: Record<Course['level'], string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-signal/10 text-signal border-signal/20',
  Advanced: 'bg-synapse/10 text-synapse border-synapse/20',
}

export function CourseCard({ course }: CourseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.1)]"
    >
      <div className="p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
                  levelColors[course.level]
                )}
              >
                {course.level}
              </span>
              {course.status === 'coming-soon' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-signal/10 text-signal border border-signal/20">
                  <Zap className="w-3 h-3" />
                  Coming Soon
                </span>
              )}
              {course.status === 'full' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                  Full
                </span>
              )}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ivory leading-snug">
              {course.title}
            </h3>
            <p className="text-[0.9375rem] text-synapse font-medium">
              {course.subtitle}
            </p>
          </div>
          {course.waitlistCount > 0 && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-synapse/10 text-synapse border border-synapse/20">
                <Users className="w-3 h-3" />
                {course.waitlistCount} on waitlist
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[0.9375rem] text-muted leading-relaxed">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-synapse/60" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-synapse/60" />
            {course.format}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-synapse/60" />
            {course.modules.length} modules
          </div>
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm text-synapse hover:text-synapse/80 transition-colors"
        >
          {expanded ? 'Hide details' : 'View modules & details'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 pt-2">
                {/* Modules */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-synapse/70">
                    What you'll learn
                  </span>
                  <ul className="mt-2 space-y-2">
                    {course.modules.map((mod, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[0.9375rem] text-ivory/80 leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-synapse/50 flex-shrink-0" />
                        {mod}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Who is it for */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-synapse/70">
                    Who is this for
                  </span>
                  <ul className="mt-2 space-y-2">
                    {course.whoIsItFor.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[0.9375rem] text-muted leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-signal/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Register section */}
        <div className="pt-3 border-t border-border">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-[0.9375rem] transition-all',
                course.status === 'full'
                  ? 'bg-muted/10 text-muted cursor-not-allowed'
                  : 'bg-synapse text-void hover:bg-synapse/90'
              )}
              disabled={course.status === 'full'}
            >
              {course.status === 'coming-soon' && 'Join Waitlist'}
              {course.status === 'open' && 'Register Interest'}
              {course.status === 'full' && 'Fully Booked'}
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterForm
                  courseSlug={course.slug}
                  courseTitle={course.title}
                  onClose={() => setShowForm(false)}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  )
}
