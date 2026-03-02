# i18n & Theme Boundary Strategy

**Date:** 2026-03-01
**Related:** [COMPONENT_AUDIT.md](./COMPONENT_AUDIT.md), Issue #64

## Problem

This project uses two React Context-based hooks that force components to be client-side:

1. **`usePalette()`** — provides theme-aware colors via `ThemeContext`
2. **`useI18n()`** — provides translated strings via `LocaleContext`

Both rely on `useContext()`, which is a client-only React hook. Since ~35 of 48 components use one or both, the vast majority of the component tree must remain client-side.

## Current Approach: Prop-Forwarding

For the Phase 5 bundling audit, we used **prop-forwarding** to convert 5 resume sidebar components:

```
ResumePage (client boundary)
├── usePalette() → palette
├── useI18n() → t()
│
├── CoreCompetencies     ← receives cardTextColor prop
├── ResumeHeader         ← receives textPrimaryColor, textSecondaryColor props
├── Education            ← receives cardTextColor, sectionHeading props
├── ClientList           ← receives cardTextColor, sectionHeading props
└── ConferenceSpeaker    ← receives cardTextColor, sectionHeading props
```

### Benefits
- Removes per-component context subscription overhead
- Simplifies testing (no context wrappers needed)
- Makes component dependencies explicit via props

### Limitations
- **No JS bundle reduction** — since `ResumePage` is `"use client"`, all imported children are still bundled as client code regardless of whether they have `"use client"` themselves
- **Prop drilling grows** — components with many translated strings (e.g., `WorkExperience`) would need many props
- **Maintenance burden** — adding a new translated string to a converted component requires updating the parent too

## Why Context-Based i18n Limits Server Components

Next.js App Router server components cannot use `useContext()`. Our i18n system stores the user's locale preference in `localStorage` and exposes it via React Context:

```
localStorage → LocaleProvider (state) → useLocale() / useI18n()
```

This means **any component that renders user-facing text** must be a client component, since the locale is only known client-side.

## Future Options

### Option 1: CSS Custom Properties for Theme Colors

Replace `usePalette()` with CSS variables set at the root:

```css
:root[data-theme="light"] {
  --card-text: #2d2d2d;
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
}
```

```tsx
// Server component — no usePalette needed
<Typography sx={{ color: 'var(--card-text)' }}>...</Typography>
```

**Impact:** Would allow ~15 more components to become server components.
**Effort:** Medium — requires refactoring all `palette.x.y` references to CSS variables.
**Tradeoff:** Loses TypeScript type safety for color values; harder to debug in tests.

### Option 2: URL-Based Locale Routing

Switch from `localStorage` locale to URL-based routing (`/en/resume`, `/fr/resume`):

```
URL path → middleware → server-side locale → server components
```

**Impact:** Would allow all components to access locale on the server.
**Effort:** High — requires restructuring the entire routing system, updating all links.
**Tradeoff:** Major architectural change; affects SEO, URL structure, navigation.

### Option 3: next-intl or Similar Library

Adopt a server-component-aware i18n library like `next-intl`:

```tsx
// Server component with next-intl
import { getTranslations } from 'next-intl/server';

export default async function Education() {
  const t = await getTranslations('resume.education');
  return <Typography>{t('heading')}</Typography>;
}
```

**Impact:** Would allow most components to become server components.
**Effort:** High — requires replacing the entire i18n system.
**Tradeoff:** Adds a dependency; requires URL-based locale routing.

### Option 4: Status Quo (Recommended for Now)

Keep the current architecture with targeted prop-forwarding where beneficial:
- Convert simple presentational components that only need 1-2 color props
- Leave complex components (many translated strings, event handlers) as client
- Revisit when/if the app needs to scale significantly

**Rationale:** The current app is a personal portfolio with ~48 components. The performance difference between 34 and 48 client components is negligible. The prop-forwarding done in this audit provides the best cost/benefit ratio.

## Decision

We chose **Option 4** (status quo with targeted prop-forwarding) for this phase. The 6 components converted demonstrate the pattern without over-investing in an optimization with diminishing returns for a portfolio site.
