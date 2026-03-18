# CI/CD — Skip Dev Deploy for Dependabot PRs and Narrow Change Detection

**Date:** 2026-03-17
**Time:** 23:01:38 PST
**Type:** Infrastructure
**Version:** 2.x

## Summary

Modified the `test-deploy-dev.yml` PR workflow to skip Railway dev deployment for Dependabot PRs while still running the full test suite. Also narrowed change detection to only trigger on `v2/` or `test-deploy-dev.yml` changes, excluding other `deploy-*.yml` manual workflows that can't be validated through this pipeline. Updated `RAILWAY_DEPLOYMENT.md` across 8 sections to reflect the new behavior.

---

## Changes Implemented

### 1. Signal Decomposition in Change Detection

Added a second output signal (`should-deploy`) to the `check-changes` job, separating "should we test?" from "should we deploy?":

- `has-v2-changes` — true when `v2/` or `test-deploy-dev.yml` changed (controls tests/e2e)
- `should-deploy` — true when `has-v2-changes` AND actor is not `dependabot[bot]` (controls deploy)

### 2. Narrowed Change Detection Scope

Changed the grep pattern from `^(v2/|\.github/workflows/)` to `^(v2/|\.github/workflows/test-deploy-dev\.yml)`. Other `deploy-*.yml` workflows are `workflow_dispatch`-only and can't be validated through the PR pipeline.

### 3. Gate Job Logic Update

Split the gate job's assertions into two independent checks:
- `HAS_V2_CHANGES` gates tests and e2e assertions
- `SHOULD_DEPLOY` gates deploy assertion

This allows Dependabot PRs (where tests pass but deploy is skipped) to pass the gate cleanly.

### 4. Documentation Updates

Updated 8 sections in `RAILWAY_DEPLOYMENT.md` for consistency with the new behavior:
- Overview paragraph and deployment trigger
- Workflow structure code block
- Deploy job configuration code block
- "When Tests and Deployment Run" section (added new "When Deployment is Skipped" subsection)
- Smart Change Detection description and example scenarios table
- Important callout, troubleshooting reference, and smart execution summary

**Modified:**
- `.github/workflows/test-deploy-dev.yml` — outputs, detection logic, deploy condition, gate logic
- `docs/setup/RAILWAY_DEPLOYMENT.md` — 8 sections updated

---

## Technical Details

### Change Detection Logic

```yaml
env:
  IS_DEPENDABOT: ${{ github.actor == 'dependabot[bot]' }}
run: |
  # has-v2-changes: v2/ app code or this workflow changed
  has_v2_changes=$(grep -E '^(v2/|\.github/workflows/test-deploy-dev\.yml)' /tmp/changed_files.txt | grep -vi 'claude\.md' | wc -l)

  # should-deploy: has v2 changes AND not a Dependabot PR
  if [ "$has_v2_changes" -gt 0 ] && [ "$IS_DEPENDABOT" != "true" ]; then
    echo "should-deploy=true" >> $GITHUB_OUTPUT
  fi
```

The Dependabot actor check uses `env:` injection rather than inline template expansion in shell, following GitHub Actions security best practices.

### Scenario Matrix

| Changed files | Tests run? | Deploy? |
|---|---|---|
| `v2/` files | Yes | Yes (unless Dependabot) |
| `test-deploy-dev.yml` | Yes | Yes (unless Dependabot) |
| Other `deploy-*.yml` only | No | No |
| Dependabot + `v2/` changes | Yes | No |
| Docs/changelog only | No | No |

---

## Validation & Testing

- Three parallel code review agents completed with no Critical or Warning findings
- Simplicity review: signal decomposition confirmed as cleanest approach
- Correctness review: all 5 scenarios verified; grep/wc pipeline confirmed safe
- Conventions review: identified 4 stale doc references, all fixed

---

## Impact Assessment

- **Dependabot PRs** no longer require `RAILWAY_TOKEN` in Dependabot secrets (workaround can be removed post-merge)
- **CI efficiency** — eliminates unnecessary dev deployments for dependency bumps
- **Workflow-only PRs** — changes to manual deploy workflows no longer trigger the full test suite
- **No breaking changes** — gate job remains the single required status check for branch protection

---

## Related Files

- `.github/workflows/test-deploy-dev.yml`
- `docs/setup/RAILWAY_DEPLOYMENT.md`
- GitHub Issue: #178

---

## Next Steps

- Remove `RAILWAY_TOKEN` from Dependabot secrets after merge (Settings → Secrets → Dependabot)

---

## Status

✅ COMPLETE
