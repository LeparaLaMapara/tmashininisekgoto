import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ counts: {} })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('course_registrations')
      .select('course_slug')

    if (error || !data) {
      return NextResponse.json({ counts: {} })
    }

    const counts: Record<string, number> = {}
    for (const row of data) {
      counts[row.course_slug] = (counts[row.course_slug] || 0) + 1
    }

    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ counts: {} })
  }
}
