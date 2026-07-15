import type { MetadataRoute } from 'next'

// AI crawlers are welcomed by name so there is no ambiguity: being readable
// by AI search (ChatGPT, Claude, Perplexity, Google AI) is a distribution
// channel, not a threat. See also /llms.txt.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'cohere-ai',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://tmashininisekgoto.vercel.app/sitemap.xml',
  }
}
