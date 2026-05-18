import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { buildSystemPrompt } from '@/lib/knowledge-base'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const DAILY_LIMIT = 10
const MAX_CONVERSATION_MESSAGES = 20 // 10 user + 10 assistant

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
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
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? headersList.get('x-real-ip')
    ?? '127.0.0.1'

  const { messages } = await req.json()

  // Cap conversation length
  if (messages.length > MAX_CONVERSATION_MESSAGES) {
    return new Response(
      JSON.stringify({ error: 'Conversation limit reached. Please start a new chat to continue.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
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

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: buildSystemPrompt(),
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse({
    headers: { 'X-RateLimit-Remaining': String(remaining) },
    getErrorMessage: (error) => {
      console.error('AI SDK Error:', error)
      return String(error)
    }
  })
}
