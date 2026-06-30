import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_INTERESTS = new Set([
  'recruitment',
  'consulting',
  'workshop',
  'speaking',
  'collaboration',
  'sekhotomultiversity',
  'learning',
  'other',
])

export async function POST(request: Request) {
  try {
    const { name, email, organisation, interest, message } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (at least 2 characters)' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (!interest || typeof interest !== 'string' || !ALLOWED_INTERESTS.has(interest)) {
      return NextResponse.json({ error: 'Please choose what you are interested in' }, { status: 400 })
    }
    if (message && (typeof message !== 'string' || message.length > 4000)) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
    }
    if (organisation && (typeof organisation !== 'string' || organisation.length > 200)) {
      return NextResponse.json({ error: 'Organisation is too long' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase.from('contact_submissions').insert({
      app: 'tmashininisekgoto',
      name: name.trim(),
      email: email.toLowerCase().trim(),
      organisation: organisation?.trim() || null,
      interest,
      message: message?.trim() || null,
      source: 'ai-page',
    })

    if (error) {
      console.error('Contact insert error:', error)
      return NextResponse.json({ error: 'Failed to send. Try again later.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
