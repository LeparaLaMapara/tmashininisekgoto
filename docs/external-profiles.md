# External profile copy and steps

Drafts for the account-level discoverability work. Nothing here is published
automatically. Every link points back to the site, which is the return path the
audit found missing.

---

## 1. LinkedIn headline

Paste into the LinkedIn "Headline" field (220 char limit). Option A is the
positioning; B is shorter.

**A (recommended):**
> Applied AI · Data Science · AI Engineering · Research | Lead Data Scientist at ABSA Insurance | Founder of Ubunye AI Ecosystems, author of Ubunye Engine

**B (shorter):**
> Applied AI, Data Science & AI Engineering | Lead Data Scientist at ABSA | Building Ubunye Engine

Remove any "PhD candidate" wording from the LinkedIn headline and About section
until registration. The site now says "PhD in Computer Science, commencing 2027", in line with the CV; the
two should match.

LinkedIn "About" opening line, to mirror the site:
> I build production AI and data systems, the infrastructure underneath them,
> and applied research grounded in real problems. Nine years across insurance,
> telecommunications, applied research and higher education.

---

## 2. GitHub profile README

Create a repository named exactly `LeparaLaMapara` (same as the username). Add a
`README.md` with the content below; GitHub renders it on the profile page. This
is one of the strongest return links, because the repos are already real.

```markdown
### Thabang Mashinini-Sekgoto

Applied AI · Data Science · AI Engineering · Research

I build production AI and data systems, the reusable infrastructure underneath
them, and applied research grounded in real problems. Lead Data Scientist at
ABSA Insurance, previously Vodacom and IBM Research.

- **Ubunye Engine** — describe a data or ML pipeline once, run that exact folder
  on a laptop, Docker, Kubernetes, a cloud cluster or Databricks.
  [Docs](https://ubunye-ai-ecosystems.github.io/ubunye_engine/) ·
  [Org](https://github.com/ubunye-ai-ecosystems)
- **Tfilterspy** — a Bayesian filtering library (Kalman, Particle, Ensemble)
  with a scikit-learn style API.
  [Docs](https://ubunye-ai-ecosystems.github.io/tfilterspy)

Writing and full background: https://www.tmashininisekgoto.com

MSc, University of the Witwatersrand · Johannesburg, South Africa
```

---

## 3. PyPI project URLs

For each package (`ubunye-engine`, `tfilterspy`), add a `[project.urls]` table to
its `pyproject.toml` in that package's own repo, then release. This makes the
PyPI page link back to the site and docs.

```toml
[project.urls]
Homepage = "https://www.tmashininisekgoto.com"
Documentation = "https://ubunye-ai-ecosystems.github.io/ubunye_engine/"
Repository = "https://github.com/ubunye-ai-ecosystems"
Author = "https://www.tmashininisekgoto.com"
```

(Swap the Documentation and Repository URLs for tfilterspy's own.)

---

## 4. Scholarly identity: Google Scholar, not ORCID

Decision, 2026-09-20: the Google Scholar profile is the scholarly identity of
record. No ORCID is registered, and an unconfirmed one is never asserted on the
site. `SOCIAL_LINKS.orcid` stays empty, and the Person schema simply omits it.

What that makes worth doing on the Scholar profile itself, all in Scholar:

1. Check every publication is on the profile, including the MSc dissertation
   (https://hdl.handle.net/10539/33910) and the EGU 2022 abstract, which
   Semantic Scholar does not have either.
2. Set the profile to **Public** and add `https://www.tmashininisekgoto.com` as
   the homepage, so the return link exists from Scholar back to the site.
3. Confirm the verified email on the profile is a current one.
4. Merge any duplicate entries Scholar has created for the same paper.

The site links to the profile from the footer, the Person `sameAs`, `/ai.txt`
and the short URL `/scholar`. The link no longer carries `authuser=1`, which
named a signed in account slot in the visitor's own browser rather than the
profile, and could resolve to the wrong account for anyone with more than one
Google login.

If a publisher or funder ever requires an ORCID, register one, put the full iD
into `SOCIAL_LINKS.orcid`, and it flows into `sameAs` and the Person schema
with no other file touched.

## 5. Search Console and Bing — the true baseline

1. **Google Search Console** (https://search.google.com/search-console): add the
   `www.tmashininisekgoto.com` property. Choose the "HTML tag" method; it gives a
   `content="..."` value.
2. **Bing Webmaster Tools** (https://www.bing.com/webmasters): add the site; the
   meta method gives a `msvalidate.01` value. Or "Import from Google Search
   Console", which skips this.
3. Set these as environment variables in Vercel and redeploy:
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = the Google content value
   - `NEXT_PUBLIC_BING_SITE_VERIFICATION` = the Bing content value

   The layout already emits both tags when the vars are present, so no code
   change is needed. Redeploy, then click Verify in each console.
4. In Search Console, submit `https://www.tmashininisekgoto.com/sitemap.xml`.
5. Capture the day-one numbers before any further change: indexed count,
   impressions, clicks, and queries containing "Ubunye". That is the baseline the
   audit said cannot exist until these are verified.

---

## 6. /ai assistant reindex

The on-site assistant answers from a Supabase vector index that has not been
rebuilt since the bio and positioning were corrected. Until it runs, the
assistant can still describe the old positioning. Trigger it with the production
admin token:

    curl -X POST https://www.tmashininisekgoto.com/api/admin/reindex \
      -H "Authorization: Bearer <PROD_ADMIN_TOKEN>"

The token is the `ADMIN_TOKEN` value in the Vercel project settings, which
differs from the local one.
