// ============================================================
// lib/rag/index.ts — barrel for the RAG library (server-only)
// ============================================================
export * from './config'
export * from './embeddings'
export * from './chunk'
export * from './hash'
export * from './documents'
export * from './retrieval'
export * from './indexer'
export { serviceClient } from './db'
