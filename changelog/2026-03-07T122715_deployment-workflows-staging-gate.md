# Deployment Workflows - Manual Dev Deploy & Production Staging Gate

**Date:** 2026-03-07
**Time:** 12:27:15 EST
**Type:** Infrastructure
**Version:** v7.1.1

## Summary

Added a manual development deployment workflow for deploying any branch to the dev environment, and hardened the production deployment workflow to enforce main-branch-only deploys with a staging gate that verifies the commit was successfully deployed to Railway staging before promotion. Updated deployment documentation to reflect the new three-environment pipeline.

---

## Changes Implemented

### 1. Manual Development Deployment Workflow

Added `deploy-dev.yml` to allow manual deployment of any branch to the development environment via GitHub Actions `workflow_dispatch`.

**Created:**
- `.github/workflows/deploy-dev.yml` — Manual deploy to development from any branch/tag/SHA

### 2. Production Deployment Hardening

Updated `deploy-production.yml` with two preflight checks before deployment proceeds:

- **Branch verification** — Rejects deployments from non-main branches at runtime
- **Staging gate** — Queries Railway's GraphQL API to verify the commit SHA has a successful deployment in the staging environment

**Modified:**
- `.github/workflows/deploy-production.yml` — Removed `ref` input, added `preflight` job with branch and staging checks, hardened interpolation via `env:` variables

### 3. Documentation Updates

Comprehensive update to deployment documentation reflecting the new pipeline.

**Modified:**
- `docs/setup/RAILWAY_DEPLOYMENT.md`:
  - Added `RAILWAY_STAGING_ENVIRONMENT_ID` variable to setup steps and config checklist
  - Added "Manual Development Deployment" section for `deploy-dev.yml`
  - Rewrote production deployment section with preflight checks, prerequisites, and staging gate details
  - Expanded environment comparison table from 2-column (dev/prod) to 3-column (dev/staging/prod)
  - Restructured GitHub Workflow Configuration reference to cover all three workflows
  - Added troubleshooting entries for staging verification and branch restriction failures

---

## Technical Details

### Railway Staging Verification

The production workflow queries Railway's GraphQL API to check for a successful staging deployment:

```yaml
- name: Verify staging deployment on Railway
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
    RAILWAY_PROJECT_ID: ${{ vars.RAILWAY_PROJECT_ID }}
    RAILWAY_STAGING_ENV_ID: ${{ vars.RAILWAY_STAGING_ENVIRONMENT_ID }}
    COMMIT_SHA: ${{ github.sha }}
  run: |
    # Queries Railway API for successful staging deployment matching commit SHA
    RESPONSE=$(curl -s -X POST \
      -H "Authorization: Bearer $RAILWAY_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{ "query": "..." }' \
      "https://backboard.railway.app/graphql/v2")
```

### New GitHub Variable Required

| Variable | Purpose |
|----------|---------|
| `RAILWAY_STAGING_ENVIRONMENT_ID` | UUID of the Railway staging environment, used by the production workflow to verify staging deployment |

### Deployment Pipeline

```
Feature Branch → PR → Dev (manual approval) → Merge to main → Staging (Railway auto-deploy) → Production (manual + staging gate)
```

---

## Impact Assessment

- **Safety**: Production deploys now require verified staging success, preventing untested code from reaching production
- **Flexibility**: Any branch can be manually deployed to dev without creating a PR
- **Security**: All `${{ }}` interpolation in `run:` blocks uses `env:` variables to prevent injection
- **Setup**: Teams must add `RAILWAY_STAGING_ENVIRONMENT_ID` as a GitHub repository variable

---

## Related Files

**Created:**
- `.github/workflows/deploy-dev.yml`

**Modified:**
- `.github/workflows/deploy-production.yml`
- `docs/setup/RAILWAY_DEPLOYMENT.md`

---

## Status

✅ COMPLETE
