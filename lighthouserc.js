/**
 * Lighthouse CI configuration.
 *
 * `npm run lighthouse` builds first and then audits. The build is not optional:
 * `npx playwright test` starts `next dev`, which leaves Turbopack's dev output
 * in `.next`, and `next start` against that dies with
 * "routesManifest.dataRoutes is not iterable". CI builds in its own step and
 * calls the CLI directly.
 *
 * The CLI is fetched with npx rather than added to devDependencies: it is a
 * large install that nothing else in this repo needs.
 *
 * ## What the numbers are based on
 *
 * The thresholds below are set against the measurements recorded in
 * SEO-AUDIT.md section 3, taken on a local production server:
 *
 *   Performance 91 | SEO 100 | Accessibility 100 | Best practices 96
 *   LCP 3.3s | CLS 0 | TBT 40-100ms
 *
 * They sit a little under those figures, because a CI runner is slower and
 * noisier than a laptop and a build that fails at random teaches everyone to
 * ignore it. The point is catching a regression, not defending a personal best.
 *
 * ## One thing this cannot check
 *
 * Lighthouse scored SEO 100 on this site while every page carried a canonical
 * pointing at the homepage on the wrong domain. It checks that a canonical
 * exists and parses, not that it points anywhere sensible. A green run here is
 * evidence about performance and accessibility, and close to no evidence about
 * whether the site is findable. See SEO-AUDIT.md section 3.
 */

/**
 * The looser budget for /about.
 *
 * The page is a genuine outlier: performance 80 against 89-92 everywhere else,
 * and total blocking time in the hundreds of milliseconds against under 90ms.
 * The GitHub contribution calendar was the largest single cost (performance 64,
 * TBT 1365ms) before it moved behind `next/dynamic`; what is left is the
 * hydration cost of the bento grid, the testimonials carousel and the
 * tech-stack filter, all client components that render on first paint.
 * Splitting those is real work and is not attempted here.
 *
 * **The numbers below are calibrated on a GitHub runner, not on a laptop.**
 * That matters, and it cost a red build to learn. Measured locally, /about
 * blocks for 433ms; on the runner the same commit produced 2151ms, 649ms and
 * 676ms across three runs. The 2151ms is the first run on a cold machine, which
 * is exactly what median-of-three exists to absorb, but even the median lands
 * around 650ms.
 *
 * So the ceiling is 800ms: above the runner's real median with room for a bad
 * day, and far enough below the 1365ms of the unfixed page that a regression of
 * that size still fails. A budget tuned to the fastest machine it will ever run
 * on is not a budget, it is a source of flaky builds that get ignored.
 *
 * These are a ratchet, not a target. They should come down as the page gets
 * faster.
 */
const ABOUT = {
  'categories:performance': ['error', { minScore: 0.75 }],
  'total-blocking-time': ['error', { maxNumericValue: 800 }],
}

/** The standard budget, with per-route overrides merged over it. */
function assertions(overrides = {}) {
  return {
    'categories:performance': ['error', { minScore: 0.85 }],
    'categories:accessibility': ['error', { minScore: 1 }],
    'categories:seo': ['error', { minScore: 1 }],
    'categories:best-practices': ['warn', { minScore: 0.9 }],

    // Core Web Vitals, held individually so a regression names itself instead
    // of showing up as "performance dropped 4 points".
    'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
    'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
    'total-blocking-time': ['error', { maxNumericValue: 300 }],
    'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],

    // Cheap to keep and directly about being found: a title and description on
    // every page, links a crawler can follow, nothing telling it to go away.
    'errors-in-console': 'off',
    'unused-javascript': 'off',
    'unsized-images': 'warn',
    'meta-description': 'error',
    'document-title': 'error',
    'crawlable-anchors': 'error',
    'is-crawlable': 'error',
    'http-status-code': 'error',
    'color-contrast': 'error',
    'heading-order': 'error',

    ...overrides,
  }
}

module.exports = {
  ci: {
    collect: {
      // Build first, then serve the production output. Auditing `next dev` would
      // measure the dev server's unminified bundles and hot-reload socket.
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 120000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/about',
        'http://localhost:3000/work',
        'http://localhost:3000/publications',
        'http://localhost:3000/blog',
        'http://localhost:3000/blog/ubunye-series-part1-why-convention',
        'http://localhost:3000/tags/mlops',
      ],
      // Three runs, median reported. A single run on a shared CI runner swings
      // by 10 points on performance for no reason at all.
      numberOfRuns: 3,
      settings: {
        // Lighthouse's default emulation: a mid-tier phone on throttled 4G.
        // Not desktop, which scores this site 100 on every page and would gate
        // nothing. Google indexes the mobile page, so mobile is the number that
        // matters and the one worth defending.
        // The Vercel analytics and speed-insights scripts are injected only in
        // production on Vercel, so they 404 under `next start` and would fail
        // the best-practices audit for something that is not a defect.
        skipAudits: ['uses-http2', 'valid-source-maps'],
      },
    },

    assert: {
      // Two profiles, because /about is a genuine outlier and pretending
      // otherwise would mean loosening the gate for every route to accommodate
      // one of them. See ABOUT below.
      assertMatrix: [
        { matchingUrlPattern: '^(?!.*/about$).*$', assertions: assertions() },
        { matchingUrlPattern: '.*/about$', assertions: assertions(ABOUT) },
      ],
    },

    upload: {
      // Anonymous temporary storage: every run gets a public report URL printed
      // in the job log, with no server to host and no token to rotate. Reports
      // expire after a few days, which is longer than anyone looks at them.
      target: 'temporary-public-storage',
    },
  },
}
