# CLAUDE.md Cleanup and CI Filter for Documentation-Only PRs

**Date:** 2026-03-13
**Time:** 14:09:24 PDT
**Type:** Infrastructure
**Version:** v2.x

## Summary

Trimmed redundant and verbose sections from all CLAUDE.md files, replacing them with concise equivalents that preserve every rule. Updated the CI `check-changes` job to skip builds when a PR only touches CLAUDE.md files, and renamed the workflow to "Test and Deploy".

---

## Changes Implemented

### 1. CLAUDE.md Cleanup (`be3cbae`)

Removed verbose restatements of well-known best practices (TypeScript, testing, error handling, security) and consolidated documentation requirements into a single paragraph with a link to `JSDOC_EXAMPLES.md`.

**Modified:**
- `CLAUDE.md` — Consolidated documentation requirements, removed redundant gate explanations and authoring pattern section
- `v2/CLAUDE.md` — Removed generic TypeScript/testing/error-handling/security sections; added `npm run test:e2e` command
- `v2/e2e/CLAUDE.md` — Added practical commands section and CI integration notes
- `changelog/CLAUDE.md` — Removed redundant cross-reference line

### 2. CI Filter for CLAUDE.md Changes (`ea553e0`)

Added `grep -vi 'claude\.md'` filter to the `check-changes` job so documentation-only PRs skip tests, E2E, and deploy.

**Modified:**
- `.github/workflows/test-deploy-dev.yml` — Added CLAUDE.md exclusion filter, renamed workflow, updated gate job comment

---

## Technical Details

### CI Filter

```yaml
# Before
has_v2_changes=$(grep -E '^(v2/|\.github/workflows/)' /tmp/changed_files.txt | wc -l)

# After
has_v2_changes=$(grep -E '^(v2/|\.github/workflows/)' /tmp/changed_files.txt | grep -vi 'claude\.md' | wc -l)
```

Case-insensitive `grep -vi` ensures all casing variants (e.g., `CLAUDE.md`, `claude.md`) are excluded.

---

## Impact Assessment

- Documentation-only PRs no longer trigger CI builds, saving runner minutes
- CLAUDE.md files are ~78 lines shorter while preserving all rules and gates
- `v2/e2e/CLAUDE.md` now serves as a practical quick-reference for E2E commands and CI behavior

---

## Related Files

**Modified:**
- `.github/workflows/test-deploy-dev.yml`
- `CLAUDE.md`
- `changelog/CLAUDE.md`
- `v2/CLAUDE.md`
- `v2/e2e/CLAUDE.md`

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Files changed | 5 |
| Lines added | 31 |
| Lines removed | 109 |
| Net reduction | −78 lines |
| Commits | 2 |

---

## Status

✅ COMPLETE
