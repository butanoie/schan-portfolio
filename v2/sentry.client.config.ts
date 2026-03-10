/**
 * Sentry client-side configuration.
 *
 * Initializes Sentry error tracking in the browser. Conditional on:
 * 1. Production environment (`NODE_ENV === "production"`)
 * 2. DSN being set (`NEXT_PUBLIC_SENTRY_DSN`)
 * 3. Browser Do Not Track (DNT) not enabled — consistent with PostHog privacy behavior
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from "@sentry/nextjs";
import { isDoNotTrackEnabled } from "@/src/lib/privacy";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && dsn && !isDoNotTrackEnabled()) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // Capture 100% of errors — portfolio is low-traffic, every error matters
    sampleRate: 1.0,

    // Sample 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Disable session replay (not needed for portfolio site)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Privacy: do not send personally identifiable information
    sendDefaultPii: false,
  });
}
