// Every table this site owns lives in the `personal` schema of the shared
// thabangvision-dev Supabase project (kb_*, blog_*, contact_submissions,
// course_registrations, chat_rate_limits). Pass this to every createClient.
export const DB_OPTIONS = { db: { schema: 'personal' } } as const
