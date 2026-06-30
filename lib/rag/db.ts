// ============================================================
// lib/rag/db.ts — Supabase clients for RAG
// ============================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The Supabase project URL is public (not a secret). Hardcoded as a fallback so
// retrieval works even if NEXT_PUBLIC_SUPABASE_URL isn't set in the runtime.
const FALLBACK_URL = 'https://zbdsqvpxpsygbuqnuekm.supabase.co'

function url(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
}

function serviceKey(): string | undefined {
  // Support both env-var names (the project was renamed SERVICE_KEY -> SERVICE_ROLE_KEY).
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
}

/**
 * Service-role client (bypasses RLS) for WRITES (indexing). Returns null when no
 * service key is configured. Callers must always pass the app filter explicitly.
 */
export function serviceClient(): SupabaseClient | null {
  const key = serviceKey()
  if (!key) return null
  return createClient(url(), key, { auth: { persistSession: false } })
}

/**
 * Read client for retrieval. Prefers the service key, but falls back to the anon
 * (publishable) key — retrieval only reads published KB rows, which are exposed to
 * `anon` via the match_kb_chunks grant + public-read RLS. This makes retrieval work
 * with whichever Supabase credential the runtime actually has.
 */
export function readClient(): SupabaseClient | null {
  const key = serviceKey() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    console.error('RAG: no Supabase key available (service or anon) — retrieval disabled')
    return null
  }
  return createClient(url(), key, { auth: { persistSession: false } })
}
