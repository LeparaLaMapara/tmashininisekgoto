// ============================================================
// lib/rag/embeddings.ts — Gemini embeddings (768-dim) via AI SDK
// Reuses the existing @ai-sdk/google dep + GOOGLE_GENERATIVE_AI_API_KEY env.
// Model: gemini-embedding-001 with outputDimensionality=768 (text-embedding-004
// is no longer available on current Gemini API keys). Cosine is scale-invariant,
// so the reduced dimension keeps the vector(768) schema valid.
// ============================================================
import { embed } from 'ai'
import { google } from '@ai-sdk/google'
import { EMBED_DIM } from './config'

export const EMBED_MODEL = 'gemini-embedding-001'

export type EmbedTask = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'

/**
 * Embed a single string. Document chunks use 'RETRIEVAL_DOCUMENT', the user
 * query uses 'RETRIEVAL_QUERY' (asymmetric retrieval). Asserts the 768-dim
 * house standard so a model/SDK drift fails loudly instead of corrupting the index.
 */
export async function embedText(text: string, task: EmbedTask): Promise<number[]> {
  const value = text.slice(0, 32_000) // ~8k token ceiling
  const { embedding } = await embed({
    model: google.textEmbeddingModel(EMBED_MODEL, {
      outputDimensionality: EMBED_DIM,
      taskType: task,
    }),
    value,
  })
  if (embedding.length !== EMBED_DIM) {
    throw new Error(`Unexpected embedding dimension ${embedding.length}, expected ${EMBED_DIM}`)
  }
  return embedding
}
