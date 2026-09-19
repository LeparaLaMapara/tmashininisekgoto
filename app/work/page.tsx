import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ProjectFilter } from '@/components/work/project-filter'
import { JsonLd } from '@/components/seo/json-ld'
import { workIndexSchema, breadcrumbSchema } from '@/lib/schema'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Work: Problems, Systems & Open Source',
  description:
    'Problems Thabang Mashinini-Sekgoto has worked on: open source infrastructure, production systems in telecoms and insurance, research and community work.',
  alternates: { canonical: '/work' },
  openGraph: pageOpenGraph('/work', 'Projects by Thabang Mashinini-Sekgoto'),
}

export default function WorkPage() {
  return (
    <section className="py-24 px-6">
      <JsonLd
        data={[
          workIndexSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ]),
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
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            The research behind some of it has its own pages under{' '}
            <Link href="/research" className="text-synapse hover:underline">Research</Link>, and everything
            here is also gathered by subject under{' '}
            <Link href="/topics" className="text-synapse hover:underline">Topics</Link>.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
