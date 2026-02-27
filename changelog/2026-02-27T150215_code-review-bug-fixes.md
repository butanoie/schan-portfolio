# Code Review Bug Fixes - Issues #43, #44, #45, #46, #48, #49

**Date:** 2026-02-27
**Time:** 15:02:15 EST
**Type:** Bug Fixes
**Version:** v2.x

## Summary

A batch of bug fixes addressing React anti-patterns, operator precedence errors, accessibility regressions, and localization gaps discovered during code review. Five commits fix issues across hooks, components, and utilities, touching 17 files.

---

## Changes Implemented

### 1. DOMPurify Hook Race Condition (#43)

Moved the `DOMPurify.addHook('afterSanitizeAttributes', ...)` call from inside the `sanitizeHtml()` function to module-level initialization. Previously, concurrent renders could register duplicate hooks or encounter race conditions.

**Modified:**
- `v2/src/utils/sanitization.ts` — relocated hook to module scope

### 2. Lightbox Redesign, Animation Settings, and Localization (#18, #34, #44, #48)

Redesigned the lightbox layout, ensured animation settings are respected, and localized all hardcoded UI strings.

**Modified:**
- `v2/src/components/project/ProjectLightbox.tsx` — layout redesign and animation fixes
- `v2/src/components/project/ProjectImage.tsx` — minor adjustments
- `v2/src/components/project/AsyncProjectsList.tsx` — minor adjustments
- `v2/src/components/common/HamburgerMenu.tsx` — localization fix
- `v2/src/components/common/Header.tsx` — localization fix
- `v2/src/hooks/useSwipe.ts` — exported for lightbox use
- `v2/src/hooks/index.ts` — barrel export update
- `v2/src/constants/app.ts` — new constants
- `v2/src/locales/en/common.json` — new translation keys
- `v2/src/locales/fr/common.json` — new translation keys
- `v2/src/locales/en/components.json` — new translation keys
- `v2/src/locales/fr/components.json` — new translation keys

**Test added:**
- `v2/src/__tests__/components/common/HamburgerMenu.test.tsx` — updated for localization

### 3. Dead Hook with Render-Phase Side Effect (#45)

Removed `useReportProjectLoadingState` from `MainLayout.tsx`. The hook called `bridge.onStateChange()` directly during render (violating React rules), and was dead code — the correct `useEffect`-based implementation already existed in `AsyncProjectsList.tsx`.

**Modified:**
- `v2/src/components/common/MainLayout.tsx` — deleted hook, removed unused `useMemo` and `useContext` imports

### 4. Unstable Object Reference in useEffect Dependency (#46)

`useScrollAnimation` used `[options]` in its `useEffect` dependency array, comparing by reference. Inline object literals would create new references each render, continuously destroying and recreating the `IntersectionObserver`. Fixed by serializing options via `JSON.stringify` for value-based comparison.

**Modified:**
- `v2/src/hooks/useScrollAnimation.ts` — serialize options for stable dependency

### 5. Operator Precedence Bug in useI18n (#49)

The variable extraction logic had a missing parenthesization where `&&` binding tighter than `||` allowed numeric values to bypass key exclusion guards for `'variables'` and `'ns'` properties.

**Modified:**
- `v2/src/hooks/useI18n.ts` — added parentheses around type union check

---

## Technical Details

### React Anti-Patterns Fixed

| Issue | Anti-Pattern | Fix |
|-------|-------------|-----|
| #43 | Side effect (DOMPurify hook) registered inside render-callable function | Move to module-level |
| #45 | State setter called during render phase | Deleted dead code (correct `useEffect` version existed) |
| #46 | Unstable object reference in `useEffect` deps | `JSON.stringify` serialization |

### JavaScript Operator Precedence (#49)

```typescript
// Before (bug): && binds tighter than ||
key !== 'variables' && key !== 'ns' && typeof value === 'string' || typeof value === 'number'
// Evaluates as: (A && B && C) || D — numeric values bypass guards

// After (fix): explicit grouping
key !== 'variables' && key !== 'ns' && (typeof value === 'string' || typeof value === 'number')
```

---

## Validation & Testing

- TypeScript: `npx tsc --noEmit` passes with no errors
- `useScrollAnimation` tests: 7/7 passing
- `useI18n` tests: 21/21 passing

---

## Impact Assessment

- **Correctness:** Fixes potential infinite re-render loop (#45), unnecessary observer churn (#46), and variable extraction bypass (#49)
- **Accessibility:** Lightbox now respects `prefers-reduced-motion` (#44)
- **Localization:** All hardcoded strings now use i18n system (#48)
- **Security:** DOMPurify hook race condition eliminated (#43)

---

## Related Files

**Modified (17 files):**
- `v2/src/utils/sanitization.ts`
- `v2/src/components/common/MainLayout.tsx`
- `v2/src/components/common/HamburgerMenu.tsx`
- `v2/src/components/common/Header.tsx`
- `v2/src/components/project/ProjectLightbox.tsx`
- `v2/src/components/project/ProjectImage.tsx`
- `v2/src/components/project/AsyncProjectsList.tsx`
- `v2/src/hooks/useScrollAnimation.ts`
- `v2/src/hooks/useI18n.ts`
- `v2/src/hooks/useSwipe.ts`
- `v2/src/hooks/index.ts`
- `v2/src/constants/app.ts`
- `v2/src/locales/en/common.json`
- `v2/src/locales/fr/common.json`
- `v2/src/locales/en/components.json`
- `v2/src/locales/fr/components.json`
- `v2/src/__tests__/components/common/HamburgerMenu.test.tsx`

---

## Status

✅ COMPLETE — All 5 commits merged on `sc/code-review` branch
