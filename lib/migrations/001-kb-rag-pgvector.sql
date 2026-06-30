-- ============================================================
-- 001-kb-rag-pgvector.sql
-- Thabang AI — grounded personal knowledge assistant (RAG)
-- Project: zbdsqvpxpsygbuqnuekm  (SHARED with thabangvisionaistudios)
--
-- Run manually in the Supabase SQL editor.
-- ADDITIVE ONLY: every object is namespaced `apps` / `kb_*` and must NOT
-- touch the other app's objects (content_embeddings, match_content,
-- chat_rate_limits, etc.). Re-runnable (create ... if not exists).
-- ============================================================

create extension if not exists vector;

-- ── Tenancy registry ───────────────────────────────────────────────────────
-- Provisioning a tenant = inserting a row here. Every app-owned table FKs to it.
create table if not exists public.apps (
  slug       text primary key,
  name       text not null,
  created_at timestamptz not null default now()
);

insert into public.apps (slug, name) values
  ('tmashininisekgoto', 'Thabang Neural Observatory')
on conflict (slug) do nothing;

-- ── Source-level documents ─────────────────────────────────────────────────
create table if not exists public.kb_documents (
  id           uuid primary key default gen_random_uuid(),
  app          text not null references public.apps(slug),
  source_type  text not null,        -- blog|project|publication|talk|video|page|upload
  source_key   text not null,        -- stable id: blog slug, project slug, talk id, filename
  title        text not null,
  url          text,                 -- link to cite (internal route or external)
  content_hash text not null,        -- sha256(normalized text) for idempotency
  metadata     jsonb not null default '{}'::jsonb,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (app, source_type, source_key)
);
create index if not exists kb_documents_app_type_idx
  on public.kb_documents (app, source_type);

-- ── Chunk-level embeddings ─────────────────────────────────────────────────
create table if not exists public.kb_chunks (
  id          uuid primary key default gen_random_uuid(),
  app         text not null references public.apps(slug),
  document_id uuid not null references public.kb_documents(id) on delete cascade,
  ordinal     int  not null,
  content     text not null,
  char_count  int  not null,
  token_est   int,
  embedding   vector(768) not null,  -- Gemini text-embedding-004
  created_at  timestamptz not null default now(),
  unique (document_id, ordinal)
);
-- Composite index LED BY app (tenancy convention), then document.
create index if not exists kb_chunks_app_doc_idx
  on public.kb_chunks (app, document_id);
-- NO vector index for this corpus size. IVFFlat with few hundred rows produces
-- empty/sparse k-means clusters and (probes=1) returns 0 rows for queries that
-- land near an empty cluster. Exact (brute-force) scan over a few hundred 768-d
-- vectors is sub-millisecond and 100% recall. Add HNSW only once the corpus is
-- large (thousands+): create index ... using hnsw (embedding vector_cosine_ops);

-- ── App-scoped similarity RPC ──────────────────────────────────────────────
-- Granted to anon, but only ever returns published rows of the named app.
create or replace function public.match_kb_chunks(
  query_embedding      vector(768),
  match_count          int   default 6,
  filter_app           text  default 'tmashininisekgoto',
  similarity_threshold float default 0.5
)
returns table (
  chunk_id    uuid,
  document_id uuid,
  source_type text,
  title       text,
  url         text,
  content     text,
  ordinal     int,
  similarity  float
)
language sql stable as $$
  select c.id, c.document_id, d.source_type, d.title, d.url, c.content, c.ordinal,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.kb_chunks c
  join public.kb_documents d on d.id = c.document_id
  where c.app = filter_app
    and d.published = true
    and 1 - (c.embedding <=> query_embedding) > similarity_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
grant execute on function public.match_kb_chunks(vector, int, text, float) to anon, authenticated;

-- ── Chat logging (Phase 2) ─────────────────────────────────────────────────
-- No auth on this site → keyed by anonymous device/ip, not user_id.
create table if not exists public.kb_conversations (
  id         uuid primary key default gen_random_uuid(),
  app        text not null references public.apps(slug),
  device_id  text,
  ip_hash    text,
  created_at timestamptz not null default now()
);
create index if not exists kb_conversations_app_idx
  on public.kb_conversations (app, created_at desc);

create table if not exists public.kb_messages (
  id              uuid primary key default gen_random_uuid(),
  app             text not null references public.apps(slug),
  conversation_id uuid not null references public.kb_conversations(id) on delete cascade,
  role            text not null,   -- 'user' | 'assistant'
  content         text not null,
  sources         jsonb,           -- cited [{title,url,similarity}] on assistant turns
  created_at      timestamptz not null default now()
);
create index if not exists kb_messages_app_conv_idx
  on public.kb_messages (app, conversation_id, created_at);

-- ── Row Level Security ─────────────────────────────────────────────────────
-- Public can READ published KB content. All WRITES go through the service role
-- (which bypasses RLS); no write policies are defined on purpose.
alter table public.apps             enable row level security;
alter table public.kb_documents     enable row level security;
alter table public.kb_chunks        enable row level security;
alter table public.kb_conversations enable row level security;
alter table public.kb_messages      enable row level security;

drop policy if exists kb_documents_public_read on public.kb_documents;
create policy kb_documents_public_read on public.kb_documents
  for select using (published = true);

drop policy if exists kb_chunks_public_read on public.kb_chunks;
create policy kb_chunks_public_read on public.kb_chunks
  for select using (
    exists (
      select 1 from public.kb_documents d
      where d.id = kb_chunks.document_id and d.published = true
    )
  );
-- kb_conversations / kb_messages / apps: no public policies → service-role only.
