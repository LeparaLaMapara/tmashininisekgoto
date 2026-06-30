// ============================================================
// lib/rag/config.ts — shared RAG configuration & tenancy slug
// ============================================================

/** The app/platform slug this site's KB rows are tagged with (tenancy column). */
export const APP = process.env.RAG_APP_SLUG || 'tmashininisekgoto'

/** Embedding dimension — Gemini text-embedding-004 (house standard). */
export const EMBED_DIM = 768

/** Retrieval defaults. Threshold is intentionally permissive: multi-intent
 *  queries land relevant docs ~0.5, and the grounded prompt ignores noise. */
export const MATCH_COUNT = 8
export const SIMILARITY_THRESHOLD = 0.4

/**
 * Master switch for retrieval. When false the chat route falls back to the
 * static knowledge base, so the page is safe to deploy before the first reindex.
 */
export function isRagEnabled(): boolean {
  return process.env.RAG_ENABLED === 'true'
}
