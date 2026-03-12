/**
 * BasePage — abstract base for all page objects.
 *
 * Encapsulates the persistent shell elements shared across all pages:
 * skip link, main content landmark, navigation, and settings panel.
 * Concrete page objects extend this class and add page-specific locators.
 *
 * Page objects hold locators and actions only — never assertions.
 * Tests own all assertions.
 *
 * @module e2e/pages/BasePage
 */
import type { Locator, Page } from '@playwright/test';
import { Navigation } from '../components/Navigation';
import { SettingsPanel } from '../components/SettingsPanel';

/** Abstract base page object shared by all page POMs. */
export abstract class BasePage {
  /** Playwright Page instance. */
  readonly page: Page;

  /** "Skip to main content" link (first focusable element). */
  readonly skipLink: Locator;

  /** Main content container (`#main-content`). */
  readonly mainContent: Locator;

  /** Navigation sub-POM for header nav and mobile drawer. */
  readonly navigation: Navigation;

  /** Settings sub-POM for theme, language, and animations controls. */
  readonly settings: SettingsPanel;

  /**
   * Initialize base locators and compose Navigation and SettingsPanel sub-POMs.
   *
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.skipLink = page.getByRole('link', { name: /skip to main/i });
    this.mainContent = page.locator('#main-content');
    this.navigation = new Navigation(page);
    this.settings = new SettingsPanel(page);
  }

  /**
   * Navigate to a page path and wait for the DOM to load.
   *
   * Uses `'domcontentloaded'` instead of `'networkidle'` because PostHog
   * and Sentry fire continuous background requests that prevent networkidle
   * from settling. Specs should use explicit locator waits for readiness.
   *
   * @param path - URL path relative to baseURL (e.g., '/', '/resume')
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Activate the skip link via keyboard interaction.
   *
   * Tabs to the skip link (first focusable element) and presses Enter
   * to move focus to `#main-content`.
   */
  async activateSkipLink(): Promise<void> {
    await this.page.keyboard.press('Tab');
    await this.skipLink.press('Enter');
  }
}
