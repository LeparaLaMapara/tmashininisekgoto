/**
 * One definition of "this post as plain markdown".
 *
 * Three consumers need the same bytes and must not drift:
 *
 *   1. `/blog/<slug>.md`   the machine-readable copy of every post
 *   2. `/llms-full.txt`    every post concatenated, for LLM ingestion
 *   3. `scripts/syndicate.mjs`  the body pushed to dev.to and Hashnode
 *
 * If the syndicated copy and the indexed copy disagree, the canonical claim
 * looks like a lie to anything comparing them, so they share this file.
 *
 * Plain `.mjs` rather than `.ts` on purpose: the syndication script is a node
 * script with no build step, and the app imports it directly. `allowJs` is on,
 * so TypeScript still infers the types from the JSDoc below.
 *
 * @typedef {object} MarkdownPost
 * @property {string} slug
 * @property {string} title
 * @property {string} date
 * @property {string[]} tags
 * @property {string} summary
 * @property {string} content
 * @property {string} [readingTime]
 * @property {string} [lastModified]
 */

/** The byline used everywhere a post is attributed. */
export const AUTHOR = 'Thabang Mashinini-Sekgoto'

/**
 * The one-paragraph statement of what a post is about.
 *
 * Normally that is `summary`, the excerpt shown on /blog. One post has a
 * four-word summary ("creating from 1st principles"), which works as a caption
 * under a headline and does not work as the opening paragraph of the post or as
 * the first thing a retrieval system reads. Where the excerpt is too short to
 * be a statement and a fuller `seoDescription` exists, that is used instead.
 *
 * The floor is 60 characters: roughly a sentence. It is an editorial minimum,
 * not a measurement of anything.
 *
 * @param {{ summary?: string, seoDescription?: string }} post
 */
export function postSummaryText(post) {
  const summary = (post.summary ?? '').trim()
  if (summary.length >= 60 || !post.seoDescription) return summary
  return post.seoDescription.trim()
}

/**
 * Strip the leading H1 from a post body.
 *
 * Posts open with their own `# Title`, and every renderer here emits the title
 * itself, so leaving it in produces the heading twice. The page does the same
 * thing before handing the body to MDX.
 */
export function stripLeadingH1(content) {
  return content.trimStart().replace(/^#\s.*\r?\n/, '').trimStart()
}

/**
 * Rewrite site-relative links and images to absolute URLs.
 *
 * Matters most off-site: `[Part 2](/blog/…)` is a dead link on dev.to and a
 * relative link in a markdown file fetched by a crawler. Skips protocol-relative
 * (`//host`) and anchor-only (`#section`) targets.
 */
export function absolutiseLinks(content, siteUrl) {
  const base = siteUrl.replace(/\/$/, '')
  return content.replace(
    /(!?\[[^\]]*\])\((\/(?!\/)[^)\s]*)\)/g,
    (_match, label, href) => `${label}(${base}${href})`
  )
}

/** ISO date (YYYY-MM-DD) from whatever the frontmatter carried. */
function isoDate(value) {
  if (!value) return ''
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime())
    ? String(value)
    : parsed.toISOString().slice(0, 10)
}

/**
 * The fixed-format metadata block that opens every machine-readable copy.
 *
 * The shape is deliberately boring and identical across posts: a blockquoted
 * summary followed by a `**Key:** value` list. An indexer that has parsed one
 * post has parsed all of them, and the summary is the first prose in the
 * document rather than the twelfth paragraph.
 */
export function summaryBlock(post, siteUrl) {
  const base = siteUrl.replace(/\/$/, '')
  const url = `${base}/blog/${post.slug}`

  const rows = [
    ['Author', AUTHOR],
    ['Published', isoDate(post.date)],
    post.lastModified && isoDate(post.lastModified) !== isoDate(post.date)
      ? ['Updated', isoDate(post.lastModified)]
      : null,
    post.readingTime ? ['Reading time', post.readingTime] : null,
    post.tags?.length ? ['Topics', post.tags.join(', ')] : null,
    ['Canonical URL', url],
    ['Markdown source', `${url}.md`],
  ].filter(Boolean)

  return [
    `> **Summary:** ${postSummaryText(post)}`,
    '',
    ...rows.map(([key, value]) => `- **${key}:** ${value}`),
  ].join('\n')
}

/**
 * A whole post as a standalone markdown document.
 *
 * @param {MarkdownPost} post
 * @param {string} siteUrl
 * @param {{ headingLevel?: number }} [options] heading depth for the title, so
 *   `/llms-full.txt` can nest posts under a `##` without clashing with the
 *   document's own `#`.
 */
export function postToMarkdown(post, siteUrl, options = {}) {
  const level = options.headingLevel ?? 1
  const body = absolutiseLinks(stripLeadingH1(post.content), siteUrl)

  return [
    `${'#'.repeat(level)} ${post.title}`,
    '',
    summaryBlock(post, siteUrl),
    '',
    '---',
    '',
    body.trimEnd(),
    '',
  ].join('\n')
}

/**
 * The body to syndicate to a third-party platform.
 *
 * No summary block: dev.to and Hashnode render their own subtitle from the
 * post's description field, and repeating it reads as padding. The footer is
 * the point of the exercise, because it is the link back that the canonical tag
 * cannot carry to a human reader.
 *
 * @param {MarkdownPost} post
 * @param {string} siteUrl
 */
export function syndicationBody(post, siteUrl) {
  const base = siteUrl.replace(/\/$/, '')
  const url = `${base}/blog/${post.slug}`

  return [
    absolutiseLinks(stripLeadingH1(post.content), siteUrl).trimEnd(),
    '',
    '---',
    '',
    `*Originally published at [${base.replace(/^https?:\/\//, '')}](${url}).*`,
    '',
    `*I write about machine learning engineering, MLOps and building AI systems in South Africa. More at [${base.replace(/^https?:\/\//, '')}](${base}).*`,
    '',
  ].join('\n')
}
