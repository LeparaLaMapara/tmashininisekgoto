# Roadmap / TODO

Working backlog for the site. Ordered by honest value, not by phase number.
The rule that runs through all of it: **most discovery features need real
traffic to mean anything, and there is no measured baseline yet.** Publishing
content and turning on Search Console come first; the rest gets better on its
own as they land.

Updated 2026-09-10.

---

## The actual bottleneck (do these first)

- [ ] **Publish the 12 written-but-withheld posts.** Biggest single lever on the
      whole site. Everything already shipped improves automatically as they land:
      cross-type related links multiply, series prev/next lights up, search has
      more to find, tag pages stop being thin. (Roadmap parts 2-6, the Ubunye
      series, the Ubunye memoir, the data-science-team post.)
- [ ] **Verify Google Search Console + Bing.** No measurement exists until this
      is done, which blocks phases 2, 3 and 12 from meaning anything. Env-var
      wiring is already in place — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
      `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Vercel, redeploy, submit the
      sitemap. Steps in `docs/external-profiles.md`.

---

## Done (for reference)

- [x] Cmd+K wired to the real search engine, grouped by type (`6808b72`)
- [x] Reading progress, series-aware prev/next, copy-link headings (`bdd5c33`)
- [x] Cross-type related content — writing / work / research / talks (`bf81291`)
- [x] Entity graph, sitemap lastmod, IndexNow, security headers (`dbb78fa`)
- [x] Security patches: rate-limit bypass, input caps, critical Next.js CVE (`3ee2213`)
- [x] `/ai` reindex + self-pruning index (`4bb8245`)

---

## Feature backlog (built infra reused, no new services)

Priorities assume the two bottleneck items above are handled. Full architecture,
data model, privacy and performance notes are in the knowledge-platform audit.

### P1 — worth doing once there is content + traffic

- [ ] **Content analytics — real view counts (phase 2).** New `content_views`
      table **in `bprargrqppufeuewryze`** (the project the prod runtime writes to,
      not the KB project — confirmed), following the `blog_comments` pattern:
      `app` column, service-role writes, day-scoped salted `ip_hash` for dedupe,
      no PII. Fire-and-forget `POST /api/views` beacon. **Build the pipeline but
      keep the public counter hidden behind a threshold** (~100 all-time) until
      numbers are meaningful; admin-only readout meanwhile.
- [ ] **Contextual "Ask about this" (phase 6).** Extend the existing assistant,
      do not add a second. `/api/chat` accepts an optional `pageContext`
      (type + slug), seeds retrieval with that document first, cites it. An
      "Ask about this" button on article/project/publication/talk pages
      deep-links to `/ai` with context prefilled.

### P2 — discovery on top of the P1 data

- [ ] **Trending / most-read (phase 3).** Needs the views table first. Score =
      `recent_views · e^(−age/τ)` so trending ≠ all-time. A tab on `/blog`;
      homepage strip only if it replaces noise, not adds it.
- [ ] **Cross-type topic hubs (phase 5).** Extend `topics.ts` + the tag page to
      aggregate related work / talks / papers / OSS under the existing rich
      intro. **Only** for topics with real depth (today: agentic AI; after the
      series publish: Ubunye, MLOps). No thin pages.
- [ ] **Audio upgrade (phase 8).** Extend `audio-player.tsx`: remember position,
      resume, persistent mini-player across navigation (small client context in
      the layout), play counts (reuse the views table with a `kind`). Keep
      existing audio files.
- [ ] **Per-topic feeds (phase 11).** `/tags/<slug>/feed.xml` for topics with
      enough posts, autodiscovered via `alternates`. Extends `feed.xml`.
- [ ] **Discovery feedback loop (phase 12).** Log search queries (including
      zero-result) + related-clicks to a private table; admin-only report
      answers "what are people trying to learn from me". Aggregate only, no
      per-visitor trails. Needs phases 1 + 2.

### P3 — flagship + niceties

- [ ] **Enhance `/now` rather than add `/building` (phase 9).** Add a "currently
      exploring" block and optional latest public GitHub activity via the
      existing `/api/github`. Do not create a second manually-maintained page.
- [ ] **Knowledge graph / explore (phase 10).** The relationship layer is
      already mostly built by `lib/related.ts`. Ship `lib/graph.ts` (nodes/edges
      from real metadata) + an `/explore` page whose **default, JS-free render is
      a grouped text index**; the visualization is a lazy-loaded enhancement on
      top, its own chunk, mobile falls back to the list. Only ship the viz if it
      helps someone find something faster than the list.

---

## Account tasks (need a login, not a commit)

- [ ] ORCID: register, claim the 4 DOIs, paste the iD into `SOCIAL_LINKS.orcid`
      (flows into schema automatically).
- [ ] LinkedIn headline + About aligned to the site (draft in
      `docs/external-profiles.md`), no PhD-candidate claim.
- [ ] Regenerate `public/resume.pdf` — the static file may still carry the old
      "PhD candidate / 10 years" copy. Offer stands to build an accurate
      print-ready version from the real timeline data.

## Watch-outs

- **PhD wording flips in Jan 2027** when registration happens — see
  `docs/` and the seven files listed in memory `thabang-site-positioning`.
- **Do not re-add** Sekgoto Multiversity or ThabangVision to the corpus, site,
  or the GitHub profile README.
- **New Supabase tables go in `bprargrqppufeuewryze`** (prod runtime), not the
  KB project `zbdsqvpxpsygbuqnuekm`.
- **5 high npm advisories** remain, all needing the `ai` v7 upgrade — a real
  chat refactor, not a patch.
