'use client';

import { useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';
import { reportWebVitals } from '@/src/lib/webVitals';
import { isDoNotTrackEnabled } from '@/src/lib/privacy';

/**
 * Props for the PostHogProvider component.
 */
interface PostHogProviderProps {
  /** Child components to render */
  children: ReactNode;
}

/**
 * Removes potentially identifying properties from PostHog events.
 * Strips the `$ip` property to prevent IP address collection.
 *
 * @param properties - The event properties to sanitize
 * @returns The sanitized properties object with `$ip` removed
 */
function sanitizeProperties(
  properties: Record<string, unknown>
): Record<string, unknown> {
  delete properties['$ip'];
  return properties;
}

/**
 * Determines whether PostHog should initialize based on environment
 * and browser settings.
 *
 * PostHog only initializes when:
 * 1. Running in production (NODE_ENV === "production")
 * 2. The PostHog API key environment variable is set
 * 3. The browser's Do Not Track setting is not enabled
 *
 * This guard controls all PostHog-dependent features, including event
 * capture and Core Web Vitals reporting via {@link reportWebVitals}.
 *
 * @returns true if PostHog should initialize, false otherwise
 */
export function shouldInitializePostHog(): boolean {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasKey = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
  const dntEnabled = isDoNotTrackEnabled();
  return isProduction && hasKey && !dntEnabled;
}

/**
 * PostHog analytics provider for privacy-friendly web analytics.
 *
 * Initializes PostHog in cookieless mode (sessionStorage only) so no cookie
 * banner is required. Respects the browser's Do Not Track setting and only
 * initializes in production to avoid polluting analytics with dev/test data.
 *
 * Features:
 * - Cookieless tracking via sessionStorage persistence
 * - Automatic pageview capture
 * - Core Web Vitals reporting (LCP, CLS, INP, TTFB)
 * - Do Not Track (DNT) browser setting respected
 * - Production-only initialization (no-ops in dev/test)
 *
 * @param props - The component props
 * @param props.children - Child components to render
 * @returns The children wrapped with PostHog initialization
 *
 * @example
 * ```tsx
 * <PostHogProvider>
 *   <App />
 * </PostHogProvider>
 * ```
 */
export default function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (!shouldInitializePostHog()) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      // Route through /ingest reverse proxy to avoid Safari ITP and ad blockers
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
      ui_host: 'https://us.posthog.com',
      // Privacy: use sessionStorage instead of cookies (no banner required)
      persistence: 'sessionStorage',
      // Automatically capture pageviews on route changes
      capture_pageview: true,
      // Disable session recording on free tier to conserve quota
      disable_session_recording: true,
      // Do not store any personal data — strip IP addresses
      sanitize_properties: sanitizeProperties,
    });

    // Report Core Web Vitals (LCP, CLS, INP, TTFB) to PostHog
    reportWebVitals();
  }, []);

  return <>{children}</>;
}
