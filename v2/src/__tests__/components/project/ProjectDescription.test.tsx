import { render, screen } from '@testing-library/react';
import { ProjectDescription } from '../../../components/project/ProjectDescription';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for ProjectDescription component.
 * Verifies that the component correctly sanitizes and renders HTML descriptions as paragraph arrays.
 */
describe('ProjectDescription', () => {
  /**
   * Test: Component renders without crashing with single paragraph
   */
  it('renders without crashing with single paragraph', () => {
    const { container } = render(
      <ProjectDescription paragraphs="Test description" />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Component renders without crashing with multiple paragraphs
   */
  it('renders without crashing with multiple paragraphs', () => {
    const { container } = render(
      <ProjectDescription paragraphs={["First paragraph", "Second paragraph"]} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders basic text paragraph
   */
  it('renders basic text paragraph', () => {
    render(<ProjectDescription paragraphs="This is a test" />);
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  /**
   * Test: Renders multiple paragraphs as array
   */
  it('renders multiple paragraphs as array', () => {
    const paragraphs = ['First paragraph', 'Second paragraph'];
    render(<ProjectDescription paragraphs={paragraphs} />);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  /**
   * Test: Renders links correctly
   */
  it('renders links correctly', () => {
    const paragraph = 'Check out <a href="https://example.com">this link</a>';
    render(<ProjectDescription paragraphs={paragraph} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('this link');
  });

  /**
   * Test: Renders strong text
   */
  it('renders strong text', () => {
    const paragraph = 'This is <strong>very important</strong>';
    render(<ProjectDescription paragraphs={paragraph} />);
    const strong = screen.getByText('very important');
    expect(strong.tagName).toBe('STRONG');
  });

  /**
   * Test: Renders italic text
   */
  it('renders italic text', () => {
    const paragraph = 'This is <em>emphasized</em>';
    render(<ProjectDescription paragraphs={paragraph} />);
    const em = screen.getByText('emphasized');
    expect(em.tagName).toBe('EM');
  });

  /**
   * Test: Renders unordered lists
   */
  it('renders unordered lists', () => {
    const paragraph = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
    render(<ProjectDescription paragraphs={paragraph} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  /**
   * Test: Renders ordered lists
   */
  it('renders ordered lists', () => {
    const paragraph = '<ol><li>First</li><li>Second</li><li>Third</li></ol>';
    render(<ProjectDescription paragraphs={paragraph} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  /**
   * Test: Renders line breaks
   */
  it('renders line breaks', () => {
    const paragraph = 'Line 1<br />Line 2';
    const { container } = render(<ProjectDescription paragraphs={paragraph} />);
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  /**
   * Test: Sanitizes dangerous HTML (script tags)
   */
  it('sanitizes dangerous HTML (script tags)', () => {
    const paragraph = 'Safe text<script>alert("xss")</script>';
    const { container } = render(<ProjectDescription paragraphs={paragraph} />);
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });

  /**
   * Test: Sanitizes dangerous HTML (onclick handlers)
   */
  it('sanitizes dangerous HTML (onclick handlers)', () => {
    const paragraph = '<div onclick="alert(\'xss\')">Click me</div>';
    const { container } = render(<ProjectDescription paragraphs={paragraph} />);
    const div = container.querySelector('div');
    if (div) {
      expect(div).not.toHaveAttribute('onclick');
    }
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  /**
   * Test: Removes disallowed tags like div
   */
  it('removes disallowed tags', () => {
    const paragraph = '<div>This div should be removed</div>This p stays';
    render(<ProjectDescription paragraphs={paragraph} />);
    // DOMPurify removes the tag but keeps the content
    expect(screen.getByText(/This div should be removed/)).toBeInTheDocument();
    expect(screen.getByText(/This p stays/)).toBeInTheDocument();
  });

  /**
   * Test: Accepts custom sx prop for styling
   */
  it('accepts custom sx prop for styling', () => {
    const { container } = render(
      <ProjectDescription paragraphs="Test" sx={{ mb: 2 }} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Handles empty paragraph
   */
  it('handles empty paragraph', () => {
    const { container } = render(<ProjectDescription paragraphs="" />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Handles empty paragraph array
   */
  it('handles empty paragraph array', () => {
    const { container } = render(<ProjectDescription paragraphs={[]} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Memoizes sanitization for performance
   */
  it('memoizes sanitization for performance', () => {
    const paragraphs = ['Test content'];
    const { rerender } = render(<ProjectDescription paragraphs={paragraphs} />);

    // Re-render with same paragraphs - should use memoized value
    rerender(<ProjectDescription paragraphs={paragraphs} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  /**
   * Test: Handles complex nested HTML in paragraphs
   */
  it('handles complex nested HTML in paragraphs', () => {
    const paragraphs = [
      'This is a <strong>complex</strong> description with <a href="/link">multiple</a> types of <em>formatting</em>.',
      'Second paragraph with <ul><li>Feature 1</li><li>Feature 2</li></ul>'
    ];
    render(<ProjectDescription paragraphs={paragraphs} />);
    expect(screen.getByText(/complex/)).toBeInTheDocument();
    expect(screen.getByText(/Feature 1/)).toBeInTheDocument();
  });

  /**
   * Test: Renders tags in stacked layout
   */
  it('renders tags in stacked layout', () => {
    const paragraphs = 'Test description';
    const tags = ['React', 'TypeScript', 'MUI'];
    render(<ProjectDescription paragraphs={paragraphs} tags={tags} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Renders tags in floated layout
   */
  it('renders tags in floated layout', () => {
    const paragraphs = 'Test description';
    const tags = ['React', 'TypeScript', 'MUI'];
    render(<ProjectDescription paragraphs={paragraphs} tags={tags} floatTags />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Works without tags
   */
  it('works without tags', () => {
    const paragraphs = 'Test description without tags';
    render(<ProjectDescription paragraphs={paragraphs} />);
    expect(screen.getByText('Test description without tags')).toBeInTheDocument();
  });

  /**
   * Test: Works with empty tags array
   */
  it('works with empty tags array', () => {
    const paragraphs = 'Test description with empty tags';
    render(<ProjectDescription paragraphs={paragraphs} tags={[]} />);
    expect(screen.getByText('Test description with empty tags')).toBeInTheDocument();
  });

  /**
   * Test: Renders tags and description together
   */
  it('renders tags and description together', () => {
    const paragraphs = 'This is a project about building web apps';
    const tags = ['Frontend', 'JavaScript'];
    render(<ProjectDescription paragraphs={paragraphs} tags={tags} />);
    expect(screen.getByText('This is a project about building web apps')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  /**
   * Test: floatTags defaults to false
   */
  it('floatTags defaults to false when not specified', () => {
    const paragraphs = 'Test description';
    const tags = ['React'];
    const { container } = render(<ProjectDescription paragraphs={paragraphs} tags={tags} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders circa/date chip with tags
   */
  it('renders circa/date chip with tags', () => {
    const paragraphs = 'Test description';
    const tags = ['React', 'TypeScript'];
    const circa = '2022-2023';
    render(<ProjectDescription paragraphs={paragraphs} tags={tags} circa={circa} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
  });

  /**
   * Test: Renders circa chip without tags
   */
  it('renders circa chip without tags', () => {
    const paragraphs = 'Test description';
    const circa = '2022-2023';
    render(<ProjectDescription paragraphs={paragraphs} circa={circa} />);
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  /**
   * Test: Renders circa in floated layout
   */
  it('renders circa in floated layout', () => {
    const paragraphs = 'Test description';
    const tags = ['React'];
    const circa = '2022-2023';
    render(
      <ProjectDescription paragraphs={paragraphs} tags={tags} circa={circa} floatTags />
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles malformed HTML gracefully
   */
  it('handles malformed HTML gracefully', () => {
    const malformedParagraph = 'Unclosed paragraph<p>Another paragraph</p>';
    const { container } = render(<ProjectDescription paragraphs={malformedParagraph} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Unclosed paragraph/)).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles very long content without crashing
   */
  it('handles very long content without crashing', () => {
    const longContent = 'Lorem ipsum dolor sit amet. '.repeat(500);
    const { container } = render(<ProjectDescription paragraphs={longContent} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles nested malformed tags
   */
  it('handles nested malformed tags', () => {
    const paragraph = '<strong><em>Bold and italic</strong></em>';
    render(<ProjectDescription paragraphs={paragraph} />);
    expect(screen.getByText(/Bold and italic/)).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles empty paragraph in array
   */
  it('handles empty paragraph in array', () => {
    const paragraphs = ['', 'Content'];
    render(<ProjectDescription paragraphs={paragraphs} />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles whitespace-only paragraph
   */
  it('handles whitespace-only paragraph', () => {
    const paragraphs = ['   '];
    const { container } = render(<ProjectDescription paragraphs={paragraphs} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles multiple empty paragraphs
   */
  it('handles multiple empty paragraphs', () => {
    const paragraphs = ['', '', ''];
    const { container } = render(<ProjectDescription paragraphs={paragraphs} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Multiple paragraphs with mixed content
   */
  it('renders multiple paragraphs with mixed content', () => {
    const paragraphs = [
      'First paragraph with <strong>bold text</strong>',
      'Second paragraph with <a href="#">a link</a>',
      'Third paragraph plain text'
    ];
    render(<ProjectDescription paragraphs={paragraphs} />);
    expect(screen.getByText('First paragraph with')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText(/Second paragraph/)).toBeInTheDocument();
    expect(screen.getByText('a link')).toBeInTheDocument();
    expect(screen.getByText('Third paragraph plain text')).toBeInTheDocument();
  });

  /**
   * Test: Backward compatibility - Single string as paragraph
   */
  it('maintains backward compatibility with single string', () => {
    const singleString = 'This is a single paragraph';
    render(<ProjectDescription paragraphs={singleString} />);
    expect(screen.getByText('This is a single paragraph')).toBeInTheDocument();
  });
});
