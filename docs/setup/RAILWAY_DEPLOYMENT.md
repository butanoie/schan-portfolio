# Railway Staging Deployment Setup

## Overview

This project automatically deploys to Railway's staging environment whenever a pull request to the `staging` branch passes all tests. This enables continuous staging deployments directly from your GitHub workflow.

**Project:** Sing Portfolio
**Environment:** Staging
**Deployment Trigger:** Every PR to `staging` branch (after lint, type check, and unit tests pass)
**Deploy Directory:** `v2/` (Next.js application)

## Prerequisites

Before setting up automatic deployments, ensure you have:

1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **Railway Project Created** - "Sing Portfolio" project must exist in your Railway account
3. **Staging Environment** - Create a "staging" environment in your Railway project
4. **GitHub Repository Access** - Push access to add secrets

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

### Step 3: Add Secrets to GitHub

Add **two** repository secrets:

**Secret 1 - Railway Token:**
1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. **Name:** `RAILWAY_TOKEN`
5. **Value:** Paste the token you copied from Railway
6. Click **Add secret**

**Secret 2 - Railway Project ID:**
1. Still in **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. **Name:** `RAILWAY_PROJECT_ID`
4. **Value:** Paste the project ID you copied from Railway
5. Click **Add secret**

### Step 4: Verify Deployment Configuration

The workflow is already configured in [`.github/workflows/run-tests.yml`](.github/workflows/run-tests.yml).

**Deploy job configuration:**
```yaml
deploy:
  needs: tests
  runs-on: ubuntu-latest
  if: github.base_ref == 'staging'
  steps:
    - name: Deploy to Railway Staging
      working-directory: v2
      run: railway up --project=${{ secrets.RAILWAY_PROJECT_ID }} --environment=staging
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

✅ Confirm both secrets are added:
- `RAILWAY_TOKEN` - Your Railway API token
- `RAILWAY_PROJECT_ID` - Your Railway project ID

### Step 5: Test the Deployment

1. Create a test branch from `staging`:
   ```bash
   git checkout staging
   git checkout -b test-deployment
   ```

2. Make a small change and commit:
   ```bash
   git commit --allow-empty -m "test: trigger deployment workflow"
   git push origin test-deployment
   ```

3. Create a Pull Request targeting the `staging` branch

4. Watch the GitHub Actions workflow:
   - Tests will run first
   - If all tests pass, the deployment job will start
   - Check the "Deploy to Railway Staging" step for logs

5. Verify deployment in Railway Dashboard:
   - Go to your "Sing Portfolio" project
   - Check the "staging" environment
   - Look for the new deployment in the deployments list

## Workflow Behavior

### When Deployment Runs
✅ PR is opened against `staging` branch
✅ All lint, type check, and unit tests pass

### When Deployment Does NOT Run
❌ PR targets `main` branch
❌ Tests fail
❌ Type checking fails
❌ Linting fails

### Deployment Environment Variables

The deployment uses Railway's environment variables configured in your Railway project settings. These are loaded automatically and do not need to be configured in GitHub.

If you need to add or modify environment variables:

1. Go to Railway Dashboard
2. Select "Sing Portfolio" project
3. Go to "staging" environment
4. Click **Variables** or **Raw Editor**
5. Add/modify variables as needed
6. Redeploy by triggering a new workflow run

## Configuration Reference

### Railway Project Details
- **Project Name:** Sing Portfolio
- **Environment:** staging
- **Deploy Source:** GitHub repository (v2/ directory)
- **Framework:** Next.js 16+

### GitHub Workflow Configuration
- **Workflow File:** `.github/workflows/run-tests.yml`
- **Trigger:** Pull requests to `staging` branch
- **Build Directory:** `v2/`
- **Token Secret Name:** `RAILWAY_TOKEN`
- **Project ID Secret Name:** `RAILWAY_PROJECT_ID`
- **Deployment Command:** `railway up --project=${{ secrets.RAILWAY_PROJECT_ID }} --environment=staging`

## Troubleshooting

### Deployment Job Not Running
**Problem:** The deploy job doesn't appear in the workflow run.

**Solutions:**
- Verify the PR targets the `staging` branch (not `main`)
- Check that all previous jobs (lint, type-check, test) completed successfully
- Review the workflow file for syntax errors

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
1. Verify the `RAILWAY_PROJECT_ID` secret is set correctly:
   - Go to Settings > Secrets and variables > Actions
   - Confirm `RAILWAY_PROJECT_ID` is present and not empty
2. Verify the project ID is correct:
   - Go to Railway Dashboard > Sing Portfolio > Project Settings
   - Copy the Project ID again and update the secret
3. Confirm the Railway API token has permissions to deploy to this project
4. Verify the staging environment exists in your Railway project

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
   railway up --environment=staging
   ```

### Option 2: Using Project ID

If you prefer not to link, you can deploy directly using the project ID:

```bash
cd v2
railway up --project=YOUR_PROJECT_ID --environment=staging
```

Replace `YOUR_PROJECT_ID` with your Railway project ID.

## Monitoring Deployments

### View Deployment History
1. Go to Railway Dashboard
2. Select "Sing Portfolio" project
3. Select "staging" environment
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

1. **Set up monitoring** - Configure Railway alerts for deployment failures
2. **Document staging URL** - Add the staging URL to your team documentation
3. **Test end-to-end** - Verify the deployed staging application functions correctly
4. **Plan production deployment** - Consider extending this workflow to production when ready

---

**Questions or issues?** Check the [Troubleshooting](#troubleshooting) section or review the GitHub Actions workflow logs for detailed error messages.
