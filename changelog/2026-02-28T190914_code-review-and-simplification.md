# Code Review, Simplification, and Bug Fixes

**Date:** 2026-02-28
**Time:** 19:09:14 EST
**Type:** Refactoring / Bug Fix
**Version:** v2.x

## Summary

Follow-up to the simplify refactoring changelog (2026-02-27T211218). Extracted shared components to eliminate duplication, fixed a `prefers-reduced-motion` accessibility bug, corrected `"use client"` directive placement across 10 files, and resolved multiple stale/inaccurate JSDoc issues found during code review. Also updated CLAUDE.md with new refactoring safety rules based on issue #54.

---

## Changes Implemented

### 1. Shared Component Extraction

Extracted two new shared components to eliminate duplicated rendering patterns.

**Created:**
- `v2/src/components/common/NavButtons.tsx` — Navigation button rendering shared between Header and Footer (previously duplicated mapping over `getNavLinks()`)
- `v2/src/components/settings/SettingsList.tsx` — Settings sections shared between SettingsButton popover and HamburgerMenu drawer, with optional `separator` prop

**Modified:**
- `v2/src/components/common/Header.tsx` — Replaced inline nav mapping with `<NavButtons />` (~20 lines removed)
- `v2/src/components/common/Footer.tsx` — Same treatment (~15 lines removed)
- `v2/src/components/settings/SettingsButton.tsx` — Replaced inline settings with `<SettingsList separator={<Divider />} />`
- `v2/src/components/common/HamburgerMenu.tsx` — Uses `<SettingsList />`, computed `isActivePath` once per iteration, extracted `DRAWER_ICON_BUTTON_SX` constant

### 2. Accessibility Bug Fix (#59)

`ScrollAnimatedSection` used `animationsEnabled` instead of `shouldAnimate` for its CSS transition guard, ignoring OS-level `prefers-reduced-motion`. The JSDoc claimed it respected both signals but only checked the user toggle. Fixed to use `shouldAnimate` (which combines `animationsEnabled && !prefersReducedMotion`), consistent with `ProjectSkeleton` and `LoadMoreButton`.

**Modified:**
- `v2/src/components/common/ScrollAnimatedSection.tsx` — `animationsEnabled` → `shouldAnimate`
- `v2/src/__tests__/components/common/ScrollAnimatedSection.test.tsx` — Updated mock accordingly

### 3. `"use client"` Directive Fixes

Moved `"use client"` above JSDoc module comments in 10 files. The directive must be the first statement in a file for Next.js App Router to recognize it as a client component — having a JSDoc block before it could cause it to be silently ignored.

**Modified:**
- `v2/src/components/settings/SettingsButton.tsx`
- `v2/src/components/settings/ThemeSwitcher.tsx`
- `v2/src/components/settings/LanguageSwitcher.tsx`
- `v2/src/components/settings/AnimationsSwitcher.tsx`
- `v2/src/hooks/useAnimations.ts`
- `v2/src/hooks/usePalette.ts`
- `v2/src/hooks/useTheme.ts`
- `v2/src/hooks/useI18n.ts`
- `v2/src/contexts/ThemeContext.tsx`
- `v2/src/contexts/AnimationsContext.tsx`

### 4. JSDoc and Documentation Fixes

Fixed multiple stale or inaccurate JSDoc comments found during code review.

- `v2/src/components/project/ProjectGallery.tsx` — Corrected stale JSDoc
- `v2/src/components/project/ProjectDetail.tsx` — Corrected stale JSDoc
- `v2/src/components/common/MainLayout.tsx` — Clarified that `effectiveLoadingState` is the primary stale-state guard (not `handleStateChange`)
- `v2/src/hooks/usePalette.ts` — Documented that both `palette` and `mode` are overridden to `"light"` during hydration-safe SSR
- `v2/src/hooks/useTheme.ts` — Corrected stale JSDoc
- `v2/src/components/settings/SettingsList.tsx` — Fixed "Factory" → "Switcher component" for `ComponentType` field

### 5. Component Storage Pattern Fix

Changed `SettingsList` to store component references (`ThemeSwitcher`) instead of pre-rendered JSX instances (`<ThemeSwitcher />`) in the module-level constant. Creating React elements outside a render cycle is an anti-pattern — each consumer should render its own component instance.

### 6. MUI Spacing Fix

Fixed `PageDeck.tsx` `mx` values from strings (`"2"`, `"10"`) to numbers (`2`, `10`). MUI interprets string values as raw CSS units (`2px`) rather than theme spacing multipliers (`16px`).

### 7. Other Cleanups

- `v2/src/constants/colors.ts` — Added `BRAND_COLORS.maroonHover` constant
- `v2/src/hooks/index.ts` — Added missing `useTheme` barrel export
- `v2/src/contexts/AnimationsContext.tsx`, `ThemeContext.tsx` — Removed unused `React` namespace imports
- `v2/src/utils/sanitization.ts` — Inlined config, removed trailing blank line
- `v2/src/components/common/HamburgerMenu.tsx` — Fixed imports placed after a const declaration

### 8. CLAUDE.md Updates

- Added **JSDoc review on modification** rule to Documentation Enforcement
- Added **Refactoring Safety** section based on issue #54 — requires checking git history before removing code, verifying behavioral equivalence, and prohibiting inaccurate comments

---

## Technical Details

### `shouldAnimate` vs `animationsEnabled`

```typescript
// useAnimations.ts
const shouldAnimate = animationsEnabled && !prefersReducedMotion;
```

`shouldAnimate` is the combined signal that respects both the user's in-app toggle and OS-level `prefers-reduced-motion`. Components controlling motion should always use `shouldAnimate`, not the raw `animationsEnabled`.

### `"use client"` Directive Placement

```typescript
// WRONG — directive may be silently ignored
/** Module JSDoc */
"use client";

// CORRECT — directive is the first statement
"use client";
/** Module JSDoc */
```

---

## Validation & Testing

- All **1,123 tests** pass (57 test files)
- ESLint reports no errors
- TypeScript type check passes with no errors
- Code review performed with 5 parallel agents (CLAUDE.md compliance, bug scan, git history, previous PR comments, code comment accuracy)
- Confidence scoring filtered issues at 80% threshold

---

## New Tests Added

- `v2/src/__tests__/components/common/ScrollAnimatedSection.test.tsx` (4 tests)
- `v2/src/__tests__/hooks/usePalette.test.tsx` (88 tests)
- `v2/src/__tests__/utils/navigation.test.ts` (16 tests)

---

## Related Issues

- Issue #54 — Stale project loading state on navigation (informed CLAUDE.md refactoring safety rules)
- Issue #59 — ScrollAnimatedSection ignores prefers-reduced-motion (fixed)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Commits | 7 |
| Files changed | 29 |
| Lines added | 657 |
| Lines removed | 178 |
| New components | 2 (NavButtons, SettingsList) |
| New test files | 3 |
| Tests passing | 1,123 |
| `"use client"` fixes | 10 files |
| JSDoc fixes | 6 files |

---

## Status

✅ COMPLETE
