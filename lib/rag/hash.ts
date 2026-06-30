// ============================================================
// lib/rag/hash.ts — content hashing for idempotent re-indexing
// ============================================================
import { createHash } from 'crypto'

/** Stable sha256 of normalized text — used to skip unchanged documents. */
export function contentHash(text: string): string {
  return createHash('sha256').update(text.replace(/\s+/g, ' ').trim()).digest('hex')
}
