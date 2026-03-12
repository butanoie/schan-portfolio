/**
 * Next.js instrumentation hook for server-side Sentry initialization.
 *
 * Next.js calls `register()` once when the server starts. It dynamically
 * imports the appropriate Sentry config based on the runtime (Node.js or edge).
 *
 * `onRequestError` is called by Next.js for unhandled server-side errors,
 * forwarding them to Sentry automatically.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#create-or-update-your-instrumentationts-file
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Registers Sentry for the active Next.js server runtime.
 *
 * Dynamically imports the Node.js or edge Sentry config depending on
 * `process.env.NEXT_RUNTIME`. Called once by Next.js at server startup.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

/**
 * Captures unhandled server-side request errors and sends them to Sentry.
 *
 * Next.js invokes this for any uncaught error during request processing,
 * providing the error, request details, and router context.
 */
export const onRequestError = Sentry.captureRequestError;
