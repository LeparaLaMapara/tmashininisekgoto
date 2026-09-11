// Reindex the Thabang AI knowledge base without running the site.
//
// Usage: npx tsx scripts/rag/reindex-direct.ts
//
// scripts/rag/reindex.mjs does the same job by calling /api/admin/reindex on a
// running server. That cannot be pointed at production: the knowledge base
// lives in its own Supabase project (see lib/rag/db.ts), and production's
// SUPABASE_SERVICE_ROLE_KEY belongs to the site's other project, so the write
// fails there. This calls the same reindexAll() in process instead, which is
// what the rag-reindex workflow runs.
//
// Needs SUPABASE_SERVICE_ROLE_KEY for the knowledge base project and
// GOOGLE_GENERATIVE_AI_API_KEY for embeddings, from the environment or
// .env.local. Idempotent: unchanged documents are skipped, and documents that
// left the corpus (unpublished or deleted) are pruned.

import fs from 'node:fs'
import path from 'node:path'
import { serviceClient } from '../../lib/rag/db'
import { reindexAll } from '../../lib/rag/indexer'

// Same minimal .env.local loader as the other scripts. Real env vars win.
const envFile = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf-8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match || match[1] in process.env) continue
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

async function main() {
  const client = serviceClient()
  if (!client) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.')
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set.')

  const started = Date.now()
  const result = await reindexAll(client)
  console.log(JSON.stringify({ ...result, durationMs: Date.now() - started }))
  if (result.errors > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
