# Core Web Vitals Reporting to PostHog (Phase 7.2)

**Date:** 2026-03-10
**Time:** 14:25:42 EDT
**Type:** Feature
**Phase:** 7.2
**Version:** v7.2.0

## Summary

Added Core Web Vitals (CWV) reporting to PostHog, completing Phase 7.2 of the modernization plan. The `web-vitals` library now captures LCP, CLS, INP, and TTFB metrics on every page load and sends them as structured `$web_vitals` events to PostHog for performance monitoring.

---

## Changes Implemented

### 1. Web Vitals Reporting Module

Created a new module to capture and forward Core Web Vitals to PostHog.

**Created:**
- `v2/src/lib/webVitals.ts` — `reportWebVitals()` function that registers `web-vitals` callbacks for LCP, CLS, INP, and TTFB, sending each metric as a `$web_vitals` PostHog event with structured properties (`metric_name`, `metric_value`, `metric_rating`, `metric_delta`, `metric_id`, `metric_navigation_type`, `page_path`)

### 2. PostHog Provider Integration

Wired `reportWebVitals()` into the existing PostHog provider so it fires automatically after `posthog.init()`.

**Modified:**
- `v2/src/components/PostHogProvider.tsx` — Added `reportWebVitals()` call after PostHog initialization

### 3. Tests

Added comprehensive unit tests for the web vitals module.

**Created:**
- `v2/src/__tests__/lib/webVitals.test.ts` — 180-line test suite covering metric capture, property structure, and callback registration for all four CWV metrics

### 4. Documentation Updates

Updated project documentation to reflect Phase 7.2 completion and CWV setup instructions.

**Modified:**
- `README.md` — Updated phase status
- `docs/active/MODERNIZATION_PLAN.md` — Marked Phase 7.2 as complete
- `docs/active/PHASE7_DETAILED_PLAN.md` — Updated task checklist and status
- `docs/active/PROJECT_CONTEXT.md` — Updated current status and context
- `docs/setup/POSTHOG_SETUP.md` — Added CWV configuration and dashboard setup guidance

### 5. Dependencies

**Modified:**
- `v2/package.json` / `v2/package-lock.json` — Added `web-vitals` library

---

## Technical Details

### Metrics Captured

| Metric | Full Name | Measures |
|--------|-----------|----------|
| LCP | Largest Contentful Paint | Loading performance |
| CLS | Cumulative Layout Shift | Visual stability |
| INP | Interaction to Next Paint | Interactivity responsiveness |
| TTFB | Time to First Byte | Server responsiveness |

### PostHog Event Structure

Each metric is sent as a `$web_vitals` event with these properties:

```typescript
{
  metric_name: string;       // "LCP", "CLS", "INP", "TTFB"
  metric_value: number;      // Raw metric value
  metric_rating: string;     // "good", "needs-improvement", "poor"
  metric_delta: number;      // Delta since last report
  metric_id: string;         // Unique metric instance ID
  metric_navigation_type: string;  // Navigation type
  page_path: string;         // Current page path
}
```

---

## Validation & Testing

- ✅ Unit tests pass for all four CWV metrics
- ✅ PostHog capture calls verified with correct event name and properties
- ✅ `reportWebVitals()` integrated into PostHog provider initialization flow

---

## Impact Assessment

- **Performance monitoring**: Enables tracking real-user Core Web Vitals in PostHog dashboards
- **SEO insights**: CWV are Google ranking signals — monitoring helps identify and fix performance regressions
- **No runtime overhead**: `web-vitals` library uses browser PerformanceObserver API with minimal footprint

---

## Related Files

**Created:**
- `v2/src/lib/webVitals.ts`
- `v2/src/__tests__/lib/webVitals.test.ts`

**Modified:**
- `v2/src/components/PostHogProvider.tsx`
- `v2/package.json`
- `v2/package-lock.json`
- `README.md`
- `docs/active/MODERNIZATION_PLAN.md`
- `docs/active/PHASE7_DETAILED_PLAN.md`
- `docs/active/PROJECT_CONTEXT.md`
- `docs/setup/POSTHOG_SETUP.md`

---

## Status

✅ COMPLETE — Phase 7.2 Core Web Vitals reporting is fully implemented and tested.
