// ============================================================
// lib/rag/chunk.ts — paragraph-greedy chunking (~1200 chars, ~150 overlap)
// Ported from tutokolo/scripts/ingest-papers.mjs chunkText/cleanText.
// ============================================================

const MAX_CHARS = 1200
const OVERLAP = 150

export function cleanText(input: string): string {
  return input
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Split text into paragraph-aware chunks no larger than `max` chars, carrying a
 * small tail overlap between chunks so context isn't lost at boundaries.
 * Oversized single paragraphs are hard-split.
 */
export function chunkText(input: string, max = MAX_CHARS, overlap = OVERLAP): string[] {
  const text = cleanText(input)
  if (!text) return []

  const paragraphs = text.split(/\n\n+/)
  const chunks: string[] = []
  let current = ''

  const flush = () => {
    const trimmed = current.trim()
    if (trimmed) chunks.push(trimmed)
    current = ''
  }

  for (const para of paragraphs) {
    if (para.length > max) {
      flush()
      for (let i = 0; i < para.length; i += max - overlap) {
        chunks.push(para.slice(i, i + max).trim())
      }
      continue
    }

    if (current && (current.length + 2 + para.length) > max) {
      const tail = current.slice(-overlap)
      flush()
      current = tail ? `${tail}\n\n${para}` : para
    } else {
      current = current ? `${current}\n\n${para}` : para
    }
  }
  flush()

  return chunks.filter(Boolean)
}
