# Discoverability backlog

Date: 2026-09-19.

The discoverability infrastructure is complete (see `DISCOVERABILITY_STATUS.md`).
This file is not a queue of next features. It is the record of what was
considered and deliberately not built, each with the evidence that would justify
building it. Nothing here should be started without that evidence: search data,
crawler failures, retrieval failures, citation data or user behaviour.

Format: **ITEM**. Deferred because. Reconsider when.

## Content and pages

- **Pages for individual publications.** Each paper is an anchor on
  `/publications` and is described in full on its research page. A page per
  paper would repeat the abstract and compete with the publisher's own page,
  which already ranks for the title. Reconsider when Search Console shows
  impressions for a paper title landing on `/publications` with a poor
  click through rate.
- **Markdown copies of project and research pages** (`/work/<slug>.md`).
  `llms-full.txt` already inlines every case study and research line in
  markdown. Reconsider when an agent or crawler is seen requesting `.md` URLs
  under `/work` or `/research` in the logs.
- **Hubs for technologies with little work behind them** (Databricks,
  Kubernetes, Dask). Below the hub threshold they would be thin pages. They are
  DefinedTerms already, and a hub appears automatically once the threshold is
  met and an intro is written. Reconsider when the Ubunye series is republished
  (Spark and Databricks will then clear the threshold; Apache Spark already has
  an intro waiting).
- **Research pages for the proposed doctoral work and the honours project.**
  Both are listed on `/research` with their status. The proposal is not
  registered and the honours project has one line of evidence. Reconsider on
  registration in January 2027 (the places that flip then are listed in `lib/knowledge-base.ts` and `CAREER_TIMELINE`), or when the
  honours report is found.
- **A research page for the IBM geospatial platform work.** The PAIRS
  deployment is stated in the CV but has no public artifact beyond the papers
  already on the seasonal forecasting page. Reconsider if a public IBM source
  describing the deployment is found.

## Talks and transcripts

- **Transcript pipeline** (recording, transcript, searchable page, structured
  metadata, topics, related work). No talk has a transcript today and the
  sessions are hosted on another person's channel. The hook is documented in
  `DISCOVERABILITY_ARCHITECTURE.md` ("When a recording becomes available").
  Reconsider when a recording the author controls exists and has a transcript,
  or when talk pages show search impressions worth serving.
- **Pages per talk.** Talks link to the series page or `/talks`. Reconsider
  with transcripts: a talk page without a transcript is a video embed and a
  paragraph.

## Measurement

- **Stars over time chart.** Vanity, and says nothing about whether strangers
  find the work. Reconsider never, unless a funder asks for it.
- **Backlink automation or outreach tooling.** Would add complexity and invite
  low quality links. The GitHub, PyPI and profile return links in the human
  queue are worth more. Reconsider when Search Console shows the site ranking on
  page two for non branded queries where one authoritative link would matter.
- **Newsletter referrer tagging (UTM on newsletter links).** There is a subscribe
  form but no newsletter being sent. Reconsider when one is.
- **Mention monitoring** (alerts when the name or projects are mentioned
  elsewhere). Paid services, noisy results. Reconsider when there is enough
  activity that mentions are missed in practice.
- **Automated Search Console pulls.** `scorecard.ts` reads the export. An API
  integration needs a service account on the owner's Google account.
  Reconsider after three monthly exports, if doing it by hand is the bottleneck.

## Identity

- **A Wikidata item for the person.** Wikidata has notability rules and items
  about oneself are frowned upon. The site already links its concepts and
  organisations to Wikidata. Reconsider if a third party creates one; then add
  it to `sameAs`.
- **ORCID.** Not used, by decision (2026-09-20): Google Scholar is the
  scholarly identity of record. Reconsider when a publisher, funder or
  institution requires an iD; then register one and set `SOCIAL_LINKS.orcid`,
  which is all the code needs.
- **OpenAlex and Semantic Scholar merges.** In the human queue; they need the
  author's own login.

## Engineering

- **ESLint.** `next lint` has never been configured in this repository and
  prompts interactively; `tsc --noEmit` runs in CI instead. Reconsider when a
  class of bug a linter catches shows up in review.
- **hreflang and translations.** The site is in English only; a translation
  (isiZulu, Sesotho, Setswana) would be a content decision first. Reconsider if
  a translated page is written.
