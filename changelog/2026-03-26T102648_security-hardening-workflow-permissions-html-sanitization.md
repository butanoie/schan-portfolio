# Security Hardening — Workflow Permissions & HTML Sanitization

**Date:** 2026-03-26
**Time:** 10:26:48 PDT
**Type:** Infrastructure / Security
**Version:** 2.x

## Summary

Added explicit `permissions: contents: read` to four GitHub Actions workflows to follow the principle of least privilege, and replaced a regex-based HTML strip function with the `striptags` library to fix an incomplete multi-character sanitization vulnerability (CodeQL alert #18).

---

## Changes Implemented

### 1. GitHub Actions Workflow Permissions (Alerts #1–4)

Added top-level `permissions: contents: read` to workflows that previously inherited default (broad) token permissions.

**Modified:**
- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-production.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/test-deploy-dev.yml`

### 2. HTML Sanitization Fix (Alert #18)

Replaced the regex-based `stripHtml()` function (`html.replace(/<[^>]*>/g, '')`) with the `striptags` library, which correctly handles multi-character sequences and edge cases that a single-pass regex misses.

**Modified:**
- `v2/src/lib/seo.ts` — switched to `striptags()` call
- `v2/package.json` — added `striptags@^3.2.0` dependency
- `v2/package-lock.json` — lockfile update

---

## Technical Details

### Workflow Permissions

Each workflow received a minimal top-level permissions block:

```yaml
permissions:
  contents: read
```

This restricts the `GITHUB_TOKEN` to read-only repository access, preventing accidental write operations if a workflow or action is compromised.

### HTML Sanitization

The previous regex `/<[^>]*>/g` is vulnerable to incomplete sanitization when HTML contains sequences like `<<img src=x onerror=alert(1)>` — the outer angle brackets are stripped but the inner tag survives. `striptags` parses tags correctly rather than relying on a single regex pass.

---

## Validation & Testing

- **Typecheck:** ✅ Pass
- **Lint:** ✅ Pass
- **Unit tests:** ✅ 1192 tests passed (68 test files)

---

## Impact Assessment

- **Security:** Reduces blast radius of compromised workflows and eliminates a potential XSS vector in HTML-to-text conversion
- **Dependencies:** Adds one small dependency (`striptags`, 0 transitive deps)
- **Breaking changes:** None — `stripHtml()` API unchanged

---

## Related Files

- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-production.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/test-deploy-dev.yml`
- `v2/src/lib/seo.ts`
- `v2/package.json`

---

## Status

✅ COMPLETE
