// ============================================================
// lib/rag/indexer.ts — chunk → embed → idempotent upsert into kb_*
// ============================================================
import type { SupabaseClient } from '@supabase/supabase-js'
import { collectCorpus, type KbSource } from './documents'
import { chunkText } from './chunk'
import { embedText } from './embeddings'
import { contentHash } from './hash'
import { APP } from './config'

export interface ReindexResult {
  documents: number
  indexed: number
  skipped: number
  chunks: number
  errors: number
}

const CHUNK_INSERT_BATCH = 50

/** Index one source: skip if unchanged, else replace its chunks. */
export async function indexDocument(
  client: SupabaseClient,
  source: KbSource
): Promise<{ status: 'indexed' | 'skipped'; chunks: number }> {
  const hash = contentHash(source.text)

  const { data: existing } = await client
    .from('kb_documents')
    .select('id, content_hash')
    .eq('app', APP)
    .eq('source_type', source.sourceType)
    .eq('source_key', source.sourceKey)
    .maybeSingle()

  if (existing && existing.content_hash === hash) {
    // Skip only if the document already has chunks (guard against partial
    // prior runs that created the document row but failed before embedding).
    const { count } = await client
      .from('kb_chunks')
      .select('id', { count: 'exact', head: true })
      .eq('document_id', existing.id)
    if ((count ?? 0) > 0) return { status: 'skipped', chunks: 0 }
  }

  const { data: doc, error: docErr } = await client
    .from('kb_documents')
    .upsert(
      {
        app: APP,
        source_type: source.sourceType,
        source_key: source.sourceKey,
        title: source.title,
        url: source.url,
        content_hash: hash,
        metadata: source.metadata ?? {},
        published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'app,source_type,source_key' }
    )
    .select('id')
    .single()
  if (docErr || !doc) throw docErr ?? new Error('kb_documents upsert returned no row')

  // Replace chunks (idempotent re-index)
  await client.from('kb_chunks').delete().eq('document_id', doc.id)

  const parts = chunkText(source.text)
  const rows = []
  for (let i = 0; i < parts.length; i++) {
    const embedding = await embedText(parts[i], 'RETRIEVAL_DOCUMENT')
    rows.push({
      app: APP,
      document_id: doc.id,
      ordinal: i,
      content: parts[i],
      char_count: parts[i].length,
      token_est: Math.ceil(parts[i].length / 4),
      embedding,
    })
  }

  for (let i = 0; i < rows.length; i += CHUNK_INSERT_BATCH) {
    const { error } = await client.from('kb_chunks').insert(rows.slice(i, i + CHUNK_INSERT_BATCH))
    if (error) throw error
  }

  return { status: 'indexed', chunks: rows.length }
}

/** Index the full in-repo corpus. Continue-on-error per document. */
export async function reindexAll(client: SupabaseClient): Promise<ReindexResult> {
  const sources = collectCorpus()
  const result: ReindexResult = {
    documents: sources.length,
    indexed: 0,
    skipped: 0,
    chunks: 0,
    errors: 0,
  }

  for (const source of sources) {
    try {
      const { status, chunks } = await indexDocument(client, source)
      if (status === 'indexed') result.indexed++
      else result.skipped++
      result.chunks += chunks
    } catch (err) {
      console.error(`Index error [${source.sourceType}/${source.sourceKey}]:`, err)
      result.errors++
    }
  }

  return result
}
