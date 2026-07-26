# Programmatic discoverability

Date: 2026-07-26
Scope: `tmashininisekgoto`, the Next.js site behind https://www.tmashininisekgoto.com

Follow-on to `SEO-AUDIT.md`. That work made the site indexable. This work makes
it *distributable*: one publish reaching several platforms, machine-readable
copies of everything for AI search, frictionless citation of the research, and a
performance budget that fails the build rather than rotting quietly.

Four of the ten items from the brief are implemented. The other six are listed
at the end with what each would need.

---

## 1. Semantic indexing

The problem this solves: an LLM crawler fetching a post gets a React page with
navigation, a table of contents, a comment form and a subscribe box wrapped
around the prose. It has to guess which part is the article.

| URL | What it is |
|---|---|
| `/blog/<slug>.md` | any post as plain markdown |
| `/llms.txt` | the index: what exists, where, one line each |
| `/llms-full.txt` | the corpus: every post and publication inlined, ~134 KB |
| `/ai.txt` | identity, research focus, expertise, and the terms for quoting |
| `/robots.txt` | now points at all of the above |

`/blog/<slug>.md` is served by a rewrite in `next.config.mjs` to a route handler
under `/api/md/`, because `app/blog/[slug]/` is already the HTML page and a
directory cannot be both. Appending `.md` to an article URL is the convention
the AI crawlers and documentation tools have converged on, so it is worth the
rewrite rather than exposing the `/api` path.

Every post declares its markdown copy in the head:

```html
<link rel="alternate" type="text/markdown"
      href="https://www.tmashininisekgoto.com/blog/how-to-build-python-packages.md"/>
```

**One implementation, three consumers.** `lib/post-markdown.mjs` produces the
bytes for the `.md` route, for `/llms-full.txt`, and for the copies pushed to
dev.to and Hashnode. If the syndicated copy and the indexed copy disagreed, the
canonical claim would look like a lie to anything comparing them. It is plain
`.mjs` rather than `.ts` so the node script can import it without a build step;
`allowJs` is on, so TypeScript still types it from the JSDoc.

**The part of `/ai.txt` that earns its keep** is the "Questions this site
answers" section. Retrieval matches on text. For an assistant to answer *"who
works on physics-informed self-supervised learning for SAR"* with this name, that
sentence has to exist somewhere machine-readable next to the name. It now does,
alongside six others, each paired with the page that answers it. Everything in
the file is read from `lib/data.ts` so it cannot drift away from the site.

**Summary blocks.** Every post now opens with an identically-structured block:
the word "Summary", one paragraph stating what the post is about, and a link to
the markdown copy. Same markup, same position, same order on all of them, so a
parser that has handled one has handled all of them. It repeats the excerpt shown
on `/blog`; that is the trade, and it is worth it.

One post had a four-word summary (`creating from 1st principles`), which works as
a caption and not as an opening paragraph. `postSummaryText()` falls back to
`seoDescription` when the excerpt is under 60 characters. Your prose was not
edited.

**Profile metadata.** `/about`, `/resume` and `/career` now emit `og:type:
profile` with `profile:first_name` and `profile:last_name` as separate fields,
instead of one title string for consumers to guess at.

---

## 2. Syndication

`scripts/syndicate.mjs`. Reads `content/blog`, pushes to dev.to and Hashnode,
and writes paste-ready files for the two platforms that cannot be automated.

```bash
npm run syndicate                          # dry run: says what it would do
npm run syndicate:publish                  # actually push
node scripts/syndicate.mjs --post <slug>   # one post
node scripts/syndicate.mjs --draft         # push unpublished, for review
```

**The canonical rule.** Every copy carries a canonical URL pointing back here:
dev.to calls it `canonical_url`, Hashnode calls it `originalArticleURL`. The tag
goes on the *copy*, never on the original — setting it in your own frontmatter
hands the ranking away, which is the opposite of the point. Posts that carry a
`canonical` in their frontmatter are skipped entirely, since those were first
published elsewhere and the canonical already belongs to someone else's URL.

The corollary is publish order: **publish here first, let it be indexed, then
syndicate.** Do it the other way round and Google meets the copy first.

**Dry run by default.** Publishing under your name to someone else's platform is
not undoable in any meaningful sense: a deleted dev.to article leaves a dead URL,
and Hashnode emails your followers. `--publish` is required every time. The CI
workflow additionally gates the real push behind a manual `workflow_dispatch`, so
the first one is a decision rather than a side effect of merging.

**Reconciliation.** `data/syndication.json` records which remote article belongs
to which post. dev.to is also queried live and matched on canonical URL, because
the state file can be stale after a manual edit there, and posting a duplicate is
the one failure mode that cannot be quietly fixed.

**Medium** retired its publishing API in 2023. Its importer is better than the
API was — it sets `rel="canonical"` back to the source automatically — so the
script writes an import checklist instead of pretending to automate it.

**LinkedIn** has no canonical mechanism at all, so republishing in full creates a
copy that competes with the original for your own name. The script writes an
excerpt-plus-link post per article instead.

Both land in `data/syndication-drafts/` (gitignored, regenerated every run).

---

## 3. Publications

**Citations, three formats, one click.** `lib/citations.ts` parses the free-text
venue strings that came from Google Scholar (`IFAC-PapersOnLine 52 (14),
117-122`) into structure, and emits BibTeX, APA 7 and Chicago author-date. A
"Cite this" toggle on each publication copies any of them. `/publications.bib`
serves the whole record for a reference manager to swallow in one fetch.

Details that matter: theses are `@mastersthesis` and preprints are `@misc` with
an `eprint`, not `@article`; author initials are expanded (`Mashinini, T. L.`,
not `Mashinini, TL`, which reference managers render as "Tl"); and the `url`
field prefers a DOI, then the arXiv abstract page, and only then the Scholar link
— which carries a profile id and is the first thing to rot.

**`/scholar`** redirects to the Google Scholar profile. Short enough for an email
signature, and it survives Google changing its URL format.

**Citation counts now refresh themselves.** `scripts/publications/sync.mjs` pulls
Semantic Scholar and CrossRef, writing `data/publications.remote.json`. A weekly
GitHub Action opens a pull request when the numbers move.

It does **not** write `lib/data.ts`. The `aiSummary` and `applications` fields
are written by hand and are the reason the page is worth reading; a script that
rewrote that file would either clobber them or need to parse TypeScript to avoid
it. So prose stays curated, numbers come from the API, and a genuinely new paper
is *reported* rather than inserted with an empty summary.

**The three sources disagree, and the page now says so.** From the first run:

| Paper | Scholar | Semantic Scholar | CrossRef |
|---|---|---|---|
| Mine workers threshold shift | 10 | 10 | **13** |
| Noise level policy advising | 8 | 8 | **10** |
| Long-range seasonal forecasting | **8** | 3 | — |

CrossRef counts only citations from publishers who registered their reference
lists. Semantic Scholar's corpus is broad but lags. Scholar indexes theses,
preprints and grey literature the others never see. None of them can *over*count,
so every figure is a lower bound and the largest is the best estimate available.
The page shows the highest with its source printed next to it, so the claim is
checkable rather than something to take on trust. Your total went from 26 to 31.

---

## 4. Lighthouse CI

`.github/workflows/lighthouse.yml` and `lighthouserc.js`. Seven representative
URLs, three runs each, median, **mobile emulation** — desktop scores this site
100 on every page and would gate nothing, and Google indexes the mobile page.
A failure on `main` opens a GitHub issue, or comments on the existing one, so the
finding outlives the pull request that caused it.

Running it for the first time found three classes of real, pre-existing defect —
16 failing elements, 3 broken heading outlines and one slow route. All are fixed:

**Colour contrast, 16 instances, all pre-existing.** `SEO-AUDIT.md` fixed this
class of bug in the footer and introduced `--color-synapse-ink` for it. The same
pattern was live in the navbar, the `/work` filters and project cards, the
publication cards, the `/about` panels, and inline code in every post.

- `--color-synapse-ink` darkened `#a84819` → `#9c4315`, which now passes on every
  surface it lands on, including `--color-synapse-dim` where the old value
  measured 4.13:1.
- New `--color-accent-ink` (`#8a5f22`): `--color-accent` measured 4.04:1 on white
  at 14px, used for inline code in every post.
- New `--color-code-muted`: `.prose pre` hardcodes a dark background in both
  themes, so the language label on it measured **1.84:1** in light mode.
- `text-muted/60` and `text-synapse/70` removed. Dimming small text below the
  full token is what caused the original failures; at 60% opacity `--color-muted`
  measures 2.45:1.

The brand colours themselves are untouched. The `-ink` variants are for small
text only, and in dark mode both equal their brand colour, so dark is unchanged.

**Heading order, 3 instances.** `/about`, `/work` and `/blog` each jumped `h1` →
`h3`. Promoted to `h2` with identical styling, the same fix the footer got.

**Performance on `/about`: 64.** The GitHub contribution calendar renders a year
of SVG rects and fetches its own data, costing 1,365ms of total blocking time on
a throttled phone while every other route sat under 90ms. It is below the fold
and decorative, so it now loads through `next/dynamic` with `ssr: false`.

| | Before | After |
|---|---|---|
| `/about` performance | 64 | **80** |
| `/about` total blocking time | 1,365ms | **433ms** |

Final state, mobile, median of three:

| Route | Perf | A11y | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| `/` | 91 | 100 | 100 | 3.34s | 0.000 | 86ms |
| `/about` | 80 | 100 | 100 | 3.32s | 0.000 | 433ms |
| `/work` | 91 | 100 | 100 | 3.41s | 0.000 | 87ms |
| `/publications` | 89 | 100 | 100 | 3.47s | 0.023 | 44ms |
| `/blog` | 91 | 100 | 100 | 3.36s | 0.002 | 79ms |
| `/blog/<post>` | 89 | 100 | 100 | 3.47s | 0.024 | 89ms |
| `/tags/mlops` | 92 | 100 | 100 | 3.18s | 0.000 | 82ms |

`/about` keeps a looser budget of its own (performance ≥ 0.75, TBT ≤ 600ms)
rather than loosening the gate for all seven routes to accommodate one. Both
budgets are ratchets set just under today's numbers: they should come down as the
page gets faster. What is left on `/about` is the hydration cost of the bento
grid, the testimonials carousel and the tech-stack filter, all client components
that render on first paint. Splitting those is real work and was not attempted.

**Read the score with the same caution as before.** Lighthouse scored SEO 100 on
this site while every page carried a canonical pointing at the wrong domain. A
green run here is evidence about speed and accessibility and almost none about
whether the site is findable.

---

## 5. What you need to do

### Tokens, for syndication (nothing else is blocked)

1. **dev.to**: Settings → Extensions → DEV Community API Keys → Generate. Add as
   the `DEVTO_API_KEY` repository secret, and to `.env.local` for local runs.
2. **Hashnode**: hashnode.com/settings/developer → Generate new token →
   `HASHNODE_TOKEN`. The publication id is in your blog dashboard URL →
   `HASHNODE_PUBLICATION_ID`.
3. Run `npm run syndicate` first. It will list what it would create without
   sending anything. Then `npm run syndicate:publish`, or the manual
   **Syndicate** workflow with `publish: true`.

Start with one post (`--post <slug>`) rather than backfilling all ten at once.
Ten articles appearing on a dormant dev.to account in one minute reads as a bot
to both the platform and its readers.

### Still open from `SEO-AUDIT.md`

Unchanged and still worth doing: create an ORCID, merge the split
Scholar/Semantic Scholar identities (your citations are divided between "Thabang
L. Mashinini" and "Thabang Mashinini-Sekgoto"), and send the ORCID and Medium
URLs so they can go into the `sameAs` array in `lib/schema.ts`.

The `unmatched` field in `data/publications.remote.json` lists the MSc thesis,
which Semantic Scholar does not index. That is expected, not a bug.

---

## 6. The six items not built

Not started, in rough order of value per hour:

| # | Item | What it needs |
|---|---|---|
| 3 | GitHub as a discovery engine | Mostly off-repo: topics on every repo, a pinned Ubunye repo, Discussions enabled, `semantic-release` in the *engine* repo rather than this one |
| 8 | Social proof that updates itself | A stars-over-time chart on `/work`; the citation half is already done and the `/api/github` route already exists |
| 7 | Backlink automation | Generated `/built-with/<tool>` pages from a content scan. Real work, and the payoff depends on Ubunye adoption that has not happened yet |
| 5 | Referrer-aware newsletter prompts | `/api/subscribe` exists; needs interest tagging and a Substack or Ghost account |
| 10 | Mention monitoring | Google Alerts is free and takes two minutes. The API-based versions are paid |
| 6 | Transcript indexing | Needs recordings to transcribe. Worth building the day there is a talk to run through it |

Item 2 was the highest-leverage one and it is done. Item 1 is done and waiting on
two tokens.
