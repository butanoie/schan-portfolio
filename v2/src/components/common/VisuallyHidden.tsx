import { ReactNode } from 'react';

/**
 * Props for the VisuallyHidden component.
 */
interface VisuallyHiddenProps {
  /** Content to hide visually but expose to screen readers */
  children: ReactNode;

  /** Optional CSS class name */
  className?: string;
}

/**
 * A component that hides content visually but makes it available to screen readers.
 *
 * This is useful for providing additional context to users with assistive technologies
 * without cluttering the visual design. Common use cases include:
 * - Screen reader-only instructions
 * - ARIA announcements that need full context
 * - Accessibility improvements that don't require visual presentation
 *
 * **Implementation:**
 * Uses standard CSS positioning techniques to move content off-screen while
 * keeping it in the DOM and accessible to screen readers.
 *
 * **Why this matters:**
 * Screen reader users need sufficient context to understand dynamic updates and
 * navigation changes. The visually-hidden class provides a way to announce
 * detailed information (like full image captions and position) to screen readers
 * while keeping the visual interface clean.
 *
 * **Usage:**
 * ```typescript
 * <VisuallyHidden>
 *   Image 3 of 8: A sunset over the mountains
 * </VisuallyHidden>
 * ```
 *
 * @component
 * @param props - Component props
 * @param props.children - Content to hide visually
 * @param props.className - Optional additional CSS classes
 * @returns A span element with visually-hidden styling
 *
 * @example
 * // For ARIA live region announcements with full context
 * <Box aria-live="assertive" aria-atomic="true">
 *   <VisuallyHidden>
 *     Viewing image {currentIndex + 1} of {total}: {caption}
 *   </VisuallyHidden>
 *   <Typography>{currentIndex + 1} of {total}</Typography>
 * </Box>
 */
export function VisuallyHidden({ children, className = '' }: VisuallyHiddenProps) {
  return (
    <span
      className={`visually-hidden ${className}`}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
    >
      {children}
    </span>
  );
}
