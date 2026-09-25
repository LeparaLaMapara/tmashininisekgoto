import { getAllPosts } from '@/lib/blog'
import { postToMarkdown } from '@/lib/post-markdown.mjs'
import { PROJECTS, PUBLICATIONS, SOCIAL_LINKS, type Project } from '@/lib/data'
import { RESEARCH, type ResearchLine } from '@/lib/graph/research'
import { getOrg } from '@/lib/graph/organizations'
import { getTopicDef } from '@/lib/graph/topics'
import { getPublications } from '@/lib/publications'
import { SITE_URL } from '@/lib/site'

/**
 * Everything worth indexing, in one file.
 *
 * `/llms.txt` is the index: a map of what exists and where. `/llms-full.txt` is
 * the corpus: the same material with the full text inlined, so a retrieval
 * system can ingest the whole site in one request rather than crawling 26 URLs
 * and stripping React out of each.
 *
 * The split is the llms.txt convention. Keeping both means small clients get a
 * cheap index and large ones get the substance.
 */

export const dynamic = 'force-static'

function publicationsSection(): string[] {
  const sorted = [...getPublications()].sort((a, b) => b.year - a.year)

  return [
    '## Publications',
    '',
    'Two journal papers, a workshop paper, a conference abstract and a thesis.',
    'Each summary states only what the source abstract supports. Possible',
    'applications are possibilities, not results.',
    '',
    ...sorted.flatMap((pub) => [
      `### ${pub.title} (${pub.year})`,
      '',
      `- **Authors:** ${pub.authors}`,
      `- **Venue:** ${pub.venue}`,
      ...(pub.doi ? [`- **DOI:** https://doi.org/${pub.doi}`] : []),
      ...(pub.bestCitation
        ? [`- **Citations:** ${pub.bestCitation.count}, the highest count observed (${pub.bestCitation.source}); providers disagree`]
        : []),
      `- **Link:** ${pub.scholarUrl}`,
      '',
      pub.aiSummary,
      '',
      `Possible applications, not results: ${pub.applications.join(', ')}.`,
      `Research line: ${SITE_URL}/research/${pub.research}`,
      '',
    ]),
    `Machine-readable citations for all of the above: ${SITE_URL}/publications.bib`,
    '',
  ]
}

const topicNames = (slugs: string[]) => slugs.map((s) => getTopicDef(s)?.name).filter(Boolean).join(', ')

/** A project as plain markdown, from the same record the /work page renders. */
function projectSection(p: Project): string[] {
  const cs = p.caseStudy
  const org = p.organization ? getOrg(p.organization)?.name : undefined
  const parts: [string, string | undefined][] = [
    ['The problem', cs.problem],
    ['Why it mattered', cs.why],
    ['The context', cs.context],
    ['What I did', cs.contribution],
    ['What changed', cs.changed],
    ['Who benefited', cs.benefited],
    ['What remained', cs.remained],
    ['Technical context', cs.technicalContext],
  ]
  return [
    `### ${p.headline}`,
    '',
    `URL: ${SITE_URL}/work/${p.slug}`,
    `Role: ${p.role}${org ? ` · Organisation: ${org}` : ''} · Period: ${p.period} · Status: ${p.status}`,
    ...(p.license ? [`Licence: ${p.license}`] : []),
    `Topics: ${topicNames([...p.graphTopics, ...p.technologies])}`,
    ...(p.artifacts.length ? [`Evidence: ${p.artifacts.map((a) => a.href).join(' , ')}`] : []),
    '',
    p.oneLiner,
    '',
    ...parts.flatMap(([h, t]) => (t ? [`**${h}.** ${t}`, ''] : [])),
  ]
}

/** A research line as plain markdown, from the same record /research renders. */
function researchSection(r: ResearchLine): string[] {
  return [
    `### ${r.name}`,
    '',
    `URL: ${r.page ? `${SITE_URL}/research/${r.slug}` : `${SITE_URL}/research#${r.slug}`}`,
    `Status: ${r.status} · Period: ${r.period} · Role: ${r.role}`,
    `Topics: ${topicNames(r.topics)}`,
    '',
    r.summary,
    '',
    ...(r.question ? [`**Question.** ${r.question}`, ''] : []),
    ...(r.approach ? [`**Approach.** ${r.approach}`, ''] : []),
    ...(r.datasets?.length ? [`**Data.** ${r.datasets.join('; ')}.`, ''] : []),
    ...(r.findings?.length ? ['**Findings.**', ...r.findings.map((f) => `- ${f}`), ''] : []),
    ...(r.limitations ? [`**Limitations.** ${r.limitations}`, ''] : []),
    ...(r.implications ? [`**Possible implications, not results.** ${r.implications}`, ''] : []),
    ...(r.software.length ? [`**Code.** ${r.software.map((sw) => `${sw.name} ${sw.href}`).join(' ; ')}`, ''] : []),
    `**Sources.** ${r.provenance.map((src) => `${src.label} ${src.href}`).join(' ; ')}`,
    '',
  ]
}

export function GET() {
  const posts = getAllPosts()

  const lines = [
    '# Thabang Mashinini-Sekgoto: full text',
    '',
    '> The complete writing and research record from https://www.tmashininisekgoto.com,',
    '> inlined for retrieval. The index-only version is at /llms.txt.',
    '',
    'Thabang Mashinini-Sekgoto builds production AI and data systems, reusable open',
    'source infrastructure and applied research. He is based in Johannesburg, South',
    'Africa, and is from Soshanguve. Lead Data Scientist at Absa Group, previously',
    'Vodacom and IBM Research. He holds an MSc from the University of the',
    'Witwatersrand and is preparing a doctoral research proposal there; he is not a',
    'PhD candidate. He is the founder of Ubunye AI Ecosystems and the author of Ubunye',
    'Engine, a config-driven Spark framework that runs identically on a laptop,',
    'Docker, Kubernetes, a cloud cluster and Databricks.',
    '',
    `Profiles: ${SOCIAL_LINKS.github} | ${SOCIAL_LINKS.linkedin} | ${SOCIAL_LINKS.scholar}`,
    '',
    `Generated from ${PROJECTS.length} projects, ${RESEARCH.length} research lines, ${posts.length} posts and ${PUBLICATIONS.length} publications.`,
    '',
    '---',
    '',
    '## Work',
    '',
    ...[...PROJECTS].sort((a, b) => a.order - b.order).flatMap(projectSection),
    '---',
    '',
    '## Research',
    '',
    ...RESEARCH.flatMap(researchSection),
    '---',
    '',
    ...publicationsSection(),
    '---',
    '',
    '## Writing',
    '',
    ...posts.flatMap((post) => [
      postToMarkdown(post, SITE_URL, { headingLevel: 3 }),
      '',
      '---',
      '',
    ]),
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
