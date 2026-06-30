// ============================================================
// lib/rag/db.ts — Supabase clients for the RAG knowledge base
//
// The KB (apps/kb_documents/kb_chunks/match_kb_chunks) lives in the
// `zbdsqvpxpsygbuqnuekm` project. We pin to it explicitly because the site's
// NEXT_PUBLIC_SUPABASE_URL may point at a different project — retrieval must
// always talk to where the KB data actually is. Both values are overridable
// via env so they can be moved/rotated without a code change.
// ============================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Public project URL (not a secret).
const KB_URL = process.env.KB_SUPABASE_URL || 'https://zbdsqvpxpsygbuqnuekm.supabase.co'

// Publishable (anon) key — public by design, RLS-gated. The KB tables only
// expose published rows to `anon` (grant + RLS), so this is safe to ship.
const KB_ANON_KEY =
  process.env.KB_SUPABASE_ANON_KEY || 'sb_publishable_ydBRJBRhPI0j9PoFh6NBHw_iPB4JYJJ'

function serviceKey(): string | undefined {
  // Support both env-var names (project was renamed SERVICE_KEY -> SERVICE_ROLE_KEY).
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
}

/**
 * Service-role client against the KB project, for WRITES (indexing).
 * Returns null when no service key is configured.
 */
export function serviceClient(): SupabaseClient | null {
  const key = serviceKey()
  if (!key) return null
  return createClient(KB_URL, key, { auth: { persistSession: false } })
}

/**
 * Read client against the KB project, for retrieval. Prefers the service key
 * (local/admin), falls back to the public anon key so it works in any runtime.
 * match_kb_chunks is granted to anon and only returns published rows (RLS).
 */
export function kbReadClient(): SupabaseClient {
  return createClient(KB_URL, serviceKey() || KB_ANON_KEY, {
    auth: { persistSession: false },
  })
}
