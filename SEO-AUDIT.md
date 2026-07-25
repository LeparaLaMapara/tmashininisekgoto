# SEO audit and discoverability overhaul

Date: 2026-07-25
Scope: `tmashininisekgoto` repo, the Next.js site behind https://www.tmashininisekgoto.com

Goal: rank for the work (AI, machine learning, data science, Spark/Databricks
engineering, published research), not only for the name.

---

## 1. What was broken

### The headline problem: every page disclaimed itself

`app/layout.tsx` set `alternates.canonical` to a single hardcoded URL. Next merges
parent metadata into children, so **all ten routes inherited the homepage's
canonical**, on the preview domain:

```html
<!-- served on /about, /work, /publications, /blog, /talks, /resume,
     /career, /tags, /ai, /courses — verified live before the fix -->
<link rel="canonical" href="https://tmashininisekgoto.vercel.app"/>
```

Two compounding failures:

1. **Wrong domain.** The string `tmashininisekgoto.com` did not appear anywhere in
   the repo. `SITE_URL` was hardcoded as the `vercel.app` in six separate files,
   so the sitemap, robots.txt, RSS feed, llms.txt and every og/twitter image URL
   pointed at the preview domain too.
2. **Wrong page.** Every route claimed to be a duplicate of the homepage. This is
   an explicit instruction to drop those pages from the index.

Both domains served HTTP 200 with no redirect, so the site was also competing
with itself.

### Everything else found

| # | Problem | Where | Severity |
|---|---|---|---|
| 1 | Site-wide canonical to preview-domain homepage | `app/layout.tsx:52` | Critical |
| 2 | Whole page body server-rendered at `opacity: 0` on **every route** | `app/template.tsx` | High |
| 3 | Reveal animations hid two entire homepage sections from non-scrolling renderers | `components/ui/scroll-reveal.tsx` | High |
| 4 | Impact counters served as `R0+` / `0%` instead of the real figures | `components/ui/animated-counter.tsx:23` | High |
| 5 | 35 further elements server-hidden on `/about`, `/work`, `/courses` | `project-card`, `course-card`, `tech-stack` | Medium |
| 6 | `/career` missing from the sitemap entirely | `app/sitemap.ts` | Medium |
| 7 | No tag pages in the sitemap | `app/sitemap.ts` | Medium |
| 8 | Every `lastModified` was build time, i.e. meaningless | `app/sitemap.ts:12` | Medium |
| 9 | Titles carried no keywords (`Work`, 18 chars incl. suffix) | all `page.tsx` | Medium |
| 10 | Descriptions out of bounds: `/ai` 215, home 199, `/courses` 158 chars | ditto | Medium |
| 11 | All 11 blog descriptions outside 155 (ten over, one at 28) | `content/blog/*.mdx` | Medium |
| 12 | Tag URLs percent-encoded: `/tags/open%20source`, `/tags/ci%2Fcd` | `app/tags/**` | Medium |
| 13 | Tag pages had no intro copy, so no topical landing page | `app/tags/[tag]/page.tsx` | Medium |
| 14 | Only 2 JSON-LD types; no `WebSite`, `BreadcrumbList`, `ScholarlyArticle` | — | Medium |
| 15 | Blog schema was loose `Article`, no `dateModified`/`image`/`mainEntityOfPage` | `app/blog/[slug]/page.tsx:67` | Medium |
| 16 | `/favicon.ico` 404 on every page load | no icon declared | Low |
| 17 | Fraunces shipped `SOFT` + `WONK` axes that nothing uses (118 KB font) | `app/layout.tsx:15` | Low |
| 18 | `/index.html` live at 200: leftover create-react-app page | `public/index.html` | Low |
| 19 | 11 of 11 blog `<title>` tags exceeded 60 chars once the site-name suffix was counted | `content/blog/*.mdx` | Medium |
| 20 | 2 colour-contrast failures, 1 heading-order skip | `components/layout/footer.tsx` | Low |

---

## 2. What changed

### Single source of truth for the domain

New `lib/site.ts` exports `SITE_URL` and `absoluteUrl()`. It replaced six
hardcoded copies of the preview-domain string in `app/layout.tsx`, `app/sitemap.ts`,
`app/robots.ts`, `app/feed.xml/route.ts`, `app/llms.txt/route.ts` and
`app/blog/[slug]/page.tsx`.

### Canonicals

- **Removed** `alternates.canonical` from the root layout. A canonical there is
  inherited by every child; this was the entire bug.
- Every route now declares its own relative canonical, which resolves against
  `metadataBase`: `alternates: { canonical: '/work' }`.
- `app/blog/[slug]` honours an optional `canonical` frontmatter field, and
  self-references otherwise.

### Server-rendered HTML

One root cause behind items 2 to 5: framer-motion's `initial={{ opacity: 0 }}` is
server-rendered as inline `opacity: 0`, so content existed in the markup but was
invisible to anything that did not execute JavaScript and scroll.

- `app/template.tsx` now animates only on client-side navigation. The first page
  load paints immediately.
- `components/ui/scroll-reveal.tsx` renders visible and hides itself after
  hydration, then reveals on scroll as before.
- `components/ui/animated-counter.tsx` initialises to the final value, so the
  markup carries `R1B+`, `80-90%`, `15%`, `R2M+`. It rewinds and counts up on the
  client, and respects `prefers-reduced-motion`.
- New `lib/use-enter-animation.ts` hook applies the same pattern to
  `project-card`, `course-card` and `tech-stack` without repeating it.

Genuinely conditional animations (mobile menu, expandable course details) were
left alone: those are correctly hidden until opened.

**Result: 0 server-hidden elements across all 12 routes, down from 36.**

### Crawlability

- Sitemap: 20 URLs to 39. Added `/career` (was missing), `/now`, and all 18 tag
  pages. `lastModified` now comes from file mtimes and post dates, giving 18
  distinct values instead of one build timestamp.
- `robots.ts` and `feed.xml` now emit the `.com`. The AI-crawler allowlist was
  already there and is unchanged.
- `/search` is deliberately **absent** from the sitemap because it is `noindex`.

### Titles and descriptions

The template `'%s | Thabang M-S'` adds 16 characters, so titles are written to
land under 60 with it.

| Route | Before | After | Len |
|---|---|---|---|
| `/` | Thabang Mashinini-Sekgoto \| Lead Data Scientist · AI & Analytics Engineering Leader (88) | Thabang Mashinini-Sekgoto \| Data Scientist & AI Engineer | 56 |
| `/about` | About | About: AI Researcher & Data Science Leader | 56 |
| `/work` | Work | AI & Machine Learning Projects | 44 |
| `/publications` | Publications | Publications: ML & Deep Learning Research | 55 |
| `/blog` | Blog | Blog: MLOps, Data Science & AI Engineering | 56 |
| `/talks` | Talks & Press | Talks & Press on AI and Data Science | 50 |
| `/resume` | Resume | Resume: Lead Data Scientist | 41 |
| `/career` | Career Journey | Career: 10 Years in Data Science & AI | 51 |
| `/tags` | Tags | Topics: MLOps, Agentic AI, Python | 47 |
| `/ai` | Talk to Thabang AI Assist | Thabang AI Assist: Ask About My Work | 50 |
| `/courses` | Courses | Courses: Practical AI & Data Science | 50 |
| `/now` | — | Now: What I’m Working On | 40 |
| `/search` | — | Search | 22 |

Descriptions rewritten where out of bounds: home 199 to 154, `/ai` 215 to 137,
`/courses` 158 to 129, `/resume` 56 to 146, `/talks` 74 to 154, `/tags` 27 to 135.
All 13 static routes now sit between 124 and 154.

Blog titles and descriptions were fixed **without touching your headlines**.
`lib/blog.ts` gained two optional frontmatter overrides that affect the `<title>`
and `<meta name="description">` only, leaving the visible H1 and the excerpts on
`/blog` exactly as written:

- `seoTitle` — set on all 11 posts whose rendered title exceeded 60 characters.
  My first pass measured frontmatter titles and reported "5 posts"; that was
  wrong, because the rendered `<title>` also carries the 16-character
  ` | Thabang M-S` suffix. Measured properly, every post was over.
- `seoDescription` — plus a smarter `metaDescription()` that prefers whole
  sentences but fills to a word boundary rather than leaving most of the budget
  unused. Without that, "The engine is now on version 0.5.0." was the entire
  snippet for Part 6.

Example of the split:

| | Value |
|---|---|
| H1 (unchanged) | How I Learned to Build My Own Python Libraries (From Curiosity to Real Work) |
| `<title>` | How to Build Your Own Python Libraries \| Thabang M-S (52) |

**All 26 indexable URLs now have a title ≤60 and a description between 70 and 155
characters**, verified by decoding HTML entities rather than measuring raw markup.

### Structured data

New `lib/schema.ts` (builders) and `components/seo/json-ld.tsx` (renderer, which
escapes `<` so content cannot break out of the script tag).

| Type | Where | Notes |
|---|---|---|
| `Person` | `/` | `affiliation` Wits + Ubunye, `alumniOf`, `worksFor`, `knowsAbout`, 7 `sameAs` profiles |
| `WebSite` | site-wide | with `SearchAction` pointing at the real `/search` |
| `BlogPosting` | `/blog/[slug]` | replaces `Article`; adds `dateModified` (file mtime), `image`, `mainEntityOfPage` |
| `ScholarlyArticle` | `/publications` | 3 papers, DOIs as `identifier` + `sameAs`, authors split into `Person` nodes, citation counts |
| `Thesis` | `/publications` | the MSc dissertation, typed correctly rather than as a journal article |
| `BreadcrumbList` | posts + tag pages | |
| `CollectionPage` | `/tags/[tag]` | with an `ItemList` of posts |

Validated with a script that parsed all 22 blocks across 16 routes and checked
required properties, absolute URLs, parseable dates and `@id` resolution.
**Result: no problems, 0 unresolved `@id` references.**

One real issue surfaced during validation and was fixed: entities were referenced
across pages by bare `@id` (e.g. a post's author pointing at the Person defined
only on the homepage). Search engines do not reliably resolve cross-page `@id`,
which would have left posts effectively authorless. Author, publisher and
`isPartOf` nodes are now self-contained (`@id` **plus** name and url).

### Content architecture

- New `lib/topics.ts`: 18 topics with a heading, intro paragraph and meta
  description, each written from posts that actually exist. Tag pages are now
  landing pages rather than bare link lists.
- **Tag URLs slugified**: `/tags/open%20source` to `/tags/open-source`,
  `/tags/ci%2Fcd` to `/tags/ci-cd`. All internal links updated.
- Old encoded URLs 301 via new `middleware.ts`. This needed middleware:
  `redirects()` in `next.config.mjs` did not match the percent-encoded paths, and
  a redirect inside the route never ran either, because the router 404s a dynamic
  segment `generateStaticParams` did not produce, before any page code executes.
  Middleware runs ahead of routing. Verified: all five tested legacy URLs 301.
- `canonical` frontmatter field added for cross-posting (see the correction in
  section 5).
- Prev/next links between posts, alongside the existing `RelatedPosts`.
- New `/now` page, driven by `lib/data.ts` and the blog so it does not go stale.
- New `/search` page and `lib/search.ts`: server-rendered search across pages,
  posts, projects, publications, talks, courses and writings. It is `noindex,
  follow` (internal search results should not be indexed) but it exists so the
  `SearchAction` is a truthful claim. The command palette is untouched.
- `llms.txt` gained `/career`, `/now` and `/tags`.

### Performance

`app/layout.tsx` requested Fraunces with `axes: ['opsz', 'SOFT', 'WONK']`. Nothing
in the codebase sets `font-variation-settings`, so SOFT and WONK were dead weight
in the one font the LCP element depends on. Reduced to `opsz` alone, which
browsers apply automatically.

Also declared an icon (`/favicon.png`), removing a 404 on every page load. Google
displays favicons beside mobile results, so this is cosmetic and functional.

### Legacy create-react-app removal

`public/index.html` was served at HTTP 200: a leftover CRA shell titled
"TL | Portfolio", described as "Web site created using create-react-app", with
`og:url` on the preview domain. An indexable junk page reinforcing the same "TL"
identity that splits the Scholar profiles. Removed, along with the CRA sample
`public/manifest.json` ("Create React App Sample") that only it referenced, and
the dead `src/` directory: 95 tracked files of the old portfolio, excluded in
`tsconfig.json` and referenced by nothing in the Next app.

**97 files, 5,709 lines deleted.** All were committed and clean beforehand, so
`git revert` restores them if any asset turns out to be wanted. The now-redundant
`"src"` entry in `tsconfig.json` `exclude` and the matching comment in
`next.config.mjs` were removed too.

### Accessibility

All three failures were in `components/layout/footer.tsx`:

- The copyright line used `text-muted/60`, which composites to `#a69e91` on paper:
  **2.45:1**. Now full `text-muted`, **5.45:1**.
- The "Talk to Thabang AI Assist" pill put the brand orange `#b5501e` on the
  `bg-synapse/10` tint `#f3e5d9`: **4.12:1**, just under the 4.5:1 minimum. Rather
  than change the brand colour, a new `--color-synapse-ink` token (`#a84819`,
  **4.72:1**) is used for small text on a synapse tint. `--color-synapse` itself is
  untouched, so the warm identity is unchanged everywhere else. In dark mode the
  token equals the brand colour, which already passes.
- Two `<h4>` column headings with no preceding `<h3>` skipped two levels in the
  outline. Now `<h2>`, with identical styling.

**Lighthouse accessibility: 93 to 100.**

---

## 3. Measurements

### Lighthouse, mobile

| | Live site (pre-deploy) | Local build, final |
|---|---|---|
| Performance | 87 | **91** |
| SEO | 100 | 100 |
| Accessibility | 93 | **100** |
| Best practices | 96 | 96 |
| LCP | 3.9 s | 3.3 s |
| CLS | 0 | 0 |
| TBT | 90 ms | 40–100 ms |
| Colour-contrast failures | 2 | **0** |
| Heading-order failures | 1 | **0** |
| Page 404s | 1 (`/favicon.ico`) | **0** |

The two 404s still reported locally are `_vercel/insights/script.js` and
`_vercel/speed-insights/script.js`, which Vercel injects only in production. They
are expected under `next start` and are not a defect.

**Read these with care.** The "before" column is the deployed site on Vercel's
CDN; the "after" is a local production server. Absolute timings are not
comparable, which is why local FCP looks worse despite the changes. The
trustworthy figures are the ones measured in the same environment before and
after the font change: Performance 87 to 91, LCP 3.8 s to 3.4 s, TBT 90 ms to
40 ms, and the Fraunces file 118.3 KB to 66.1 KB (44% smaller).

Blog post page: Performance 89, SEO 100, LCP 3.5 s, CLS 0.022.

**Note that Lighthouse SEO scored 100 both before and after.** It checks that a
canonical exists and is well-formed, not that it points anywhere sensible. The
single most damaging problem on this site passed that audit cleanly. Do not treat
a green Lighthouse SEO score as evidence of anything.

### Remaining performance headroom

LCP breaks down as 458 ms TTFB plus 3,175 ms render delay, so the bottleneck is
render delay, not fetching. Contributors, largest first:

- Three font families totalling ~154 KB (Fraunces 66 + Inter 48 + JetBrains Mono 40).
  Dropping JetBrains Mono, or subsetting it to the digits and letters actually used
  in the mono UI, is the next real win.
- ~83 KB unused JavaScript, 56 KB of it in one chunk. Worth checking whether the
  command palette (`cmdk`) and the 3D career scene are being pulled into the shared
  bundle; both are candidates for `next/dynamic`.
- One 13 KB render-blocking stylesheet. Modest, and not worth a critical-CSS build
  step yet.

### Tests

`tests/rendering.spec.ts` is new. It asserts two things that are easy to break in
opposite directions: no `opacity: 0` in the served HTML for any route, *and* the
reveal animations still fire on scroll with the hero at full opacity immediately.
A screenshot cannot tell those apart. **23 tests pass** (16 new assertions plus
the 7 pre-existing screenshot tests, which had no assertions).

---

## 4. Verification commands

```powershell
npm run build                     # clean, 56 static pages
npm start

# every route self-canonicalises on the .com
foreach ($p in @('','about','work','publications','blog','talks','resume','career','tags','ai','courses','now')) {
  $r = Invoke-WebRequest "http://localhost:3000/$p"
  ([regex]'<link rel="canonical" href="([^"]*)"').Match($r.Content).Groups[1].Value
}

# legacy tag URLs 301
curl.exe -s -o NUL -w "%{http_code} %{redirect_url}" "http://localhost:3000/tags/open%20source"

npx playwright test               # 23 passing
```

Two throwaway validators were used during the work and are worth rebuilding if you
revisit this: one parsed every JSON-LD block across 16 routes and checked required
properties, absolute URLs, date parsing and `@id` resolution; the other measured
title and description lengths on **decoded** text, which matters because raw markup
counts `&#x27;` as six characters and made one description look 10 over the limit
when it was not.

---

## 5. One correction to the brief

The brief asked for a `canonical` frontmatter field so posts can be cross-posted
to Medium, dev.to, Hashnode and LinkedIn "while keeping ranking credit here."

The field is implemented, but **the canonical tag belongs on the copy, not the
original**. To keep credit on this site:

- Publish here first and let the post be indexed.
- On Medium, use *Import a story* (it sets `rel="canonical"` back to your URL
  automatically) or the story settings' canonical link field.
- On dev.to, set `canonical_url:` in the post's frontmatter to your URL.
- On Hashnode, use *Original article URL* in post settings.
- On LinkedIn, there is no canonical mechanism. Post an excerpt and link back
  rather than republishing in full.

Setting `canonical` in your own frontmatter points *your* page at someone else's
domain, which hands the ranking away. Leave it unset for original work. It exists
only for the rare case where a piece genuinely first appeared elsewhere.

---

## 6. Your checklist (off-repo)

### Do first, in order

1. **Deploy.** None of the canonical fixes take effect until this ships.
2. **Set `www.tmashininisekgoto.com` as the production domain in Vercel**, and set
   the `tmashininisekgoto.vercel.app` to redirect to it. Vercel dashboard, Project
   Settings, Domains: add/confirm the `.com` as primary, then use the redirect
   option on the `vercel.app` entry. Domain routing is not in the repo, so this
   cannot be done in code.
3. **Google Search Console**: add a property for `https://www.tmashininisekgoto.com`
   if it does not exist. Submit `/sitemap.xml`. Then use URL Inspection to request
   indexing for the ten routes whose canonical was wrong: `/about`, `/work`,
   `/publications`, `/blog`, `/talks`, `/resume`, `/career`, `/tags`, `/ai`,
   `/courses`. They will otherwise wait for a natural recrawl.
4. **Bing Webmaster Tools**: verify the same property and submit the sitemap. Bing
   also feeds ChatGPT search, so it is worth more than its market share suggests.
5. **Re-test `/tags/ci-cd` and the legacy redirects on the live domain.** They pass
   locally, but percent-encoded paths can behave differently on Vercel's edge than
   under `next start`.

### Identity and research profiles

6. **Create an ORCID** at https://orcid.org. It is the canonical academic
   identifier and currently the biggest gap in your `sameAs` list.
7. **Merge the split Google Scholar / Semantic Scholar identities.** Your work is
   currently divided between "Thabang L. Mashinini" and "Thabang Mashinini-Sekgoto".
   On Semantic Scholar, claim your author page and merge; on Scholar, add the
   missing papers to the one profile. Until this is done, your citation count is
   split and neither profile looks as strong as your record actually is.
8. **Send me three URLs** and I will add them to the Person `sameAs` array in
   `lib/schema.ts`: your ORCID, your Medium profile, and confirmation of the
   Instagram handle. I used `SOCIAL_LINKS.instagram` from `lib/data.ts` and left
   ORCID and Medium out entirely rather than guessing.

### Closed items

9. **`tlmashinini-sekgotosk.vercel.app` already returns 404.** There is nothing to
   redirect from. Check whether the project still exists in your Vercel dashboard;
   if it does not, this item is closed.
10. **`/index.html` no longer exists**, so no redirect or removal request is needed.
    If Search Console has it indexed, it will drop out naturally once recrawled;
    you can speed that up with a removal request under Removals.

---

## 7. Decisions still yours

### Content gap: this is the real ceiling

The brief named *SAR flood mapping*, *physics-informed self-supervised learning*,
*Databricks migration*, *Spark pipeline portability* and *telematics analytics*.
**There are zero posts on any of them.**

That matters more than anything in this audit. Those five topics are where you
have genuine differentiated authority and low competition, and the site currently
says nothing about them. Everything above makes your existing 11 posts rank as
well as they can; it cannot make you rank for subjects you have not written about.

Actual coverage across the 11 posts: MLOps (7), open source (7), Python (7),
engineering (8), the Ubunye series (6), agentic AI (2), data science (2), plus
single posts on leadership, career, CI/CD, architecture and South Africa.

Suggested order, highest value first. Each becomes a `lib/topics.ts` entry and a
tag landing page the moment a post exists:

1. **Spark pipeline portability / config-driven ETL.** Closest to the Ubunye
   Engine work you have already written about, so it is the cheapest to write and
   links naturally to six existing posts.
2. **Databricks migration.** High commercial-intent search, very few credible
   first-hand accounts from a regulated enterprise.
3. **SAR flood mapping and physics-informed SSL.** Your PhD. Almost no competition,
   and it connects the site to your publications and academic profiles. This is
   the one that makes you findable as a researcher rather than a practitioner.
4. **Telematics analytics.** Ties to the insurance work; narrow but valuable.

### Still open

- **A real photograph for `Person.image`.** It currently points at
  `/avatar.svg`. A genuine headshot on a stable URL helps the entity look like a
  real person, which matters for how search engines and AI assistants describe you.
- **Visible excerpts are still thin on three posts**, even though their search
  snippets are now fixed. `summary` doubles as the excerpt shown on `/blog` and the
  topic pages, and for `how-to-build-python-packages` it reads "creating from 1st
  principles". Rewriting `summary` is a copy change in your voice, so it is yours
  to make; `seoDescription` already carries the SERP text independently.
- **Cross-post canonicals** are unimplemented on the destination platforms, because
  that work happens in Medium/dev.to/Hashnode settings rather than in this repo.
  See section 5.
