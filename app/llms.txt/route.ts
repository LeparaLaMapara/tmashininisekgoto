import { getAllPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()

  const lines = [
    '# Thabang Mashinini-Sekgoto',
    '',
    '> Personal site of Thabang Mashinini-Sekgoto: AI researcher at the University of the',
    '> Witwatersrand, founder of Ubunye AI Ecosystems, and builder from Soshanguve, South',
    '> Africa. He builds AI systems for banks and telecoms, open source data/ML tooling,',
    '> and free websites for township businesses through the Kasilam community project.',
    '',
    'Key facts: creator of Ubunye Engine (config driven Spark pipelines that run identically',
    'on laptops, Docker, Kubernetes, cloud clusters and Databricks, proven by identical',
    'output hashes on seven environments); leader of Kasilam (free websites for township',
    'businesses, seven live sites shipped).',
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
    '## Main pages',
    '',
    `- [Work and projects](${SITE_URL}/work): every project with why it was built, what it is, and its impact`,
    `- [About](${SITE_URL}/about): who Thabang is`,
    `- [Publications](${SITE_URL}/publications): peer reviewed research`,
    `- [Talks](${SITE_URL}/talks): talks and media`,
    `- [Teaching](${SITE_URL}/courses): courses and sessions`,
    `- [CV](${SITE_URL}/resume): full career history`,
    `- [Career journey](${SITE_URL}/career): the path from BSc at Wits to Lead Data Scientist`,
    `- [Now](${SITE_URL}/now): what he is working on at the moment`,
    `- [Topics](${SITE_URL}/tags): the writing grouped by subject, each topic its own page`,
    `- [Thabang AI Assist](${SITE_URL}/ai): an AI assistant grounded on his work (it is an assistant, not him)`,
    '',
    '## Related sites',
    '',
    '- [Ubunye Engine documentation](https://ubunye-ai-ecosystems.github.io/ubunye_engine/)',
    '- [Ubunye examples repository](https://github.com/ubunye-ai-ecosystems/ubunye-examples)',
    '- [Kasilam Digital Platforms](https://kasilamdigitialplatforms.vercel.app)',
    '',
    '## Machine-readable files',
    '',
    `- [/ai.txt](${SITE_URL}/ai.txt): identity, research focus, expertise and the terms for quoting this material`,
    `- [/llms-full.txt](${SITE_URL}/llms-full.txt): this index with the full text of every post and publication inlined`,
    `- [/publications.bib](${SITE_URL}/publications.bib): BibTeX for every publication`,
    `- [/feed.xml](${SITE_URL}/feed.xml): RSS`,
    `- [/sitemap.xml](${SITE_URL}/sitemap.xml): every indexable URL`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
