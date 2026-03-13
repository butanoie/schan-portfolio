# Style — Run Prettier Across Entire Codebase and Fix Lint Errors

**Date:** 2026-03-12
**Time:** 09:19:19 PDT
**Type:** Configuration
**PR:** #143
**Version:** v2.x

## Summary

Formatted all 213 files across the entire codebase to match the `.prettierrc` config (single quotes, trailing commas, 80 char width). Also replaced `any` with `unknown` in `typeGuards.ts` to fix `@typescript-eslint/no-explicit-any` errors and removed unused `eslint-disable` directives. Closes #141.

---

## Changes Implemented

### 1. Codebase-Wide Prettier Formatting

Applied consistent formatting to 213 files across all source code, tests, documentation, configuration, and data files. Key formatting rules enforced:

- **Single quotes** — Aligned all string literals to `singleQuote: true`
- **Trailing commas** — Added trailing commas per `trailingComma` config
- **Print width** — Reflowed lines to 80 character width
- **Consistent indentation** — Normalized tabs/spaces across all file types

### 2. TypeScript Lint Fixes

- **`typeGuards.ts`** — Replaced `any` with `unknown` to resolve `@typescript-eslint/no-explicit-any` errors
- Removed unused `eslint-disable` directives that were no longer needed after fixes

---

## Technical Details

### Scope

| Category | Files |
|---|---|
| Components (`src/components/`) | 48 |
| Tests (`src/__tests__/`) | 65 |
| Hooks (`src/hooks/`) | 11 |
| Types (`src/types/`) | 8 |
| Data (`src/data/`) | 7 |
| Lib (`src/lib/`) | 13 |
| Utils (`src/utils/`) | 6 |
| App routes (`app/`) | 11 |
| Docs (`docs/`) | 9 |
| Config & other | 35 |
| **Total** | **213** |

### Net Line Impact

| Metric | Count |
|---|---|
| Lines added | ~38,193 |
| Lines removed | ~36,620 |
| Net addition | ~1,573 (formatting expansion) |
| Files changed | 213 |

---

## Impact Assessment

- **Consistent formatting** — Every file now matches `.prettierrc`, eliminating formatting inconsistencies that accumulated before the pre-commit hook was added in #142
- **Clean lint baseline** — Removed `any` usage and stale `eslint-disable` directives, establishing a clean starting point for the lint-staged pre-commit hook
- **No behavioral changes** — All changes are purely cosmetic (formatting) or type-safety improvements (`any` → `unknown`)

---

## Status

✅ COMPLETE
