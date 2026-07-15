import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Production Vercel stores this under SUPABASE_SERVICE_KEY; local uses the full name.
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET() {
  const supabase = db()
  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }
  const { count, error } = await supabase
    .from('blog_subscribers')
    .select('id', { count: 'exact', head: true })
  if (error) {
    return NextResponse.json({ error: 'Could not count' }, { status: 500 })
  }
  return NextResponse.json({ count: count ?? 0 })
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const supabase = db()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const { error } = await supabase
      .from('blog_subscribers')
      .upsert(
        { email: email.toLowerCase(), subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe. Try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
