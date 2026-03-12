/**
 * SettingsPanel sub-POM — gear button, popover, and preference controls.
 *
 * The settings button uses `next/dynamic` with `ssr: false`, so it is absent
 * from the initial HTML and appears only after React hydration. The `open()`
 * method waits with an extended timeout to handle this delay.
 *
 * On desktop, clicking the gear button opens an MUI Popover (note: not a
 * Dialog, so no `role="dialog"`). On mobile, settings controls are rendered
 * inline within the navigation drawer — callers should use
 * `navigation.openDrawer()` first and interact with controls directly.
 *
 * @module e2e/components/SettingsPanel
 */
import type { Locator, Page } from '@playwright/test';

/** Valid theme modes for the theme toggle. */
type ThemeMode = 'light' | 'dark' | 'highContrast';

/** Valid locales for the language toggle. */
type LocaleOption = 'en' | 'fr';

/**
 * Maps theme modes to their ARIA labels on the toggle buttons.
 * These match the i18n keys in common.json under `theme.*Aria`.
 */
const THEME_LABELS: Record<ThemeMode, RegExp> = {
  light: /light theme/i,
  dark: /dark theme/i,
  highContrast: /high contrast theme/i,
};

/**
 * Maps locale options to their button labels.
 * These match the i18n keys in common.json under `settings.*`.
 */
const LOCALE_LABELS: Record<LocaleOption, RegExp> = {
  en: /english/i,
  fr: /français/i,
};

export class SettingsPanel {
  /** Page instance for interactions. */
  readonly page: Page;

  /** Gear button that opens the settings popover (desktop). */
  readonly gearButton: Locator;

  /** Settings popover container (desktop only, identified by ID). */
  readonly popover: Locator;

  /** Theme toggle button group. */
  readonly themeGroup: Locator;

  /** Language toggle button group. */
  readonly languageGroup: Locator;

  /**
   * Animations toggle switch.
   *
   * Accessible name comes from the `FormControlLabel` label prop, which
   * changes dynamically between "Animations enabled" and "Animations disabled".
   * The `aria-label="Toggle animations"` on the `Switch` is overridden by
   * the `FormControlLabel` wrapper.
   */
  readonly animationsSwitch: Locator;

  /**
   * @param page - Playwright Page instance used for all locator queries
   */
  constructor(page: Page) {
    this.page = page;
    this.gearButton = page.getByRole('button', { name: /open settings/i });
    this.popover = page.locator('#settings-popover');
    this.themeGroup = page.getByRole('group', { name: /select theme/i });
    this.languageGroup = page.getByRole('group', { name: /language/i });
    this.animationsSwitch = page.getByRole('switch', {
      name: /animations (enabled|disabled)/i,
    });
  }

  /**
   * Open the settings popover (desktop only).
   *
   * Waits up to 10 seconds for the gear button to appear, accounting for
   * the `next/dynamic` hydration delay. On mobile, settings are inline in
   * the navigation drawer — use `navigation.openDrawer()` instead.
   */
  async open(): Promise<void> {
    await this.gearButton.waitFor({ state: 'visible', timeout: 10_000 });
    await this.gearButton.click();
    await this.popover.waitFor({ state: 'visible' });
  }

  /**
   * Close the settings popover by pressing Escape.
   *
   * The gear button's `onClick` handler unconditionally opens the popover
   * (no toggle logic), so clicking it again does not close it. The popover
   * closes via MUI's `onClose` — triggered by Escape or clicking outside.
   */
  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.popover.waitFor({ state: 'hidden' });
  }

  /**
   * Switch the theme by clicking the corresponding toggle button.
   *
   * Works in both desktop (popover) and mobile (drawer) contexts
   * since the ARIA labels are identical.
   *
   * @param mode - Target theme mode
   */
  async switchTheme(mode: ThemeMode): Promise<void> {
    await this.themeGroup
      .getByRole('button', { name: THEME_LABELS[mode] })
      .click();
  }

  /**
   * Switch the language by clicking the corresponding toggle button.
   *
   * @param locale - Target locale
   */
  async switchLanguage(locale: LocaleOption): Promise<void> {
    await this.languageGroup
      .getByRole('button', { name: LOCALE_LABELS[locale] })
      .click();
  }

  /**
   * Toggle the animations switch on or off.
   */
  async toggleAnimations(): Promise<void> {
    await this.animationsSwitch.click();
  }
}
