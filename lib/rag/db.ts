// ============================================================
// lib/rag/db.ts — service-role Supabase client for RAG writes/RPC
// ============================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client (bypasses RLS). Server-only. Returns null when env is
 * not configured so callers can degrade gracefully.
 *
 * NOTE: because this bypasses RLS, every query/RPC MUST pass the app filter
 * explicitly (see lib/rag/config.ts APP).
 */
export function serviceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
