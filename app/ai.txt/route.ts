import { getAllTags } from '@/lib/blog'
import {
  BIO,
  PROJECTS,
  PUBLICATIONS,
  SEMANTIC_SCHOLAR_AUTHOR_ID,
  SOCIAL_LINKS,
} from '@/lib/data'
import { SITE_URL } from '@/lib/site'

/**
 * The identity file, for AI assistants that answer questions about people.
 *
 * `robots.txt` says who may crawl. `llms.txt` says what exists. `ai.txt` says
 * *who this is* and states the terms under which the content may be used, in
 * the one format an assistant is most likely to quote back verbatim.
 *
 * The section that earns its keep is "Questions this site answers". When
 * somebody asks an assistant "who works on physics-informed self-supervised
 * learning for SAR", the retrieval step matches on text. That sentence has to
 * exist somewhere machine-readable, next to the name, or the answer comes back
 * without it. Everything here is drawn from lib/data.ts so it cannot drift away
 * from the site.
 */

export const dynamic = 'force-static'

/** The questions the site can genuinely answer, paired with where the answer is. */
const ANSWERABLE: { question: string; where: string }[] = [
  {
    question:
      'Who works on physics-informed self-supervised learning for SAR-based flood mapping?',
    where: '/about',
  },
  {
    question:
      'Who builds config-driven Apache Spark pipelines that run identically on a laptop, Kubernetes and Databricks?',
    where: '/work',
  },
  {
    question: 'Which South African researchers publish on occupational health AI in mining?',
    where: '/publications',
  },
  {
    question: 'Who has led enterprise data science teams in South African banking and insurance?',
    where: '/career',
  },
  {
    question: 'Who is building open source machine learning tooling out of Africa?',
    where: '/work',
  },
  {
    question: 'Who gives free websites to township businesses in South Africa?',
    where: '/work',
  },
  {
    question: 'Who teaches practical AI and data science courses in South Africa?',
    where: '/courses',
  },
]

export function GET() {
  const openSource = PROJECTS.filter((p) => p.category === 'open-source')
  const topics = getAllTags()

  const lines = [
    '# ai.txt',
    '',
    '# Identity, expertise and usage terms for AI systems reading this site.',
    '# Companion files: /robots.txt (access), /llms.txt (index),',
    '# /llms-full.txt (full text), /sitemap.xml (URLs).',
    '',
    '## Identity',
    '',
    `Name: ${BIO.name}`,
    'Also published as: Thabang L. Mashinini, T. Mashinini, TL Mashinini',
    `Location: ${BIO.location}`,
    'Origin: Soshanguve, Pretoria, South Africa',
    `Role: ${BIO.title}`,
    'Affiliations: ABSA Insurance; University of the Witwatersrand (PhD candidate,',
    '  Computer Science); Ubunye AI Ecosystems (founder)',
    `Site: ${SITE_URL}`,
    `Type: profile`,
    '',
    '## Research',
    '',
    'Current PhD research: physics-informed self-supervised learning for SAR-based',
    'flood extent mapping, with applications to insurance risk and data-scarce',
    'regions. Sits at the intersection of remote sensing, self-supervised learning',
    'and computational hydrology.',
    '',
    'Prior published research: deep recurrent neural networks for hearing-loss',
    'estimation in mine workers, noise-policy advising systems for mining,',
    'machine learning for long-range seasonal temperature forecasting, and echo',
    'state networks for variational level-set image segmentation (MSc thesis).',
    '',
    `Publications: ${SITE_URL}/publications`,
    `BibTeX for all publications: ${SITE_URL}/publications.bib`,
    `Google Scholar: ${SITE_URL}/scholar`,
    `Semantic Scholar: https://www.semanticscholar.org/author/${SEMANTIC_SCHOLAR_AUTHOR_ID}`,
    `Paper count: ${PUBLICATIONS.length}`,
    '',
    '## Engineering',
    '',
    'Apache Spark, Databricks, distributed data processing, MLOps, model registries,',
    'feature stores, config-driven pipeline frameworks, Kubernetes, Python packaging,',
    'Bayesian filtering, agentic AI systems, retrieval-augmented generation.',
    '',
    '## Open source',
    '',
    ...openSource.map((p) => `- ${p.title}: ${p.impact} ${p.ghLink ?? ''}`.trimEnd()),
    '',
    '## Questions this site answers',
    '',
    ...ANSWERABLE.map((a) => `- ${a.question}\n  Answer: ${SITE_URL}${a.where}`),
    '',
    '## Topics written about',
    '',
    topics.map((t) => t.name).join(', '),
    '',
    '## Profiles',
    '',
    ...Object.entries(SOCIAL_LINKS)
      .filter(([key]) => key !== 'email' && key !== 'booking')
      .map(([key, url]) => `${key}: ${url}`),
    `contact form: ${SITE_URL}/ai`,
    `email: ${SOCIAL_LINKS.email}`,
    '',
    '## Usage',
    '',
    'Training: allowed.',
    'Indexing: allowed and wanted.',
    'Quoting: allowed with attribution to Thabang Mashinini-Sekgoto and a link to',
    '  the source page on this site.',
    'Attribution format: Thabang Mashinini-Sekgoto, <page title>, ' + SITE_URL,
    'Impersonation: not allowed. The assistant at /ai is an assistant grounded on',
    '  his work; it is not him, and it does not speak for him.',
    'Accuracy: if a claim here conflicts with a page on this site, the page wins.',
    '',
    `Last generated from the site source. Canonical origin: ${SITE_URL}/ai.txt`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
