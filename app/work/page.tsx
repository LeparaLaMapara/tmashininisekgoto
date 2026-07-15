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
            <span className="text-synapse">
              Projects
            </span>
          </h1>
          <p className="text-muted text-xl max-w-2xl mb-16 leading-relaxed">
            What I have built and what I am building now. Production systems for
            banks and telecoms, open source tools anyone can use, research, and
            free websites for the businesses of Soshanguve. Every card says why
            it exists and what it changed.
          </p>
        </ScrollReveal>

        <ProjectFilter />
      </div>
    </section>
  )
}
