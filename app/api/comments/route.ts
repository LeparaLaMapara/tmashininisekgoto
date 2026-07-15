import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const APP = process.env.RAG_APP_SLUG || 'tmashininisekgoto'
const SLUG_RE = /^[a-z0-9-]{1,120}$/
const MAX_PER_WINDOW = 5
const WINDOW_MINUTES = 10

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function ipHash(request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  return createHash('sha256').update(`${APP}:${ip}`).digest('hex').slice(0, 32)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || ''
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const supabase = db()
  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('blog_comments')
    .select('id, name, message, created_at')
    .eq('app', APP)
    .eq('slug', slug)
    .eq('approved', true)
    .order('created_at', { ascending: true })
    .limit(200)

  if (error) {
    console.error('comments GET error:', error)
    return NextResponse.json({ error: 'Could not load comments' }, { status: 500 })
  }

  return NextResponse.json({ comments: data ?? [] })
}

export async function POST(request: Request) {
  let body: { slug?: string; name?: string; message?: string; website?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: real people never see this field, bots fill it in.
  if (body.website) {
    return NextResponse.json({ success: true })
  }

  const slug = (body.slug || '').trim()
  const name = (body.name || '').trim()
  const message = (body.message || '').trim()

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }
  if (name.length < 1 || name.length > 60) {
    return NextResponse.json({ error: 'Please give a name (up to 60 characters).' }, { status: 400 })
  }
  if (message.length < 2 || message.length > 2000) {
    return NextResponse.json(
      { error: 'Comments can be up to 2000 characters.' },
      { status: 400 }
    )
  }

  const supabase = db()
  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const hash = ipHash(request)
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString()
  const { count } = await supabase
    .from('blog_comments')
    .select('id', { count: 'exact', head: true })
    .eq('app', APP)
    .eq('ip_hash', hash)
    .gte('created_at', windowStart)

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: 'You are commenting fast. Give it a few minutes and try again.' },
      { status: 429 }
    )
  }

  const { data, error } = await supabase
    .from('blog_comments')
    .insert({ app: APP, slug, name, message, ip_hash: hash })
    .select('id, name, message, created_at')
    .single()

  if (error) {
    console.error('comments POST error:', error)
    return NextResponse.json({ error: 'Could not post your comment. Try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, comment: data })
}
