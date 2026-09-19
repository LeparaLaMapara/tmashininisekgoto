# Discoverability status

Date: 2026-09-19. Branch: `feat/discoverability-engine` (not merged, not deployed).
Architecture: `DISCOVERABILITY_ARCHITECTURE.md`. Why each change was made:
`DISCOVERABILITY_AUDIT.md`. What waits and why: `DISCOVERABILITY_BACKLOG.md`.

The infrastructure is complete. Further discoverability work should wait for
evidence (search data, crawler or retrieval failures, citation data, user
behaviour), not for ideas.

## DONE

Pages and content
- `/research` plus three research pages (echo state networks for level set
  segmentation; ML for seasonal climate forecasting; ML for hearing loss in mine
  workers), each with question, method, data, findings (including the negative
  one), limitations, possible implications labelled as such, code, papers and
  sources. Two further lines listed without pages for lack of evidence.
- `/topics` plus twelve topic hubs, generated only above an evidence threshold
  and only with a written intro. Blog tags with a hub redirect (308) to it.
- Every `/work/<slug>` page titled with what it is (e.g. "TFiltersPy: Kalman and
  particle filters for Python"), with an at a glance block (kind, role,
  organisation, period, status, licence, package authors, technologies,
  topics), lineage, and typed connections. The original argument line kept as
  the lede.
- Research in the navigation; `/now`, `/research` and `/topics` in the footer.
  The `/now` orphan is resolved.

Evidence
- All five publication summaries rewritten to what each abstract supports
  (three contained claims the abstracts do not make); applications relabelled
  "Possible applications (not results)"; "peer-reviewed" removed where it was
  not true; source titles, venues and a co-author's surname corrected; arXiv id
  and the thesis handle added; citation figures labelled "highest observed"
  with provider and retrieval date, Scholar counts marked as hand recorded.
- Homepage no longer claims remote sensing papers or two years at IBM.
- The IBM product link, which now redirects to an unrelated product, removed.
- `/llms.txt` no longer claims seven environments; every machine file and the
  assistant's fallback knowledge base now generated from the records.
- Tests pin each retracted claim so it cannot return.

Structure and identity
- One connected JSON-LD graph: stable `@id` per entity, DefinedTerms linked to
  Wikidata (hand verified), organisations with Wikidata ids, papers attached to
  the one Person, name variants from the published record, SoftwareSourceCode
  with licence and PyPI authors, `sameAs` only for true identity, `rel="me"` on
  profile links.
- Citation exports: correct BibTeX entry types, arXiv eprint and category,
  compound surnames, brace protection, escaping; APA and Chicago fixed.

Distribution
- Syndication: explicit post list or `--all` required to publish, original must
  answer 200 first, orphaned copies reported, state saved after each write and
  archived, Hashnode draft bug fixed, no keys on pull request runs.

Validation (all run on this branch, 2026-09-19)
- `tsc --noEmit`: clean.
- `next build`: 78 prerendered pages (66 before), research and topic pages static.
- Crawler against the production build: 49 pages, 0 errors (warnings only:
  five long descriptions and five long titles, all on existing pages whose copy
  is the author's).
- `tests/graph.spec.ts` (24 tests) and `tests/retrieval-eval.spec.ts` (22):
  all pass; retrieval 18 of 18 stranger queries land on the right page in the
  top three.
- Full Playwright suite: 110 tests; all pass on a clean server except the flaky
  one listed under FAILED.
- External link check: 44 links, 0 broken.
- Mobile rendering (390 px): no horizontal overflow on project, research and
  topic pages.
- Syndication dry run: runs, reports the orphaned copy, refuses a bare publish.
- Lighthouse CI (mobile emulation, twelve URLs, budgets unchanged): the first
  full run caught two accessibility regressions this work introduced (inline
  prose links on `/publications` and `/research` distinguished by colour only,
  0.95 and 0.96 against a budget of 1.0). Fixed with underlines; the re run of
  the seven new or changed URLs passes every assertion, and the other five
  passed in the full run. Performance budgets passed throughout.

CI
- `discoverability.yml`: type check, build, crawl and graph, evidence and
  retrieval tests on every PR and push to main; weekly external link check,
  GitHub metadata report and production crawl, opening one issue on failure.
- Lighthouse now covers a project, research index, research page, topic index
  and hub, under the unchanged budgets.

## BLOCKED ON HUMAN

The human action queue. Only things that cannot be done from the repository.

1. **Approve and merge the branch.**
   Needed: review `feat/discoverability-engine`, merge to `main`.
   Why: nothing here is live until it deploys.
   Where: GitHub pull request from the branch.
   Unblocks: every page, redirect and machine file above, and the CI gates.

2. **Enable Vercel Web Analytics.**
   Needed: turn on Web Analytics for the `tmashininisekgoto` project.
   Why: the site ships the analytics component, but the Vercel API reports
   "Web Analytics not found": no pageview, referrer or country data has ever
   been collected.
   Where: Vercel dashboard, project tmashininisekgoto, Analytics tab.
   Unblocks: landing pages, referrers (GitHub, dev.to, search), geography.

3. **Verify Google Search Console and Bing Webmaster Tools.**
   Needed: add the `www.tmashininisekgoto.com` property, set
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION`
   in Vercel, redeploy, verify, submit `/sitemap.xml`.
   Why: the only source of queries, impressions and index coverage.
   Where: search.google.com/search-console and bing.com/webmasters; steps in
   `docs/external-profiles.md` section 5.
   Unblocks: `scripts/discoverability/scorecard.ts`, the branded versus non
   branded measure, and the 30/60/90 day checks.

4. **Confirm or create an ORCID.**
   Needed: say whether ORCID 0000-0002-6530-5011 ("Thabang Mashinini",
   University of the Witwatersrand, Astronomy and Astrophysics and Computational
   and Applied Mathematics, no works) is yours. If yes, add the five works and
   the site URL to it; if no, register one.
   Why: the strongest scholarly identity link, and not assertable unconfirmed.
   Where: orcid.org; then set `SOCIAL_LINKS.orcid` in `lib/data.ts`.
   Unblocks: ORCID in `sameAs` everywhere, automatically.

5. **Resolve the MSc dates.**
   Needed: say what "2018 to 2019" (CV) and "2022" (thesis record and repository)
   each mean, for example study period and award year.
   Why: both are shown side by side on the research page until then; neither is
   changed.
   Where: reply, or edit `CAREER_TIMELINE` and `lib/graph/research.ts`.
   Unblocks: a single, sourced period on the CV, career and research pages.

6. **Decide on the orphaned dev.to copy.**
   Needed: unpublish (or leave) the dev.to copy of "building a data science
   team from scratch" until its original goes live on 1 October.
   Why: its canonical points at a page that returns 404 today, so dev.to holds
   the only working copy.
   Where: dev.to dashboard, article "Rebuilding a data science capability in
   under two years".
   Unblocks: the syndicate dry run reporting no orphans.

7. **Merge split scholarly profiles.**
   Needed: request a merge of OpenAlex authors A5064850070 and A5045647254; claim
   the Semantic Scholar author page 1419516441 and attach the EGU abstract and
   the thesis.
   Why: the work is split across two identities in OpenAlex and incomplete in
   Semantic Scholar, which is how AI research tools see it.
   Where: openalex.org author pages (support request) and semanticscholar.org.
   Unblocks: complete author records for citation and retrieval tools.

8. **Update public repository and package metadata.**
   Needed, each reversible, none automated because they publish under your name:
   set `ESNIterativeSegmentation` homepage to
   `https://www.tmashininisekgoto.com/research/echo-state-networks-level-set-segmentation`
   (after the merge); give `Echo-State-Master` a description or archive it;
   change the GitHub profile name from "Tha-Bang!" to your name; release
   `ubunye-engine` so PyPI shows the project URLs already in `pyproject.toml`;
   choose licences for `ESNIterativeSegmentation` and `kalmanfilter-`.
   Where: GitHub repository settings, profile settings, PyPI release.
   Unblocks: return links from the evidence to the canonical site; the weekly
   GitHub metadata report going quiet.

9. **Confirm TFiltersPy authorship wording.**
   Needed: confirm the site's "I built TFiltersPy" against the PyPI author list
   (you, Lebogang L. Sekgoto and Palesa L. Sekgoto).
   Why: the structured data lists all three as PyPI states; the prose says "I".
   Where: reply, or edit the `tfilterspy` case study.
   Unblocks: prose and metadata that agree.

## DEFERRED

Each with its reason and trigger in `DISCOVERABILITY_BACKLOG.md`:
per publication pages; markdown copies of project and research pages; hubs for
low evidence technologies; pages for the proposed doctoral research and the
honours project; a transcript pipeline and per talk pages; stars over time;
backlink automation; newsletter referrer tagging; mention monitoring;
automated Search Console pulls; a Wikidata item for the person; ESLint;
translations and hreflang.

## FAILED / NEEDS INVESTIGATION

- **`tests/soft-nav-reveal.spec.ts` › /courses paints its heading without a
  reload** failed once in the full parallel run and passed three of three in
  isolation. Timing flakiness under load, predating this work (the test and
  the page are untouched). Worth a retry annotation or a longer wait if it
  recurs in CI.
- **`next lint`** has never been configured here and prompts interactively; it
  was not run. `tsc` is the static check in CI.
- **WIReDSpace outage.** The thesis record (and its handle) timed out or
  returned 502/504 during this work. The link checker reports it as
  unreachable, not broken; recheck weekly.
- **Scholar citation counts** could not be re-verified (Google Scholar serves a
  robot check to scripts). The figures remain the hand recorded ones and are
  labelled so.

## Measure now, and over 30, 60 and 90 days

Now (no accounts needed): `node scripts/discoverability/audit-site.mjs --base
https://www.tmashininisekgoto.com` (crawl health), `npx tsx
scripts/discoverability/check-external.ts` (evidence links, GitHub metadata),
`npx tsx scripts/discoverability/graph-report.ts` (graph shape), the retrieval
evaluation, and the syndication dry run.

After items 2 and 3:
- **Day 30:** index coverage for `/research/*` and `/topics/*` (all should be
  indexed; any "crawled, not indexed" is a thin page signal), first non branded
  impressions, referrers from GitHub and dev.to.
- **Day 60:** non branded share of impressions from `scorecard.ts`; which
  topics bring strangers in; whether TFiltersPy and Ubunye Engine pages earn
  impressions for "kalman filter python" and "spark pipeline framework" style
  queries.
- **Day 90:** non branded clicks trend; research pages with zero impressions
  (a structural question, not a copy one); whether any backlog trigger has
  fired. Only then decide on further work.
