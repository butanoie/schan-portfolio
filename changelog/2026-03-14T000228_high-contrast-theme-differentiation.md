# High-Contrast Theme — Visual Differentiation from Dark Mode

**Date:** 2026-03-14
**Time:** 00:02:28 EDT
**Type:** Feature
**Version:** 2.x

## Summary

Overhauled the high-contrast theme to be visually distinct from dark mode, implementing stark black-and-white styling with no shadows, gradients, or decorative colors. Introduced a dedicated HC override module, shared styling utilities, and component-level fixes across 34 files to achieve WCAG AAA compliance across all interactive states.

---

## Changes Implemented

### 1. HC Override Module

Dedicated `highContrastOverrides.ts` module that layers MUI component overrides on top of the base theme using `createTheme(base, overrides)` deep merge. Covers 14 MUI components: Paper, Card, AppBar, Divider, Accordion, Button, IconButton, Link, Tooltip, Chip, Skeleton, Popover, ToggleButton, Switch.

**Created:**
- `v2/src/lib/highContrastOverrides.ts` — All HC-specific MUI overrides in one auditable file
- `v2/src/utils/highContrastStyles.ts` — Shared `getHcContainerSx()` and `getHcChipSx()` helpers

### 2. Theme Engine Changes

Removed inline `palette.mode === 'highContrast'` checks from base theme factory. Added `card.hoverText` palette token to eliminate mode checks in colophon components. Added `isHighContrast` convenience field to `usePalette()` return value.

**Modified:**
- `v2/src/lib/themes.ts` — Wired `applyHighContrastOverrides`, removed 3 inline mode checks
- `v2/src/hooks/usePalette.ts` — Added `isHighContrast` derived boolean
- `v2/src/types/theme.ts` — Added `card.hoverText` to `ThemePalette`
- `v2/src/constants/colors.ts` — Added `card.hoverText` to all palettes, `BRAND_COLORS.roseHover`

### 3. Component Updates (Wave 1 — Core)

- `Footer.tsx` — HC footer bg/border, thought bubble palette wiring, nav link hover colors
- `Header.tsx` — Social icon HC hover fix
- `MainLayout.tsx` — Skip link HC styling
- `SettingsButton.tsx` — Gear icon HC hover color
- `ProjectGallery.tsx` — Shadow suppression, border hover in HC
- `ProjectImage.tsx` — HC focus-visible outline on thumbnails
- `ArtifactSection.tsx` — HC download button styling
- `ButaStory.tsx` — Removed border from decorative Paper
- `TechnologiesShowcase.tsx` / `DesignPhilosophy.tsx` — Replaced mode checks with palette token, inverted hover/focus for white card backgrounds

### 4. Component Updates (Wave 2 — Edge Cases)

- `NavButtons.tsx` — HC nav button colors via `getNavButtonSx`
- `HamburgerMenu.tsx` — Extracted `getDrawerNavItemSx` helper
- `ProjectTags.tsx` — HC chip/container styling via shared helpers
- `ResumeHeader.tsx` — HC contact button styling
- `CoreCompetencies.tsx` / `Education.tsx` / `ClientList.tsx` / `ConferenceSpeaker.tsx` — HC sidebar styling via shared helpers
- `AnimationsSwitcher.tsx` — Simplified to let MuiSwitch theme override handle HC

### 5. Test Updates

Added `ThemeContextProvider` wrappers to 6 test files that now require theme context due to `usePalette()` additions.

---

## Technical Details

### HC Design Decisions
- Shadows/elevation replaced with 1px solid borders
- Hatched diagonal stripe pattern for disabled states (not opacity)
- Focus indicators: 3px solid yellow (#FFFF00) with 2px offset
- Links always underlined
- On white card backgrounds: black hover/focus indicators (not yellow)
- Toggle buttons: black text on yellow background for hover, inverted for selected

### Key Architecture Pattern
MUI `sx` props beat `styleOverrides` in specificity. Components with hardcoded colors in `sx` must be updated at the component level — theme overrides alone cannot fix them.

---

## Validation & Testing

```
TypeScript: tsc --noEmit (pass)
ESLint: eslint . (pass)
Unit tests: 1203/1203 passed (68 test files)
E2E tests: 104/104 passed (Chromium)
axe accessibility: All 4 pages pass in highContrast theme (Chromium + WebKit)
```

---

## Impact Assessment

- High-contrast mode is now visually distinct from dark mode at a glance
- All text meets WCAG AAA contrast ratio (7:1+) in HC mode
- Shared HC styling utilities reduce future component-level boilerplate
- `isHighContrast` in `usePalette()` eliminates repeated derivation across 13+ components

---

## Related Files

| Category | Files |
|----------|-------|
| Theme engine | `highContrastOverrides.ts`, `themes.ts`, `usePalette.ts`, `theme.ts`, `colors.ts` |
| Shared utils | `highContrastStyles.ts`, `navigation.ts` |
| Components (14) | Footer, Header, MainLayout, NavButtons, HamburgerMenu, SettingsButton, AnimationsSwitcher, ProjectGallery, ProjectImage, ProjectTags, ArtifactSection, ButaStory, TechnologiesShowcase, DesignPhilosophy |
| Resume (5) | ResumePage, ResumeHeader, CoreCompetencies, Education, ClientList, ConferenceSpeaker |
| Tests (6) | Footer, HamburgerMenu, MainLayout, ProjectDescription, ProjectTagsContainer, AnimationsSwitcher |

---

## Summary Statistics

- **34 files changed**, 932 insertions, 257 deletions
- **2 new files** created (highContrastOverrides.ts, highContrastStyles.ts)
- **14 MUI components** with HC overrides
- **6 test files** updated with ThemeContextProvider wrappers
- **PR:** #159

---

## Status

COMPLETE
