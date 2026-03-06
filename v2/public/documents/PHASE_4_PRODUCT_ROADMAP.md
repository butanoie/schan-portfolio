# Phase 4: Enhanced Features — Product Roadmap

**Created:** 2026-03-03
**Author:** Sing Chan (with Claude)
**Phase Duration:** 2-3 weeks (2026-02-02 to 2026-02-08)
**Status:** Completed
**Format:** SAFe (Epics, Features, PBIs)
**Companion:** [Phase 4 Gherkin Test Cases](PHASE_4_GHERKIN_TEST_CASES.md)

---

## Epic 4.1: Theme Switching

**Business Value:** Support user visual preferences (light, dark, high contrast) to improve readability, reduce eye strain, and demonstrate accessibility leadership. High contrast exceeds WCAG AAA.

**Lean Business Case:** Theme switching is a baseline expectation for modern web apps and a direct signal of accessibility commitment to enterprise employers evaluating the portfolio.

**Success Metrics:** Three themes functional, preference persists across sessions, switch under 100ms, no layout shift, AA on light/dark, AAA on high contrast.

---

### Feature 4.1.1: Theme Definitions

#### PBI 4.1.1.1: Theme Configuration File

> **Test Cases:** [PBI 4.1.1.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4111-theme-configuration-file)

**Description:** Create `v2/src/lib/themes.ts` (350+ lines) defining three complete MUI theme configurations.

Light: background #FFFFFF, text #1A1A1A, primary Sage Green #8BA888, secondary Maroon #8B1538, accents Sky Blue/Duck Egg.

Dark: background #121212, text #F5F5F5, primary #A8D5A8, secondary #E85775, surface elevations #1F1F1F to #2A2A2A.

High Contrast: background #000000, text #FFFFFF, links white+underline, focus yellow #FFFF00, no gradients.

```tsx
type ThemeMode = 'light' | 'dark' | 'highContrast';

interface ThemePalette {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: { primary: string; secondary: string; disabled: string };
  borders: string;
  accents: { blue: string; green: string; red: string };
}
```

**Acceptance Criteria:**

- Three complete MUI theme objects with palette, typography, and component overrides
- Light/Dark meet WCAG AA contrast (4.5:1 text, 3:1 UI)
- High contrast meets WCAG AAA (7:1+ text)
- JSDoc on all exports and types
- Verified with WebAIM Contrast Checker

---

### Feature 4.1.2: Theme Provider Infrastructure

#### PBI 4.1.2.1: ThemeProvider Component

> **Test Cases:** [PBI 4.1.2.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4121-themeprovider-component)

**Description:** Create `v2/src/components/theme/ThemeProvider.tsx` wrapping MUI ThemeProvider with SSR-safe init and localStorage persistence.

**Acceptance Criteria:**

- Wraps children in MUI ThemeProvider with selected theme
- Reads from localStorage, falls back to system preference, then light
- Persists selection on change
- No hydration mismatch between server and client
- Theme transitions: 150ms ease-in-out, disabled for `prefers-reduced-motion`
- JSDoc, unit tests for init, persistence, SSR safety

#### PBI 4.1.2.2: useTheme and useColorMode Hooks

> **Test Cases:** [PBI 4.1.2.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4122-usetheme-and-usecolormode-hooks)

**Description:** Create `v2/src/hooks/useTheme.ts` for theme state and `v2/src/hooks/useColorMode.ts` for system dark mode detection.

```tsx
function useTheme(): { mode: ThemeMode; setMode: (mode: ThemeMode) => void };
function useColorMode(): { isDarkMode: boolean };
```

**Acceptance Criteria:**

- `useTheme` reads/writes preference, triggers re-render
- `useColorMode` detects system preference via `matchMedia`
- Both update reactively on system change
- Unit tests for all states

---

### Feature 4.1.3: Theme Switcher UI

#### PBI 4.1.3.1: Settings Button and Theme Switcher

> **Test Cases:** [PBI 4.1.3.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4131-settings-button-and-theme-switcher)

**Description:** Create `SettingsButton.tsx` with popover containing `ThemeSwitcher.tsx` for cycling themes.

**Acceptance Criteria:**

- Settings button: gear icon, 44x44px touch target
- Popover with theme options (icon, label, active indicator)
- Keyboard: Enter/Space to open, arrows to navigate, Escape to close
- `aria-expanded` on trigger, `role="listbox"` on options
- Focus trapped in popover, screen reader announces changes via `aria-live`
- Unit tests for cycling, keyboard, accessibility

---

### Feature 4.1.4: Component Theme Integration

#### PBI 4.1.4.1: Update All Components with Theme-Aware Styling

> **Test Cases:** [PBI 4.1.4.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4141-update-all-components-with-theme-aware-styling)

**Description:** Replace hardcoded colors with theme tokens in all components.

```tsx
sx={{
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background,
  transition: 'all 150ms ease-in-out',
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
}}
```

**Acceptance Criteria:**

- No hardcoded color values remain
- All components render correctly in all three themes
- Contrast verified per theme
- No layout shift on theme change
- 833+ total tests passing (41 new theme tests)

---

## Epic 4.2: Internationalization (i18n)

**Business Value:** Externalize all user-facing strings into locale files for future multi-language support, demonstrating enterprise localization practices.

**Lean Business Case:** i18n infrastructure shows product maturity. French support demonstrates localization capability for Canadian and international employers.

**Success Metrics:** All strings externalized, English and French complete, locale-aware formatting, zero hardcoded user-facing text.

---

### Feature 4.2.1: i18n Library Setup

#### PBI 4.2.1.1: i18next Configuration

> **Test Cases:** [PBI 4.2.1.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4211-i18next-configuration)

**Description:** Create `v2/src/lib/i18n.ts` (250+ lines) configuring i18next with React hooks, namespaces, and SSR compatibility.

Namespaces: `common.json` (buttons, labels, nav), `pages.json` (page content), `meta.json` (SEO strings).

**Acceptance Criteria:**

- i18next configured with react-i18next bindings
- Namespace-based organization
- SSR-compatible (no hydration mismatch)
- TypeScript type safety for keys
- English fallback for missing translations
- JSDoc on all config exports

---

### Feature 4.2.2: Locale Files

#### PBI 4.2.2.1: English Locale Files

> **Test Cases:** [PBI 4.2.2.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4221-english-locale-files)

**Description:** Create JSON locale files for all English strings. Files: `v2/src/locales/en/common.json`, `resume.json`, `colophon.json`, `home.json`, `projects.json`.

**Acceptance Criteria:**

- All user-facing strings extracted into JSON
- Consistent dot-separated key naming
- No hardcoded English in components
- Projects: JSON merge pattern (title, desc, circa, captions)
- Pages: direct `t()` call pattern

#### PBI 4.2.2.2: French Locale Files

> **Test Cases:** [PBI 4.2.2.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4222-french-locale-files)

**Description:** French translations via DeepL. Files mirror English structure in `v2/src/locales/fr/`.

**Acceptance Criteria:**

- Complete French translations for all strings
- Professional quality (no machine-translation artifacts)
- Same JSON structure/keys as English
- Switching to French renders all content without key fallbacks

---

### Feature 4.2.3: i18n Hooks and Component Integration

#### PBI 4.2.3.1: useI18n and useLocale Hooks

> **Test Cases:** [PBI 4.2.3.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4231-usei18n-and-uselocale-hooks)

**Description:** Create hooks for translation lookup and locale state management.

```tsx
const { t } = useI18n();
return <Button>{t('buttons.loadMore')}</Button>;
```

**Acceptance Criteria:**

- `useI18n` returns `t()` scoped to correct namespace
- `useLocale` manages locale state with setter
- Language switch triggers re-render of all translated content
- Unit tests for lookup and switching

#### PBI 4.2.3.2: Update All Components with i18n

> **Test Cases:** [PBI 4.2.3.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4232-update-all-components-with-i18n)

**Description:** Replace hardcoded strings with `t()` calls in Header, Footer, ProjectCard, ResumeHeader, and all other user-facing text.

**Acceptance Criteria:**

- Zero hardcoded user-facing text in components
- Renders correctly in English and French
- Missing keys fall back to English
- No TypeScript errors introduced

---

### Feature 4.2.4: Locale-Aware Formatting

#### PBI 4.2.4.1: Date, Number, and Currency Formatting

> **Test Cases:** [PBI 4.2.4.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4241-date-number-and-currency-formatting)

**Description:** Locale-aware formatting via `Intl` API with caching.

```tsx
formatDate(new Date(2025, 0, 1), 'en-US'); // "January 1, 2025"
formatDate(new Date(2025, 0, 1), 'fr');    // "1 janvier 2025"
```

**Acceptance Criteria:**

- Dates/numbers format per active locale
- Intl instances cached for performance
- Currency formatting prepared for future use
- Unit tests for English and French

---

### Feature 4.2.5: Language Switcher UI

#### PBI 4.2.5.1: LanguageSwitcher Component

> **Test Cases:** [PBI 4.2.5.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4251-languageswitcher-component)

**Description:** Create `LanguageSwitcher.tsx` in Settings popover alongside theme switcher.

**Acceptance Criteria:**

- Language options in Settings popover with active indicator
- Switching updates all content immediately
- Preference persisted, `<html lang="">` updates
- Keyboard accessible, screen reader announces change
- Unit tests

---

### Feature 4.2.6: Localization Documentation

#### PBI 4.2.6.1: Translation Workflow Guide

> **Test Cases:** [PBI 4.2.6.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4261-translation-workflow-guide)

**Description:** Create `docs/guides/TRANSLATION_WORKFLOW.md` documenting both localization patterns and how to add translations.

**Acceptance Criteria:**

- Documents JSON merge pattern (projects) and direct i18n pattern (pages)
- Step-by-step for adding new strings
- DeepL integration instructions
- Examples for each pattern

---

## Epic 4.3: Animations & Transitions

**Business Value:** Visual polish through scroll animations, hover effects, and transitions while respecting `prefers-reduced-motion`.

**Lean Business Case:** Subtle animations signal design maturity. Full reduced-motion support demonstrates accessibility-first thinking.

**Success Metrics:** 60fps animations, all disabled when reduced motion preferred, 60 new tests, zero performance regressions.

---

### Feature 4.3.1: Animation Hooks

#### PBI 4.3.1.1: useReducedMotion Hook

> **Test Cases:** [PBI 4.3.1.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4311-usereducedmotion-hook)

**Description:** Create `v2/src/hooks/useReducedMotion.ts` detecting `prefers-reduced-motion`.

```tsx
function useReducedMotion(): boolean;
```

**Acceptance Criteria:**

- Reads `prefers-reduced-motion: reduce` via `matchMedia`
- Updates reactively on system change
- SSR-safe (defaults false on server)
- Unit tests for both states

#### PBI 4.3.1.2: useScrollAnimation Hook

> **Test Cases:** [PBI 4.3.1.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4312-usescrollanimation-hook)

**Description:** Create `v2/src/hooks/useScrollAnimation.ts` using Intersection Observer for fade-in.

```tsx
function useScrollAnimation(options?: IntersectionObserverInit): {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
};
```

**Acceptance Criteria:**

- Returns ref and visibility from Intersection Observer
- Configurable threshold/root margin
- Sets `isVisible: true` immediately when reduced motion preferred
- Cleans up on unmount
- Unit tests

---

### Feature 4.3.2: Global Animation Styles

#### PBI 4.3.2.1: Animations CSS

> **Test Cases:** [PBI 4.3.2.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4321-animations-css)

**Description:** Create `v2/src/styles/animations.css` with keyframes and global reduced-motion override.

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Acceptance Criteria:**

- Keyframes: fadeIn, slideUp, shimmer, scaleIn
- Global reduced-motion override disables all animations
- No layout shift from animations

---

### Feature 4.3.3: Component Animation Integration

#### PBI 4.3.3.1: ProjectsList Scroll Animations

> **Test Cases:** [PBI 4.3.3.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4331-projectslist-scroll-animations)

**Description:** Apply scroll-triggered fade-in to projects using `useScrollAnimation`.

**Acceptance Criteria:**

- Projects fade in on scroll into viewport
- Disabled when reduced motion preferred
- No cumulative layout shift, 60fps
- Unit tests

#### PBI 4.3.3.2: Lightbox Transitions

> **Test Cases:** [PBI 4.3.3.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4332-lightbox-transitions)

**Description:** Smooth transitions for lightbox open/close and image navigation.

**Acceptance Criteria:**

- Fade on open/close, slide between images
- Disabled when reduced motion preferred
- Unit tests

#### PBI 4.3.3.3: Project Image Hover Effects

> **Test Cases:** [PBI 4.3.3.3 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4333-project-image-hover-effects)

**Description:** Hover animations on `ProjectImage.tsx` thumbnails (scale, shadow, opacity).

**Acceptance Criteria:**

- Scale/shadow on hover, opacity transition on gallery thumbnails
- Disabled when reduced motion preferred
- 60 new tests total across animation features

---

## Epic 4.4: WCAG 2.2 Level AA Compliance

**Business Value:** Full WCAG 2.2 AA compliance across all pages, establishing the portfolio as a reference implementation of accessibility standards.

**Lean Business Case:** Accessibility compliance is non-negotiable for enterprise clients (DoD 5015.2, FedRAMP). Demonstrating compliance on the portfolio validates accessibility expertise.

**Success Metrics:** Zero violations, 8 test files, 120+ test cases, 1,117 total tests, 87.35% coverage.

---

### Feature 4.4.1: Testing Infrastructure

#### PBI 4.4.1.1: axe-core Test Helpers

> **Test Cases:** [PBI 4.4.1.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4411-axe-core-test-helpers)

**Description:** Create `v2/src/__tests__/utils/axe-helpers.ts` (~150 lines) with reusable a11y testing utilities.

```tsx
runAxe(container)            // Execute axe audit
testAccessibility(container) // Full WCAG 2.2 AA suite
canReceiveFocus(element)     // Check focusability
hasAccessibleName(element)   // Verify naming
```

**Acceptance Criteria:**

- All helpers with JSDoc
- Configurable rule inclusion/exclusion
- Integrates with vitest-axe matchers
- Unit tests for helpers

#### PBI 4.4.1.2: Vitest axe-core Configuration

> **Test Cases:** [PBI 4.4.1.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4412-vitest-axe-core-configuration)

**Description:** Update `v2/vitest.setup.ts` with axe-core WCAG 2.2 AA rules.

**Acceptance Criteria:**

- vitest-axe matchers registered globally
- Color-contrast, region, landmark rules enabled
- Configuration documented

---

### Feature 4.4.2: WCAG Violation Remediation

#### PBI 4.4.2.1: Touch Target Size Fixes

> **Test Cases:** [PBI 4.4.2.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4421-touch-target-size-fixes)

**Description:** Update Header icon buttons to 44x44px minimum (WCAG 2.5.8).

**Acceptance Criteria:**

- LinkedIn, GitHub buttons: medium size, explicit 44px min dimensions
- SettingsButton: medium icon size
- Verified with manual measurement

#### PBI 4.4.2.2: Image Contrast Fix

> **Test Cases:** [PBI 4.4.2.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4422-image-contrast-fix)

**Description:** Update `ProjectGallery.tsx` thumbnail opacity from 0.4 to 0.85 (WCAG 1.4.11).

**Acceptance Criteria:**

- Opacity 0.85, smooth hover transition
- Meets 3:1 non-text contrast
- Transition respects reduced motion

---

### Feature 4.4.3: Comprehensive Accessibility Tests

#### PBI 4.4.3.1: Component Accessibility Test Suite

> **Test Cases:** [PBI 4.4.3.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4431-component-accessibility-test-suite)

**Description:** Create 8 test files: Header, SettingsButton, ProjectGallery, Footer, MainLayout, ThemeSwitcher, LanguageSwitcher, Lightbox.

**Acceptance Criteria:**

- Each file runs axe audit on rendered component
- Keyboard navigation tested (Tab, Enter, Space, Escape, arrows)
- Focus management verified (trap, return, visible indicators)
- ARIA attributes validated
- 120+ test cases, all passing
- 1,117 total tests across suite

---

### Feature 4.4.4: Accessibility Audit Verification

#### PBI 4.4.4.1: WCAG 2.2 AA Criteria Checklist

> **Test Cases:** [PBI 4.4.4.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4441-wcag-22-aa-criteria-checklist)

**Description:** Verify all criteria across every page.

Key criteria: 1.1.1 Non-text Content, 1.4.3 Contrast Minimum, 1.4.11 Non-text Contrast, 2.1.1 Keyboard, 2.4.3 Focus Order, 2.4.7 Focus Visible, 2.5.8 Target Size, 3.1.1 Language, 4.1.2 Name/Role/Value.

**Acceptance Criteria:**

- All criteria verified and documented
- Zero violations on any page
- Manual screen reader testing (NVDA, VoiceOver)
- Keyboard navigation on all pages
- Results in compliance guide

---

### Feature 4.4.5: Accessibility Documentation

#### PBI 4.4.5.1: Accessibility Statement

> **Test Cases:** [PBI 4.4.5.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4451-accessibility-statement)

**Description:** Create `docs/accessibility/ACCESSIBILITY_STATEMENT.md` (~400 lines).

**Acceptance Criteria:**

- References WCAG 2.2 AA, Section 508, ADA
- Features list, testing methodology, known limitations, feedback contact

#### PBI 4.4.5.2: WCAG Compliance Guide

> **Test Cases:** [PBI 4.4.5.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4452-wcag-compliance-guide)

**Description:** Create `docs/accessibility/WCAG_COMPLIANCE_GUIDE.md` (~500 lines).

**Acceptance Criteria:**

- Every AA criterion mapped to implementation with code examples
- Compliance verification matrix

#### PBI 4.4.5.3: Testing Checklist and Developer Guide

> **Test Cases:** [PBI 4.4.5.3 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4453-testing-checklist-and-developer-guide)

**Description:** Create testing checklist (~300 lines) and developer guide (~250 lines).

**Acceptance Criteria:**

- Keyboard, screen reader, visual, zoom, animation testing steps
- Browser compatibility matrix
- Test patterns and templates
- How to run and write a11y tests

---

## Epic 4.5: SEO Optimization

**Business Value:** Search engine visibility, social media previews, and crawling infrastructure for portfolio discoverability.

**Lean Business Case:** Portfolio is the primary discovery surface for career opportunities. SEO directly impacts visibility to recruiters searching for product/UX/development talent.

**Success Metrics:** Lighthouse SEO 100/100, structured data validates, social previews on Twitter/LinkedIn/Facebook, sitemap and robots.txt accessible.

---

### Feature 4.5.1: SEO Constants and Utilities

#### PBI 4.5.1.1: SEO Constants

> **Test Cases:** [PBI 4.5.1.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4511-seo-constants)

**Description:** Create `v2/src/constants/seo.ts` with SITE_URL, AUTHOR, SOCIAL_LINKS, SITE_METADATA, PAGE_METADATA.

**Acceptance Criteria:**

- Single source of truth for all SEO values
- JSDoc on all exports, zero TypeScript errors

#### PBI 4.5.1.2: SEO Utilities Library

> **Test Cases:** [PBI 4.5.1.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4512-seo-utilities-library)

**Description:** Create `v2/src/lib/seo.ts` with JSON-LD schema generators.

```tsx
generatePersonSchema()      // Site author
generateBreadcrumbSchema()  // Navigation
generateProjectSchema()     // CollectionPage
stripHtml(str)              // Remove tags
truncate(str, max)          // Cap at 160 chars
```

**Acceptance Criteria:**

- Validates with Google Rich Results Test
- Handles HTML in project descriptions
- Optional chaining for missing images
- JSDoc on all functions

---

### Feature 4.5.2: Page Metadata

#### PBI 4.5.2.1: Root Layout Metadata

> **Test Cases:** [PBI 4.5.2.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4521-root-layout-metadata)

**Description:** Enhance `v2/app/layout.tsx` with metadata export and Person JSON-LD.

```tsx
export const metadata: Metadata = {
  title: { default: "Sing Chan's Portfolio", template: '%s | Sing Chan' },
  openGraph: { type: 'website', url: SITE_URL, images: ['/og-image.png'] },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: SITE_URL },
};
```

**Acceptance Criteria:**

- Title template, OG tags, Twitter cards, canonical URL
- Person JSON-LD in script tag
- Theme color meta tags
- All visible in DevTools head

#### PBI 4.5.2.2: Page-Specific Metadata

> **Test Cases:** [PBI 4.5.2.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4522-page-specific-metadata)

**Description:** Metadata on homepage, resume (layout wrapper), and colophon.

**Acceptance Criteria:**

- Unique title, description, canonical per page
- Resume uses layout wrapper (client component constraint)
- All pages render correctly with metadata

---

### Feature 4.5.3: Crawling Infrastructure

#### PBI 4.5.3.1: Dynamic Sitemap

> **Test Cases:** [PBI 4.5.3.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4531-dynamic-sitemap)

**Description:** Create `v2/app/sitemap.ts` for XML sitemap.

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/resume`, priority: 0.8 },
    { url: `${SITE_URL}/colophon`, priority: 0.5 },
  ];
}
```

**Acceptance Criteria:**

- Accessible at `/sitemap.xml`, valid XML
- All current routes included
- Extensible for future project pages

#### PBI 4.5.3.2: Robots.txt

> **Test Cases:** [PBI 4.5.3.2 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4532-robotstxt)

**Description:** Create `v2/app/robots.ts`.

**Acceptance Criteria:**

- Accessible at `/robots.txt`
- Allows all crawlers, references sitemap

---

### Feature 4.5.4: Social Preview Assets

#### PBI 4.5.4.1: OG Image and Humans.txt

> **Test Cases:** [PBI 4.5.4.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4541-og-image-and-humanstxt)

**Description:** Add `v2/public/og-image.png` (1200x630px) and `v2/public/humans.txt`.

**Acceptance Criteria:**

- OG image referenced in layout metadata
- humans.txt accessible with author credits
- Previews render on Facebook, Twitter, LinkedIn

---

### Feature 4.5.5: SEO Validation

#### PBI 4.5.5.1: Testing and Verification

> **Test Cases:** [PBI 4.5.5.1 Test Scenarios](PHASE_4_GHERKIN_TEST_CASES.md#pbi-4551-testing-and-verification)

**Description:** Validate all SEO through automated and manual testing.

**Acceptance Criteria:**

- `npm run build` succeeds
- `/sitemap.xml` and `/robots.txt` accessible
- All meta tags in head
- Person schema validates (Google Rich Results, schema.org)
- Social previews verified (Facebook Debugger, Twitter Validator, LinkedIn Inspector)
- Lighthouse SEO: 100/100
- Sitemap submitted to Google Search Console and Bing Webmaster Tools

---

## Cross-Cutting: Quality Standards

All PBIs must meet:

- JSDoc on all exported components, functions, interfaces, types
- TypeScript strict mode: zero errors
- ESLint: zero errors including jsx-a11y
- Unit test coverage: 80%+ for new code
- WCAG 2.2 Level AA on all interactive elements
- Animations respect `prefers-reduced-motion`
- Touch targets: 44x44px minimum
- Bundle size increase under 50KB per feature

### Definition of Done

- Code reviewed and merged
- All unit tests passing
- TypeScript type-check and ESLint pass
- Manual accessibility check (keyboard, screen reader)
- Renders correctly in all three themes
- Text renders correctly in English and French

---

## Phase 4 Actuals

| Metric | Target | Actual |
|--------|--------|--------|
| Total Tests | 900+ | 1,117 |
| Test Coverage | 80%+ | 87.35% |
| A11y Test Cases | 100+ | 120+ |
| WCAG Violations | 0 | 0 |
| Lighthouse A11y | 100 | 100 |
| TypeScript Errors | 0 | 0 |
| ESLint Violations | 0 | 0 |
| Theme Switch | <100ms | Achieved |
| Bundle Increase | <50KB/feature | Within target |
