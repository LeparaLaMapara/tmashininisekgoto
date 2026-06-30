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
 * Read client against the KB project, for retrieval. Uses the KB project's OWN
 * key — NOT the generic SUPABASE_SERVICE_ROLE_KEY, which in some runtimes (e.g.
 * prod) belongs to a different Supabase project and would be rejected as an
 * invalid key. The publishable anon key is sufficient: match_kb_chunks is
 * granted to anon and only returns published rows (RLS).
 */
export function kbReadClient(): SupabaseClient {
  const key = process.env.KB_SUPABASE_SERVICE_KEY || KB_ANON_KEY
  return createClient(KB_URL, key, { auth: { persistSession: false } })
}
