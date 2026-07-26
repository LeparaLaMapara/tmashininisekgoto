import { getAllPosts } from '@/lib/blog'
import { postToMarkdown } from '@/lib/post-markdown.mjs'
import { PUBLICATIONS, SOCIAL_LINKS } from '@/lib/data'
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
    'Peer-reviewed research and thesis work. Summaries are written by Thabang, not',
    'generated from the abstracts.',
    '',
    ...sorted.flatMap((pub) => [
      `### ${pub.title} (${pub.year})`,
      '',
      `- **Authors:** ${pub.authors}`,
      `- **Venue:** ${pub.venue}`,
      ...(pub.doi ? [`- **DOI:** https://doi.org/${pub.doi}`] : []),
      ...(pub.bestCitation
        ? [`- **Citations:** ${pub.bestCitation.count} (${pub.bestCitation.source})`]
        : []),
      `- **Link:** ${pub.scholarUrl}`,
      '',
      pub.aiSummary,
      '',
      `Applied to: ${pub.applications.join(', ')}.`,
      '',
    ]),
    `Machine-readable citations for all of the above: ${SITE_URL}/publications.bib`,
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
    'Thabang Mashinini-Sekgoto is a Lead Data Scientist and AI researcher based in',
    'Johannesburg, South Africa, from Soshanguve. He is a PhD candidate at the',
    'University of the Witwatersrand working on physics-informed self-supervised',
    'learning for SAR-based flood extent mapping, founder of Ubunye AI Ecosystems, and',
    'the author of Ubunye Engine, a config-driven Spark framework that runs identically',
    'on a laptop, Docker, Kubernetes, a cloud cluster and Databricks.',
    '',
    `Profiles: ${SOCIAL_LINKS.github} | ${SOCIAL_LINKS.linkedin} | ${SOCIAL_LINKS.scholar}`,
    '',
    `Generated from ${posts.length} posts and ${PUBLICATIONS.length} publications.`,
    '',
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
