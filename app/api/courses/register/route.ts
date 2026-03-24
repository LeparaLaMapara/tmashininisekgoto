import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { fullName, email, whatsapp, courseSlug } = await request.json()

    // Validate required fields
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name is required (at least 2 characters)' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!courseSlug || typeof courseSlug !== 'string') {
      return NextResponse.json(
        { error: 'Course selection is required' },
        { status: 400 }
      )
    }

    // Validate WhatsApp if provided
    if (whatsapp && typeof whatsapp === 'string' && whatsapp.trim().length > 0) {
      const cleaned = whatsapp.replace(/[\s\-\(\)]/g, '')
      if (!/^\+?\d{7,15}$/.test(cleaned)) {
        return NextResponse.json(
          { error: 'Invalid WhatsApp number' },
          { status: 400 }
        )
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('course_registrations')
      .upsert(
        {
          full_name: fullName.trim(),
          email: email.toLowerCase().trim(),
          whatsapp: whatsapp?.trim() || null,
          course_slug: courseSlug,
          registered_at: new Date().toISOString(),
        },
        { onConflict: 'email,course_slug' }
      )

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to register. Try again later.' },
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
