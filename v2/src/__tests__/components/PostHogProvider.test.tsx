/**
 * Tests for the PostHogProvider component.
 *
 * Verifies:
 * - PostHog only initializes in production with a valid API key
 * - Do Not Track browser setting is respected
 * - Children are rendered regardless of PostHog initialization
 * - Cookieless (sessionStorage) persistence is configured
 * - PostHog does not initialize in development/test environments
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostHogProvider, {
  shouldInitializePostHog,
} from '@/src/components/PostHogProvider';

// Mock posthog-js
vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
  },
}));

import posthog from 'posthog-js';

/**
 * Sets navigator.doNotTrack to the given value.
 *
 * @param value - The DNT value to set (e.g., "1", "yes", or null)
 */
function setDoNotTrack(value: string | null): void {
  Object.defineProperty(navigator, 'doNotTrack', {
    value,
    writable: true,
    configurable: true,
  });
}

describe('PostHogProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    setDoNotTrack(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('shouldInitializePostHog', () => {
    it('should return false in test environment', () => {
      // NODE_ENV is "test" during vitest runs
      expect(shouldInitializePostHog()).toBe(false);
    });

    it('should return false when NEXT_PUBLIC_POSTHOG_KEY is not set', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(shouldInitializePostHog()).toBe(false);
    });

    it('should return false when Do Not Track is enabled', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
      setDoNotTrack('1');
      expect(shouldInitializePostHog()).toBe(false);
    });

    it('should return true in production with key and no DNT', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
      setDoNotTrack(null);
      expect(shouldInitializePostHog()).toBe(true);
    });

    it("should return false when DNT is set to 'yes'", () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
      setDoNotTrack('yes');
      expect(shouldInitializePostHog()).toBe(false);
    });
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <PostHogProvider>
          <div data-testid="child">Hello</div>
        </PostHogProvider>
      );
      expect(screen.getByTestId('child')).toHaveTextContent('Hello');
    });

    it('should not call posthog.init in test environment', () => {
      render(
        <PostHogProvider>
          <div>Content</div>
        </PostHogProvider>
      );
      expect(posthog.init).not.toHaveBeenCalled();
    });

    it('should call posthog.init in production with key', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
      setDoNotTrack(null);

      render(
        <PostHogProvider>
          <div>Content</div>
        </PostHogProvider>
      );

      expect(posthog.init).toHaveBeenCalledWith('phc_test_key', {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        persistence: 'sessionStorage',
        capture_pageview: true,
        disable_session_recording: true,
        sanitize_properties: expect.any(Function),
      });
    });

    it('should use custom PostHog host when provided', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://eu.posthog.com');
      setDoNotTrack(null);

      render(
        <PostHogProvider>
          <div>Content</div>
        </PostHogProvider>
      );

      expect(posthog.init).toHaveBeenCalledWith(
        'phc_test_key',
        expect.objectContaining({
          api_host: 'https://eu.posthog.com',
        })
      );
    });

    it('should strip $ip from properties via sanitize_properties', () => {
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key');
      setDoNotTrack(null);

      render(
        <PostHogProvider>
          <div>Content</div>
        </PostHogProvider>
      );

      // Extract the sanitize_properties function from the init call
      const initCall = (posthog.init as Mock).mock.calls[0];
      const config = initCall[1];
      const sanitized = config.sanitize_properties({
        $ip: '1.2.3.4',
        $current_url: '/about',
        event: 'pageview',
      });

      expect(sanitized).not.toHaveProperty('$ip');
      expect(sanitized).toHaveProperty('$current_url', '/about');
      expect(sanitized).toHaveProperty('event', 'pageview');
    });
  });
});
