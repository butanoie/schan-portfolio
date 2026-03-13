# E2E Navigation & Settings — 35 Tests Across Core User Flows

**Date:** 2026-03-12
**Time:** 21:55:22 PDT
**Type:** Feature
**Phase:** 8.7 (E2E Navigation & Settings — Testing Roadmap)
**PRs:** #134, #135
**Branch:** `sc/e2e-nav`
**Version:** v2.x

## Summary

Added two comprehensive E2E spec files covering navigation (18 tests) and settings (17 tests), totaling 35 new Playwright tests for core user interaction flows. These specs validate route loading, active state indicators, preference persistence across navigation, footer links, theme/language switching, animation toggling, and popover/mobile drawer behavior.

---

## Changes Implemented

### 1. Navigation Spec (#134)

Created `navigation.spec.ts` with 18 tests across 4 categories:

| Category | Tests | Coverage |
|---|---|---|
| Route loading | 4 | Home, Resume, Colophon, Samples with H1 verification |
| Active state (desktop) | 4 | `aria-current="page"` on each nav link |
| Active state (mobile) | 4 | Mobile viewport nav with drawer interaction |
| Preference persistence | 4 | Theme and language survive cross-page navigation |
| Footer navigation | 2 | Footer link functionality |

### 2. Settings Spec (#135)

Created `settings.spec.ts` with 17 tests across 5 categories:

| Category | Tests | Coverage |
|---|---|---|
| Theme switching | 5 | Light/dark/system modes + persistence via localStorage |
| Language switching | 4 | French UI text, disclaimer, project titles + persistence |
| Animations toggle | 3 | CSS transition suppression + persistence |
| Popover controls | 3 | Open/close via gear button and Escape key |
| Mobile drawer | 2 | Settings controls within mobile navigation drawer |

### 3. POM & Helper Enhancements

- Extended `SettingsPanel` POM with `closeViaGearButton()` using pre-captured coordinates to bypass MUI backdrop pointer interception
- Added `seedAnimations()` localStorage helper in `storage.ts`

### 4. Documentation

- Updated `v2/e2e/CLAUDE.md` with MUI Popover `aria-hidden` and backdrop gotchas
- Updated `v2/src/components/CLAUDE.md` with related component notes

---

## Technical Details

### MUI Popover Backdrop Workaround

The settings popover uses MUI's `Popover` component, which renders a transparent backdrop that intercepts pointer events. The `closeViaGearButton()` method captures the gear button's coordinates before opening the popover, then uses coordinate-based clicking to bypass the backdrop — a pattern documented in `v2/e2e/CLAUDE.md` for future test authors.

### Preference Persistence Pattern

Both specs validate that user preferences (theme, language) persist across page navigation by:
1. Setting a preference via the settings panel
2. Navigating to a different page
3. Verifying the preference is still active on the new page

This catches regressions in the `localStorage`-backed persistence layer and the App Router's persistent layout state.

---

## Validation & Testing

```
35 new E2E tests added (18 navigation + 17 settings)
838 lines added across 6 files
All tests pass against local dev server
```

---

## Related Files

**Created:**
- `v2/e2e/specs/navigation.spec.ts` — Navigation E2E spec (298 lines)
- `v2/e2e/specs/settings.spec.ts` — Settings E2E spec (463 lines)

**Modified:**
- `v2/e2e/components/SettingsPanel.ts` — POM enhancements (+50 lines)
- `v2/e2e/helpers/storage.ts` — New `seedAnimations()` helper (+23 lines)
- `v2/e2e/CLAUDE.md` — MUI Popover gotchas
- `v2/src/components/CLAUDE.md` — Component notes

---

## Status

✅ COMPLETE
