import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';
import posthog from 'posthog-js';

/**
 * Sends a single Core Web Vital metric to PostHog as a custom event.
 *
 * Each metric is captured as a `$web_vitals` event with structured properties
 * that allow filtering and aggregation in PostHog dashboards.
 *
 * @param metric - The web-vitals Metric object containing name, value, rating, etc.
 *
 * @example
 * ```ts
 * // Called automatically by web-vitals callbacks
 * sendMetricToPostHog({ name: "LCP", value: 1234, rating: "good", ... });
 * ```
 */
function sendMetricToPostHog(metric: Metric): void {
  posthog.capture('$web_vitals', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
    metric_navigation_type: metric.navigationType,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

/**
 * Registers Core Web Vitals reporting callbacks that send metrics to PostHog.
 *
 * Measures four key metrics:
 * - **LCP** (Largest Contentful Paint) — loading performance
 * - **CLS** (Cumulative Layout Shift) — visual stability
 * - **INP** (Interaction to Next Paint) — interactivity responsiveness
 * - **TTFB** (Time to First Byte) — server responsiveness
 *
 * Each metric fires once per page load and is sent as a `$web_vitals` PostHog
 * event. Call this after `posthog.init()` to ensure the PostHog client is ready.
 *
 * @example
 * ```ts
 * posthog.init(key, config);
 * reportWebVitals();
 * ```
 */
export function reportWebVitals(): void {
  onCLS(sendMetricToPostHog);
  onINP(sendMetricToPostHog);
  onLCP(sendMetricToPostHog);
  onTTFB(sendMetricToPostHog);
}
