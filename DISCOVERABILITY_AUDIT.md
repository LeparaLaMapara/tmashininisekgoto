# Discoverability audit

Date: 2026-09-19
Scope: the Next.js site behind https://www.tmashininisekgoto.com, audited on branch
`main` (commit `7ada7b0`) and against the live production deployment.
Method: read every route, layout, content source and machine file in the repo;
crawled the live site with `scripts/discoverability/audit-site.mjs` (the crawler
added by this work); checked every external identity and artifact claim against
its source (GitHub API, PyPI JSON API, Semantic Scholar API, the MSc thesis
LaTeX source in `LeparaLaMapara/ESNIterativeSegmentation`).

The question the audit answers is not "can people who know the name find the
site". It is:

> P(discover the work | the searcher does not know the name)

Two earlier passes exist and are still accurate for what they covered:
`SEO-AUDIT.md` (July 2026, made the site indexable) and `DISCOVERABILITY.md`
(July 2026, made it distributable: markdown copies, llms.txt, syndication,
citations, performance budget). This audit starts where they stopped.

---

## Summary

The technical layer is in good shape. The live crawl found **38 indexable
pages, zero broken internal links, zero canonical errors, zero noindex
accidents and zero malformed JSON-LD**. One orphan page (`/now`).

The problem is one layer up. The site is organised as a **CV with a blog
attached**, not as a body of work that can be entered from a problem. Concretely:

1. **The work pages are titled with a thesis, not with what the thing is.**
   `/work/tfilterspy` is titled "You should not have to become a specialist to
   get a clean signal". The words *TFiltersPy*, *Kalman*, *Python* and
   *library* are absent from both the `<title>` and the `<h1>`. The same is
   true of Ubunye Engine ("The pipeline should outlive the platform it runs
   on"). Someone searching "python kalman filter library" has almost nothing
   in the strongest two ranking signals to match.
2. **Research has no home.** The MSc work on echo state networks for level set
   segmentation, the seasonal climate forecasting work and the occupational
   noise papers exist only as rows on `/publications`, with no URL of their own,
   no description of method or findings, and no link to the code that exists
   for them. "Reservoir computing iterative image segmentation" cannot land
   anywhere on this site.
3. **Topics exist only for blog posts.** `/tags/*` covers five blog tags
   (ai agents, software engineering, python, open source, data science). The
   subjects the actual projects and research are about (Kalman filtering,
   reservoir computing, image segmentation, climate risk, telematics,
   optimisation, geospatial ML, Spark, Databricks) have no page at all.
4. **The structured data is fragments, not a graph.** Every page emits correct
   but disconnected JSON-LD. The same project has two different identities
   (`/work#ubunye-engine` as SoftwareSourceCode on the index, and
   `/work/ubunye-engine#work` as CreativeWork on its own page). Publications
   have no `@id`. Nothing states which publication belongs to which research,
   which post is about which project, or which topic anything is about.
5. **Identity resolution is incomplete.** The name the published record uses
   (TL Mashinini, T Mashinini, Thabang L. Mashinini, Thabang L.
   Mashinini-Sekgoto) is never connected to the canonical name in markup.

None of that is fixed by more keywords. It is fixed by giving each piece of
work a proper page, connecting the pages to each other and to shared topics,
and describing the connections in markup.

---

## 1. What already works

| Area | State | Evidence |
|---|---|---|
| Canonical URLs | Self referencing on every route, correct origin | crawl: 0 canonical errors |
| Host consolidation | apex (307) and vercel.app (308) redirect to `www` | curl |
| robots.txt | Allows all, names the AI crawlers, points at sitemap and machine files | `/robots.txt` |
| Sitemap | 37 URLs, real `lastmod` from git history, not build time | `app/sitemap.ts` |
| Metadata API | Per route titles, descriptions, OG, Twitter card | every `page.tsx` |
| OG images | Dynamic 1200x630 cards with declared dimensions and alt | `lib/site.ts`, `/api/og` |
| Blog machine copies | `/blog/<slug>.md`, `/llms.txt`, `/llms-full.txt`, `/ai.txt`, RSS | `DISCOVERABILITY.md` |
| Citations | BibTeX, Scholar meta tags, citation counts from three sources with provenance | `lib/citations.ts`, `lib/publications.ts` |
| Rendering | Static prerendering for every content page (66 pages at build) | `next build` |
| Performance budget | Lighthouse CI on every PR, opens an issue on regression | `.github/workflows/lighthouse.yml` |
| Distribution | Syndication to dev.to, Medium, Hashnode with canonical back; IndexNow on publish | `scripts/syndicate.mjs` |
| Honesty guards | Tests pin the ABSA attribution rule, publish schedule, series order | `tests/*.spec.ts` |
| Project records | Nine case studies with problem, why, context, contribution, change, beneficiaries, what remained | `lib/data.ts` |

This is a better starting point than most personal sites. Nothing here needs
to be rebuilt.

## 2. What is missing

1. **Research pages.** No `/research` route. Three research lines have enough
   public evidence (thesis, code, papers, abstracts) to deserve one each.
2. **Topic hubs spanning all entity types.** No page gathers the projects,
   research, publications, writing and talks on one subject.
3. **A content graph.** Relationships (project to research, research to
   publication, post to project, anything to topic) are not modelled. The
   existing `lib/related.ts` infers similarity from shared words, which is
   useful but is not the same as a stated relationship.
4. **Lineage.** The repos show a clear history that the site never tells:
   `kalmanfilter-` ("Kalman and Particle filter implementations from first
   principles... The ideas here became tfilterspy"), `Echo-State-Master` (2019)
   before `ESNIterativeSegmentation`, `DSIDE` (municipal data work, 2018) behind
   the CSIR story.
5. **Descriptive facts on project pages.** No status, dates, licence, language,
   organisation or role in a scannable block. The questions "what is it" and
   "is it maintained" need reading several paragraphs to answer.
6. **Name variants in markup.** No `alternateName` on the Person.
7. **Machine files for work and research.** `llms.txt` lists posts and main
   pages; it does not list the nine projects or any research. `llms-full.txt`
   inlines posts and publications but no case study.
8. **Search Console and Bing verification.** The code path exists
   (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) but no value is set, so there is no
   query data at all. Every statement about ranking today is unmeasured.
9. **ORCID.** `SOCIAL_LINKS.orcid` is empty. Nothing to link until one is
   registered.
10. **Quality gates beyond performance.** Lighthouse runs in CI. Nothing
    checks titles, canonicals, JSON-LD, orphans, sitemap consistency or
    external artifact links.

## 3. What is duplicated

| Duplicate | Where | Consequence |
|---|---|---|
| Two identities for each open source project | `/work` emits SoftwareSourceCode `@id /work#<slug>`; `/work/<slug>` emits CreativeWork `@id /work/<slug>#work` | Consumers see two unrelated entities for one thing |
| Two description fields per project (`oneLiner`/`caseStudy` and legacy `problem`/`solution`/`impact`) | `lib/data.ts` | Kept on purpose for RAG and search; acceptable, but the schema reads the legacy field on one page and the new one on another |
| Hand written facts in machine files | `app/llms.txt/route.ts` hardcodes project claims that `lib/data.ts` also states | They have already drifted (see 4) |
| Topic vocabularies | blog tags (10), project topics (35 free text strings), talk topics (9) | Three unconnected vocabularies; "Applied Research" and "Research" and "Science" never meet |

## 4. What is stale or contradictory

| Claim | Where | Evidence says | Action |
|---|---|---|---|
| Ubunye Engine "identical output hashes on seven environments" | `/llms.txt` | `lib/data.ts` (rewritten 2026-09 "against what the repos prove") and `lib/knowledge-base.ts`: five environments byte identical, Databricks separately asserted | Derive llms.txt from `lib/data.ts` (done) |
| "Noise level policy advising system... Combines real-time noise monitoring with ML models" | `/publications` summary | The abstract describes K-means clustering and a comparison of logistic regression, SVM, decision tree and random forest classifiers. No real-time monitoring | Summary rewritten to the abstract (done) |
| "Long-range seasonal forecasting... outperforming traditional numerical weather prediction at extended lead times... integrated into climate intelligence workflows" | `/publications` summary | The abstract compares a CNN and an RNN against **climatology**, not NWP, with skill up to 30 weeks (PCC) and 52 weeks (RMSESS) **for select locations only**, and says further work is needed | Summary rewritten to the abstract (done) |
| MSc dated "2018 - 2019" | `/resume`, `/career` | The thesis record and its repo say 2022 (`PUBLICATIONS`, repo description "University of the Witwatersrand, 2022") | **Needs Thabang**: both can be true (study period vs award year). Not changed. See backlog E1 |
| Ubunye Engine licence | `lib/schema.ts` asserts MIT for every project | `LICENSE` in the repo is MIT; GitHub's detector reports NOASSERTION and PyPI metadata has no licence field | Claim is correct; licence now read per project. PyPI metadata fix is external (backlog X3) |
| TFiltersPy authorship | schema says author = Thabang only | PyPI metadata lists "Thabang L. Mashinini-Sekgoto, Lebogang L. Sekgoto, Palesa L. Sekgoto" | Schema now lists the PyPI authors (done); page prose unchanged, backlog E2 |
| Typewriter roles "AI Systems Architect", "Distributed Systems Engineer" | `lib/data.ts` `TYPEWRITER_ROLES` | Grep shows it is no longer rendered anywhere | Dead data, harmless; backlog |

## 5. What prevents indexing

Almost nothing. The crawl found no blocked, noindexed, redirecting or broken
URL in the sitemap. Specific residual risks:

1. `/now` is in the sitemap but no page links to it (orphan). Crawlers
   discover it only through the sitemap, and it inherits no internal authority.
2. No Search Console property is verified, so Google has never been handed the
   sitemap directly and there is no coverage report to catch a regression.
3. Twelve descriptions are longer than ~160 characters and six titles longer
   than 70, so search engines rewrite them. Not an indexing blocker; it hands
   the snippet to the engine instead of the author.

## 6. What prevents machine understanding

1. **No stated relationships.** A machine reading `/work/tfilterspy` learns a
   CreativeWork exists. It is not told it is software, written in Python,
   licensed MIT, about Kalman filtering (a concept it already knows as
   Wikidata Q846780), preceded by an earlier repo, or authored by the same
   person as the ScholarlyArticles on `/publications`.
2. **`sameAs` misused on case studies.** Employer case studies put product and
   press URLs in `sameAs`, which asserts the case study *is* the Vodacom
   product page. It is not.
3. **Topics are strings.** `keywords: "Sensor Data, State Estimation"` is a
   string. There is no DefinedTerm with a stable `@id` and no link to a shared
   vocabulary, so "Kalman Filtering" on this site and "Kalman filter"
   everywhere else are not known to be the same concept.
4. **Publications have no identity on the site.** No `@id`, no anchor, and the
   author list is plain names, so the "TL Mashinini" on a paper is not tied to
   the Person entity.
5. **The person's name variants are not declared.** Scholarly indexes know him
   as Thabang L. Mashinini (Semantic Scholar), TL Mashinini and T Mashinini
   (author lists). Without `alternateName` these read as different people.

## 7. What prevents topic based discovery

1. Titles and headings name the argument, not the subject (see summary item 1).
2. Topic pages exist only for blog tags, and only five tags have published
   posts behind them. The topics the *work* is about have no landing page.
3. Research has no page (summary item 2).
4. The strongest subject specific content on the site, the case studies, is
   not in `llms.txt` or `llms-full.txt`, which is what AI retrieval systems are
   most likely to fetch.
5. Nothing links a post to the project it discusses, so a reader (or crawler)
   entering through writing does not reach the work, and vice versa, except
   through the word overlap heuristic.

## 8. What prevents individual projects from ranking independently

A project page needs to answer, in the page itself: what it is, what problem it
solves, why it was built, what he contributed, how it works, what it uses,
what evidence exists, where the code is, what writing and research relates,
and what came before and after. Today:

| Question | Answered? |
|---|---|
| What is it | Only in prose, not in title or H1 |
| Problem, why, contribution, how | Yes, in the case study |
| Technologies | Only in a collapsed "Technical context" block |
| Evidence and artifacts | Yes, "Inspect it" row |
| Status, dates, licence, language | No |
| Related research and writing | Partly, through word overlap |
| Lineage | No |

## 9. What prevents the site acting as the canonical identity source

1. `sameAs` covers GitHub, LinkedIn, Scholar, YouTube, dev.to, Medium and
   Semantic Scholar. That is good. PyPI and the Ubunye AI Ecosystems GitHub
   organisation are not connected (the organisation has no Organization node
   with a `founder`).
2. The return path is missing on the external side. The PyPI page for
   `ubunye-engine` has no project URLs at all; the GitHub profile's `name`
   field reads "Tha-Bang!", which a knowledge graph cannot match to anything.
   Both are account configuration, not code (backlog X1 to X4).
3. No `rel="me"` links, the one mechanism that lets profile hosts (Mastodon,
   IndieAuth, some verifiers) confirm two URLs belong to the same person.
4. Organisations are plain strings. "ABSA Insurance", "Vodacom", "IBM
   Research", "University of the Witwatersrand" and "CSIR" are not entities
   with URLs, so the career cannot be joined to the organisations' own graphs.

---

## Crawl baseline (live, 2026-09-19)

```text
Crawled 38 HTML pages (47 URLs) in 6.2s. Sitemap: 37 URLs.
   1  error:orphan-page            /now
  12  warn:description-length
   6  warn:title-long
Structured data: BlogPosting 8, CreativeWork 9, SoftwareSourceCode 1,
ScholarlyArticle 1 (+1 Thesis) on 1 page, CollectionPage 9, ProfilePage 2.
```

The post implementation crawl is recorded in `DISCOVERABILITY_ARCHITECTURE.md`.
