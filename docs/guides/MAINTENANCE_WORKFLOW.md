# Maintenance Workflow

Operational procedures for ongoing content updates, dependency maintenance, and performance monitoring.

**Created:** Phase 7.6
**Last Updated:** 2026-03-11

---

## Table of Contents

1. [Adding a New Project](#adding-a-new-project)
2. [Updating the Resume](#updating-the-resume)
3. [Adding Writing Samples](#adding-writing-samples)
4. [Quarterly Dependency Review](#quarterly-dependency-review)
5. [Monthly Performance Review](#monthly-performance-review)
6. [Monitoring Dashboards](#monitoring-dashboards)

---

## Adding a New Project

Projects use a **JSON Merge Pattern** — structural data lives in `projects.ts`, while translatable strings live in locale JSON files. This means adding a project touches three locations.

### Steps

1. **Add project images**

   Create a directory under `v2/public/images/gallery/<project-id>/` with:
   - Full-size images (e.g., `screenshot.png`)
   - Thumbnail variants suffixed `_tn` (e.g., `screenshot_tn.png`)

2. **Add base project data**

   Edit `v2/src/data/projects.ts` — add a new entry to the `PROJECTS` array.
   Projects are ordered most recent first. Leave translatable fields as empty strings:

   ```typescript
   {
     id: 'myNewProject',
     title: '',           // Populated from locale JSON
     desc: [],            // Populated from locale JSON
     circa: '',           // Populated from locale JSON
     tags: ['React', 'TypeScript'],
     images: [
       {
         url: '/images/gallery/myNewProject/screenshot.png',
         tnUrl: '/images/gallery/myNewProject/screenshot_tn.png',
         caption: '',     // Populated from locale JSON
       },
     ],
     // ... other structural fields
   }
   ```

3. **Add translations (English)**

   Edit `v2/src/locales/en/projects.json` — add a key matching the project ID:

   ```json
   {
     "myNewProject": {
       "title": "My New Project",
       "circa": "2026",
       "desc": ["First paragraph.", "Second paragraph."],
       "captions": ["Screenshot of the dashboard"]
     }
   }
   ```

4. **Add translations (French)**

   Edit `v2/src/locales/fr/projects.json` with the French translations.
   Use the DeepL MCP server for translation assistance. See [LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md#translation-workflow) for the full procedure.

5. **Update project count**

   Update the JSDoc comment at the top of `v2/src/data/projects.ts` — increment the "Total projects" count and adjust the date range if needed.

6. **Validate and test**

   ```bash
   cd v2
   npx tsx src/data/validateProjects.ts    # Validates project data structure
   npm test                                 # Run full test suite
   npm run build                            # Verify production build
   ```

7. **Create PR with changelog entry**

   Follow the changelog format in `changelog/CLAUDE.md`.

---

## Updating the Resume

The resume uses the **Direct i18n Pattern** — `getLocalizedResumeData(t)` calls the `t()` translation function directly. All translatable strings are in the locale JSON files.

### Steps

1. **Edit resume data**

   Edit `v2/src/data/resume.ts` — modify or add entries in the appropriate section:
   - `header` — name, tagline, contact links
   - `jobs` — work experience (most recent first)
   - `competencies` — skills organized by category
   - `clients` — client list
   - `conferences` — speaking history
   - `education` — degrees and certifications

2. **Add/update translation keys**

   - English: `v2/src/locales/en/resume.json`
   - French: `v2/src/locales/fr/resume.json`
   - Common strings: `v2/src/locales/en/pages.json` (for page-level text like titles)

3. **Update the PDF**

   If resume content changed substantially, update `v2/public/Sing_Chan_Resume.pdf` to match.

4. **Test**

   ```bash
   cd v2
   npm test -- resume     # Run resume-related tests
   npm run build          # Verify build
   ```

5. **Create PR with changelog entry**

---

## Adding Writing Samples

Writing samples use the **Direct i18n Pattern** like the resume.

### Steps

1. **Add the document**

   Place the document file in `v2/public/documents/`.

2. **Edit samples data**

   Edit `v2/src/data/samples.ts` — add a new item to the appropriate `ARTIFACT_SECTIONS` entry:

   ```typescript
   {
     titleKey: 'samples.artifacts.myDocument.title',
     descriptionKey: 'samples.artifacts.myDocument.description',
     format: { label: 'PDF', href: '/documents/my-document.pdf' },
   }
   ```

3. **Add translations**

   - English: `v2/src/locales/en/samples.json`
   - French: `v2/src/locales/fr/samples.json`

4. **Test and create PR**

---

## Quarterly Dependency Review

Dependabot creates PRs automatically every Monday. This quarterly review ensures nothing falls through the cracks.

### Schedule

Run quarterly (January, April, July, October) or when Dependabot PRs accumulate.

### Steps

1. **Review open Dependabot PRs**

   ```bash
   gh pr list --label dependencies
   ```

2. **Merge patch/minor updates**

   These are grouped into single PRs by the Dependabot config. If CI passes, merge:

   ```bash
   gh pr merge <PR-number> --squash
   ```

3. **Evaluate major updates**

   Major version bumps get individual PRs. For each:
   - Read the package's changelog/migration guide
   - Check for breaking changes affecting the codebase
   - Test locally before merging

4. **Run full validation after merging**

   ```bash
   cd v2
   npm ci                  # Clean install from lock file
   npm run build           # Verify production build
   npm test                # Full test suite
   npm run lint            # Lint check
   npm run typecheck       # TypeScript check
   ```

5. **Verify no Lighthouse regression**

   Run a Lighthouse audit on the local production build and compare against baseline scores:
   - Desktop: 97–100
   - Mobile: 90–92
   - SEO: 100

---

## Monthly Performance Review

A quick health check across all monitoring tools. Takes ~15 minutes.

### Checklist

- [ ] **PostHog Analytics**
  - Review pageview trends and traffic patterns
  - Check top pages and referral sources
  - Note any unusual spikes or drops
  - Dashboard: [PostHog](https://us.posthog.com) → Sing's Portfolio project

- [ ] **Core Web Vitals (PostHog)**
  - Review `$web_vitals` events for p75 values
  - Target thresholds (Google "good" ratings):
    - LCP < 2500ms
    - CLS < 0.1
    - INP < 200ms
    - TTFB < 800ms
  - Investigate any metrics rated "poor"

- [ ] **Sentry Error Tracking**
  - Check for unresolved errors
  - Triage new issues — fix critical, dismiss noise
  - Verify source maps are resolving correctly
  - Dashboard: [Sentry](https://sentry.io) → portfolio project

- [ ] **Better Stack Uptime**
  - Verify uptime is at or above target (99.9%)
  - Review any incidents from the past month
  - Check status page is accurate
  - Dashboard: [Better Stack](https://betterstack.com)

- [ ] **Lighthouse Audit**
  - Run Lighthouse on production URL
  - Compare against baseline scores (Desktop 97–100, Mobile 90–92, SEO 100)
  - Investigate any score drops > 5 points

- [ ] **Dependabot**
  - Check for any open dependency PRs that need attention
  - Review security alerts: `gh api repos/{owner}/{repo}/dependabot/alerts --jq '.[].state'`

---

## Monitoring Dashboards

Quick reference for all monitoring services used by the project.

| Service | Purpose | Free Tier | Setup Docs |
|---------|---------|-----------|------------|
| [PostHog](https://us.posthog.com) | Web analytics + Core Web Vitals | 1M events/month | [POSTHOG_SETUP.md](../setup/POSTHOG_SETUP.md) |
| [Sentry](https://sentry.io) | Error tracking with source maps | 5K errors/month | [SENTRY_SETUP.md](../setup/SENTRY_SETUP.md) |
| [Better Stack](https://betterstack.com) | Uptime monitoring + status page | 10 monitors, 3-min intervals | External service (no code) |
| [Dependabot](https://github.com) | Automated dependency PRs | Unlimited (GitHub built-in) | `.github/dependabot.yml` |

All services are on free tiers — zero ongoing cost.
