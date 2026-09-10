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

## 4. ORCID

Register at https://orcid.org/register (free). Then:

1. Add the four publications by DOI (Add works → Search & link, or by DOI). The
   DOIs are in `lib/data.ts` under `PUBLICATIONS`.
2. Add `https://www.tmashininisekgoto.com` under "Websites & social links".
3. Put the resulting iD (e.g. `https://orcid.org/0000-0000-0000-0000`) into
   `SOCIAL_LINKS.orcid` in `lib/data.ts`. It flows into `sameAs` and the Person
   schema automatically. Also add it to the Google Scholar profile.

---

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
