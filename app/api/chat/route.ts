import { streamText, StreamData, type JSONValue } from 'ai'
import { google } from '@ai-sdk/google'
import { buildSystemPrompt, buildGroundedPrompt } from '@/lib/knowledge-base'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { isRagEnabled } from '@/lib/rag/config'
import { searchKb, formatRetrievalContext, toSources, type SourceRef } from '@/lib/rag/retrieval'
import { kbReadClient } from '@/lib/rag/db'
import { clientIp } from '@/lib/request-ip'

const DAILY_LIMIT = 10
const MAX_CONVERSATION_MESSAGES = 20 // 10 user + 10 assistant
// A single request must not be able to run up an unbounded model bill. The
// conversation is capped by count above; these cap its size. A real question
// fits easily inside both.
const MAX_MESSAGE_CHARS = 4000
const MAX_TOTAL_CHARS = 24000

interface ChatMessage { role: string; content?: unknown }

/** Extract the latest user message text (content may be a string or parts). */
function lastUserText(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role !== 'user') continue
    if (typeof m.content === 'string') return m.content
    if (Array.isArray(m.content)) {
      return m.content
        .map((p) => (typeof p === 'string' ? p : (p as { text?: string })?.text ?? ''))
        .join(' ')
        .trim()
    }
  }
  return ''
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function getRateLimitInfo(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = getSupabase()
  if (!supabase) {
    // No Supabase configured, allow all requests
    return { allowed: true, remaining: DAILY_LIMIT }
  }

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // Get today's count for this IP
  const { data, error } = await supabase
    .from('chat_rate_limits')
    .select('message_count')
    .eq('ip_address', ip)
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is fine (first message today)
    // Other errors: allow the request but log
    console.error('Rate limit check error:', error)
    return { allowed: true, remaining: DAILY_LIMIT }
  }

  const currentCount = data?.message_count ?? 0

  if (currentCount >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  // Upsert: increment count or create new row
  const { error: upsertError } = await supabase
    .from('chat_rate_limits')
    .upsert(
      {
        ip_address: ip,
        date: today,
        message_count: currentCount + 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'ip_address,date' }
    )

  if (upsertError) {
    console.error('Rate limit upsert error:', upsertError)
  }

  return { allowed: true, remaining: DAILY_LIMIT - (currentCount + 1) }
}

export async function POST(req: Request) {
  const headersList = await headers()
  const ip = clientIp(headersList)

  let parsed: unknown
  try {
    parsed = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const messages = (parsed as { messages?: unknown })?.messages
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Cap conversation length
  if (messages.length > MAX_CONVERSATION_MESSAGES) {
    return new Response(
      JSON.stringify({ error: 'Conversation limit reached. Please start a new chat to continue.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Cap conversation size, so one request cannot run up an unbounded bill.
  let totalChars = 0
  for (const m of messages) {
    const content = (m as ChatMessage)?.content
    const text = typeof content === 'string'
      ? content
      : Array.isArray(content)
        ? content.map((p) => (typeof p === 'string' ? p : (p as { text?: string })?.text ?? '')).join(' ')
        : ''
    if (text.length > MAX_MESSAGE_CHARS) {
      return new Response(
        JSON.stringify({ error: 'That message is too long. Please shorten it.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      )
    }
    totalChars += text.length
  }
  if (totalChars > MAX_TOTAL_CHARS) {
    return new Response(
      JSON.stringify({ error: 'This conversation is too long. Please start a new chat.' }),
      { status: 413, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Rate limit per IP
  const { allowed, remaining } = await getRateLimitInfo(ip)

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'You\'ve reached the daily message limit (10 messages). Come back tomorrow!' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Retrieval-augmented grounding. Falls back to the static knowledge base when
  // RAG is disabled or no relevant context is found, so the page never regresses.
  let system = buildSystemPrompt()
  let sources: SourceRef[] = []

  if (isRagEnabled()) {
    const supabase = kbReadClient()
    const query = lastUserText(messages)
    if (supabase && query) {
      try {
        const hits = await searchKb(supabase, query)
        console.log(`RAG retrieval: ${hits.length} hits for "${query.slice(0, 60)}"`)
        if (hits.length) {
          system = buildGroundedPrompt(formatRetrievalContext(hits))
          sources = toSources(hits)
        }
      } catch (err) {
        console.error('Retrieval error (falling back to static KB):', err)
      }
    } else {
      console.error('RAG: retrieval skipped (no client or empty query)')
    }
  }

  const data = new StreamData()

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system,
    messages,
    maxTokens: 2048,
    onFinish: async () => {
      // Attach cited sources to this assistant message for the UI.
      if (sources.length) {
        data.appendMessageAnnotation({ type: 'sources', sources } as unknown as JSONValue)
      }
      await data.close()
    },
  })

  return result.toDataStreamResponse({
    data,
    headers: { 'X-RateLimit-Remaining': String(remaining) },
    getErrorMessage: (error) => {
      // Log the real error server-side; never return it to the client, where it
      // can leak internals (model names, stack frames, provider messages).
      console.error('AI SDK Error:', error)
      return 'The assistant hit an error. Please try again.'
    }
  })
}
