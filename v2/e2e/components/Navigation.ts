/**
 * Navigation sub-POM — header nav links and hamburger drawer.
 *
 * Context-aware: `navigateTo()` detects whether the hamburger button
 * is visible (mobile) or hidden (desktop) and routes through the
 * appropriate navigation path.
 *
 * Desktop nav renders as `<Box component="nav" aria-label="Main navigation">`
 * with MUI `Button` links. Mobile nav uses MUI `Drawer` containing
 * `<nav aria-label="Mobile navigation menu">`.
 *
 * @module e2e/components/Navigation
 */
import type { Locator, Page } from '@playwright/test';

/** Valid navigation targets matching the app's route names. */
type NavTarget = 'portfolio' | 'resume' | 'colophon' | 'samples';

/**
 * Maps nav targets to their accessible link names.
 * These match the i18n keys in common.json under `nav.*`.
 */
const NAV_LABELS: Record<NavTarget, RegExp> = {
  portfolio: /portfolio/i,
  resume: /résumé|resume/i,
  colophon: /colophon/i,
  samples: /samples/i,
};

export class Navigation {
  /** Page instance for keyboard and navigation actions. */
  readonly page: Page;

  /** Desktop navigation landmark. */
  readonly desktopNav: Locator;

  /** Mobile navigation landmark (inside the drawer). */
  readonly mobileNav: Locator;

  /** Hamburger button to open the mobile drawer. */
  readonly hamburgerButton: Locator;

  /** Close button inside the mobile drawer. */
  readonly closeDrawerButton: Locator;

  /**
   * @param page - Playwright Page instance used for all locator queries
   */
  constructor(page: Page) {
    this.page = page;
    this.desktopNav = page.getByRole('navigation', {
      name: /main navigation/i,
    });
    this.mobileNav = page.getByRole('navigation', {
      name: /mobile navigation menu/i,
    });
    this.hamburgerButton = page.getByRole('button', {
      name: /open navigation menu/i,
    });
    this.closeDrawerButton = page.getByRole('button', {
      name: /close navigation menu/i,
    });
  }

  /**
   * Navigate to a page, using mobile drawer or desktop nav as appropriate.
   *
   * Detects the current viewport by checking hamburger button visibility.
   * On mobile, opens the drawer first, then clicks the link inside it.
   * On desktop, clicks the link directly in the nav bar.
   *
   * @param target - Navigation target (route name)
   */
  async navigateTo(target: NavTarget): Promise<void> {
    // Wait for hydration before probing — hamburger uses next/dynamic with
    // ssr: false, so isVisible() returns false before hydration completes.
    await this.hamburgerButton
      .waitFor({ state: 'attached', timeout: 10_000 })
      .catch(() => {});
    const isMobile = await this.hamburgerButton.isVisible();

    if (isMobile) {
      await this.openDrawer();
      await this.mobileNav
        .getByRole('link', { name: NAV_LABELS[target] })
        .click();
    } else {
      await this.desktopNav
        .getByRole('link', { name: NAV_LABELS[target] })
        .click();
    }
  }

  /**
   * Get the currently active navigation link (has `aria-current="page"`).
   *
   * @returns Locator for the active link element
   */
  activeLink(): Locator {
    return this.page.locator('[aria-current="page"]');
  }

  /**
   * Open the mobile navigation drawer.
   *
   * Waits for the hamburger button to be visible before clicking.
   */
  async openDrawer(): Promise<void> {
    await this.hamburgerButton.waitFor({ state: 'visible' });
    await this.hamburgerButton.click();
    await this.mobileNav.waitFor({ state: 'visible' });
  }

  /**
   * Close the mobile navigation drawer.
   *
   * Clicks the close button inside the drawer.
   */
  async closeDrawer(): Promise<void> {
    await this.closeDrawerButton.click();
    await this.mobileNav.waitFor({ state: 'hidden' });
  }
}
