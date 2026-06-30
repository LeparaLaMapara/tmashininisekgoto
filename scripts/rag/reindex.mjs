// ============================================================
// scripts/rag/reindex.mjs — trigger POST /api/admin/reindex
// Usage: npm run rag:reindex   (dev server or REINDEX_URL must be reachable)
// ============================================================
import fs from 'node:fs'
import path from 'node:path'

// Minimal .env.local loader (no dependency).
function loadEnvLocal() {
  const file = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}

loadEnvLocal()

const url = process.env.REINDEX_URL || 'http://localhost:3000/api/admin/reindex'
const token = process.env.ADMIN_TOKEN
if (!token) {
  console.error('ADMIN_TOKEN is not set (.env.local or env).')
  process.exit(1)
}

const res = await fetch(url, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
})
const body = await res.text()
console.log(`POST ${url} → ${res.status}`)
console.log(body)
process.exit(res.ok ? 0 : 1)
