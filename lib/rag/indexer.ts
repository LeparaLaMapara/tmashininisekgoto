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
  /** Documents removed because they left the corpus (unpublished or deleted). */
  pruned: number
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
    pruned: 0,
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

  // Prune documents that have left the corpus.
  //
  // Upserting the current corpus is not enough on its own: a post that is
  // unpublished, or a project removed from the data file, keeps its old rows and
  // stays retrievable. That is how the assistant ended up able to cite a 404
  // post, a retired PhD claim and two subjects that were removed on purpose.
  // Reindexing must therefore also delete what is no longer meant to exist.
  try {
    result.pruned = await pruneRemoved(client, sources)
  } catch (err) {
    console.error('Prune error:', err)
    result.errors++
  }

  return result
}

/**
 * Delete indexed documents (and their chunks) whose source is no longer in the
 * corpus, scoped to this app.
 *
 * The keep-set is keyed on `source_type:source_key`, the same pair the upsert
 * uses as its conflict target, so it identifies rows exactly. Deletion is
 * skipped entirely if the corpus is empty, which only happens when something is
 * misconfigured; wiping the whole index on an empty read would be a far worse
 * outcome than leaving it stale.
 */
async function pruneRemoved(client: SupabaseClient, sources: KbSource[]): Promise<number> {
  if (sources.length === 0) return 0

  const keep = new Set(sources.map((s) => `${s.sourceType}:${s.sourceKey}`))

  const { data: existing, error } = await client
    .from('kb_documents')
    .select('id, source_type, source_key')
    .eq('app', APP)
  if (error) throw error

  const stale = (existing ?? []).filter(
    (row) => !keep.has(`${row.source_type}:${row.source_key}`)
  )
  if (stale.length === 0) return 0

  const ids = stale.map((row) => row.id)
  // Chunks first: no ON DELETE CASCADE is assumed, so orphaned chunks would
  // otherwise survive their document and stay retrievable.
  const { error: chunkErr } = await client.from('kb_chunks').delete().in('document_id', ids)
  if (chunkErr) throw chunkErr
  const { error: docErr } = await client.from('kb_documents').delete().in('id', ids)
  if (docErr) throw docErr

  console.log(`Pruned ${stale.length} document(s) no longer in the corpus:`,
    stale.map((r) => `${r.source_type}/${r.source_key}`).join(', '))
  return stale.length
}
