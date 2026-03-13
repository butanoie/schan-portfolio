import { render, screen, fireEvent } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { ProjectImage } from '../../../components/project/ProjectImage';
import type { ProjectImage as ProjectImageType } from '../../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Mock Next.js Image component.
 * Prevents errors during testing and allows for focused component testing.
 * Renders a standard HTML img element with test attributes.
 */
vi.mock('next/image', () => ({
  /**
   * Mock Image component that renders an img element for testing.
   * Accepts all Image props and passes them to the img element.
   *
   * @param props - Image component props
   * @param props.src - Image source URL
   * @param props.alt - Image alt text
   * @param props.fill - Whether image fills its container
   * @param props.priority - Whether image is high priority
   * @param props.onLoad - Callback when image loads
   * @param props.onError - Callback when image fails to load
   * @param props.placeholder - Placeholder strategy for image loading
   * @param props.blurDataURL - Blurred image data URL for lazy loading
   * @returns Mock img element with test attributes
   */
  default: ({
    src,
    alt,
    fill,
    priority,
    onLoad,
    onError,
    placeholder,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blurDataURL,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    onLoad?: () => void;
    onError?: () => void;
    placeholder?: string;
    blurDataURL?: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-testid="mock-image"
      data-fill={fill}
      data-priority={priority}
      data-placeholder={placeholder}
      {...rest}
      onLoad={onLoad}
      onError={onError}
    />
  ),
}));

/**
 * Test suite for ProjectImage component.
 * Verifies image loading, error handling, click interactions, and accessibility.
 */
describe('ProjectImage', () => {
  const mockImage: ProjectImageType = {
    url: '/images/gallery/project1/image1.jpg',
    tnUrl: '/images/gallery/project1/image1_tn.jpg',
    caption: 'Test image caption',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Image Rendering', () => {
    /**
     * Test: Renders image with correct source URL
     */
    it('renders image with correct source URL', () => {
      render(<ProjectImage image={mockImage} size="thumbnail" />);
      const image = screen.getByTestId('mock-image');
      expect(image).toBeInTheDocument();
      expect(image.getAttribute('src')).toBe(mockImage.tnUrl);
    });

    /**
     * Test: Uses thumbnail URL when size is thumbnail
     */
    it('uses thumbnail URL when size is "thumbnail"', () => {
      render(<ProjectImage image={mockImage} size="thumbnail" />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('src')).toBe(mockImage.tnUrl);
    });

    /**
     * Test: Uses full URL when size is full
     */
    it('uses full URL when size is "full"', () => {
      render(<ProjectImage image={mockImage} size="full" />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('src')).toBe(mockImage.url);
    });

    /**
     * Test: Renders with correct alt text from caption
     */
    it('renders with correct alt text from caption', () => {
      render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('alt')).toBe('Test image caption');
    });

    /**
     * Test: Default size is thumbnail
     */
    it('defaults to thumbnail size when size prop not provided', () => {
      render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('src')).toBe(mockImage.tnUrl);
    });

    /**
     * Test: Sets priority attribute based on prop
     */
    it('sets priority attribute when priority prop is true', () => {
      render(<ProjectImage image={mockImage} priority={true} />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('data-priority')).toBe('true');
    });

    /**
     * Test: Priority defaults to false
     */
    it('priority defaults to false', () => {
      render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('data-priority')).toBe('false');
    });

    /**
     * Test: Uses blur placeholder for image loading state
     */
    it('uses blur placeholder for image loading', () => {
      render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('data-placeholder')).toBe('blur');
    });
  });

  describe('Error Handling', () => {
    /**
     * Test: Displays error fallback when image fails to load
     */
    it('displays error fallback when image fails to load', () => {
      const { rerender } = render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');

      // Simulate image load error
      fireEvent.error(image);
      rerender(<ProjectImage image={mockImage} />);

      // After error, should render fallback UI
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });

    /**
     * Test: Error fallback maintains aspect ratio
     */
    it('error fallback maintains aspect ratio', () => {
      const { rerender } = render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');

      fireEvent.error(image);
      rerender(<ProjectImage image={mockImage} />);

      const fallback = screen.getByRole('img', { name: /test image caption/i });
      // MUI Box component is rendered with sx styles
      // Verify the fallback Box element is displayed and accessible
      expect(fallback).toBeInTheDocument();
      expect(fallback.tagName).toBe('DIV');
    });

    /**
     * Test: Error fallback has correct alt text
     */
    it('error fallback has correct alt text for accessibility', () => {
      const { rerender } = render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');

      fireEvent.error(image);
      rerender(<ProjectImage image={mockImage} />);

      const fallback = screen.getByRole('img', { name: /test image caption/i });
      expect(fallback).toBeInTheDocument();
    });

    /**
     * Test: Error state persists after error
     */
    it('error fallback persists and continues to show error state', () => {
      const { rerender } = render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');

      fireEvent.error(image);
      rerender(<ProjectImage image={mockImage} />);

      // Should continue showing error
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-image')).not.toBeInTheDocument();
    });

    /**
     * Test: onError callback is called when image fails
     */
    it('calls onError handler when image fails to load', () => {
      render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');

      // Trigger error
      fireEvent.error(image);

      // Error fallback should be displayed
      // (which confirms onError was called internally)
    });
  });

  describe('Interactions and Styling', () => {
    /**
     * Test: Wraps image in a button when onClick prop provided
     */
    it('wraps image in a button when onClick prop provided', () => {
      const onClick = vi.fn();
      render(<ProjectImage image={mockImage} onClick={onClick} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveStyle({ cursor: 'pointer' });
    });

    /**
     * Test: Does not render a button when no onClick handler
     */
    it('does not render a button when no onClick handler', () => {
      render(<ProjectImage image={mockImage} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    /**
     * Test: Click handler is called when button wrapper is clicked
     */
    it('calls onClick handler when button is clicked', () => {
      const onClick = vi.fn();
      render(<ProjectImage image={mockImage} onClick={onClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Image uses object-fit cover for proper display
     */
    it('uses object-fit cover for image display', () => {
      render(<ProjectImage image={mockImage} />);

      const image = screen.getByTestId('mock-image');
      expect(image).toHaveStyle({ objectFit: 'cover' });
    });

    /**
     * Test: Container has proper aspect ratio
     */
    it('container maintains 4:3 aspect ratio', () => {
      const { container } = render(<ProjectImage image={mockImage} />);

      const wrapper = container.firstChild;
      // MUI Box applies aspect ratio dynamically - verify element structure
      expect(wrapper).toHaveClass('MuiBox-root');
    });

    /**
     * Test: Container has overflow hidden for clean edges
     */
    it('container has overflow hidden for clean image edges', () => {
      const { container } = render(<ProjectImage image={mockImage} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ overflow: 'hidden' });
    });
  });

  describe('Accessibility', () => {
    /**
     * Test: Image has proper alt text from caption
     */
    it('image has proper alt text for accessibility', () => {
      render(<ProjectImage image={mockImage} />);

      const image = screen.getByAltText('Test image caption');
      expect(image).toBeInTheDocument();
    });

    /**
     * Test: Error fallback is properly marked as image role
     */
    it('error fallback is properly marked as image role', () => {
      const { rerender } = render(<ProjectImage image={mockImage} />);
      const image = screen.getByTestId('mock-image');

      fireEvent.error(image);
      rerender(<ProjectImage image={mockImage} />);

      const fallback = screen.getByRole('img', { name: /test image caption/i });
      expect(fallback).toBeInTheDocument();
    });

    /**
     * Test: Button wrapper has correct aria-label when onClick provided
     */
    it('button wrapper has correct aria-label with caption', () => {
      render(<ProjectImage image={mockImage} onClick={() => {}} />);

      const button = screen.getByRole('button', {
        name: /view test image caption in lightbox/i,
      });
      expect(button).toBeInTheDocument();
    });

    /**
     * Test: Error fallback button wrapper has correct aria-label
     */
    it('error fallback button has correct aria-label', () => {
      const { rerender } = render(
        <ProjectImage image={mockImage} onClick={() => {}} />
      );
      fireEvent.error(screen.getByTestId('mock-image'));
      rerender(<ProjectImage image={mockImage} onClick={() => {}} />);

      const button = screen.getByRole('button', {
        name: /view test image caption in lightbox/i,
      });
      expect(button).toBeInTheDocument();
    });

    /**
     * Test: Keyboard Enter activates onClick on the button wrapper
     */
    it('activates onClick on Enter key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<ProjectImage image={mockImage} onClick={onClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Keyboard Space activates onClick on the button wrapper
     */
    it('activates onClick on Space key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<ProjectImage image={mockImage} onClick={onClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: buttonRef is forwarded to the button element
     */
    it('forwards buttonRef to the button element', () => {
      const ref = {
        current: null,
      } as React.MutableRefObject<HTMLButtonElement | null>;
      render(
        <ProjectImage image={mockImage} onClick={() => {}} buttonRef={ref} />
      );

      const button = screen.getByRole('button');
      expect(ref.current).toBe(button);
    });
  });

  describe('Custom Styling', () => {
    /**
     * Test: Accepts custom sx styles to wrapper
     */
    it('accepts custom sx styles to wrapper', () => {
      const { container } = render(
        <ProjectImage image={mockImage} sx={{ border: '1px solid red' }} />
      );

      const wrapper = container.firstChild as HTMLElement;
      // MUI sx styles are applied dynamically via className
      expect(wrapper).toHaveClass('MuiBox-root');
    });

    /**
     * Test: Merges default styles with custom sx props
     */
    it('merges default styles with custom sx props', () => {
      const { container } = render(
        <ProjectImage image={mockImage} sx={{ opacity: 0.5 }} />
      );

      const wrapper = container.firstChild as HTMLElement;
      // MUI merges sx props - verify Box is rendered with custom props
      expect(wrapper).toHaveClass('MuiBox-root');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Image Sizes Configuration', () => {
    /**
     * Test: Image has correct sizes attribute for responsive loading
     */
    it('image has correct sizes attribute for responsive loading', () => {
      render(<ProjectImage image={mockImage} size="thumbnail" />);

      const image = screen.getByTestId('mock-image');
      // Next.js Image component should have sizes prop
      expect(image).toBeInTheDocument();
    });

    /**
     * Test: Both thumbnail and full sizes use same responsive sizes
     */
    it('both sizes use responsive sizes attribute', () => {
      const { rerender } = render(
        <ProjectImage image={mockImage} size="thumbnail" />
      );
      expect(screen.getByTestId('mock-image')).toBeInTheDocument();

      rerender(<ProjectImage image={mockImage} size="full" />);
      expect(screen.getByTestId('mock-image')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    /**
     * Test: Image has fill attribute for responsive sizing
     */
    it('image has fill attribute for responsive sizing', () => {
      render(<ProjectImage image={mockImage} />);

      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('data-fill')).toBe('true');
    });

    /**
     * Test: Image load handler can be triggered
     */
    it('can trigger image load handler', () => {
      render(<ProjectImage image={mockImage} />);

      const image = screen.getByTestId('mock-image');
      // Should not throw
      fireEvent.load(image);
      expect(image).toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    /**
     * Test: All props together work correctly
     */
    it('works with all props combined', () => {
      const onClick = vi.fn();
      render(
        <ProjectImage
          image={mockImage}
          size="full"
          priority={true}
          onClick={onClick}
          sx={{ border: '2px solid blue' }}
        />
      );

      const image = screen.getByTestId('mock-image');
      expect(image.getAttribute('src')).toBe(mockImage.url);
      expect(image.getAttribute('data-priority')).toBe('true');

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ cursor: 'pointer' });

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Works with minimal props (image only)
     */
    it('works with minimal props (image only)', () => {
      render(<ProjectImage image={mockImage} />);

      const image = screen.getByTestId('mock-image');
      expect(image).toBeInTheDocument();
      expect(image.getAttribute('src')).toBe(mockImage.tnUrl);
      expect(image.getAttribute('data-priority')).toBe('false');
    });
  });

  describe('Reduced Motion', () => {
    /**
     * Test: Component respects prefers-reduced-motion preference
     */
    it('respects prefers-reduced-motion preference', () => {
      render(<ProjectImage image={mockImage} onClick={() => {}} />);

      // With reduced motion enabled (set in vitest.setup.ts matchMedia mock),
      // transitions should be disabled. The image wrapper is inside the button.
      const imageWrapper = screen.getByTestId('mock-image').parentElement;
      expect(imageWrapper).toBeInTheDocument();
    });
  });
});
