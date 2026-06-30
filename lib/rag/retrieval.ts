// ============================================================
// lib/rag/retrieval.ts — query embedding + app-scoped similarity search
// ============================================================
import type { SupabaseClient } from '@supabase/supabase-js'
import { embedText } from './embeddings'
import { APP, MATCH_COUNT, SIMILARITY_THRESHOLD } from './config'

export interface KbHit {
  chunk_id: string
  document_id: string
  source_type: string
  title: string
  url: string | null
  content: string
  ordinal: number
  similarity: number
}

export interface SourceRef {
  title: string
  url: string | null
  source_type: string
  similarity: number
}

export interface SearchOptions {
  matchCount?: number
  threshold?: number
  app?: string
}

/** Embed the query and return app-scoped, published chunk matches. */
export async function searchKb(
  client: SupabaseClient,
  query: string,
  opts: SearchOptions = {}
): Promise<KbHit[]> {
  const query_embedding = await embedText(query, 'RETRIEVAL_QUERY')
  const { data, error } = await client.rpc('match_kb_chunks', {
    query_embedding,
    match_count: opts.matchCount ?? MATCH_COUNT,
    filter_app: opts.app ?? APP,
    similarity_threshold: opts.threshold ?? SIMILARITY_THRESHOLD,
  })
  if (error) {
    console.error('match_kb_chunks error:', error)
    return []
  }
  return (data ?? []) as KbHit[]
}

/** Numbered, citable context blocks for the system prompt. */
export function formatRetrievalContext(hits: KbHit[]): string {
  if (!hits.length) return ''
  return hits
    .map((h, i) => {
      const source = h.url ? `${h.title} — ${h.url}` : h.title
      return `[${i + 1}] ${source}\n${h.content}`
    })
    .join('\n\n')
}

/** Deduped source list (best similarity per title+url) for UI citations. */
export function toSources(hits: KbHit[]): SourceRef[] {
  const map = new Map<string, SourceRef>()
  for (const h of hits) {
    const key = `${h.url ?? ''}|${h.title}`
    const prev = map.get(key)
    if (!prev || h.similarity > prev.similarity) {
      map.set(key, {
        title: h.title,
        url: h.url,
        source_type: h.source_type,
        similarity: h.similarity,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.similarity - a.similarity)
}
