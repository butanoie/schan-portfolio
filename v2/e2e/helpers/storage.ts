/**
 * localStorage seed helpers for Playwright E2E tests.
 *
 * Uses `page.addInitScript` to set localStorage values before React hydration.
 * This ensures preferences are available on first render, avoiding flash-of-
 * default-state artifacts. Must be called before `page.goto()`.
 *
 * @module e2e/helpers/storage
 */
import type { Page } from '@playwright/test';

/** Valid theme modes matching the portfolio-theme-mode localStorage key. */
type ThemeMode = 'light' | 'dark' | 'highContrast';

/** Valid locale values matching the locale localStorage key. */
type LocaleValue = 'en' | 'fr';

/**
 * Seed the theme preference before page navigation.
 *
 * Must be called before `page.goto()` — `addInitScript` runs before
 * any page JavaScript, ensuring React reads the correct theme on mount.
 *
 * @param page - Playwright Page instance
 * @param theme - Theme mode to set
 *
 * @example
 * await seedTheme(page, 'dark');
 * await page.goto('/');
 */
export async function seedTheme(page: Page, theme: ThemeMode): Promise<void> {
  await page.addInitScript((t) => {
    localStorage.setItem('portfolio-theme-mode', t);
  }, theme);
}

/**
 * Seed the locale preference before page navigation.
 *
 * Must be called before `page.goto()` — `addInitScript` runs before
 * any page JavaScript, ensuring the i18n system reads the correct
 * locale on initialization.
 *
 * @param page - Playwright Page instance
 * @param locale - Locale to set
 *
 * @example
 * await seedLocale(page, 'fr');
 * await page.goto('/');
 */
export async function seedLocale(
  page: Page,
  locale: LocaleValue
): Promise<void> {
  await page.addInitScript((l) => {
    localStorage.setItem('locale', l);
  }, locale);
}
