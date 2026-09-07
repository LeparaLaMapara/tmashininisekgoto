// Narrate blog posts with Kokoro (open source, Apache 2.0), free and local.
//
//   node scripts/tts/generate.mjs           narrate every post missing audio
//   node scripts/tts/generate.mjs <slug>    narrate one post (overwrites)
//
// Output: public/audio/<slug>.mp3 (64 kbps mono, small enough to commit).
// Voice: af_heart. Requires ffmpeg on PATH for the MP3 encode.

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import path from 'path'
import matter from 'gray-matter'
import { KokoroTTS } from 'kokoro-js'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const OUT_DIR = path.join(process.cwd(), 'public/audio')
const VOICE = 'af_heart'

function cleanForNarration(raw) {
  const { data, content } = matter(raw)
  let text = content

  // The intro already speaks the title; drop the post's own H1.
  text = text.trimStart().replace(/^# .*\r?\n/, '')
  // Code blocks are for eyes, not ears.
  text = text.replace(/```[\s\S]*?```/g, '')
  // Series navigation lines are noise when spoken.
  text = text
    .split('\n')
    .filter((line) => !/\]\(\/blog\//.test(line))
    .join('\n')
  // Images, horizontal rules, tables.
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  text = text.replace(/^---+\s*$/gm, '')
  text = text
    .split('\n')
    .filter((line) => !line.trim().startsWith('|'))
    .join('\n')
  // Links become their text; inline code loses its backticks.
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  text = text.replace(/`([^`]*)`/g, '$1')
  // Headings become sentences; emphasis and quote markers vanish.
  text = text.replace(/^#{1,6}\s*(.+)$/gm, '$1.')
  text = text.replace(/^\s*>\s?/gm, '')
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  // Collapse leftover blank space.
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  const intro = `${data.title}. Written by Thabang Mashinini-Sekgoto.`
  return `${intro}\n\n${text}`
}

function floatTo16BitWav(samples, sampleRate) {
  const buffer = Buffer.alloc(44 + samples.length * 2)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + samples.length * 2, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(samples.length * 2, 40)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2)
  }
  return buffer
}

/**
 * Split text into pieces small enough for one synthesis call.
 *
 * Kokoro renders one utterance at a time and silently drops whatever exceeds
 * its internal limit. No error, no warning, and the chunk still reports its
 * full text back, so an over-long piece looks like a success and returns audio
 * missing most of its words.
 *
 * Part 4 of the agent series hit this. TextSplitterStream handed the model a
 * single 3,731 character chunk, which produced 26 seconds of audio: 142
 * characters per second against a median of 14. The article narrated in 5.3
 * minutes instead of roughly 9.5, with whole paragraphs absent.
 *
 * Pushing to the splitter in smaller pieces does not help, because it buffers
 * and re-splits by its own rules. The only reliable fix is to bypass it and
 * call generate() per segment, which is what narrate() now does.
 */
const MAX_SEGMENT = 600

function segmentForTts(text) {
  const out = []
  for (const para of text.split(/\n{2,}/)) {
    const block = para.trim()
    if (!block) continue
    if (block.length <= MAX_SEGMENT) {
      out.push(block)
      continue
    }
    let buf = ''
    for (const sentence of block.split(/(?<=[.!?])\s+/)) {
      if (buf && buf.length + sentence.length + 1 > MAX_SEGMENT) {
        out.push(buf.trim())
        buf = ''
      }
      buf += (buf ? ' ' : '') + sentence
    }
    if (buf.trim()) out.push(buf.trim())
  }
  return out
}

async function narrate(tts, slug, text) {
  const segments = segmentForTts(text)

  const chunks = []
  let sampleRate = 24000
  for (const segment of segments) {
    const audio = await tts.generate(segment, { voice: VOICE })
    chunks.push(audio.audio)
    sampleRate = audio.sampling_rate
  }

  const total = chunks.reduce((n, c) => n + c.length, 0)
  const merged = new Float32Array(total)
  let offset = 0
  for (const c of chunks) {
    merged.set(c, offset)
    offset += c.length
  }

  const wavPath = path.join(OUT_DIR, `${slug}.tmp.wav`)
  const mp3Path = path.join(OUT_DIR, `${slug}.mp3`)
  writeFileSync(wavPath, floatTo16BitWav(merged, sampleRate))
  execFileSync('ffmpeg', ['-y', '-i', wavPath, '-codec:a', 'libmp3lame', '-b:a', '64k', mp3Path], {
    stdio: 'ignore',
  })
  rmSync(wavPath)

  // Guard: text rendering far too fast means the limit was hit again.
  const seconds = total / sampleRate
  const cps = text.length / seconds
  if (cps > 25) {
    console.warn(`  WARNING ${slug}: ${cps.toFixed(0)} chars/sec, expected about 14. Audio is probably incomplete.`)
  }
  return seconds
}


const onlySlug = process.argv[2]
mkdirSync(OUT_DIR, { recursive: true })

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
const jobs = []
for (const file of files) {
  const slug = file.replace(/\.mdx$/, '')
  if (onlySlug && slug !== onlySlug) continue
  const mp3 = path.join(OUT_DIR, `${slug}.mp3`)
  if (!onlySlug && existsSync(mp3)) {
    console.log(`skip ${slug} (audio exists)`)
    continue
  }
  const raw = readFileSync(path.join(BLOG_DIR, file), 'utf8')
  if (matter(raw).data.published === false) {
    console.log(`skip ${slug} (unpublished)`)
    continue
  }
  jobs.push({ slug, text: cleanForNarration(raw) })
}

if (jobs.length === 0) {
  console.log('Nothing to narrate.')
  process.exit(0)
}

console.log(`Loading Kokoro (first run downloads the model once)...`)
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
  dtype: 'q8',
})

for (const job of jobs) {
  const started = Date.now()
  const seconds = await narrate(tts, job.slug, job.text)
  const mins = (seconds / 60).toFixed(1)
  const took = ((Date.now() - started) / 1000).toFixed(0)
  console.log(`${job.slug}: ${mins} min of audio in ${took}s`)
}
console.log('Done.')
