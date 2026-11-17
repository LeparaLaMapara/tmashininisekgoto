import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ProjectFilter } from '@/components/work/project-filter'
import { JsonLd } from '@/components/seo/json-ld'
import { workIndexSchema, breadcrumbSchema } from '@/lib/schema'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

/** Live products he built, linked out. Added 2026-11-17; no figures, by his request. */
const LIVE = [
  { name: 'Sekhoto', text: 'Free school help for South African learners, Grade R to 12, built to work on a cheap phone.', href: 'https://sekhotomultiversity.com' },
  { name: 'Masepala', text: 'Plain-language facts on every South African municipality and ward, from public government data.', href: 'https://masepala.vercel.app' },
  { name: 'ThabangVision', text: 'Rent camera gear and book photographers and filmmakers in South Africa.', href: 'https://www.thabangvision.com' },
]

export const metadata: Metadata = {
  title: 'Work: Problems, Systems & Open Source',
  description:
    'Problems Thabang Mashinini-Sekgoto has worked on: open source infrastructure, production systems in telecoms and banking, research and community work.',
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

        <ScrollReveal>
          <h2 className="font-mono text-sm uppercase tracking-widest text-synapse-ink mb-4">Live now</h2>
          <ul className="mb-20 max-w-3xl">
            {LIVE.map((l) => (
              <li key={l.name} className="border-t-2 border-border last:border-b-2">
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-6 py-5">
                  <span>
                    <span className="block font-display text-xl font-semibold text-ivory group-hover:text-synapse-ink transition-colors">{l.name}</span>
                    <span className="block mt-1 text-muted">{l.text}</span>
                  </span>
                  <ArrowUpRight className="w-5 h-5 shrink-0 text-synapse-ink" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
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
            <Link href="/research" className="text-synapse underline underline-offset-2 hover:no-underline">Research</Link>, and everything
            here is also gathered by subject under{' '}
            <Link href="/topics" className="text-synapse underline underline-offset-2 hover:no-underline">Topics</Link>.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
