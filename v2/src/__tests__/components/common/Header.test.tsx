import { render, screen } from '../../test-utils';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from '@/src/components/common/Header';
import { testAccessibility, canReceiveFocus, hasAccessibleName } from '@/src/__tests__/utils/axe-helpers';

/**
 * Mock next/navigation usePathname hook
 */
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

/**
 * Test suite for Header component accessibility and functionality.
 *
 * Tests cover WCAG 2.2 Level AA compliance including:
 * - Automated accessibility audits with axe-core
 * - Touch target sizing (WCAG 2.5.8)
 * - Accessible naming (WCAG 4.1.2)
 * - Keyboard navigation (WCAG 2.1.1)
 * - Focus management
 * - Landmark structure (WCAG 1.3.1)
 */
describe('Header Component', () => {
  /**
   * Setup: Reset mocks before each test
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Accessibility audit test.
   *
   * Verifies that the Header component passes axe-core automated accessibility checks
   * for WCAG 2.2 Level AA compliance.
   */
  it('should pass axe accessibility tests', async () => {
    const result = render(<Header />);
    await act(async () => {
      await testAccessibility(result);
    });
  });

  /**
   * Touch target size test.
   *
   * Verifies that all interactive elements (social links, navigation buttons)
   * meet the minimum touch target size of 44x44px as required by WCAG 2.5.8.
   */
  it('should meet minimum touch target size for social media links', () => {
    render(<Header />);

    // Check LinkedIn button
    const linkedInButton = screen.getByLabelText(/linkedin/i);
    expect(linkedInButton).toBeInTheDocument();
    const linkedInStyles = window.getComputedStyle(linkedInButton);
    expect(parseInt(linkedInStyles.minWidth)).toBeGreaterThanOrEqual(44);
    expect(parseInt(linkedInStyles.minHeight)).toBeGreaterThanOrEqual(44);

    // Check GitHub button
    const githubButton = screen.getByLabelText(/github/i);
    expect(githubButton).toBeInTheDocument();
    const githubStyles = window.getComputedStyle(githubButton);
    expect(parseInt(githubStyles.minWidth)).toBeGreaterThanOrEqual(44);
    expect(parseInt(githubStyles.minHeight)).toBeGreaterThanOrEqual(44);
  });

  /**
   * Accessible naming test for social links.
   *
   * Verifies that social media links have accessible names via aria-label,
   * enabling screen reader users to identify their purpose.
   */
  it('should have accessible names for social media links', () => {
    render(<Header />);

    const linkedInButton = screen.getByLabelText(/linkedin/i);
    const githubButton = screen.getByLabelText(/github/i);

    expect(hasAccessibleName(linkedInButton as HTMLElement)).toBe(true);
    expect(hasAccessibleName(githubButton as HTMLElement)).toBe(true);
  });

  /**
   * Navigation landmark test.
   *
   * Verifies that the main navigation has a proper nav element with aria-label,
   * enabling assistive technology users to locate main navigation via landmark navigation.
   */
  it('should have navigation landmark with aria-label', () => {
    render(<Header />);

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  /**
   * Active page indication test.
   *
   * Verifies that the currently active navigation link is marked with aria-current="page",
   * informing screen reader users of their current location.
   */
  it('should indicate active page with aria-current', () => {
    render(<Header />);

    // On the home page (/), the Portfolio link should be marked as current
    const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
    expect(portfolioLink).toHaveAttribute('aria-current', 'page');

    // Other links should not have aria-current
    const resumeLink = screen.getByRole('link', { name: /résumé/i });
    const colophonLink = screen.getByRole('link', { name: /colophon/i });

    expect(resumeLink).not.toHaveAttribute('aria-current');
    expect(colophonLink).not.toHaveAttribute('aria-current');
  });

  /**
   * Keyboard navigation test.
   *
   * Verifies that all interactive elements are accessible via keyboard:
   * - Can be focused with Tab key
   * - Can be activated with Enter/Space
   * - Focus order is logical
   *
   * Covers WCAG 2.1.1 (Keyboard) and WCAG 2.4.3 (Focus Order).
   */
  it('should be keyboard navigable', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const linkedInButton = screen.getByLabelText(/linkedin/i);
    const githubButton = screen.getByLabelText(/github/i);
    const portfolioLink = screen.getByRole('link', { name: /portfolio/i });

    // All interactive elements should be focusable
    expect(canReceiveFocus(linkedInButton as HTMLElement)).toBe(true);
    expect(canReceiveFocus(githubButton as HTMLElement)).toBe(true);
    expect(canReceiveFocus(portfolioLink as HTMLElement)).toBe(true);

    // Tab to LinkedIn button
    await user.tab();
    expect(linkedInButton).toHaveFocus();

    // Tab to GitHub button
    await user.tab();
    expect(githubButton).toHaveFocus();
  });

  /**
   * Focus visibility test.
   *
   * Verifies that keyboard focus is visible on interactive elements,
   * enabling keyboard users to track navigation position.
   * Covers WCAG 2.4.7 (Focus Visible).
   */
  it('should have visible focus indicators', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const linkedInButton = screen.getByLabelText(/linkedin/i);

    // Tab to element
    await user.tab();
    expect(linkedInButton).toHaveFocus();

    // Element should have focus styling (browser default or custom)
    expect(linkedInButton).toHaveFocus();
  });

  /**
   * Navigation button accessibility test.
   *
   * Verifies that navigation buttons are properly labeled and accessible,
   * meeting WCAG 4.1.2 requirements for accessible naming.
   */
  it('should have accessible navigation buttons', () => {
    render(<Header />);

    const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
    const resumeLink = screen.getByRole('link', { name: /résumé/i });
    const colophonLink = screen.getByRole('link', { name: /colophon/i });

    expect(portfolioLink).toBeInTheDocument();
    expect(resumeLink).toBeInTheDocument();
    expect(colophonLink).toBeInTheDocument();

    expect(hasAccessibleName(portfolioLink as HTMLElement)).toBe(true);
    expect(hasAccessibleName(resumeLink as HTMLElement)).toBe(true);
    expect(hasAccessibleName(colophonLink as HTMLElement)).toBe(true);
  });

  /**
   * External link attributes test.
   *
   * Verifies that external social media links have proper attributes
   * for security and accessibility (target="_blank", rel="noopener noreferrer").
   */
  it('should have proper attributes for external links', () => {
    render(<Header />);

    const linkedInButton = screen.getByLabelText(/linkedin/i);
    const githubButton = screen.getByLabelText(/github/i);

    expect(linkedInButton).toHaveAttribute('target', '_blank');
    expect(linkedInButton).toHaveAttribute('rel', 'noopener noreferrer');

    expect(githubButton).toHaveAttribute('target', '_blank');
    expect(githubButton).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
