import { getAllPosts } from '@/lib/blog'

const SITE_URL = 'https://tmashininisekgoto.vercel.app'

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
    'output hashes on seven environments); founder of ThabangVision (thabangvision.com, a',
    'live marketplace to book South African photographers, videographers and gear); leader',
    'of Kasilam (free websites for township businesses, seven live sites shipped).',
    '',
    '## Blog posts',
    '',
    ...posts.map(
      (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.summary}`
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
    `- [Thabang AI Assist](${SITE_URL}/ai): an AI assistant grounded on his work (it is an assistant, not him)`,
    '',
    '## Related sites',
    '',
    '- [Ubunye Engine documentation](https://ubunye-ai-ecosystems.github.io/ubunye_engine/)',
    '- [Ubunye examples repository](https://github.com/ubunye-ai-ecosystems/ubunye-examples)',
    '- [Kasilam Digital Platforms](https://kasilamdigitialplatforms.vercel.app)',
    '- [ThabangVision](https://thabangvision.com)',
    '',
    `RSS feed: ${SITE_URL}/feed.xml`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
