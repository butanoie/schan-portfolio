/**
 * Viewport presets for responsive E2E testing.
 *
 * Mobile breakpoint matches MUI's `sm` (600px). Below 600px the hamburger
 * menu appears; at or above 600px the desktop nav buttons are shown.
 *
 * @module e2e/fixtures/viewport.fixture
 */
import type { Page } from '@playwright/test';

/** Mobile viewport: iPhone-sized, below MUI sm breakpoint (600px). */
const MOBILE_VIEWPORT = { width: 375, height: 812 };

/** Desktop viewport: standard desktop size, above MUI sm breakpoint. */
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

/**
 * Set the viewport to mobile dimensions (375x812).
 *
 * @param page - Playwright Page instance
 *
 * @example
 * await asMobile(page);
 * await page.goto('/');
 */
export async function asMobile(page: Page): Promise<void> {
  await page.setViewportSize(MOBILE_VIEWPORT);
}

/**
 * Set the viewport to desktop dimensions (1280x800).
 *
 * @param page - Playwright Page instance
 *
 * @example
 * await asDesktop(page);
 * await page.goto('/');
 */
export async function asDesktop(page: Page): Promise<void> {
  await page.setViewportSize(DESKTOP_VIEWPORT);
}
