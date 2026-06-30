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
 * Master switch for retrieval. ON by default; set RAG_ENABLED=false to use the
 * static knowledge base instead (kill-switch). Retrieval failures also fall back
 * to the static KB at runtime, so this is safe even if the corpus is empty.
 */
export function isRagEnabled(): boolean {
  return process.env.RAG_ENABLED !== 'false'
}
