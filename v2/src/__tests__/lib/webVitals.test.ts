/**
 * Tests for the Core Web Vitals reporting utility.
 *
 * Verifies:
 * - All four metric callbacks (CLS, INP, LCP, TTFB) are registered
 * - Metrics are sent to PostHog with the correct event name and properties
 * - Page path is included from window.location
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Metric } from "web-vitals";

// vi.hoisted ensures these are available when vi.mock factory runs (hoisted above imports)
const { mockOnCLS, mockOnINP, mockOnLCP, mockOnTTFB } = vi.hoisted(() => ({
  mockOnCLS: vi.fn(),
  mockOnINP: vi.fn(),
  mockOnLCP: vi.fn(),
  mockOnTTFB: vi.fn(),
}));

vi.mock("web-vitals", () => ({
  onCLS: mockOnCLS,
  onINP: mockOnINP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
}));

// Mock posthog-js
vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
  },
}));

import posthog from "posthog-js";
import { reportWebVitals } from "@/src/lib/webVitals";

/**
 * Creates a fake web-vitals Metric object for testing.
 *
 * @param overrides - Properties to override on the default metric
 * @returns A Metric object with sensible defaults
 */
function createMetric(overrides: Partial<Metric> = {}): Metric {
  return {
    name: "LCP" as Metric["name"],
    value: 1234,
    rating: "good" as const,
    delta: 1234,
    id: "v5-1234567890",
    navigationType: "navigate" as Metric["navigationType"],
    entries: [],
    ...overrides,
  } as Metric;
}

describe("reportWebVitals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register all four metric callbacks", () => {
    reportWebVitals();

    expect(mockOnCLS).toHaveBeenCalledOnce();
    expect(mockOnINP).toHaveBeenCalledOnce();
    expect(mockOnLCP).toHaveBeenCalledOnce();
    expect(mockOnTTFB).toHaveBeenCalledOnce();
  });

  it("should send LCP metric to PostHog with correct properties", () => {
    reportWebVitals();

    // Extract the callback passed to onLCP and invoke it
    const lcpCallback = mockOnLCP.mock.calls[0][0] as (metric: Metric) => void;
    const metric = createMetric({
      name: "LCP" as Metric["name"],
      value: 2500,
      rating: "needs-improvement",
      delta: 2500,
      id: "v5-lcp-123",
      navigationType: "navigate" as Metric["navigationType"],
    });

    lcpCallback(metric);

    expect(posthog.capture).toHaveBeenCalledWith("$web_vitals", {
      metric_name: "LCP",
      metric_value: 2500,
      metric_rating: "needs-improvement",
      metric_delta: 2500,
      metric_id: "v5-lcp-123",
      metric_navigation_type: "navigate",
      page_path: "/",
    });
  });

  it("should send CLS metric to PostHog", () => {
    reportWebVitals();

    const clsCallback = mockOnCLS.mock.calls[0][0] as (metric: Metric) => void;
    const metric = createMetric({
      name: "CLS" as Metric["name"],
      value: 0.05,
      rating: "good",
      delta: 0.05,
    });

    clsCallback(metric);

    expect(posthog.capture).toHaveBeenCalledWith(
      "$web_vitals",
      expect.objectContaining({
        metric_name: "CLS",
        metric_value: 0.05,
        metric_rating: "good",
      })
    );
  });

  it("should send INP metric to PostHog", () => {
    reportWebVitals();

    const inpCallback = mockOnINP.mock.calls[0][0] as (metric: Metric) => void;
    const metric = createMetric({
      name: "INP" as Metric["name"],
      value: 200,
      rating: "good",
    });

    inpCallback(metric);

    expect(posthog.capture).toHaveBeenCalledWith(
      "$web_vitals",
      expect.objectContaining({
        metric_name: "INP",
        metric_value: 200,
      })
    );
  });

  it("should send TTFB metric to PostHog", () => {
    reportWebVitals();

    const ttfbCallback = mockOnTTFB.mock.calls[0][0] as (
      metric: Metric
    ) => void;
    const metric = createMetric({
      name: "TTFB" as Metric["name"],
      value: 800,
      rating: "needs-improvement",
    });

    ttfbCallback(metric);

    expect(posthog.capture).toHaveBeenCalledWith(
      "$web_vitals",
      expect.objectContaining({
        metric_name: "TTFB",
        metric_value: 800,
        metric_rating: "needs-improvement",
      })
    );
  });

  it("should include page_path from window.location.pathname", () => {
    // window.location.pathname defaults to "/" in jsdom
    reportWebVitals();

    const lcpCallback = mockOnLCP.mock.calls[0][0] as (metric: Metric) => void;
    lcpCallback(createMetric());

    expect(posthog.capture).toHaveBeenCalledWith(
      "$web_vitals",
      expect.objectContaining({
        page_path: "/",
      })
    );
  });
});
