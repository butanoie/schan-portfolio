# Writing Samples Feature

**Date:** 2026-03-06
**Type:** Feature
**Branch:** sc/writing-samples-1
**Commits:** 10

## Summary

Added a new Writing Samples page to the portfolio site, providing a curated showcase of technical writing artifacts across multiple categories. The feature includes full i18n support (EN/FR), a responsive card-based layout, comprehensive test coverage, and a footer navigation fix to accommodate the new fourth nav item.

---

## Changes Implemented

### 1. Writing Samples Page & Components

New `/samples` route with a card-based artifact browser organized by category sections.

**Created:**
- `v2/app/samples/page.tsx` - Next.js page route with SEO metadata
- `v2/src/components/samples/SamplesContent.tsx` - Main page content component
- `v2/src/components/samples/ArtifactSection.tsx` - Category section with artifact cards (PDF/Markdown download support)
- `v2/src/components/samples/index.ts` - Barrel export

### 2. Data Model & Type System

Defined artifact and sample category types with a single-format-per-document data model.

**Created:**
- `v2/src/types/samples.ts` - `WritingSample`, `Artifact`, `ArtifactFormat` types
- `v2/src/data/samples.ts` - 14 writing sample artifacts across 5 categories

### 3. Writing Sample Documents

Added PDF and Markdown documents as downloadable artifacts.

**Created (14 documents):**
- `v2/public/documents/` - PDFs: Architecture Decision Record, Azure Cost Savings Report, Changelog Strategy, Front End Framework Evaluation, Interaction Design Specification, Product Knowledge Onboarding, Product Requirements Document, QA Automation Strategy, Usability Test Plan and Findings, WCAG Compliance Guide
- `v2/public/documents/` - Markdown: Defender Reduction Runbook, Elasticsearch Reduction Runbook, Phase 3/4 Gherkin Test Cases, Phase 3/4 Product Roadmaps

### 4. Internationalization (EN/FR)

Full translation coverage for all sample titles, descriptions, and UI strings.

**Created:**
- `v2/src/locales/en/samples.json` - English translations (112 lines)
- `v2/src/locales/fr/samples.json` - French translations (112 lines)

**Modified:**
- `v2/src/locales/en/common.json` - Added `nav.samples` key
- `v2/src/locales/fr/common.json` - Added `nav.samples` key
- `v2/src/lib/i18next-config.ts` - Registered `samples` namespace

### 5. Navigation Updates

Added "Samples" to the site navigation (header, footer, hamburger menu).

**Modified:**
- `v2/src/utils/navigation.ts` - Added samples nav link with `ArticleIcon`

### 6. Footer Navigation Fix (Issue #96)

Replaced pill-style `Button` components in the footer with compact text links to prevent overflow with 4 nav items.

**Modified:**
- `v2/src/components/common/Footer.tsx` - New `FooterNavLinks` component using `MuiLink` text links separated by middot characters; removed `NavButtons` import
- `v2/src/__tests__/components/common/Footer.test.tsx` - Updated active page test to check `aria-current` instead of button class; added `nav.samples` mock translation

### 7. SEO

**Modified:**
- `v2/app/sitemap.ts` - Added `/samples` to sitemap

**Created:**
- `v2/src/constants/seo.ts` - SEO metadata constants for the samples page

### 8. Documentation

**Created:**
- `docs/active/ARTIFACTS.md` - Writing samples content guide
- `docs/active/ARTIFACTS_PAGE_PLAN.md` - Feature planning document

### 9. Hero Images

**Created:**
- `v2/public/images/tasty_morsels@2x-en.png` - English hero image
- `v2/public/images/tasty_morsels@2x-fr.png` - French hero image

---

## Technical Details

### Artifact Data Model

Each artifact has a single format (PDF or Markdown) with a direct file path:

```typescript
interface Artifact {
  id: string;
  titleKey: string;
  descriptionKey: string;
  format: 'pdf' | 'md';
  filePath: string;
  available: boolean;
}
```

### Footer Nav Refactor

Footer navigation uses text links instead of buttons to save horizontal space:

```tsx
<MuiLink
  component={Link}
  href={link.href}
  underline={active ? "always" : "hover"}
  aria-current={active ? "page" : undefined}
  sx={{ color: NAV_COLORS.text, fontWeight: active ? 700 : 600 }}
>
  {t(link.labelKey)}
</MuiLink>
```

### Accessibility

- Unavailable artifact cards use dashed borders (not opacity) per WCAG contrast requirements
- Footer links maintain WCAG 2.2 AA contrast (white on sage green)
- Active page indicated via `aria-current="page"`

---

## Validation & Testing

### Test Coverage

| Test Suite | Tests |
|---|---|
| `ArtifactSection.test.tsx` | Card rendering, download links, unavailable states |
| `SamplesContent.test.tsx` | Page structure, section rendering, i18n |
| `samples.test.ts` | Data integrity, type validation |
| `Footer.test.tsx` | Updated for text link nav, samples translation |
| `navigation.test.ts` | Updated for samples nav link |

- **All 1174 tests passing** across 61 test files

---

## Related Files

### Created (28 files)
- `v2/app/samples/page.tsx`
- `v2/src/components/samples/SamplesContent.tsx`
- `v2/src/components/samples/ArtifactSection.tsx`
- `v2/src/components/samples/index.ts`
- `v2/src/types/samples.ts`
- `v2/src/data/samples.ts`
- `v2/src/constants/seo.ts`
- `v2/src/locales/en/samples.json`
- `v2/src/locales/fr/samples.json`
- `v2/src/__tests__/components/samples/ArtifactSection.test.tsx`
- `v2/src/__tests__/components/samples/SamplesContent.test.tsx`
- `v2/src/__tests__/data/samples.test.ts`
- `v2/public/images/tasty_morsels@2x-en.png`
- `v2/public/images/tasty_morsels@2x-fr.png`
- `v2/public/documents/` (14 document files)
- `docs/active/ARTIFACTS.md`
- `docs/active/ARTIFACTS_PAGE_PLAN.md`

### Modified (7 files)
- `v2/src/components/common/Footer.tsx`
- `v2/src/__tests__/components/common/Footer.test.tsx`
- `v2/src/utils/navigation.ts`
- `v2/src/__tests__/utils/navigation.test.ts`
- `v2/src/lib/i18next-config.ts`
- `v2/src/locales/en/common.json`
- `v2/src/locales/fr/common.json`
- `v2/app/sitemap.ts`
- `v2/src/types/index.ts`

---

## Summary Statistics

| Metric | Value |
|---|---|
| Total commits | 10 |
| Files changed | 41 |
| Lines added | ~7,954 |
| Lines removed | ~25 |
| Writing sample documents | 14 |
| New test files | 3 |
| Languages supported | 2 (EN, FR) |
| Issues closed | #96 |

---

## Status

COMPLETE
