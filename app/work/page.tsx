import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ProjectFilter } from '@/components/work/project-filter'
import { JsonLd } from '@/components/seo/json-ld'
import { softwareSourceCodeSchema, webPageSchema, breadcrumbSchema } from '@/lib/schema'
import { PROJECTS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'AI & Machine Learning Projects',
  description:
    'Projects spanning open-source frameworks, telecoms optimization, banking ML platforms, geospatial research, and education technology.',
  alternates: { canonical: '/work' },
  openGraph: pageOpenGraph('/work', 'Projects by Thabang Mashinini-Sekgoto'),
}

/**
 * The open source projects, as code rather than as cards about code.
 *
 * Only projects with a real repository are emitted, and every field is read
 * from the project record. Nothing about adoption, stars or downloads is
 * asserted, because none of it can be verified from this repository.
 */
const OPEN_SOURCE = PROJECTS.filter(
  (project) => project.category === 'open-source' && project.ghLink
)

export default function WorkPage() {
  return (
    <section className="py-24 px-6">
      <JsonLd
        data={[
          webPageSchema({
            path: '/work',
            name: 'Work and projects',
            description:
              'Production systems, open source infrastructure and applied research by Thabang Mashinini-Sekgoto.',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ]),
          ...OPEN_SOURCE.map((project) =>
            softwareSourceCodeSchema({
              slug: project.slug,
              name: project.title,
              description: project.solution,
              codeRepository: project.ghLink!,
              url: project.productLink,
              programmingLanguage: project.skills,
            })
          ),
        ]}
      />
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
