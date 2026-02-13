# Railway Development Deployment Setup

## Overview

This project automatically deploys to Railway's development environment whenever a pull request to the `main` branch passes all tests. The deployment is smart—it only runs tests and deploys if changes are detected in the `v2/` folder or GitHub workflow files. Manual approval is required before deployment proceeds.

**Project:** Sing Portfolio
**Environment:** Development
**Deployment Trigger:** Every PR to `main` branch with v2/ or workflow changes (after lint, type check, and unit tests pass)
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

**Why the difference?**
- **Token** is a secret because it's an authentication credential (sensitive)
- **Project ID & Service Name** are variables because they're just configuration identifiers (non-sensitive)

### Step 5: Verify Deployment Configuration

The workflow is already configured in [`.github/workflows/run-tests.yml`](.github/workflows/run-tests.yml).

**Workflow Structure:**
```yaml
# Smart change detection
check-changes:
  # Detects if v2/ folder or .github/workflows/ changed
  # Outputs: has-v2-changes (true/false)

# Tests only run if changes detected
tests:
  needs: check-changes
  if: needs.check-changes.outputs.has-v2-changes == 'true'
  # Runs: lint, type-check, test

# Deployment only runs if tests pass
deploy:
  needs: [check-changes, tests]
  if: needs.check-changes.outputs.has-v2-changes == 'true'
  environment: "Sing Portfolio / development"
```

**Deploy job configuration:**
```yaml
deploy:
  needs: [check-changes, tests]
  runs-on: ubuntu-latest
  if: needs.check-changes.outputs.has-v2-changes == 'true'
  environment: "Sing Portfolio / development"
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Install Railway CLI
      run: npm install -g @railway/cli

    - name: Deploy to Railway Development
      run: railway up --project=${{ vars.RAILWAY_PROJECT_ID }} --service=${{ vars.RAILWAY_SERVICE_NAME }} --environment=development
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Explanation:**
- **Smart Detection**: The `check-changes` job prevents unnecessary test runs when only docs or other non-v2 files change
- **Tests Conditional**: Tests only run if v2/ or workflow files changed (saves CI time)
- **Deployment Conditional**: Deployment only runs if changes detected AND tests pass
- `--project`: Specifies which Railway project to deploy to (using the unique project ID from variables)
- `--service`: Specifies which service within the project to deploy (loaded from variables)
- `--environment`: Specifies the deployment environment (development)
- `RAILWAY_TOKEN`: Authentication token from secrets (encrypted, sensitive)
- **Environment Protection**: The "Sing Portfolio / development" environment requires manual approval before deployment

✅ Confirm all configuration is added:
- **Secret:** `RAILWAY_TOKEN` - Your Railway API token
- **Variable:** `RAILWAY_PROJECT_ID` - Your Railway project ID
- **Variable:** `RAILWAY_SERVICE_NAME` - Your Railway service name

✅ Confirm environment approval is configured:
- Go to **Settings** > **Environments** > **Sing Portfolio / development**
- Add **Required reviewers** (GitHub users who must approve deployments)
- Consider adding team leads or project maintainers

### Step 7: Configure Deployment Approval (Optional but Recommended)

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

### Step 6: Test the Deployment

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

⚠️ **Important:** The workflow ONLY triggers on changes in the `v2/` folder or `.github/workflows/` folder. Changes to docs or other files won't trigger the workflow.

## Workflow Behavior

### When Tests and Deployment Run
✅ PR is opened against `main` branch
✅ Changes detected in `v2/` folder OR `.github/workflows/` folder
✅ All lint, type check, and unit tests pass
✅ Manual approval provided by configured reviewer(s)

### When Tests Skip (Workflow Still Runs)
⏭️ PR targets `main` branch
⏭️ Changes only in `docs/`, `changelog/`, or other non-v2 folders
⏭️ The workflow runs but `check-changes` outputs `has-v2-changes=false`
⏭️ Tests and deployment jobs are skipped (saves CI time)

### When Deployment Does NOT Run
❌ PR targets a branch other than `main`
❌ Tests fail
❌ Type checking fails
❌ Linting fails
❌ Manual approval denied or not provided

## Smart Change Detection

The workflow includes intelligent change detection to save CI time and resources. The `check-changes` job identifies whether the `v2/` application folder or `.github/workflows/` folder was modified.

### How It Works

1. **PR Opened**: When you open a PR to `main`, the workflow runs
2. **Change Detection**: The `check-changes` job compares files changed against the base branch
3. **Decision**:
   - If `v2/` or `.github/workflows/` files changed → Tests and deployment jobs run
   - If only `docs/`, `changelog/`, or other folders changed → Tests and deployment jobs are skipped (fast feedback)
4. **Result**: You see clear indication of whether tests ran or were skipped

### Benefits

- ✅ **Saves CI Time** - No unnecessary test runs for documentation-only changes
- ✅ **Faster Feedback** - Immediate result for doc-only PRs without waiting for tests
- ✅ **Efficient Resources** - Reduces compute costs and CI pipeline strain
- ✅ **Clear Status** - GitHub shows which jobs ran and why

### Example Scenarios

| Changes | Tests Run? | Deploy? | Why |
|---------|-----------|--------|-----|
| Changes in `v2/src/` | ✅ Yes | ✅ Yes (after approval) | Application code changed |
| Changes in `.github/workflows/` | ✅ Yes | ✅ Yes (after approval) | Workflow configuration changed |
| Changes in `docs/` only | ❌ No | ❌ No | Only documentation changed |
| Changes in `changelog/` only | ❌ No | ❌ No | Only changelog changed |
| Mix of `v2/` + `docs/` | ✅ Yes | ✅ Yes (after approval) | Application code changed |

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
- **Workflow File:** `.github/workflows/run-tests.yml`
- **Workflow Name:** "Lint, Type Check, Unit Test, and Deploy"
- **Trigger:** Pull requests to `main` branch
- **Smart Execution:** Only runs tests/deploy if `v2/` or `.github/workflows/` folders changed
- **Change Detection:** First job (`check-changes`) determines if tests run
- **Tests:** Only run if changes detected (lint, type-check, unit tests)
- **Environment:** `Sing Portfolio / development` (requires manual approval for deployment)
- **Deployment Gate:** Manual approval from configured reviewers before deployment
- **Deploy Source:** Repository root (Railway automatically detects `v2/` as the app directory)
- **Authentication Secret:** `RAILWAY_TOKEN` (encrypted)
- **Project ID Variable:** `RAILWAY_PROJECT_ID` (non-sensitive config)
- **Service Name Variable:** `RAILWAY_SERVICE_NAME` (non-sensitive config)
- **Deployment Command:** `railway up --project=${{ vars.RAILWAY_PROJECT_ID }} --service=${{ vars.RAILWAY_SERVICE_NAME }} --environment=development`
- **Best Practice:** Token stored as secret (sensitive), configuration stored as variables (non-sensitive)

## Troubleshooting

### Deployment Job Not Running
**Problem:** The deploy job doesn't appear in the workflow run.

**Solutions:**
- Verify the PR targets the `main` branch
- Verify changes are in the `v2/` folder or `.github/workflows/` folder (check the `check-changes` job output)
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

## Manual Deployment

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
