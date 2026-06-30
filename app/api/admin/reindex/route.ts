// ============================================================
// POST /api/admin/reindex — rebuild the KB embeddings from the in-repo corpus
// Guarded by ADMIN_TOKEN (Bearer header). Idempotent: unchanged docs are skipped.
// ============================================================
import { serviceClient } from '@/lib/rag/db'
import { reindexAll } from '@/lib/rag/indexer'

// Embedding the whole corpus can exceed the default serverless budget.
export const maxDuration = 300

function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false // fail closed if no token configured
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  return token === expected
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = serviceClient()
  if (!client) {
    return Response.json({ error: 'Supabase service role not configured' }, { status: 500 })
  }

  const started = Date.now()
  try {
    const result = await reindexAll(client)
    return Response.json({ ...result, durationMs: Date.now() - started })
  } catch (err) {
    console.error('Reindex failed:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
