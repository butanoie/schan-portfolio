'use client';

/**
 * Root-level error boundary for the Next.js App Router.
 *
 * This component catches errors that occur in the root layout itself —
 * errors that no other `error.tsx` boundary can catch. Because it replaces
 * the entire document, it must render its own `<html>` and `<body>` tags.
 *
 * **i18n exception:** Strings are hardcoded in English because the
 * LocaleProvider (which supplies translations) is part of the root layout
 * that has already crashed. This is a deliberate trade-off — a readable
 * English fallback is better than a blank page.
 *
 * @param props - Error boundary props provided by Next.js
 * @param props.error - The error that was thrown
 * @param props.reset - Function to re-render the root layout and attempt recovery
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/** Props provided by Next.js to the global error boundary. */
interface GlobalErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string };
  /** Function to attempt recovery by re-rendering the root layout */
  reset: () => void;
}

/**
 * Root-level error boundary that replaces the entire document on crash.
 *
 * Reports the error to Sentry and provides a "Try again" recovery button.
 * Renders its own `<html>/<body>` because the root layout has already failed.
 *
 * @param props - Error boundary props provided by Next.js
 * @param props.error - The error that was thrown
 * @param props.reset - Function to re-render the root layout and attempt recovery
 * @returns A minimal error page with recovery option
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    // i18n exception: hardcoded English — LocaleProvider is unavailable at this level
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '30rem' }}>
            An unexpected error occurred. Please try again, or refresh the page
            if the problem persists.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '0.375rem',
              backgroundColor: '#fff',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
