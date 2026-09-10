import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ProjectFilter } from '@/components/work/project-filter'
import { JsonLd } from '@/components/seo/json-ld'
import { softwareSourceCodeSchema, webPageSchema, breadcrumbSchema } from '@/lib/schema'
import { PROJECTS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Work: Problems, Systems & Open Source',
  description:
    'Some problems Thabang Mashinini-Sekgoto has worked on: open-source infrastructure, production systems in telecoms and insurance, applied research, and community capability-building.',
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
            <span className="text-synapse">Work</span>
          </h1>
          <p className="text-muted text-xl max-w-2xl mb-6 leading-relaxed">
            Some problems I have spent time on, and why they kept me. Most start
            the same way, noisy data, infrastructure that will not stay up,
            research that is hard to move, or people who need a better tool.
          </p>
          <p className="text-muted text-lg max-w-2xl mb-16 leading-relaxed">
            Sometimes the answer became a production system, sometimes a library,
            sometimes research, and sometimes the useful thing was helping someone
            else learn to solve it. These are some of those.
          </p>
        </ScrollReveal>

        <ProjectFilter />

        <ScrollReveal>
          <p className="mt-20 border-t border-border pt-10 text-lg text-muted max-w-2xl leading-relaxed">
            Much of this starts the same way: hit a problem, work out why it keeps
            happening, solve it once, then try to make the solution useful beyond
            me.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
