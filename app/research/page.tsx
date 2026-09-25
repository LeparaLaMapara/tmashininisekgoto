import type { Metadata } from 'next'
import Link from 'next/link'
import { Papers } from '@/components/research/papers'
import { RESEARCH } from '@/lib/graph/research'
import { JsonLd } from '@/components/seo/json-ld'
import { researchIndexSchema, breadcrumbSchema } from '@/lib/schema'
import { pageOpenGraph } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Research and publications: echo state networks, climate forecasting',
  description:
    'Research and papers by Thabang Mashinini-Sekgoto: echo state networks for image segmentation, ML for seasonal climate forecasting, and hearing loss in mine workers, with citations and BibTeX.',
  alternates: { canonical: '/research' },
  openGraph: pageOpenGraph('/research', 'Research by Thabang Mashinini-Sekgoto'),
}

const STATUS_LABEL = { completed: 'Completed', published: 'Published', proposed: 'Proposed, not started' } as const

export default function ResearchIndex() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          researchIndexSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Research', path: '/research' },
          ]),
        ]}
      />
      <h1 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">Research</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Everything I have published, newest first. The production work that grew out of some of it is
        under <Link href="/work" className="text-synapse underline underline-offset-2 hover:no-underline">Work</Link>.
      </p>

      <Papers />

      {/* The research lines keep their own pages; linked here rather than listed first. */}
      <nav aria-label="The research behind the papers" className="mt-20 border-t-2 border-border pt-8">
        <h2 className="font-display text-xl font-bold text-ivory mb-4">The research behind the papers</h2>
        <ul className="space-y-2">
          {RESEARCH.map((r) => (
            <li key={r.slug} id={r.slug} className="scroll-mt-28 text-ivory/85">
              {r.page ? (
                <Link href={`/research/${r.slug}`} className="font-semibold text-ivory underline underline-offset-2 hover:no-underline">{r.headline}</Link>
              ) : (
                <span className="font-semibold text-ivory">{r.headline}</span>
              )}
              <span className="text-muted text-sm"> · {STATUS_LABEL[r.status]}, {r.period}</span>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
