/**
 * Shared privacy utilities used by analytics and error tracking services.
 *
 * Centralizes Do Not Track (DNT) detection so that PostHog, Sentry, and
 * any future third-party integrations share a single, consistent check.
 */

/**
 * Checks whether the browser's Do Not Track setting is enabled.
 *
 * Inspects both `navigator.doNotTrack` (standard) and `window.doNotTrack`
 * (legacy IE/Edge) for the values `"1"` or `"yes"`.
 *
 * Returns `false` during server-side rendering (no `window` available).
 *
 * @returns true if DNT is enabled, false otherwise
 *
 * @example
 * ```ts
 * if (isDoNotTrackEnabled()) {
 *   // Skip initializing analytics/tracking
 * }
 * ```
 */
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const dnt =
    navigator.doNotTrack ||
    (window as unknown as Record<string, unknown>).doNotTrack;
  return dnt === '1' || dnt === 'yes';
}
