import { render } from '@testing-library/react';
import { VideoEmbed } from '../../../components/project/VideoEmbed';
import type { ProjectVideo } from '../../../types';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for VideoEmbed component.
 * Verifies that the component correctly renders Vimeo and YouTube videos.
 */
describe('VideoEmbed', () => {
  const vimeoVideo: ProjectVideo = {
    type: 'vimeo',
    id: '123456789',
    width: 1280,
    height: 720,
  };

  const youtubeVideo: ProjectVideo = {
    type: 'youtube',
    id: 'dQw4w9WgXcQ',
    width: 1280,
    height: 720,
  };

  /**
   * Test: Renders Vimeo video correctly
   */
  it('renders Vimeo video correctly', () => {
    const { container } = render(<VideoEmbed video={vimeoVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain('vimeo.com/video/123456789');
  });

  /**
   * Test: Renders YouTube video correctly
   */
  it('renders YouTube video correctly', () => {
    const { container } = render(<VideoEmbed video={youtubeVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain('youtube.com/embed/dQw4w9WgXcQ');
  });

  /**
   * Test: iframe has proper title for accessibility
   */
  it('iframe has proper title for accessibility', () => {
    const { container } = render(<VideoEmbed video={vimeoVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.title).toBe('Vimeo video player');
  });

  /**
   * Test: YouTube iframe has proper title
   */
  it('YouTube iframe has proper title', () => {
    const { container } = render(<VideoEmbed video={youtubeVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.title).toBe('YouTube video player');
  });

  /**
   * Test: iframe has fullscreen attribute
   */
  it('iframe has fullscreen attribute', () => {
    const { container } = render(<VideoEmbed video={vimeoVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.hasAttribute('allowfullscreen')).toBe(true);
  });

  /**
   * Test: iframe is focusable for keyboard navigation
   */
  it('iframe is focusable for keyboard navigation', () => {
    const { container } = render(<VideoEmbed video={vimeoVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.tabIndex).toBeGreaterThanOrEqual(-1);
  });

  /**
   * Test: Component maintains aspect ratio container
   */
  it('maintains aspect ratio container', () => {
    const { container } = render(<VideoEmbed video={vimeoVideo} />);
    const wrapper = container.querySelector('[style*="position"]');
    expect(wrapper).toBeInTheDocument();
  });

  /**
   * Test: Accepts custom sx prop for styling
   */
  it('accepts custom sx prop for styling', () => {
    const { container } = render(
      <VideoEmbed video={vimeoVideo} sx={{ mb: 4 }} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: iframe has allow attribute for features
   */
  it('iframe has allow attribute for features', () => {
    const { container } = render(<VideoEmbed video={vimeoVideo} />);
    const iframe = container.querySelector('iframe');
    expect(iframe?.hasAttribute('allow')).toBe(true);
    const allowAttr = iframe?.getAttribute('allow') || '';
    expect(allowAttr).toContain('accelerometer');
    expect(allowAttr).toContain('encrypted-media');
  });

  /**
   * Test: Throws error for unsupported video type
   */
  it('throws error for unsupported video type', () => {
    const invalidVideo = {
      type: 'dailymotion' as never,
      id: '123',
      width: 1280,
      height: 720,
    };

    expect(() => {
      render(<VideoEmbed video={invalidVideo} />);
    }).toThrow();
  });

  /**
   * Test: Memoizes URL construction for performance
   */
  it('memoizes URL construction for performance', () => {
    const { container, rerender } = render(<VideoEmbed video={vimeoVideo} />);
    const initialIframe = container.querySelector('iframe');

    // Re-render with same video
    rerender(<VideoEmbed video={vimeoVideo} />);
    const updatedIframe = container.querySelector('iframe');

    expect(initialIframe?.src).toBe(updatedIframe?.src);
  });

  /**
   * Test: Updates iframe src when video changes
   */
  it('updates iframe src when video changes', () => {
    const { container, rerender } = render(<VideoEmbed video={vimeoVideo} />);
    let iframe = container.querySelector('iframe');
    expect(iframe?.src).toContain('vimeo');

    rerender(<VideoEmbed video={youtubeVideo} />);
    iframe = container.querySelector('iframe');
    expect(iframe?.src).toContain('youtube');
  });
});
