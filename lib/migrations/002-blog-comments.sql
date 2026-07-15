-- Blog comments, open to everyone (no account needed).
-- Follows docs/standards/multi-app-tenancy.md: app column, app-led index, RLS on,
-- all reads/writes go through the site's API route using the service role.

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  app text not null references public.apps(slug),
  slug text not null,
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 2 and 2000),
  approved boolean not null default true,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_app_slug_idx
  on public.blog_comments (app, slug, created_at);

create index if not exists blog_comments_ip_idx
  on public.blog_comments (app, ip_hash, created_at);

alter table public.blog_comments enable row level security;

-- No anon policies on purpose: the browser never talks to this table directly.
-- The API route validates, rate limits, and writes with the service role.
