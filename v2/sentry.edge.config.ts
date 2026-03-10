/**
 * Sentry edge runtime configuration.
 *
 * Initializes Sentry error tracking for the Next.js edge runtime
 * (middleware, edge API routes). Same behavior as the server config —
 * DNT is not checked because `navigator` is unavailable in edge runtime.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // Capture 100% of errors — portfolio is low-traffic, every error matters
    sampleRate: 1.0,

    // Sample 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Privacy: do not send personally identifiable information
    sendDefaultPii: false,
  });
}
