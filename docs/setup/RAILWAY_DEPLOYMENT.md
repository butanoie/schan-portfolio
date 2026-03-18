# Railway Development Deployment Setup

## Overview

This project automatically deploys to Railway's development environment whenever a pull request to the `main` branch passes all tests. The deployment is smart—it only runs tests and deploys if changes are detected in the `v2/` folder or `test-deploy-dev.yml`, and skips deployment for Dependabot PRs. Manual approval is required before deployment proceeds.

**Project:** Sing Portfolio
**Environment:** Development
**Deployment Trigger:** Every non-Dependabot PR to `main` branch with v2/ or `test-deploy-dev.yml` changes (after lint, type check, and unit tests pass)
**Deploy Directory:** `v2/` (Next.js application)
**Approval:** Manual approval required per environment configuration

## Prerequisites

Before setting up automatic deployments, ensure you have:

1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **Railway Project Created** - "Sing Portfolio" project must exist in your Railway account
3. **Development Environment** - Create a "development" environment in your Railway project
4. **GitHub Repository Access** - Push access to add secrets
5. **Repository Admin Access** - Needed to configure environment approval rules

## Setup Steps

### Step 1: Get Railway Project ID

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select the **Sing Portfolio** project
3. Click **Project Settings** (gear icon)
4. Copy the **Project ID** (UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 2: Create Railway API Token

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click your profile icon in the top right corner
3. Select **Account Settings**
4. Navigate to the **Tokens** tab
5. Click **Create Token**
6. Give it a descriptive name (e.g., "GitHub CI/CD Deploy")
7. Copy the token (you won't be able to see it again)

### Step 3: Find Your Railway Service Name

1. In your Railway Dashboard, go to the **Sing Portfolio** project
2. Look at the services list in the left sidebar
3. Find the service name for your Next.js application (e.g., `web`, `app`, `api`, etc.)
4. Copy the exact service name (it's case-sensitive)

### Step 4: Add Configuration to GitHub

Add **one secret** and **two variables** to GitHub Actions:

**Secret - Railway Token (Authentication):**

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. **Name:** `RAILWAY_TOKEN`
5. **Value:** Paste the token you copied from Railway
6. Click **Add secret**

**Variable 1 - Railway Project ID:**

1. Still in **Settings** > **Secrets and variables** > **Actions**
2. Click the **Variables** tab
3. Click **New repository variable**
4. **Name:** `RAILWAY_PROJECT_ID`
5. **Value:** Paste the project ID you copied from Railway
6. Click **Add variable**

**Variable 2 - Railway Service Name:**

1. Still in the **Variables** tab
2. Click **New repository variable**
3. **Name:** `RAILWAY_SERVICE_NAME`
4. **Value:** Paste the service name you found in step 3
5. Click **Add variable**

**Variable 3 - Staging Deploy Environment Name (required for production deploys):**

1. Still in the **Variables** tab
2. Click **New repository variable**
3. **Name:** `RAILWAY_STAGING_DEPLOY_ENV_NAME`
4. **Value:** The GitHub Deployments environment name that Railway creates when it auto-deploys to staging (e.g., `"Sing Portfolio / staging"`). You can find this under **Settings > Environments** in your GitHub repository.
5. Click **Add variable**

**Why the difference?**

- **Token** is a secret because it's an authentication credential (sensitive)
- **Project ID, Service Name & Staging Deploy Env Name** are variables because they're just configuration identifiers (non-sensitive)

### Step 5: Verify Deployment Configuration

The workflow is already configured in [`.github/workflows/test-deploy-dev.yml`](.github/workflows/test-deploy-dev.yml).

**Workflow Structure:**

```yaml
# Smart change detection
check-changes:
  # Detects if v2/ folder or test-deploy-dev.yml changed
  # Outputs: has-v2-changes (true/false), should-deploy (true/false)

# Tests only run if changes detected
tests:
  needs: check-changes
  if: needs.check-changes.outputs.has-v2-changes == 'true'
  # Runs: lint, type-check, test

# Deployment only runs if tests pass AND not Dependabot
deploy:
  needs: [check-changes, tests]
  if: needs.check-changes.outputs.should-deploy == 'true'
  environment: "Sing Portfolio / development"
```

**Deploy job configuration:**

```yaml
deploy:
  needs: [check-changes, tests]
  runs-on: ubuntu-latest
  if: needs.check-changes.outputs.should-deploy == 'true'
  environment: "Sing Portfolio / development"
  steps:
    - name: Checkout code
      uses: actions/checkout@v6

    - name: Install Railway CLI
      run: npm install -g @railway/cli

    - name: Deploy to Railway Development
      run: railway up --project=${{ vars.RAILWAY_PROJECT_ID }} --service=${{ vars.RAILWAY_SERVICE_NAME }} --environment=development
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Explanation:**

- **Smart Detection**: The `check-changes` job prevents unnecessary test runs when only docs or other non-v2 files change
- **Tests Conditional**: Tests only run if v2/ or `test-deploy-dev.yml` changed (saves CI time)
- **Deployment Conditional**: Deployment only runs if changes detected AND tests pass AND PR author is not Dependabot
- `--project`: Specifies which Railway project to deploy to (using the unique project ID from variables)
- `--service`: Specifies which service within the project to deploy (loaded from variables)
- `--environment`: Specifies the deployment environment (development)
- `RAILWAY_TOKEN`: Authentication token from secrets (encrypted, sensitive)
- **Environment Protection**: The "Sing Portfolio / development" environment requires manual approval before deployment

✅ Confirm all configuration is added:

- **Secret:** `RAILWAY_TOKEN` - Your Railway API token
- **Variable:** `RAILWAY_PROJECT_ID` - Your Railway project ID
- **Variable:** `RAILWAY_SERVICE_NAME` - Your Railway service name
- **Variable:** `RAILWAY_STAGING_DEPLOY_ENV_NAME` - GitHub Deployments environment name for staging (required for production deploys)

✅ Confirm environment approval is configured:

- Go to **Settings** > **Environments** > **Sing Portfolio / development**
- Add **Required reviewers** (GitHub users who must approve deployments)
- Consider adding team leads or project maintainers

### Step 6: Configure Deployment Approval (Optional but Recommended)

To add an extra layer of safety, configure required reviewers for the development environment:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Environments**
3. Click on **Sing Portfolio / development** environment
4. Check **Required reviewers** checkbox
5. Add GitHub users who must approve deployments (e.g., team leads, project maintainers)
6. Click **Save protection rules**

**Result:** Deployments will wait for approval from one of the designated reviewers before proceeding to Railway.

**Benefits:**

- 🔒 **Safety Gate** - Prevents accidental deployments
- 👥 **Team Control** - Multiple people can review before deployment
- 📋 **Audit Trail** - GitHub records who approved each deployment

### Step 7: Test the Deployment

1. Create a test branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b test-deployment
   ```

2. Make a small change in the `v2/` folder (this triggers the workflow):

   ```bash
   # For example, update a comment or documentation in v2/
   echo "# test" >> v2/README.md
   git add v2/README.md
   git commit -m "test: trigger deployment workflow"
   git push origin test-deployment
   ```

3. Create a Pull Request targeting the `main` branch

4. Watch the GitHub Actions workflow:
   - **check-changes** job runs first (detects v2/ changes)
   - **tests** job runs (lint, type-check, unit tests)
   - **deploy** job shows as "Waiting for approval" after tests pass
   - Approve the deployment from the PR checks or environment settings

5. After approval, verify deployment in Railway Dashboard:
   - Go to your "Sing Portfolio" project
   - Check the "development" environment
   - Look for the new deployment in the deployments list

⚠️ **Important:** Tests only run when changes are detected in the `v2/` folder or `test-deploy-dev.yml`. Changes to other workflow files, docs, or other folders won't trigger tests. Dependabot PRs run tests but skip deployment.

## Workflow Behavior

### When Tests and Deployment Run

✅ PR is opened against `main` branch
✅ Changes detected in `v2/` folder or `test-deploy-dev.yml`
✅ All lint, type check, and unit tests pass
✅ Manual approval provided by configured reviewer(s)
✅ PR author is not `dependabot[bot]`

### When Tests Skip (Workflow Still Runs)

⏭️ PR targets `main` branch
⏭️ Changes only in `docs/`, `changelog/`, other `deploy-*.yml` workflows, or other non-v2 folders
⏭️ The workflow runs but `check-changes` outputs `has-v2-changes=false`
⏭️ Tests and deployment jobs are skipped (saves CI time)

### When Deployment is Skipped (Tests Still Run)

⏭️ PR has `v2/` or `test-deploy-dev.yml` changes but author is `dependabot[bot]`
⏭️ Tests and E2E run normally to validate dependency changes
⏭️ Deploy is skipped — dependency bumps don't need dev environment validation

### When Deployment Does NOT Run

❌ PR targets a branch other than `main`
❌ Tests fail
❌ Type checking fails
❌ Linting fails
❌ Manual approval denied or not provided

## Smart Change Detection

The workflow includes intelligent change detection to save CI time and resources. The `check-changes` job identifies whether the `v2/` application folder or `test-deploy-dev.yml` was modified, and whether the PR author is Dependabot.

### How It Works

1. **PR Opened**: When you open a PR to `main`, the workflow runs
2. **Change Detection**: The `check-changes` job compares files changed against the base branch
3. **Decision**:
   - If `v2/` or `test-deploy-dev.yml` changed → Tests run; deploy runs if not Dependabot
   - If only other `deploy-*.yml` workflows, `docs/`, `changelog/`, or other folders changed → Tests and deployment are skipped
   - If Dependabot is the PR author → Tests run but deploy is skipped
4. **Result**: You see clear indication of whether tests ran or were skipped

### Benefits

- ✅ **Saves CI Time** - No unnecessary test runs for documentation-only or unrelated workflow changes
- ✅ **Faster Feedback** - Immediate result for non-app PRs without waiting for tests
- ✅ **Efficient Resources** - Reduces compute costs and CI pipeline strain
- ✅ **Dependabot Efficiency** - Dependency bumps are tested but not deployed to dev
- ✅ **Clear Status** - GitHub shows which jobs ran and why

### Example Scenarios

| Changes                                | Tests Run? | Deploy?                 | Why                                         |
| -------------------------------------- | ---------- | ----------------------- | ------------------------------------------- |
| Changes in `v2/src/`                   | ✅ Yes     | ✅ Yes (after approval) | Application code changed                    |
| Changes in `test-deploy-dev.yml`       | ✅ Yes     | ✅ Yes (after approval) | PR pipeline workflow changed                |
| Changes in other `deploy-*.yml` only   | ❌ No      | ❌ No                   | Manual deploy workflows — test separately   |
| Changes in `docs/` only               | ❌ No      | ❌ No                   | Only documentation changed                  |
| Changes in `changelog/` only          | ❌ No      | ❌ No                   | Only changelog changed                      |
| Mix of `v2/` + `docs/`                | ✅ Yes     | ✅ Yes (after approval) | Application code changed                    |
| Dependabot bumps `v2/` dependencies   | ✅ Yes     | ❌ No                   | Dependency changes tested but not deployed   |

### Deployment Environment Variables

The deployment uses Railway's environment variables configured in your Railway project settings. These are loaded automatically and do not need to be configured in GitHub.

If you need to add or modify environment variables:

1. Go to Railway Dashboard
2. Select "Sing Portfolio" project
3. Go to "development" environment
4. Click **Variables** or **Raw Editor**
5. Add/modify variables as needed
6. Redeploy by triggering a new workflow run (e.g., push a new commit to a PR targeting main)

## Configuration Reference

### Railway Project Details

- **Project Name:** Sing Portfolio
- **Environment:** development
- **Deploy Source:** GitHub repository root (Railway detects `v2/` as the application directory)
- **Framework:** Next.js 16+

### GitHub Workflow Configuration

**Development (PR-based):**

- **Workflow File:** `.github/workflows/test-deploy-dev.yml`
- **Workflow Name:** "Lint, Type Check, Unit Test, and Deploy"
- **Trigger:** Pull requests to `main` branch
- **Smart Execution:** Only runs tests/deploy if `v2/` or `test-deploy-dev.yml` changed; skips deploy for Dependabot PRs
- **Environment:** `Sing Portfolio / development`

**Development (Manual):**

- **Workflow File:** `.github/workflows/deploy-dev.yml`
- **Workflow Name:** "Manual Deploy to Development"
- **Trigger:** Manual (`workflow_dispatch`) from any branch
- **Environment:** `Sing Portfolio / development`

**Staging (Manual):**

- **Workflow File:** `.github/workflows/deploy-staging.yml`
- **Workflow Name:** "Manual Deploy to Staging"
- **Trigger:** Manual (`workflow_dispatch`) from `main` branch only
- **Preflight Checks:** Branch verification + commit-on-main verification
- **Environment:** `Sing Portfolio / staging`

**Production:**

- **Workflow File:** `.github/workflows/deploy-production.yml`
- **Workflow Name:** "Manual Deploy to Production"
- **Trigger:** Manual (`workflow_dispatch`) from `main` branch only
- **Preflight Checks:** Branch verification + staging deployment verification (via GitHub Deployments API)
- **Environment:** `Sing Portfolio / production`

**Shared Configuration:**

- **Authentication Secret:** `RAILWAY_TOKEN` (encrypted)
- **Project ID Variable:** `RAILWAY_PROJECT_ID` (non-sensitive config)
- **Service Name Variable:** `RAILWAY_SERVICE_NAME` (non-sensitive config)
- **Staging Deploy Env Name Variable:** `RAILWAY_STAGING_DEPLOY_ENV_NAME` (GitHub Deployments environment name used by production workflow for staging verification)
- **Best Practice:** Token stored as secret (sensitive), configuration stored as variables (non-sensitive)

## Troubleshooting

### Deployment Job Not Running

**Problem:** The deploy job doesn't appear in the workflow run.

**Solutions:**

- Verify the PR targets the `main` branch
- Verify changes are in the `v2/` folder or `test-deploy-dev.yml` (check the `check-changes` job output)
- Check that all previous jobs (check-changes, lint, type-check, test) completed successfully
- Verify the deployment is pending approval (check GitHub Actions checks section)
- Review the workflow file for syntax errors

### Deployment Waiting for Approval

**Problem:** The deploy job appears in the workflow but shows "Waiting for approval" or "Waiting for reviewer".

**Solutions:**

1. This is expected behavior - the environment requires manual approval
2. Approve the deployment:
   - Go to the PR's **Checks** section
   - Click the "Review deployment" button next to "Sing Portfolio / development"
   - Select "Approve and deploy"
3. If you don't see the approval button:
   - Verify you're added as a required reviewer (or owner of the repository)
   - Go to **Settings** > **Environments** > **Sing Portfolio / development**
   - Check **Required reviewers** configuration

### "Token not found" Error

**Problem:** Deployment fails with "RAILWAY_TOKEN not found" or similar error.

**Solutions:**

1. Verify the secret was added correctly:
   - Go to Settings > Secrets and variables > Actions
   - Confirm `RAILWAY_TOKEN` exists
2. Regenerate the token:
   - Go to Railway Account Settings > Tokens
   - Create a new token
   - Update the `RAILWAY_TOKEN` secret in GitHub with the new value

### Deployment Fails with Project Not Found

**Problem:** Railway reports "Project not found" or similar error.

**Solutions:**

1. Verify the `RAILWAY_PROJECT_ID` variable is set correctly:
   - Go to Settings > Secrets and variables > Actions > Variables tab
   - Confirm `RAILWAY_PROJECT_ID` is present and not empty
2. Verify the project ID is correct:
   - Go to Railway Dashboard > Sing Portfolio > Project Settings
   - Copy the Project ID again and update the variable
3. Verify the `RAILWAY_SERVICE_NAME` variable is set:
   - Go to Settings > Secrets and variables > Actions > Variables tab
   - Confirm `RAILWAY_SERVICE_NAME` is present and matches your service name exactly
4. Confirm the Railway API token has permissions to deploy to this project
5. Verify the development environment exists in your Railway project

### Railway Deployment Timeout

**Problem:** Deployment takes too long and times out.

**Solutions:**

1. Check Railway Dashboard for deployment logs
2. Monitor your Next.js build time in the Railway logs
3. Optimize Next.js build if it's taking too long
4. Consider increasing build resources in Railway project settings

### Environment Variables Not Loading

**Problem:** Deployed application reports missing environment variables.

**Solutions:**

1. Verify variables are set in Railway project settings
2. Check that variables are set for the "staging" environment (not just project-level)
3. Redeploy after adding/changing variables:
   ```bash
   # Push a new commit to staging PR to trigger workflow
   git commit --allow-empty -m "chore: redeploy to load environment changes"
   git push
   ```

## Manual Development Deployment (Any Branch)

In addition to the automatic PR-based deployment, you can manually deploy **any branch** to the development environment using the **"Manual Deploy to Development"** workflow.

**Workflow File:** `.github/workflows/deploy-dev.yml`

### How It Works

1. Go to your GitHub repository > **Actions** tab
2. Select **"Manual Deploy to Development"** workflow
3. Click **"Run workflow"**
4. Choose the branch to deploy from the dropdown (or enter a tag/commit SHA)
5. Click **"Run workflow"**
6. Approve the deployment when prompted (environment protection rules apply)

This is useful for testing feature branches in the development environment without creating a PR to `main`.

## Manual CLI Deployment

To deploy manually without using GitHub Actions:

### Option 1: Using Project Linking (Recommended)

1. Install Railway CLI:

   ```bash
   npm install -g @railway/cli
   ```

2. Log in:

   ```bash
   railway login
   ```

3. Link to project:

   ```bash
   railway link
   ```

   Select "Sing Portfolio" when prompted.

4. Deploy:
   ```bash
   cd v2
   railway up --environment=development
   ```

### Option 2: Using Project ID and Service Name

If you prefer not to link, you can deploy directly using the project ID and service name:

```bash
cd v2
RAILWAY_PROJECT_ID="your-project-id-here" \
RAILWAY_SERVICE_NAME="your-service-name-here" \
RAILWAY_TOKEN="your-api-token-here" \
railway up --project=$RAILWAY_PROJECT_ID --service=$RAILWAY_SERVICE_NAME --environment=development
```

Or pass them directly:

```bash
cd v2
railway up --project=your-project-id --service=your-service-name --environment=development
```

Replace:

- `your-project-id` with your Railway project ID
- `your-service-name` with your Railway service name

**Note:** The `--service` flag is required when your Railway project has multiple services.

## Monitoring Deployments

### View Deployment History

1. Go to Railway Dashboard
2. Select "Sing Portfolio" project
3. Select "development" environment
4. View the **Deployments** tab

### View Logs

1. Select a deployment from the history
2. Click **Logs** tab
3. Review build and runtime logs

### Rollback to Previous Deployment

1. Go to the **Deployments** tab
2. Find the deployment you want to restore
3. Click the **Redeploy** button

## Security Considerations

✅ **Safe Practices:**

- Railway token stored as GitHub secret (never in code or logs)
- Token only has deployment permissions
- Environment-specific deployments (staging isolated from production)
- All deployments logged and auditable in GitHub Actions

⚠️ **Important:**

- Never commit your Railway token to version control
- Regenerate token if it's accidentally exposed
- Review GitHub Actions logs for any sensitive information leaks
- Regularly audit deployed code and environment variables

## Manual Staging Deployment

In addition to Railway's automatic staging deployments (triggered when commits land on `main`), you can manually deploy a specific commit to the staging environment.

**Workflow File:** `.github/workflows/deploy-staging.yml`

### How It Works

1. Go to your GitHub repository > **Actions** tab
2. Select **"Manual Deploy to Staging"** workflow
3. Click **"Run workflow"**
4. Ensure **Branch: main** is selected (other branches will be rejected)
5. Optionally enter a **Commit SHA** to deploy a specific commit (must be on `main`). Leave blank for latest.
6. Click **"Run workflow"**
7. Approve the deployment when prompted (environment protection rules apply)

### Preflight Checks

The workflow validates:

1. **Branch verification** — Confirms the workflow is running from `main`
2. **Commit verification** — If a specific SHA was provided, confirms it exists on `main`

After validation, the workflow deploys to Railway's staging environment and sets the `SENTRY_RELEASE` variable for error tracking.

### When to Use

- **Re-deploy a specific commit** to staging for verification before promoting to production
- **Re-trigger a staging deploy** if Railway's automatic deployment failed
- **Test a rollback** by deploying an older `main` commit to staging

---

## Production Deployment

### Manual Production Deployment Workflow

Once your changes are verified in the staging environment, you can manually deploy to production using the **"Manual Deploy to Production"** workflow.

**Workflow File:** `.github/workflows/deploy-production.yml`

### How It Works

1. **Main Branch Only**: Production deployments can only be triggered from the `main` branch
2. **Staging Gate**: The workflow verifies that the exact commit has been successfully deployed to the Railway staging environment before proceeding
3. **Approval Gate**: Requires manual approval from configured reviewers before deploying
4. **Deploy to Production**: Once all checks pass and approval is granted, deploys to your production environment in Railway

### Prerequisites

Before deploying to production, you must:

1. **Merge to `main`**: All changes must be on the `main` branch
2. **Staging deployment**: Railway must have auto-deployed the commit to the staging environment. Railway handles this automatically when commits land on `main`.
3. **Staging success**: The staging deployment must have completed successfully in Railway

### Deploying to Production

#### Step 1: Trigger the Workflow

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Select **"Manual Deploy to Production"** workflow
4. Click **"Run workflow"** button
5. Ensure **Branch: main** is selected (other branches will be rejected)
6. Optionally enter a **Commit SHA** to deploy a specific previous commit (must be on `main` and have passed staging). Leave blank to deploy the latest.
7. Click **"Run workflow"**

#### Step 2: Preflight Checks

The workflow automatically runs three checks before deployment:

1. **Branch verification** - Confirms the workflow is running from `main`. If triggered from another branch, the workflow fails immediately.
2. **Commit verification** - If a specific commit SHA was provided, confirms it exists on the `main` branch. Otherwise, uses the current HEAD of `main`.
3. **Staging deployment verification** - Queries the GitHub Deployments API to confirm the commit SHA has a successful deployment in the staging environment. Railway's GitHub integration automatically creates deployment records, so this check verifies that Railway successfully deployed the commit to staging. If no successful staging deployment is found, the workflow fails with a descriptive error.

#### Step 3: Approve the Deployment

After preflight checks pass:

1. The deploy job will pause and show **"Waiting for approval"**
2. Go to the **Actions** tab and select the running workflow
3. Click the **"Review deployment"** button
4. Review the details:
   - **Environment**: Sing Portfolio / production
   - **Deployed by**: Your GitHub username
   - **Commit**: The commit being deployed (verified against staging)
5. Click **"Approve and deploy"**

The workflow will then proceed to deploy to production.

#### Step 4: Verify Production Deployment

1. Go to Railway Dashboard
2. Select the **Sing Portfolio** project
3. Select the **production** environment
4. Check the **Deployments** tab for the new deployment
5. Monitor the deployment logs for any issues

### Production Deployment Configuration

**Workflow Structure:**

```yaml
workflow_dispatch:
  inputs:
    commit_sha:
      description: "Commit SHA to deploy (leave blank for latest)"
      required: false

jobs:
  preflight:
    # Verifies: 1) running from main, 2) commit is on main, 3) deployed to staging
    steps:
      - name: Verify main branch
      - name: Resolve deploy commit
      - name: Verify commit exists on main
      - name: Verify staging deployment on Railway

  deploy-production:
    needs: preflight
    environment: "Sing Portfolio / production"
```

**Staging verification uses the GitHub Deployments API:**

```yaml
- name: Verify staging deployment via GitHub Deployments
  env:
    GH_TOKEN: ${{ github.token }}
    COMMIT_SHA: ${{ steps.resolve.outputs.sha }}
    STAGING_ENV: ${{ vars.RAILWAY_STAGING_DEPLOY_ENV_NAME }}
  run: |
    # Queries GitHub Deployments API for successful staging deployment matching commit SHA
    # Railway's GitHub integration automatically creates deployment records
```

**Key Features:**

- **Main Branch Only**: Cannot deploy from feature branches - enforced at runtime
- **Staging Gate**: Queries the GitHub Deployments API to verify the commit was successfully deployed to staging first (Railway auto-creates deployment records via its GitHub integration)
- **Approval Protection**: `environment: "Sing Portfolio / production"` requires manual approval
- **Same Configuration**: Uses `RAILWAY_PROJECT_ID`, `RAILWAY_SERVICE_NAME`, and `RAILWAY_TOKEN`
- **Additional Variable**: Requires `RAILWAY_STAGING_DEPLOY_ENV_NAME` (GitHub environment name) for the staging verification check
- **Production Environment**: Targets the `production` environment in Railway

### Recommended Deployment Workflow

**Best Practice:**

1. Create PR to `main` with your changes
2. Tests run automatically and deploy to development (with approval)
3. Verify changes work correctly in development environment
4. Merge PR to `main`
5. Railway auto-deploys the commit to staging
6. Verify changes work correctly in staging environment
7. Manually trigger "Manual Deploy to Production" workflow from `main`
8. Preflight checks verify commit was deployed to staging
9. Approve the production deployment
10. Monitor production deployment and verify application works

This gives you:

- **Safety**: Three environments (development -> staging -> production) with progressive validation
- **Staging Gate**: Production deploys are blocked until the commit succeeds in staging
- **Control**: Manual approval required for all production deployments
- **Audit Trail**: GitHub records all deployments and approvers
- **Rollback**: Deploy any previous `main` commit by specifying its SHA (as long as it passed staging)

### Setting Up Production Approval

To require approval before production deployments:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Environments**
3. Click **New environment**
4. Name it **"Sing Portfolio / production"** (must match workflow)
5. Click **Configure environment**
6. Check **Required reviewers** checkbox
7. Add GitHub users who can approve production deployments
8. Click **Add secret** and add your `RAILWAY_TOKEN` if not already present
9. Click **Save protection rules**

**Result:** All production deployments will wait for approval from designated reviewers.

### Comparing Environments

| Aspect            | Development                              | Staging                                  | Production                           |
| ----------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------ |
| **Trigger**       | Automatic on PR / Manual                 | Auto-deploy on `main` (Railway) / Manual | Manual (workflow_dispatch)           |
| **Branch**        | Any branch                               | `main` only                              | `main` only                          |
| **Staging Gate**  | No                                       | No                                       | Yes - commit must succeed in staging |
| **Approval**      | Required                                 | N/A (auto) / Required (manual)           | Required                             |
| **Railway Env**   | development                              | staging                                  | production                           |
| **Use Case**      | Testing and validation                   | Pre-production verification              | Live users                           |
| **Workflow File** | `test-deploy-dev.yml` / `deploy-dev.yml` | Railway auto / `deploy-staging.yml`      | `deploy-production.yml`              |

### Troubleshooting Production Deployment

#### Preflight: "No successful staging deployment found"

**Problem:** The production workflow fails at the preflight step with a staging verification error.

**Solutions:**

1. **Commit not on `main`**: Ensure the commit has been merged to `main` and Railway has auto-deployed it to staging
2. **Staging deployment still in progress**: Wait for Railway to finish the staging deployment, then re-run the workflow
3. **Staging deployment failed**: Check the Railway dashboard for the staging environment — the deployment may have failed. Fix the issue, push a new commit, and try again
4. **Wrong environment name**: Verify the `RAILWAY_STAGING_DEPLOY_ENV_NAME` variable matches the GitHub Deployments environment name that Railway uses (check **Settings > Environments** in your GitHub repository)
5. **API response debugging**: Check the workflow logs for the GitHub Deployments API response output to identify the issue

#### Preflight: "Production deployments are only allowed from the main branch"

**Problem:** The production workflow fails because it was triggered from a non-main branch.

**Solution:** Go to Actions > "Manual Deploy to Production" > "Run workflow" and ensure **Branch: main** is selected in the dropdown.

#### "Sing Portfolio / production" Environment Not Found

**Problem:** Workflow fails because the production environment doesn't exist in GitHub.

**Solution:**

1. Go to your GitHub repository
2. Navigate to **Settings** > **Environments**
3. Click **New environment**
4. Name it exactly: **"Sing Portfolio / production"**
5. Click **Configure environment**
6. Add required reviewers (optional but recommended)
7. Click **Save protection rules**

#### Production Deployment Fails with Environment Error

**Problem:** Railway reports "environment not found" or similar error.

**Solution:**

1. Verify the production environment exists in Railway:
   - Go to Railway Dashboard
   - Select "Sing Portfolio" project
   - Check that a "production" environment exists
2. If missing, create it:
   - Click the environment dropdown
   - Select "New environment"
   - Name it: `production`
3. Configure environment variables (if needed):
   - Go to the production environment in Railway
   - Add all necessary environment variables
   - Ensure they match your production requirements

#### Permission Denied Error

**Problem:** Deployment fails with permission or authentication error.

**Solution:**

1. Verify the Railway token has production deployment permissions:
   - Go to Railway Account Settings > Tokens
   - Check the token permissions
2. Regenerate the token if needed:
   - Create a new token in Railway
   - Update the `RAILWAY_TOKEN` secret in GitHub
3. Verify the token secret exists:
   - Go to Settings > Secrets and variables > Actions
   - Confirm `RAILWAY_TOKEN` is present

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway CLI Documentation](https://docs.railway.app/reference/cli)
- [Railway Environments Guide](https://docs.railway.app/develop/environments)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment/introduction)

## Next Steps

After verifying successful deployment:

1. **Set up approval process** - Train team members on approving deployments
2. **Configure monitoring** - Set up Railway alerts for deployment failures
3. **Document development URL** - Add the development URL to your team documentation
4. **Test end-to-end** - Verify the deployed development application functions correctly
5. **Add deployment notifications** - Consider Slack or email notifications for deployment status
6. **Plan production deployment** - When ready, extend this workflow to production environment

### Approval Workflow for Teams

Once set up, here's the typical approval workflow:

1. Developer creates PR to `main` with v2 changes
2. Automated tests run (lint, type-check, unit tests)
3. Tests pass → Deployment waits for approval
4. Reviewer sees "Review deployment" button in PR checks
5. Reviewer clicks, reviews changes, and approves
6. Deployment automatically proceeds to Railway
7. Application deploys to development environment in Railway

---

**Questions or issues?** Check the [Troubleshooting](#troubleshooting) section or review the GitHub Actions workflow logs for detailed error messages.
