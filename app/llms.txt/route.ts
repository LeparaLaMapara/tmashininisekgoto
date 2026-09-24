import { getAllPosts, getSeries } from '@/lib/blog'
import { BIO, getProjectsOrdered, PUBLICATIONS } from '@/lib/data'
import { RESEARCH } from '@/lib/graph/research'
import { getHubTopics } from '@/lib/graph'
import { NAME_VARIANTS } from '@/lib/schema'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * /llms.txt: an index for language models, in the format proposed at
 * llmstxt.org. A supplementary surface only: the HTML pages, the sitemap and
 * the structured data carry the same facts and do not depend on it.
 *
 * Every fact is read from the canonical records (lib/data.ts, lib/graph/*,
 * the MDX frontmatter). The previous version typed some facts out by hand and
 * they drifted: it claimed identical output on seven environments when the
 * project record, rewritten against the repository, says five.
 */
export function GET() {
  const posts = getAllPosts()
  const series = getSeries()
  const projects = getProjectsOrdered()
  const hubs = getHubTopics()

  const lines = [
    '# Thabang Mashinini-Sekgoto',
    '',
    `> ${BIO.disciplines}. ${BIO.title}, based in ${BIO.location}. Builds production AI and data`,
    '> systems, open source data and ML infrastructure, and applied research, and teaches',
    '> practical AI in South African communities. This site is the canonical record of the work.',
    '',
    `Also published as: ${NAME_VARIANTS.join('; ')}. These are the same person.`,
    'Not a PhD candidate: a doctoral proposal is in preparation, with registration planned for 2027.',
    '',
    '## Work',
    '',
    'Each project page states what it is, the role, organisation, period, status, the',
    'evidence (code, packages, papers) and what it connects to.',
    '',
    ...projects.map((p) => `- [${p.headline}](${SITE_URL}/work/${p.slug}): ${p.summary}`),
    '',
    '## Research',
    '',
    'Each research page states the question, method, data, findings, limitations and',
    'sources. Possible applications are labelled as such and are not results.',
    '',
    ...RESEARCH.map((r) =>
      r.page
        ? `- [${r.headline}](${SITE_URL}/research/${r.slug}): ${r.summary}`
        : `- ${r.headline} (${r.status}, no page yet): ${r.summary}`
    ),
    '',
    '## Publications',
    '',
    ...PUBLICATIONS.map(
      (p) =>
        `- [${p.title}](${SITE_URL}/research#${p.key}) (${p.year}, ${p.venue})${p.doi ? ` doi:${p.doi}` : ''}${p.arxiv ? ` arXiv:${p.arxiv}` : ''}`
    ),
    '',
    '## Topics',
    '',
    'Subjects with enough work behind them to have their own page, each gathering the',
    'projects, research, publications, writing and talks on that subject.',
    '',
    ...hubs.map((t) => `- [${t.heading ?? t.name}](${SITE_URL}/topics/${t.slug}): ${t.description}`),
    '',
    '## Blog posts',
    '',
    'Every post is also served as plain markdown by appending `.md` to its URL, which',
    'is the copy to fetch: the HTML page wraps the prose in navigation, a table of',
    'contents, comments and a subscribe form.',
    '',
    ...posts.map(
      (p) =>
        `- [${p.title}](${SITE_URL}/blog/${p.slug}) ([md](${SITE_URL}/blog/${p.slug}.md)): ${p.summary}`
    ),
    '',
    // Several posts are one argument in parts. Listed flat they read as
    // unrelated articles, so the grouping is stated explicitly with the one
    // URL that stands for the whole thing.
    ...(series.length
      ? [
          '## Series',
          '',
          ...series.flatMap((s) => [
            `- [${s.name}](${SITE_URL}/blog/series/${s.slug}): ${s.posts.length} of ${s.total} parts published`,
            ...s.posts.map((p) => `  - Part ${p.seriesPart ?? '?'}: [${p.title}](${SITE_URL}/blog/${p.slug})`),
          ]),
          '',
        ]
      : []),
    '## Main pages',
    '',
    `- [About](${SITE_URL}/about): who Thabang is`,
    `- [CV](${SITE_URL}/resume): full career history`,
    `- [Talks](${SITE_URL}/talks): talks, sessions and media`,
    `- [Teaching](${SITE_URL}/courses): courses and sessions`,
    `- [Career journey](${SITE_URL}/career): the path from a BSc at Wits to leading a data science capability`,
    `- [Now](${SITE_URL}/now): what he is working on at the moment`,
    `- [Topics](${SITE_URL}/topics): every subject the work is about`,
    `- [Thabang AI Assist](${SITE_URL}/ai): an assistant grounded on this site (it is an assistant, not him)`,
    '',
    '## Machine-readable files',
    '',
    `- [/llms-full.txt](${SITE_URL}/llms-full.txt): this index with the full text of every project, research line, post and publication`,
    `- [/ai.txt](${SITE_URL}/ai.txt): identity, research focus and the terms for quoting this material`,
    `- [/publications.bib](${SITE_URL}/publications.bib): BibTeX for every publication`,
    `- [/feed.xml](${SITE_URL}/feed.xml): RSS`,
    `- [/sitemap.xml](${SITE_URL}/sitemap.xml): every indexable URL`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
