// ============================================================
// lib/rag/documents.ts — collect the in-repo corpus into KbSource[]
// Reads structured data (lib/data.ts) + MDX blog (lib/blog.ts). Server-only.
// ============================================================
import {
  PROJECTS,
  TALKS,
  WRITINGS,
  PUBLICATIONS,
  COURSES,
  CAREER_TIMELINE,
  TESTIMONIALS,
  BIO,
  IMPACT_NUMBERS,
  TECH_STACK,
  SOCIAL_LINKS,
} from '@/lib/data'
import { getAllPosts } from '@/lib/blog'

export interface KbSource {
  sourceType: string
  sourceKey: string
  title: string
  url: string | null
  text: string
  metadata?: Record<string, unknown>
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

/**
 * Gather every ingestible source from the repo. Each entry maps to one
 * kb_documents row; (sourceType, sourceKey) is the idempotency key.
 */
export function collectCorpus(): KbSource[] {
  const sources: KbSource[] = []

  // ── Blog posts (MDX) ──
  for (const post of getAllPosts()) {
    sources.push({
      sourceType: 'blog',
      sourceKey: post.slug,
      title: post.title,
      url: `/blog/${post.slug}`,
      text: [post.title, post.summary, post.content].filter(Boolean).join('\n\n'),
      metadata: { tags: post.tags, date: post.date },
    })
  }

  // ── Projects ──
  for (const p of PROJECTS) {
    sources.push({
      sourceType: 'project',
      sourceKey: p.slug,
      title: p.title,
      url: `/work#${p.slug}`,
      text: [
        `Project: ${p.title} (${p.category})`,
        `Problem: ${p.problem}`,
        `Solution: ${p.solution}`,
        `Impact: ${p.impact}`,
        `Tech: ${p.skills.join(', ')}`,
        p.ghLink ? `GitHub: ${p.ghLink}` : '',
        p.productLink ? `Link: ${p.productLink}` : '',
      ].filter(Boolean).join('\n'),
    })
  }

  // ── Publications ──
  for (const pub of PUBLICATIONS) {
    sources.push({
      sourceType: 'publication',
      sourceKey: pub.semanticScholarId ?? slugify(pub.title),
      title: pub.title,
      url: pub.scholarUrl,
      text: [
        `Publication: ${pub.title} (${pub.year})`,
        `Authors: ${pub.authors}`,
        `Venue: ${pub.venue}`,
        `Summary: ${pub.aiSummary}`,
        `Applications: ${pub.applications.join(', ')}`,
      ].join('\n'),
      metadata: { year: pub.year, citations: pub.citations ?? null },
    })
  }

  // ── Talks & media (transcripts added in Phase 2) ──
  for (const t of TALKS) {
    sources.push({
      sourceType: 'talk',
      sourceKey: String(t.id),
      title: t.title,
      url: t.videoUrl,
      text: [
        `Talk: ${t.title}`,
        `Event: ${t.event} (${t.date})`,
        t.description,
      ].filter(Boolean).join('\n'),
      metadata: { event: t.event, date: t.date },
    })
  }

  // ── Writings / press ──
  for (const w of WRITINGS) {
    sources.push({
      sourceType: 'writing',
      sourceKey: slugify(w.title),
      title: w.title,
      url: w.link,
      text: [`Press: ${w.title} (${w.date})`, w.description].join('\n'),
    })
  }

  // ── Courses ──
  for (const c of COURSES) {
    sources.push({
      sourceType: 'course',
      sourceKey: c.slug,
      title: c.title,
      url: `/courses#${c.slug}`,
      text: [
        `Course: ${c.title} — ${c.subtitle}`,
        `Level: ${c.level} · ${c.duration} · ${c.format} · Status: ${c.status}`,
        c.description,
        `Modules: ${c.modules.join('; ')}`,
        `Who it's for: ${c.whoIsItFor.join('; ')}`,
      ].join('\n'),
    })
  }

  // ── Career timeline ──
  for (const m of CAREER_TIMELINE) {
    sources.push({
      sourceType: 'career',
      sourceKey: slugify(`${m.period}-${m.shortOrg}`),
      title: `${m.role} — ${m.org}`,
      url: '/resume',
      text: [
        `${m.role} at ${m.org} (${m.period}) [${m.kind}]`,
        m.description,
        `Highlight: ${m.highlight}`,
        `Skills: ${m.skills.join(', ')}`,
      ].join('\n'),
    })
  }

  // ── Bio / about (single page doc, incl. impact numbers, stack, contact) ──
  sources.push({
    sourceType: 'page',
    sourceKey: 'bio',
    title: 'About Thabang Mashinini-Sekgoto',
    url: '/about',
    text: [
      `${BIO.name} — ${BIO.title}`,
      `Location: ${BIO.location}`,
      BIO.shortBio,
      `Philosophy: ${BIO.philosophy}`,
      `Impact: ${IMPACT_NUMBERS.map((i) => `${i.value}${i.suffix} ${i.label} (${i.context})`).join('; ')}`,
      `Tech stack: ${TECH_STACK.map((t) => t.name).join(', ')}`,
      `Contact: email ${SOCIAL_LINKS.email}; book a call ${SOCIAL_LINKS.booking}; GitHub ${SOCIAL_LINKS.github}; LinkedIn ${SOCIAL_LINKS.linkedin}; Google Scholar ${SOCIAL_LINKS.scholar}`,
    ].join('\n\n'),
  })

  // ── Testimonials ──
  sources.push({
    sourceType: 'page',
    sourceKey: 'testimonials',
    title: 'Testimonials',
    url: '/',
    text: TESTIMONIALS.map((t) => `"${t.quote}" — ${t.name}, ${t.role}`).join('\n\n'),
  })

  // ── SekhotoMultiversity (what Thabang is also building) ──
  sources.push({
    sourceType: 'page',
    sourceKey: 'sekhotomultiversity',
    title: 'SekhotoMultiversity',
    url: 'https://sekhotomultiversity.vercel.app',
    text: [
      'SekhotoMultiversity is an AI-powered learning and opportunity platform that Thabang is building for African families, students, workers, and communities.',
      'The goal is to democratize access to AI, knowledge, and opportunities — helping people learn new skills, find jobs, scholarships and study opportunities, and apply AI in everyday life, with South African / African context.',
      'It reflects Thabang\'s philosophy of building technology that uplifts communities. To partner or collaborate on SekhotoMultiversity, contact Thabang directly.',
      'Explore it at https://sekhotomultiversity.vercel.app',
    ].join('\n'),
  })

  return sources
}
