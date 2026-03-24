'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import GitHubCalendar from 'react-github-calendar'
import type { Activity } from 'react-github-calendar'
import { TECH_STACK, TECH_CATEGORIES, REPO_CATEGORY_MAP, type TechItem, type Project } from '@/lib/data'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

type FilterKey = 'all' | TechItem['category']

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  ...Object.entries(TECH_CATEGORIES).map(([key, label]) => ({
    key: key as TechItem['category'],
    label,
  })),
]

const calendarTheme = {
  dark: ['#111118', '#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9'] as [string, string, string, string, string],
}

// Map tech stack categories to project categories for calendar filtering
const TECH_TO_PROJECT_CATEGORY: Partial<Record<TechItem['category'], Project['category'][]>> = {
  'ml-ai': ['research', 'open-source'],
  'data-engineering': ['open-source', 'telecoms'],
  'languages': ['open-source', 'research', 'social-impact'],
  'web': ['open-source', 'social-impact'],
  'infrastructure': ['telecoms', 'research', 'open-source'],
  'devops': ['open-source', 'telecoms'],
}

export function TechStack() {
  const [active, setActive] = useState<FilterKey>('all')
  const [categoryData, setCategoryData] = useState<
    Record<string, Record<string, number>> | null
  >(null)

  useEffect(() => {
    fetch('/api/github')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setCategoryData(data)
      })
      .catch(() => {})
  }, [])

  const filtered =
    active === 'all'
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === active)

  const transformData = useCallback(
    (contributions: Array<Activity>): Array<Activity> => {
      if (active === 'all' || !categoryData) return contributions

      // Get project categories mapped to this tech category
      const projectCategories = TECH_TO_PROJECT_CATEGORY[active as TechItem['category']] || []

      // Merge contribution dates from all matching project categories
      const mergedDates: Record<string, number> = {}
      for (const projCat of projectCategories) {
        const dateCounts = categoryData[projCat]
        if (!dateCounts) continue
        for (const [date, count] of Object.entries(dateCounts)) {
          mergedDates[date] = (mergedDates[date] || 0) + count
        }
      }

      if (Object.keys(mergedDates).length === 0) {
        return contributions.map((day) => ({ ...day, count: 0, level: 0 as const }))
      }

      return contributions.map((day) => {
        const count = mergedDates[day.date] || 0
        const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4
        return { ...day, count, level: level as Activity['level'] }
      })
    },
    [active, categoryData]
  )

  const calendarLabel = active === 'all'
    ? '{{count}} contributions in the last year'
    : `{{count}} contributions using ${TECH_CATEGORIES[active as TechItem['category']] || active} tools`

  return (
    <div>
      {/* Filter Tabs */}
      <ScrollReveal>
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActive(filter.key)}
              className={cn(
                'px-5 py-2.5 rounded-lg text-[0.9375rem] font-medium transition-all',
                active === filter.key
                  ? 'bg-synapse text-void'
                  : 'bg-surface border border-border text-muted hover:text-ivory hover:border-synapse/30'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Tech Grid with Logos */}
      <motion.div
        layout
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-16"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-synapse/30 hover:bg-synapse/5 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.15)] transition-all duration-200 group"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src={`/icons/${item.icon}.svg`}
                  alt={item.name}
                  width={36}
                  height={36}
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-sm text-ivory/80 text-center leading-tight group-hover:text-ivory transition-colors">
                {item.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* GitHub Calendar — filtered by tech category */}
      <ScrollReveal>
        <div className="glass border border-border rounded-2xl p-6 md:p-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-ivory/60 uppercase tracking-wider">
              Contribution Activity
            </h3>
            {active !== 'all' && (
              <span className="text-sm text-synapse bg-synapse/10 px-3 py-1 rounded-full">
                {TECH_CATEGORIES[active as TechItem['category']]}
              </span>
            )}
          </div>
          <GitHubCalendar
            username="LeparaLaMapara"
            theme={calendarTheme}
            colorScheme="dark"
            blockSize={13}
            blockMargin={4}
            fontSize={13}
            style={{ width: '100%' }}
            transformData={active !== 'all' && categoryData ? transformData : undefined}
            labels={{ totalCount: calendarLabel }}
          />
        </div>
      </ScrollReveal>
    </div>
  )
}
