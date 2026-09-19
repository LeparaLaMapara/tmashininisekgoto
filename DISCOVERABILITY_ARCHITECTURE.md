# Discoverability architecture

Date: 2026-09-19. Branch: `feat/discoverability-engine`.
Companion documents: `DISCOVERABILITY_AUDIT.md` (what was wrong and why),
`DISCOVERABILITY_STATUS.md` (what is done, blocked, deferred or failing, and the
human action queue), `DISCOVERABILITY_BACKLOG.md` (what was considered and why it
waits). Earlier passes: `SEO-AUDIT.md` (indexability) and `DISCOVERABILITY.md`
(distribution, machine copies, citations, performance budget).

The goal the whole system serves:

> P(discover the work | the searcher does not know the name)

It is reached by three things, in this order of importance: every significant
piece of work has a page that names what it is and says what it contains; the
pages are connected to each other and to shared subjects; and the connections
are described in markup and machine files that agree with the pages because
they are generated from the same records.

---

## 1. Canonical source model

`https://www.tmashininisekgoto.com` is the canonical origin (`lib/site.ts`). Every
fact the site states lives in exactly one record, and every surface is generated
from it:

```text
lib/data.ts            projects, publications, talks, career, bio, profiles
lib/graph/topics.ts    the topic ontology (with Wikidata ids)
lib/graph/research.ts  research lines
lib/graph/organizations.ts  organisations (with Wikidata ids)
content/blog/*.mdx     posts (frontmatter: tags, topics, projects, series)
data/publications.remote.json  citation counts, refreshed by script
            |
            v
lib/graph/index.ts     nodes, stable ids, stated and derived relations, hubs
            |
   +--------+---------+-----------+-------------+--------------+
   v        v         v           v             v              v
 pages   JSON-LD   sitemap   llms.txt etc   site search   tests and CI
```

Rule: no surface types a fact out by hand. Where one did (`/llms.txt` claimed
identical output on seven environments; the assistant's fallback knowledge base
carried overstated paper summaries), it drifted, and it now reads the records.

The public CV (`public/resume.pdf`) is the ceiling for career claims. Primary
sources (paper abstracts, the thesis, repositories, package metadata) are the
ceiling for research and software claims.

## 2. Content model

| Entity | Record | Page | Schema.org type | `@id` |
|---|---|---|---|---|
| Person | `BIO`, `SOCIAL_LINKS` | `/`, `/about` | `Person` | `/#person` |
| Organisation | `ORGANIZATIONS` | none (named on pages) | `Corporation`, `CollegeOrUniversity`, ... | `/#org-<slug>` |
| Project (software) | `PROJECTS`, `kind: 'software'` | `/work/<slug>` | `SoftwareSourceCode` | `/work/<slug>#software` |
| Project (system, programme) | `PROJECTS` | `/work/<slug>` | `CreativeWork` | `/work/<slug>#work` |
| Research line | `RESEARCH` | `/research/<slug>` when `page: true` | `ResearchProject` | `/research/<slug>#research` |
| Publication | `PUBLICATIONS` | anchor on `/publications` | `ScholarlyArticle`, `Thesis` | `/publications#<key>` |
| Post | MDX | `/blog/<slug>` | `BlogPosting` | `/blog/<slug>#post` |
| Series | frontmatter `series` | `/blog/series/<slug>` | `CreativeWorkSeries` | `/blog/series/<slug>#series` |
| Talk | `TALKS` | `/talks`, series page | `VideoObject` | `<page>#talk-<id>` |
| Topic | `TOPICS` | `/topics/<slug>` when it has a hub | `DefinedTerm` | `/topics/<slug>#topic` |

Each project record now carries identity fields: `headline` (the page title and
H1, naming what it is), `summary` (the meta description), `kind`, `status`,
`period`, `organization`, `role`, `license` and `authors` (software), `graphTopics`,
`technologies` and `lineage`. The earlier argument title (`cardTitle`) stays as
the lede, so the voice is kept and the name is no longer missing.

## 3. Research model

A research line is the unit someone searches for ("reservoir computing for
image segmentation"), not a single paper. `lib/graph/research.ts` holds, where
evidence exists: question, approach, datasets, findings, limitations,
implications, publications, code, related projects, topics, lineage and
provenance. Missing evidence means an omitted field, never filler.

Three rules keep it honest:

1. Findings are the source's own, including negative ones. The MSc page says
   plainly that the echo state network did not beat the trained gated models.
2. Possible applications are labelled "What it might mean" or "Possible
   applications (not results)" everywhere they appear, in HTML and machine files.
3. Every page lists its sources. A line with too little evidence for a page
   (`page: false`, for example the proposed doctoral research) is listed on
   `/research` with its status and no page is generated.

## 4. Topic model

`lib/graph/topics.ts` is the one vocabulary. Each topic has a kind (field,
method, domain, technology), broader topics, and a hand verified Wikidata id
where one exists. Blog tags map onto it (`TAG_TO_TOPIC`), talk topics map onto it
(`TALK_TOPIC_TO_TOPIC`), and projects, research and publications name their
topics directly.

A topic gets a hub page at `/topics/<slug>` only when both hold:

- it has a written `intro` and `description`, and
- at least three items are attached, at least two of them substantive (project,
  research line, publication or post). Talks count toward three but cannot make
  a hub alone.

That produced twelve hubs from fifty six topics. The rest stay as `DefinedTerm`s in
the markup and appear on `/topics` linked to wherever their work lives. A topic
with one project behind it is best served by that project's page, not by a thin
page of its own. A blog tag whose topic has a hub redirects there (308), so one
subject has one URL.

## 5. Knowledge graph

`lib/graph/index.ts` turns every record into a node (`type`, `key`, `href`, `id`,
`topics`, `links`). Relations are of two kinds:

- **Stated**: a research line lists its publications and related projects; a post
  names the projects it discusses (`projects:` frontmatter). Stated links are made
  symmetric automatically.
- **Derived**: two nodes sharing topics, scored by the sum of inverse topic
  frequencies, so sharing "echo state networks" counts for far more than sharing
  "Python". A stated link always outranks a derived one.

`getConnections()` feeds the "Related research / Publications / Related work /
Related writing / Talks" sections on project, research and post pages, each card
saying why it is there ("Directly connected", "Shares kalman filtering").

In JSON-LD (`lib/schema.ts`) every entity uses its one `@id` on every page, with
`name` and `url` repeated so references stand alone. The relations used, each
only where the semantics match:

| From | Property | To |
|---|---|---|
| Person | `alternateName` | name variants found in the published record |
| Person | `worksFor`, `alumniOf`, `affiliation` | Organisation |
| Person | `knowsAbout` | DefinedTerm |
| Person | `sameAs` | verified profiles only |
| Organisation | `sameAs`, `parentOrganization`, `founder` | Wikidata, parent, Person |
| SoftwareSourceCode | `author`, `maintainer`, `publisher`, `about`, `codeRepository`, `license`, `sameAs` (repo, PyPI) | Person, Organisation, DefinedTerm |
| CreativeWork (case study) | `creator`, `sourceOrganization`, `about`, `subjectOf` (press), `mentions` (product pages) | |
| ResearchProject | `member`, `parentOrganization`, `knowsAbout`, `subjectOf` (papers, code) | |
| ScholarlyArticle, Thesis | `author` (the subject as the Person `@id`), `about`, `isBasedOn` (research line), `identifier`, `sameAs` (DOI, Semantic Scholar) | |
| BlogPosting | `about`, `mentions` (projects), `isPartOf` (series) | |
| DefinedTerm | `inDefinedTermSet`, `sameAs` (Wikidata) | |

`sameAs` is never used for "related": a case study is not the Vodacom product
page it links to, so that link is `mentions`.

## 6. Machine readable surfaces

| Surface | Source | Notes |
|---|---|---|
| HTML with JSON-LD | pages | The primary surface; everything below is supplementary |
| `/sitemap.xml` | routes + graph | Real `lastmod` from git or content dates; redirecting tags excluded |
| `/robots.txt` | static | Allows all, names AI crawlers, points at the machine files |
| `/llms.txt` | records | Index: work, research, publications, topics, posts, series |
| `/llms-full.txt` | records | Full text of every case study, research line, paper summary and post |
| `/ai.txt` | records | Identity, name variants, research lines, questions the site answers |
| `/blog/<slug>.md` | `lib/post-markdown.mjs` | Same bytes as syndicated copies |
| `/feed.xml` | posts | RSS |
| `/publications.bib` | `lib/citations.ts` | BibTeX; APA and Chicago in the cite box |

`llms.txt` is treated as an extra surface, not a standard any crawler is obliged
to read. Nothing depends on it.

## 7. Syndication architecture

Canonical first. A post is published on the site (by the scheduler), indexed,
and only then copied (dev.to, Hashnode, Medium) with a canonical back to the
original; LinkedIn, which has no canonical, gets a teaser draft only.
`scripts/syndicate.mjs` guards:

- dry run by default; a publish must name its posts or pass `--all`;
- refuses to copy a post whose original does not answer 200;
- reports copies whose original is no longer live;
- writes state after every write and uploads it as a run artifact;
- skips Hashnode under `--draft` (its API has no draft mode);
- pull request runs never receive publishing keys.

## 8. Citation architecture

Publications live in `lib/data.ts` with a `key`, the research line they belong
to, and topics. Counts come from three providers (`scripts/publications/sync.mjs`
for Semantic Scholar and Crossref, Google Scholar by hand). The page shows the
**highest observed** count with its provider, all three on hover, the retrieval
date for scripted counts, and says plainly that Scholar counts are hand recorded.
No provider is treated as exact. Exports: BibTeX (correct entry types, arXiv
eprint and category, brace protection), APA 7 and Chicago author date.

## 9. External identity graph

Declared in `sameAs` (all verified): GitHub, LinkedIn, Google Scholar, YouTube,
dev.to, Medium, Semantic Scholar. `rel="me"` on the footer profile links.
`alternateName` carries the variants the published record uses: Thabang
Mashinini (arXiv, NeurIPS), Thabang L. Mashinini (Crossref, Semantic Scholar),
Thabang Lukhetho Mashinini (EGU, OpenAlex), T. L. Mashinini (author lists) and
Thabang L. Mashinini-Sekgoto (PyPI). Not declared until confirmed: ORCID (a
candidate record exists and is in the human queue), OpenAlex (the profile is
split in two), PyPI user pages.

## 10. Monitoring

Smallest useful layer, all in the repository:

| What | How | When |
|---|---|---|
| Crawl errors, canonicals, noindex, orphans, JSON-LD, sitemap | `scripts/discoverability/audit-site.mjs` | every PR, and against production weekly |
| Broken evidence and identity links, GitHub repo metadata | `scripts/discoverability/check-external.ts` | weekly |
| Performance and accessibility | Lighthouse CI | every PR and push to main |
| Citation counts | `publications.yml` | existing schedule |
| Syndication state and orphan copies | `scripts/syndicate.mjs` dry run | on every run |
| Branded vs non branded discovery | `scripts/discoverability/scorecard.ts` over a Search Console export | monthly, once Search Console is verified |
| Graph shape | `scripts/discoverability/graph-report.ts` | on demand |

Indexing, impressions, queries and referrers require accounts only the owner can
configure (Search Console, Bing, Vercel Web Analytics); see the human queue.

## 11. CI/CD validation

`.github/workflows/discoverability.yml` on every pull request and push to main:
type check, build, serve, crawl (fails on any error), then
`tests/graph.spec.ts` (ontology, records, evidence pins, structured data,
connections) and `tests/retrieval-eval.spec.ts` (eighteen stranger queries must
land on the right page within the top three results of the site's own search).
Weekly it checks external links and crawls production, opening one issue on
failure. `lighthouse.yml` enforces the performance and accessibility budgets on
twelve representative URLs, now including a project, research and topic page.

## 12. Human approval boundaries

Automated: building, validating, crawling, reporting, generating every machine
file, scheduled publishing of posts the author has already written and dated,
and syndicating posts already live for a day.

Always a person: publishing anything new under the author's name, any claim
that cannot be checked automatically, destructive or public changes to GitHub
repositories, merging or claiming external author profiles (ORCID, OpenAlex,
Semantic Scholar), credentials and new accounts, unpublishing syndicated copies,
and resolving contradictory historical facts. The code never picks the
flattering side of a contradiction; it records both.

---

## How new work joins the graph

**A new project.** Add a record to `PROJECTS` in `lib/data.ts` with the identity
fields (`headline` under 60 characters naming the thing, `summary` under 160,
`kind`, `status`, `period`, `role`, `graphTopics`, `technologies`, and `license`
and `authors` for software). The page, its JSON-LD, its sitemap entry, its place
in every topic hub it belongs to, its connections, search, `llms.txt` and
`llms-full.txt` all follow. `tests/graph.spec.ts` fails if a topic slug is
unknown, a headline is too long, or software does not name itself.

**A new research line.** Add a record to `RESEARCH` in `lib/graph/research.ts`
with `provenance` for every claim. Set `page: true` only when question,
approach and findings are all supported by a source. Link its publications by
key; each publication's `research` field must point back (a test checks both
directions).

**A new publication.** Add it to `PUBLICATIONS` with a `key`, its `research`
line and `topics`. Write `aiSummary` from the abstract only, and list
applications as possibilities. Run `npm run pubs:sync` for counts.

**A new post.** Frontmatter `tags` (max five, the syndicated vocabulary) map to
topics automatically. Add `topics:` for ontology topics beyond the tags and
`projects:` for any project the post discusses. Keep `publishOn` as the last
line if scheduled.

**A new talk.** Add it to `TALKS` with its `topics` from the talk vocabulary. A
title about agents joins the AI agents topic automatically.

**A new subject.** Add a topic to `TOPICS` with its Wikidata id checked by hand.
It becomes a hub on its own the day it has an intro and enough work behind it.

**When a recording becomes available.** The hook for transcripts: add a
`transcript` source to the talk record, generate a transcript into
`content/talks/<slug>.md`, and give talks a page route that renders it with
`VideoObject.transcript`. The graph, sitemap and machine files would pick it up
like any other node. Not built today because no talk has a transcript; see the
backlog.

## Measured result

| | Before (main, live) | After (this branch, local build) |
|---|---|---|
| Indexable pages crawled | 38 | 49 |
| Research pages | 0 | 3, plus an index |
| Topic pages spanning all work | 0 (5 blog tags) | 12 hubs, plus an index |
| Crawl errors | 1 (orphan `/now`) | 0 |
| Distinct schema types in markup | 24 | 32 |
| DefinedTerm nodes | 0 | on every project, research, post and hub page |
| Stranger queries landing on the right page (site search, top 3) | not measurable: research and topics had no pages | 18 of 18 |
