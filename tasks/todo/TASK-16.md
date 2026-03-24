# TASK-16: Auto-update publications via Semantic Scholar API

**Category:** Publications
**Priority:** High
**Status:** Todo

Set up a scheduled agent that checks Semantic Scholar API for new papers by author ID `1419516441`. When new papers are found, generate AI impact summaries and create a PR.

**API endpoint:** `https://api.semanticscholar.org/graph/v1/author/1419516441/papers`
**Data constant:** `SEMANTIC_SCHOLAR_AUTHOR_ID` in `lib/data.ts`

Note: Only 3 of 5 publications are indexed on Semantic Scholar. EGU22 abstract and MSc thesis need manual maintenance.
