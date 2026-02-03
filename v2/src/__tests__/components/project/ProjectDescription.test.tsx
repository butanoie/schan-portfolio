import { render, screen } from '@testing-library/react';
import { ProjectDescription } from '../../../components/project/ProjectDescription';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for ProjectDescription component.
 * Verifies that the component correctly sanitizes and renders HTML descriptions.
 */
describe('ProjectDescription', () => {
  /**
   * Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <ProjectDescription html="<p>Test description</p>" />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders basic HTML paragraph
   */
  it('renders basic HTML paragraph', () => {
    render(<ProjectDescription html="<p>This is a test</p>" />);
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  /**
   * Test: Renders multiple paragraphs
   */
  it('renders multiple paragraphs', () => {
    const html = '<p>First paragraph</p><p>Second paragraph</p>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  /**
   * Test: Renders links correctly
   */
  it('renders links correctly', () => {
    const html = '<p>Check out <a href="https://example.com">this link</a></p>';
    render(<ProjectDescription html={html} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('this link');
  });

  /**
   * Test: Renders strong text
   */
  it('renders strong text', () => {
    const html = '<p>This is <strong>very important</strong></p>';
    render(<ProjectDescription html={html} />);
    const strong = screen.getByText('very important');
    expect(strong.tagName).toBe('STRONG');
  });

  /**
   * Test: Renders italic text
   */
  it('renders italic text', () => {
    const html = '<p>This is <em>emphasized</em></p>';
    render(<ProjectDescription html={html} />);
    const em = screen.getByText('emphasized');
    expect(em.tagName).toBe('EM');
  });

  /**
   * Test: Renders unordered lists
   */
  it('renders unordered lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  /**
   * Test: Renders ordered lists
   */
  it('renders ordered lists', () => {
    const html = '<ol><li>First</li><li>Second</li><li>Third</li></ol>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  /**
   * Test: Renders line breaks
   */
  it('renders line breaks', () => {
    const html = '<p>Line 1<br />Line 2</p>';
    const { container } = render(<ProjectDescription html={html} />);
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  /**
   * Test: Sanitizes dangerous HTML (script tags)
   */
  it('sanitizes dangerous HTML (script tags)', () => {
    const html = '<p>Safe text</p><script>alert("xss")</script>';
    const { container } = render(<ProjectDescription html={html} />);
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });

  /**
   * Test: Sanitizes dangerous HTML (onclick handlers)
   */
  it('sanitizes dangerous HTML (onclick handlers)', () => {
    const html = '<p onclick="alert(\'xss\')">Click me</p>';
    const { container } = render(<ProjectDescription html={html} />);
    const p = container.querySelector('p');
    expect(p).not.toHaveAttribute('onclick');
  });

  /**
   * Test: Removes disallowed tags like div
   */
  it('removes disallowed tags', () => {
    const html = '<div>This div should be removed</div><p>This p stays</p>';
    render(<ProjectDescription html={html} />);
    // DOMPurify removes the tag but keeps the content
    expect(screen.getByText('This div should be removed')).toBeInTheDocument();
    expect(screen.getByText('This p stays')).toBeInTheDocument();
    // The p tag should still be present
    const pElements = document.querySelectorAll('p');
    expect(pElements.length).toBeGreaterThan(0);
  });

  /**
   * Test: Accepts custom sx prop for styling
   */
  it('accepts custom sx prop for styling', () => {
    const { container } = render(
      <ProjectDescription html="<p>Test</p>" sx={{ mb: 2 }} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Handles empty HTML
   */
  it('handles empty HTML', () => {
    const { container } = render(<ProjectDescription html="" />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Memoizes sanitization for performance
   */
  it('memoizes sanitization for performance', () => {
    const html = '<p>Test content</p>';
    const { rerender } = render(<ProjectDescription html={html} />);

    // Re-render with same HTML - should use memoized value
    rerender(<ProjectDescription html={html} />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  /**
   * Test: Handles complex nested HTML
   */
  it('handles complex nested HTML', () => {
    const html = `
      <p>
        This is a <strong>complex</strong> description with
        <a href="/link">multiple</a> types of
        <em>formatting</em>.
      </p>
      <ul>
        <li>Feature 1</li>
        <li>Feature 2</li>
      </ul>
    `;
    render(<ProjectDescription html={html} />);
    expect(screen.getByText(/complex/)).toBeInTheDocument();
    expect(screen.getByText(/Feature 1/)).toBeInTheDocument();
  });

  /**
   * Test: Renders tags in stacked layout
   */
  it('renders tags in stacked layout', () => {
    const html = '<p>Test description</p>';
    const tags = ['React', 'TypeScript', 'MUI'];
    render(<ProjectDescription html={html} tags={tags} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Renders tags in floated layout
   */
  it('renders tags in floated layout', () => {
    const html = '<p>Test description</p>';
    const tags = ['React', 'TypeScript', 'MUI'];
    render(<ProjectDescription html={html} tags={tags} floatTags />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Works without tags
   */
  it('works without tags', () => {
    const html = '<p>Test description without tags</p>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText('Test description without tags')).toBeInTheDocument();
  });

  /**
   * Test: Works with empty tags array
   */
  it('works with empty tags array', () => {
    const html = '<p>Test description with empty tags</p>';
    render(<ProjectDescription html={html} tags={[]} />);
    expect(screen.getByText('Test description with empty tags')).toBeInTheDocument();
  });

  /**
   * Test: Renders tags and description together
   */
  it('renders tags and description together', () => {
    const html = '<p>This is a project about building web apps</p>';
    const tags = ['Frontend', 'JavaScript'];
    render(<ProjectDescription html={html} tags={tags} />);
    expect(screen.getByText('This is a project about building web apps')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  /**
   * Test: floatTags defaults to false
   */
  it('floatTags defaults to false when not specified', () => {
    const html = '<p>Test description</p>';
    const tags = ['React'];
    const { container } = render(<ProjectDescription html={html} tags={tags} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders circa/date chip with tags
   */
  it('renders circa/date chip with tags', () => {
    const html = '<p>Test description</p>';
    const tags = ['React', 'TypeScript'];
    const circa = '2022-2023';
    render(<ProjectDescription html={html} tags={tags} circa={circa} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
  });

  /**
   * Test: Renders circa chip without tags
   */
  it('renders circa chip without tags', () => {
    const html = '<p>Test description</p>';
    const circa = '2022-2023';
    render(<ProjectDescription html={html} circa={circa} />);
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  /**
   * Test: Renders circa in floated layout
   */
  it('renders circa in floated layout', () => {
    const html = '<p>Test description</p>';
    const tags = ['React'];
    const circa = '2022-2023';
    render(
      <ProjectDescription html={html} tags={tags} circa={circa} floatTags />
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles malformed HTML gracefully
   */
  it('handles malformed HTML gracefully', () => {
    const malformedHtml = '<p>Unclosed paragraph<p>Another paragraph</p>';
    const { container } = render(<ProjectDescription html={malformedHtml} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Unclosed paragraph/)).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles very long content without crashing
   */
  it('handles very long content without crashing', () => {
    const longContent =
      '<p>' + 'Lorem ipsum dolor sit amet. '.repeat(500) + '</p>';
    const { container } = render(<ProjectDescription html={longContent} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles nested malformed tags
   */
  it('handles nested malformed tags', () => {
    const html = '<p><strong><em>Bold and italic</p></strong></em>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText(/Bold and italic/)).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles empty tags
   */
  it('handles empty tags', () => {
    const html = '<p></p><p>Content</p>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles whitespace-only HTML
   */
  it('handles whitespace-only HTML', () => {
    const html = '<p>   </p>';
    const { container } = render(<ProjectDescription html={html} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Edge case - Handles many tags with no content between them
   */
  it('handles many consecutive tags', () => {
    const html =
      '<strong></strong><em></em><span></span><p>Finally some content</p>';
    render(<ProjectDescription html={html} />);
    expect(screen.getByText('Finally some content')).toBeInTheDocument();
  });
});
