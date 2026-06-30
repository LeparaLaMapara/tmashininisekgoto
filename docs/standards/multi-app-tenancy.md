# Multi-App Tenancy Standard

How multiple apps safely share one Supabase/Postgres project. Adopt this on every
app-owned table so a row always declares **which app owns it**, and so one app can never
read or clobber another's data.

> Context: several apps share databases here — e.g. project `zbdsqvpxpsygbuqnuekm` is used
> by both this site (`tmashininisekgoto`) and `thabangvisionaistudios`, and project
> `bprargrqppufeuewryze` is shared by `tutokolo` + `family-shop`. Without a tenant column,
> service-role queries see *every* app's rows.

## The rules

1. **`app text not null` on every app-owned table**, FK → `public.apps(slug)`.
   `apps` is the single registry; provisioning a tenant = inserting one row.
   ```sql
   create table if not exists public.apps (
     slug text primary key, name text not null, created_at timestamptz not null default now()
   );
   ```

2. **Composite indexes are led by `app`** — `(app, …)`. Every list/filter query must include
   `app = $current`.

3. **RPCs take a `filter_app` argument and filter on it.** Never expose an unfiltered match /
   search function to `anon`. (See `match_kb_chunks` in `lib/migrations/001-kb-rag-pgvector.sql`.)

4. **RLS scoped by app.** Public reads gated by `published`/ownership; **writes via service
   role only**, and server code always sets `app` explicitly. Because service role bypasses
   RLS, the app filter is your real boundary — pass it on every query.

5. **`current_app()` helper** for the eventual authenticated case:
   ```sql
   create or replace function public.current_app() returns text language sql stable as $$
     select coalesce(
       current_setting('request.jwt.claims', true)::jsonb ->> 'app',
       current_setting('app.current', true)
     );
   $$;
   ```
   Anon sites (like this one) pass `app` literally from the server for now; this is the
   upgrade path when apps authenticate.

6. **Safe retrofit of an existing table** (add NOT NULL without downtime):
   ```sql
   alter table T add column app text;                                   -- 1. nullable
   update T set app = '<owning-app>' where app is null;                 -- 2. backfill
   alter table T alter column app set default '<owning-app>';           -- 3. default
   alter table T alter column app set not null;                         -- 4. enforce
   alter table T add constraint T_app_fk
     foreign key (app) references public.apps(slug);                    -- 5. FK
   create index T_app_idx on T (app, <existing lead column>);           -- 6. composite index
   ```
   Ship code that filters by `app` **before** step 4, so live traffic tolerates the
   transition.

## Retrofit backlog — project `bprargrqppufeuewryze` (Phase 3)

These shared tables currently have **RLS enabled but no policies and no `app` column**, so
`tutokolo` and `family-shop` can see each other's rows via the service role:

`suppliers`, `supplier_products`, `supplier_prices`, `supplier_contacts`,
`supplier_locations`, `supplier_searches`, `supplier_verification_logs`, `saved_suppliers`,
`user_cvs`, `cv_versions`, `job_descriptions`, `application_documents`, `application_sessions`,
`application_checklists`, `saved_opportunities`.

Fix: seed `apps` with `tutokolo` + `family-shop`, apply the 6-step retrofit to each table,
add `.eq('app', APP)` to every query in both repos, and add `filter_app` to their `match_*`
RPCs (e.g. `tutokolo/lib/data/adapters/supabase-vector.ts`). Sequence so reads filter by app
before the column becomes not-null.
