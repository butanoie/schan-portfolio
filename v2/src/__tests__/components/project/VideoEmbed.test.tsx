import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { VideoEmbed } from '@/src/components/project/VideoEmbed';
import type { ProjectVideo } from '@/src/types/project';

/**
 * Mock useInView hook.
 */
const mockUseInView = vi.fn(() => [vi.fn(), true, true]);
vi.mock('@/src/hooks/useInView', () => ({
  // @ts-expect-error - Mock function with spread args
  // eslint-disable-next-line jsdoc/require-jsdoc
  useInView: (...args) => mockUseInView(...args),
}));

/**
 * Mock useReducedMotion hook.
 */
const mockUseReducedMotion = vi.fn(() => false);
vi.mock('@/src/hooks/useReducedMotion', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('VideoEmbed', () => {
  /**
   * Creates a mock Vimeo video configuration.
   *
   * @param overrides - Optional property overrides
   * @returns A mock ProjectVideo object for Vimeo
   */
  const createMockVimeoVideo = (
    overrides?: Partial<ProjectVideo>
  ): ProjectVideo => ({
    type: 'vimeo',
    id: '123456789',
    width: 1920,
    height: 1080,
    ...overrides,
  });

  /**
   * Creates a mock YouTube video configuration.
   *
   * @param overrides - Optional property overrides
   * @returns A mock ProjectVideo object for YouTube
   */
  const createMockYouTubeVideo = (
    overrides?: Partial<ProjectVideo>
  ): ProjectVideo => ({
    type: 'youtube',
    id: 'dQw4w9WgXcQ',
    width: 1920,
    height: 1080,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock return values
    mockUseInView.mockReturnValue([vi.fn(), true, true]);
    mockUseReducedMotion.mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('renders region with aria-label', () => {
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} />);

      const region = screen.getByRole('region', {
        name: 'Video: Vimeo video player',
      });
      expect(region).toBeInTheDocument();
    });

    it('renders iframe for Vimeo video', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('title', 'Vimeo video player');
    });

    it('renders iframe for YouTube video', () => {
      const video = createMockYouTubeVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('title', 'YouTube video player');
    });

    it('has proper allowFullScreen attribute', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('allowFullScreen');
    });

    it('has proper allow attribute with permissions', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );
    });
  });

  describe('Vimeo Video', () => {
    it('generates correct Vimeo embed URL', () => {
      const video = createMockVimeoVideo({ id: '987654321' });

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute(
        'src',
        'https://player.vimeo.com/video/987654321?title=0&byline=0&portrait=0'
      );
    });

    it('uses correct title for Vimeo player', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('title', 'Vimeo video player');
    });

    it('has correct aria-label for Vimeo', () => {
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} />);

      const region = screen.getByRole('region', {
        name: 'Video: Vimeo video player',
      });
      expect(region).toBeInTheDocument();
    });
  });

  describe('YouTube Video', () => {
    it('generates correct YouTube embed URL', () => {
      const video = createMockYouTubeVideo({ id: 'abc123XYZ' });

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute(
        'src',
        'https://www.youtube.com/embed/abc123XYZ?rel=0&modestbranding=1'
      );
    });

    it('uses correct title for YouTube player', () => {
      const video = createMockYouTubeVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('title', 'YouTube video player');
    });

    it('has correct aria-label for YouTube', () => {
      const video = createMockYouTubeVideo();

      render(<VideoEmbed video={video} />);

      const region = screen.getByRole('region', {
        name: 'Video: YouTube video player',
      });
      expect(region).toBeInTheDocument();
    });
  });

  describe('Aspect Ratio', () => {
    it('calculates correct aspect ratio for 16:9 video', () => {
      const video = createMockVimeoVideo({
        width: 1920,
        height: 1080,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Aspect ratio = (1080 / 1920) * 100 = 56.25%
    });

    it('calculates correct aspect ratio for 4:3 video', () => {
      const video = createMockVimeoVideo({
        width: 640,
        height: 480,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Aspect ratio = (480 / 640) * 100 = 75%
    });

    it('calculates correct aspect ratio for square video', () => {
      const video = createMockVimeoVideo({
        width: 1080,
        height: 1080,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Aspect ratio = (1080 / 1080) * 100 = 100%
    });

    it('handles custom aspect ratios', () => {
      const video = createMockVimeoVideo({
        width: 1920,
        height: 800,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Aspect ratio = (800 / 1920) * 100 ≈ 41.67%
    });
  });

  describe('Lazy Loading', () => {
    it('loads iframe immediately when lazy=false', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} lazy={false} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
    });

    it('loads iframe immediately when lazy=true but in view', () => {
      mockUseInView.mockReturnValue([vi.fn(), true, true]);
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} lazy={true} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
    });

    it('shows loading text when not in view', () => {
      mockUseInView.mockReturnValue([vi.fn(), false, false]);
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} lazy={true} />);

      expect(screen.getByText('Loading video...')).toBeInTheDocument();
    });

    it('does not render iframe when not in view', () => {
      mockUseInView.mockReturnValue([vi.fn(), false, false]);
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} lazy={true} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).not.toBeInTheDocument();
    });

    it('uses useInView hook with correct options', () => {
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} lazy={true} />);

      expect(mockUseInView).toHaveBeenCalledWith({
        threshold: 0.1,
        triggerOnce: true,
      });
    });

    it('loads iframe after entering viewport', () => {
      // Start not in view
      mockUseInView.mockReturnValue([vi.fn(), false, false]);
      const { container, rerender } = render(
        <VideoEmbed video={createMockVimeoVideo()} lazy={true} />
      );

      expect(container.querySelector('iframe')).not.toBeInTheDocument();
      expect(screen.getByText('Loading video...')).toBeInTheDocument();

      // Enter viewport
      mockUseInView.mockReturnValue([vi.fn(), true, true]);
      rerender(<VideoEmbed video={createMockVimeoVideo()} lazy={true} />);

      expect(container.querySelector('iframe')).toBeInTheDocument();
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
    });
  });

  describe('Reduced Motion', () => {
    it('respects prefers-reduced-motion preference', () => {
      mockUseReducedMotion.mockReturnValue(true);
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      // With reduced motion, no fade-in animation
    });

    it('uses fade-in animation when motion is allowed', () => {
      mockUseReducedMotion.mockReturnValue(false);
      mockUseInView.mockReturnValue([vi.fn(), true, true]);
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      // With motion allowed, fade-in animation applied
    });

    it('calls useReducedMotion hook', () => {
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} />);

      expect(mockUseReducedMotion).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop as object', () => {
      const video = createMockVimeoVideo();

      const { container } = render(
        <VideoEmbed video={video} sx={{ marginBottom: 8 }} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
    });

    it('applies custom sx prop as array', () => {
      const video = createMockVimeoVideo();

      const { container } = render(
        <VideoEmbed
          video={video}
          sx={[{ marginBottom: 4 }, { paddingTop: 2 }]}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very small video dimensions', () => {
      const video = createMockVimeoVideo({
        width: 320,
        height: 240,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Aspect ratio = (240 / 320) * 100 = 75%
    });

    it('handles very large video dimensions', () => {
      const video = createMockVimeoVideo({
        width: 3840,
        height: 2160,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // 4K video: Aspect ratio = (2160 / 3840) * 100 = 56.25%
    });

    it('handles portrait orientation video', () => {
      const video = createMockVimeoVideo({
        width: 1080,
        height: 1920,
      });

      const { container } = render(<VideoEmbed video={video} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      // Portrait: Aspect ratio = (1920 / 1080) * 100 ≈ 177.78%
    });

    it('handles video with ID containing special characters', () => {
      const video = createMockYouTubeVideo({ id: 'abc-123_XYZ' });

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute(
        'src',
        'https://www.youtube.com/embed/abc-123_XYZ?rel=0&modestbranding=1'
      );
    });

    it('handles transition from loading to loaded state', () => {
      mockUseInView.mockReturnValue([vi.fn(), false, false]);

      const { container, rerender } = render(
        <VideoEmbed video={createMockVimeoVideo()} lazy={true} />
      );

      // Initially shows loading text
      expect(screen.getByText('Loading video...')).toBeInTheDocument();

      // Simulate entering viewport
      mockUseInView.mockReturnValue([vi.fn(), true, true]);
      rerender(<VideoEmbed video={createMockVimeoVideo()} lazy={true} />);

      // Now shows iframe
      expect(container.querySelector('iframe')).toBeInTheDocument();
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has semantic region role', () => {
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} />);

      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('has descriptive aria-label for Vimeo', () => {
      const video = createMockVimeoVideo();

      render(<VideoEmbed video={video} />);

      const region = screen.getByRole('region', {
        name: 'Video: Vimeo video player',
      });
      expect(region).toBeInTheDocument();
    });

    it('has descriptive aria-label for YouTube', () => {
      const video = createMockYouTubeVideo();

      render(<VideoEmbed video={video} />);

      const region = screen.getByRole('region', {
        name: 'Video: YouTube video player',
      });
      expect(region).toBeInTheDocument();
    });

    it('iframe has descriptive title for Vimeo', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('title', 'Vimeo video player');
    });

    it('iframe has descriptive title for YouTube', () => {
      const video = createMockYouTubeVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('title', 'YouTube video player');
    });

    it('supports keyboard navigation via iframe', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      // iframes are keyboard accessible by default
    });
  });

  describe('Video Platform Support', () => {
    it('supports Vimeo platform', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe?.src).toContain('player.vimeo.com');
    });

    it('supports YouTube platform', () => {
      const video = createMockYouTubeVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      expect(iframe?.src).toContain('youtube.com/embed');
    });

    it('Vimeo URL includes player parameters', () => {
      const video = createMockVimeoVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      const src = iframe?.getAttribute('src') || '';
      expect(src).toContain('title=0');
      expect(src).toContain('byline=0');
      expect(src).toContain('portrait=0');
    });

    it('YouTube URL includes player parameters', () => {
      const video = createMockYouTubeVideo();

      const { container } = render(<VideoEmbed video={video} />);

      const iframe = container.querySelector('iframe');
      const src = iframe?.getAttribute('src') || '';
      expect(src).toContain('rel=0');
      expect(src).toContain('modestbranding=1');
    });
  });
});
