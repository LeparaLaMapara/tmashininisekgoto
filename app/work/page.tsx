import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ProjectFilter } from '@/components/work/project-filter'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Projects spanning open-source frameworks, telecoms optimization, banking ML platforms, geospatial research, and education technology.',
}

export default function WorkPage() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Work &{' '}
            <span className="bg-gradient-to-r from-synapse via-accent to-signal bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-muted text-xl max-w-2xl mb-16 leading-relaxed">
            Production systems, open-source tools, and research built across
            telecoms, banking, education, and global research organizations.
          </p>
        </ScrollReveal>

        <ProjectFilter />
      </div>
    </section>
  )
}
