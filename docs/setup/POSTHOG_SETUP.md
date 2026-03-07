# PostHog Web Analytics Setup

## Overview

This project uses [PostHog](https://posthog.com) for privacy-friendly web analytics. PostHog tracks pageviews and user behavior without requiring cookie banners, using sessionStorage-based persistence (cookieless mode).

**Free Tier:** 1M events/month per project, unlimited team members, no credit card required.

## Architecture

```
Browser (posthog-js SDK)
  │
  ├── Production → PostHog "Sing's Portfolio" project (production data)
  ├── Dev/Staging → PostHog "Portfolio - Development" project (test data)
  └── Local dev   → No tracking (SDK skips initialization)
```

### How It Works

The `PostHogProvider` component (`v2/src/components/PostHogProvider.tsx`) wraps the application in `v2/app/layout.tsx`. On mount, it checks three conditions before initializing PostHog:

1. **Environment:** `NODE_ENV` must be `"production"` (skips local dev)
2. **API Key:** `NEXT_PUBLIC_POSTHOG_KEY` must be set (skips if missing)
3. **Do Not Track:** Browser DNT setting must not be enabled (respects user privacy)

If all conditions pass, PostHog initializes with:
- `persistence: "sessionStorage"` — no cookies, no banner required
- `capture_pageview: true` — automatic pageview tracking
- `disable_session_recording: true` — conserves free tier quota
- IP address stripping via `sanitize_properties`

## Prerequisites

- PostHog account at [posthog.com](https://posthog.com)
- Two PostHog projects (production + development)
- Railway environments configured (see [Railway Deployment](RAILWAY_DEPLOYMENT.md))

## Setup Steps

### Step 1: Create PostHog Account

1. Go to [posthog.com](https://posthog.com) and sign up
2. Select **US** or **EU** data region (note which you choose — it determines the host URL)
3. Complete onboarding

### Step 2: Create PostHog Projects

You need two projects to separate production analytics from development/test traffic.

**Production project:**
1. During onboarding (or via the project switcher in the top nav), create a project
2. Name it something identifiable (e.g., "Sing's Portfolio" or "Portfolio - Production")
3. Go to **Settings** (gear icon) → **Project API Key**
4. Copy the API key (starts with `phc_`)

**Development project:**
1. Click the **project name** in the top navigation bar to open the project switcher
2. Click **New project**
3. Name it **Portfolio - Development**
4. Select the same data region as your production project
5. Go to **Settings** (gear icon) → **Project API Key**
6. Copy the API key

You should now have two API keys:
- Production: `phc_xxxx...` (your production project key)
- Development: `phc_yyyy...` (your development project key)

### Step 3: Configure Railway Environment Variables

Set the PostHog environment variables in each Railway environment. The API key determines which PostHog project receives the data.

#### Production environment
1. Go to [railway.com](https://railway.com) → your portfolio project
2. Click on your **production** service
3. Go to the **Variables** tab
4. Add two variables:
   - `NEXT_PUBLIC_POSTHOG_KEY` = your production PostHog API key
   - `NEXT_PUBLIC_POSTHOG_HOST` = `https://us.i.posthog.com` (or `https://eu.i.posthog.com` for EU)
5. Redeploy for changes to take effect

#### Development environment (remote dev)
1. Switch to your **development** service/environment in Railway
2. Go to the **Variables** tab
3. Add two variables:
   - `NEXT_PUBLIC_POSTHOG_KEY` = your development PostHog API key
   - `NEXT_PUBLIC_POSTHOG_HOST` = `https://us.i.posthog.com` (or `https://eu.i.posthog.com` for EU)
4. Redeploy for changes to take effect

#### Staging environment
1. Switch to your **staging** service/environment in Railway
2. Add the same two variables using the **development** PostHog API key
3. Redeploy for changes to take effect

### Step 4: Update Local Environment (Optional)

For local development, PostHog does **not** initialize (since `NODE_ENV=development`). However, if you want to test PostHog locally, you can temporarily add the development key to `v2/.env.local`:

```env
# Only add these if you need to test PostHog locally
# Remember to also set NODE_ENV=production in your dev command
NEXT_PUBLIC_POSTHOG_KEY=phc_your_development_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Under normal development, you do **not** need these variables set locally.

### Step 5: Verify Setup

#### Verify production tracking
1. Deploy to production with the environment variables set
2. Visit your production URL
3. Open browser DevTools → **Network** tab
4. Filter for `posthog`
5. You should see requests to `us.i.posthog.com` (or `eu.i.posthog.com`)
6. Go to your production PostHog project → **Activity** to see the pageview event

#### Verify development tracking
1. Deploy to your development Railway environment
2. Visit the development URL
3. Same network check — requests should go to PostHog
4. Go to your development PostHog project → **Activity** to see events

#### Verify local dev does not track
1. Run `npm run dev` from `v2/`
2. Visit `http://localhost:3000`
3. Open DevTools → Network tab, filter for `posthog`
4. No PostHog requests should appear

#### Verify Do Not Track is respected
1. Enable Do Not Track in your browser:
   - **Chrome:** Settings → Privacy and security → Send a "Do Not Track" request
   - **Firefox:** Settings → Privacy & Security → Send websites a "Do Not Track" request
   - **Safari:** DNT is not supported (always returns null)
2. Visit your production URL
3. No PostHog requests should appear in the Network tab

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Yes (for tracking) | PostHog project API key (public, safe for client code) | `phc_abc123...` |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog instance URL (defaults to `https://us.i.posthog.com`) | `https://eu.i.posthog.com` |

## Environment Matrix

| Environment | `NODE_ENV` | PostHog Key | PostHog Project | Tracks? |
|-------------|-----------|-------------|-----------------|---------|
| Local dev | `development` | Not set | N/A | No |
| Remote dev (Railway) | `production` | Development key | Portfolio - Development | Yes |
| Staging (Railway) | `production` | Development key | Portfolio - Development | Yes |
| Production (Railway) | `production` | Production key | Sing's Portfolio | Yes |

## Privacy Configuration

PostHog is configured for maximum privacy:

| Setting | Value | Effect |
|---------|-------|--------|
| `persistence` | `sessionStorage` | No cookies — data cleared when tab closes |
| `respect_dnt` | Via code check | Users with Do Not Track enabled are not tracked |
| `sanitize_properties` | Strips `$ip` | IP addresses removed from events |
| `disable_session_recording` | `true` | No screen recordings captured |
| Production only | Via code check | No tracking in development or test environments |

This configuration means:
- No cookie consent banner is required
- No personally identifiable information (PII) is collected
- Users can opt out via their browser's Do Not Track setting
- Session data does not persist across browser sessions

## Files

| File | Purpose |
|------|---------|
| `v2/src/components/PostHogProvider.tsx` | Client component that initializes PostHog |
| `v2/app/layout.tsx` | Root layout — wraps app with PostHogProvider |
| `v2/.env.example` | Documents required environment variables |
| `v2/src/__tests__/components/PostHogProvider.test.tsx` | Unit tests for PostHogProvider |

## Troubleshooting

### No events appearing in PostHog

**Problem:** PostHog dashboard shows no events after deployment.

**Solutions:**
1. Verify `NEXT_PUBLIC_POSTHOG_KEY` is set in Railway environment variables
2. Verify the key matches the correct PostHog project
3. Check that the Railway service was redeployed after adding variables
4. Open browser DevTools → Network tab and filter for `posthog` — if no requests appear, the SDK is not initializing
5. Check the browser console for PostHog errors

### Events going to wrong project

**Problem:** Development traffic appearing in production PostHog project.

**Solutions:**
1. Verify each Railway environment has the correct `NEXT_PUBLIC_POSTHOG_KEY`:
   - Production Railway → production PostHog key
   - Development/Staging Railway → development PostHog key
2. Redeploy after changing variables

### PostHog requests blocked by ad blocker

**Problem:** Ad blockers (uBlock Origin, etc.) may block requests to `posthog.com`.

**Solutions:**
- This is expected behavior — users with ad blockers will not be tracked
- For more complete tracking, consider setting up a [reverse proxy](https://posthog.com/docs/advanced/proxy) (optional, not required for a portfolio site)

## Related Documentation

- [Phase 7 Detailed Plan](../active/PHASE7_DETAILED_PLAN.md) — Full Phase 7 implementation plan
- [Railway Deployment](RAILWAY_DEPLOYMENT.md) — Railway environment configuration
- [PostHog Documentation](https://posthog.com/docs) — Official PostHog docs
- [PostHog Free Tier](https://posthog.com/pricing) — Pricing and free tier limits
