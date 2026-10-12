// ============================================================
// lib/rag/db.ts — Supabase clients for the RAG knowledge base
//
// The KB (apps/kb_documents/kb_chunks/match_kb_chunks) lives in the `personal`
// schema of the thabangvision-dev project `bprargrqppufeuewryze`, next to the
// site's other tables (moved off thabangvision-prod 2026-10-12). It is pinned
// explicitly so retrieval never follows a stray NEXT_PUBLIC_SUPABASE_URL. Both
// values are overridable via env so they can be moved/rotated without a code change.
// ============================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { DB_OPTIONS } from '@/lib/db-schema'

// A client bound to the `personal` schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KbClient = SupabaseClient<any, any, any>

// Public project URL (not a secret).
const KB_URL = process.env.KB_SUPABASE_URL || 'https://bprargrqppufeuewryze.supabase.co'

// Publishable (anon) key — public by design, RLS-gated. The KB tables only
// expose published rows to `anon` (grant + RLS), so this is safe to ship.
const KB_ANON_KEY =
  process.env.KB_SUPABASE_ANON_KEY || 'sb_publishable_ZZLo21P9hL3MzL4mSu3oCA_rrZbQ-uS'

function serviceKey(): string | undefined {
  // Support both env-var names (project was renamed SERVICE_KEY -> SERVICE_ROLE_KEY).
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
}

/**
 * Service-role client against the KB project, for WRITES (indexing).
 * Returns null when no service key is configured.
 */
export function serviceClient(): KbClient | null {
  const key = serviceKey()
  if (!key) return null
  return createClient(KB_URL, key, { ...DB_OPTIONS, auth: { persistSession: false } })
}

/**
 * Read client against the KB project, for retrieval. Uses the KB project's OWN
 * key — NOT the generic SUPABASE_SERVICE_ROLE_KEY, which in some runtimes (e.g.
 * prod) belongs to a different Supabase project and would be rejected as an
 * invalid key. The publishable anon key is sufficient: match_kb_chunks is
 * granted to anon and only returns published rows (RLS).
 */
export function kbReadClient(): KbClient {
  const key = process.env.KB_SUPABASE_SERVICE_KEY || KB_ANON_KEY
  return createClient(KB_URL, key, { ...DB_OPTIONS, auth: { persistSession: false } })
}
