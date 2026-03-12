/**
 * Sentry server-side configuration.
 *
 * Initializes Sentry error tracking on the Node.js server runtime.
 * Unlike the client config, DNT is not checked here because:
 * - `navigator` is unavailable server-side
 * - Server errors should always be captured regardless of client preferences
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // Capture 100% of errors — portfolio is low-traffic, every error matters
    sampleRate: 1.0,

    // Sample 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Privacy: do not send personally identifiable information
    sendDefaultPii: false,
  });
}
