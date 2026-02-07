import 'vitest-axe/extend-expect';
import { axe } from 'vitest-axe';
import { RenderResult } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * Run axe accessibility tests on a rendered component.
 *
 * @param container - The rendered component container
 * @param options - Optional axe configuration
 * @returns Promise resolving to axe results
 *
 * @example
 * const result = render(<MyComponent />);
 * await runAxe(result.container);
 */
export async function runAxe(
  container: HTMLElement,
  options?: Parameters<typeof axe>[1]
) {
  const results = await axe(container, options);
  // @ts-expect-error vitest-axe matcher not recognized by TypeScript
  expect(results).toHaveNoViolations();
  return results;
}

/**
 * Test component for WCAG 2.2 Level AA compliance.
 *
 * Runs automated accessibility tests with focus on:
 * - Color contrast (WCAG 1.4.3)
 * - Link naming (WCAG 4.1.2)
 * - Button naming (WCAG 4.1.2)
 * - Image alt text (WCAG 1.1.1)
 * - Form labels (WCAG 3.3.2)
 * - ARIA attributes (WCAG 4.1.2)
 * - Landmarks (WCAG 1.3.1)
 * - Touch targets (WCAG 2.5.8)
 *
 * @param renderResult - React Testing Library render result
 * @returns Promise resolving when tests complete
 *
 * @example
 * it('should be accessible', async () => {
 * const result = render(<MyComponent />);
 * await testAccessibility(result);
 * });
 */
export async function testAccessibility(renderResult: RenderResult) {
  const { container } = renderResult;

  await runAxe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'link-name': { enabled: true },
      'button-name': { enabled: true },
      'image-alt': { enabled: true },
      label: { enabled: true },
      'aria-allowed-attr': { enabled: true },
      'aria-required-attr': { enabled: true },
      'aria-valid-attr-value': { enabled: true },
      'landmark-one-main': { enabled: true },
      region: { enabled: true },
      'target-size': { enabled: true },
    },
  });
}

/**
 * Check if element can receive keyboard focus.
 *
 * An element can receive focus if it is:
 * - A button element
 * - An anchor element
 * - An input/textarea/select element
 * - Has a non-negative tabindex attribute
 *
 * @param element - The element to check
 * @returns True if element can receive focus
 *
 * @example
 * const button = screen.getByRole('button');
 * expect(canReceiveFocus(button)).toBe(true);
 */
export function canReceiveFocus(element: HTMLElement): boolean {
  const tabIndex = element.getAttribute('tabindex');
  const isButton = element.tagName === 'BUTTON';
  const isLink = element.tagName === 'A';
  const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);

  return (
    isButton ||
    isLink ||
    isInput ||
    (tabIndex !== null && parseInt(tabIndex) >= 0)
  );
}

/**
 * Check if element has accessible name.
 *
 * An element has an accessible name if it has:
 * - An aria-label attribute
 * - An aria-labelledby attribute
 * - Text content
 *
 * @param element - The element to check
 * @returns True if element has accessible name
 *
 * @example
 * const icon = screen.getByRole('button');
 * expect(hasAccessibleName(icon)).toBe(true);
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  return !!(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim()
  );
}
