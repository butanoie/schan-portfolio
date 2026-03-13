# E2E Content Pages — 13 Tests for Resume, Colophon, and Samples

**Date:** 2026-03-13
**Time:** 07:54:28 PDT
**Type:** Feature
**Phase:** Phase 8.11
**Version:** v2.x

## Summary

Added E2E specs for all three content pages (Resume, Colophon, Samples) with 13 tests covering section presence, interactive behavior, download links, and French locale verification. Fixed a MUI Accordion duplicate-ID bug in the ColophonPage POM that caused Playwright strict mode violations.

---

## Changes Implemented

### 1. Resume Spec (`resume.spec.ts`)

4 tests verifying content page fundamentals:
- **Section presence** — all 7 `aria-labelledby` sections visible
- **Contact links** — LinkedIn, GitHub, mailto, tel href patterns via CSS attribute selectors
- **PDF download** — visible link with `.pdf` href and "(opens in new tab)" aria-label
- **French locale** — seeded locale verifies "Résumé professionnel" and "Expérience professionnelle"

**Created:**
- `v2/e2e/specs/resume.spec.ts` (139 lines)

### 2. Colophon Spec (`colophon.spec.ts`)

5 tests covering sections and accordion interaction:
- **Section presence** — technologies, design philosophy, buta story (sr-only heading)
- **V1 accordion default state** — collapsed with `aria-expanded="false"`
- **V1 accordion toggle** — expand/collapse with `aria-expanded` and content visibility
- **Technology card links** — `visit .+ website` aria-label pattern
- **French locale** — "Conception et typographie", "L'histoire de Buta"

**Created:**
- `v2/e2e/specs/colophon.spec.ts` (149 lines)

### 3. Samples Spec (`samples.spec.ts`)

4 tests covering artifacts and download edge cases:
- **Section presence** — 5 artifact sections via positional (locale-independent) access
- **Download buttons** — all carry PDF or Markdown format in aria-labels
- **Cost Savings edge case** — 4 cards, only 3 download links (roadmap has no format)
- **French locale** — "Définir la vision", "Mesurer l'impact"

**Created:**
- `v2/e2e/specs/samples.spec.ts` (156 lines)

### 4. ColophonPage POM Fix

Fixed `v1AccordionContent` locator — MUI Accordion wraps `AccordionDetails` in a `region` div that also receives the `aria-controls` target ID, creating duplicate `#v1-technologies-content` elements. Scoped to `.MuiAccordionDetails-root` inside the accordion.

**Modified:**
- `v2/e2e/pages/ColophonPage.ts` (+6/-1 lines)

---

## Technical Details

### Selector Patterns

| Page | Selector Strategy | Example |
|------|------------------|---------|
| Resume | `aria-labelledby` + CSS `[href]` | `a[href*="linkedin.com"]` |
| Colophon | `aria-labelledby` + `.MuiAccordionDetails-root` | `#v1-accordion .MuiAccordionDetails-root` |
| Samples | `section[aria-label]` positional `.nth(index)` | `allArtifactSections().nth(4)` |

### Locale Testing

All French locale tests use the seed approach (`seedLocale(page, 'fr')` before `goto()`) rather than runtime settings panel switching — faster and avoids re-testing the locale mechanism.

### Gotchas Discovered

1. **MUI Accordion duplicate IDs** — `AccordionDetails` + region wrapper both get same `id`
2. **Playwright `filter({ has })` matches children only** — use CSS attribute selectors for self-filtering
3. **JSDoc `check-indentation`** — continuation lines must not have extra indentation alignment

---

## Validation & Testing

```
✅ npm run lint          — 0 errors, 0 warnings
✅ npm run typecheck     — clean
✅ npm run format:check  — clean (new files formatted)
✅ npx playwright test   — 194 passed (0 failed), including 26 new tests (13 × 2 browsers)
```

---

## Impact Assessment

- Closes issue #138 (Phase 8.11: E2E — Resume, Colophon, Samples Pages)
- Content pages now have E2E coverage for section rendering, interactions, and i18n
- POM fix prevents future Playwright strict mode violations with the V1 accordion

---

## Related Files

**Created:**
- `v2/e2e/specs/resume.spec.ts`
- `v2/e2e/specs/colophon.spec.ts`
- `v2/e2e/specs/samples.spec.ts`

**Modified:**
- `v2/e2e/pages/ColophonPage.ts`

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| New spec files | 3 |
| New tests | 13 |
| Total test runs (× browsers) | 26 |
| Lines added | ~444 |
| POM lines changed | +6/−1 |
| Full suite result | 194 passed |

---

## Status

✅ COMPLETE
