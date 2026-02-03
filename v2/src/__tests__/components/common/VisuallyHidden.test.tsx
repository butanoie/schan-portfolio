import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from '../../../components/common/VisuallyHidden';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for VisuallyHidden component.
 * Verifies that content is hidden visually but accessible to screen readers.
 */
describe('VisuallyHidden', () => {
  /**
   * Test: Content is rendered in the DOM
   */
  it('renders content in the DOM', () => {
    render(<VisuallyHidden>Hidden content</VisuallyHidden>);
    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });

  /**
   * Test: Content has visually-hidden CSS class
   */
  it('applies visually-hidden class', () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const element = container.querySelector('.visually-hidden');
    expect(element).toBeInTheDocument();
  });

  /**
   * Test: Content is hidden with CSS positioning
   */
  it('hides content visually with CSS', () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const element = container.querySelector('.visually-hidden') as HTMLElement;

    const styles = window.getComputedStyle(element);
    expect(styles.position).toBe('absolute');
    expect(styles.width).toBe('1px');
    expect(styles.height).toBe('1px');
    expect(styles.overflow).toBe('hidden');
  });

  /**
   * Test: Accepts custom className
   */
  it('accepts custom className prop', () => {
    const { container } = render(
      <VisuallyHidden className="custom-class">Hidden</VisuallyHidden>
    );
    const element = container.querySelector('.visually-hidden.custom-class');
    expect(element).toBeInTheDocument();
  });

  /**
   * Test: Renders as span element
   */
  it('renders as span element', () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const element = container.querySelector('span.visually-hidden');
    expect(element?.tagName).toBe('SPAN');
  });

  /**
   * Test: Accessible to screen readers (aria-label context)
   */
  it('is accessible via text content to screen readers', () => {
    render(<VisuallyHidden>Press Escape to close</VisuallyHidden>);
    const element = screen.getByText('Press Escape to close');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('visually-hidden');
  });

  /**
   * Test: Works with complex content
   */
  it('works with complex text content', () => {
    const caption = 'Mountain landscape at sunset';
    const imageNumber = 3;
    const total = 10;

    render(
      <VisuallyHidden>
        Image {imageNumber} of {total}: {caption}
      </VisuallyHidden>
    );

    expect(
      screen.getByText(`Image ${imageNumber} of ${total}: ${caption}`)
    ).toBeInTheDocument();
  });
});
