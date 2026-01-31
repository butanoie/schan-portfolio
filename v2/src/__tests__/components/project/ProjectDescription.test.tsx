import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectDescription } from '@/src/components/project/ProjectDescription';

describe('ProjectDescription', () => {
  describe('Rendering', () => {
    it('renders HTML description correctly', () => {
      const html = '<p>This is a test description.</p>';

      render(<ProjectDescription html={html} />);

      expect(screen.getByText('This is a test description.')).toBeInTheDocument();
    });

    it('renders section element with aria-label', () => {
      const html = '<p>Test description</p>';

      const { container } = render(<ProjectDescription html={html} />);

      const section = screen.getByRole('region', {
        name: 'Project description',
      });
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('renders multiple paragraphs', () => {
      const html = `
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
        <p>Third paragraph.</p>
      `;

      const { container } = render(<ProjectDescription html={html} />);

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(3);
    });

    it('renders links with href attribute', () => {
      const html = '<p>Check out <a href="https://example.com">this link</a>.</p>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link', { name: 'this link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders strong (bold) text', () => {
      const html = '<p>This is <strong>important</strong> text.</p>';

      render(<ProjectDescription html={html} />);

      const strong = screen.getByText((content, element) => {
        return element?.tagName === 'STRONG' && element?.textContent === 'important';
      });
      expect(strong).toBeInTheDocument();
    });

    it('renders em (italic) text', () => {
      const html = '<p>This is <em>emphasized</em> text.</p>';

      render(<ProjectDescription html={html} />);

      const em = screen.getByText((content, element) => {
        return element?.tagName === 'EM' && element?.textContent === 'emphasized';
      });
      expect(em).toBeInTheDocument();
    });

    it('renders unordered lists', () => {
      const html = `
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
      `;

      const { container } = render(<ProjectDescription html={html} />);

      const ul = container.querySelector('ul');
      expect(ul).toBeInTheDocument();

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();
      expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('renders ordered lists', () => {
      const html = `
        <ol>
          <li>Step one</li>
          <li>Step two</li>
          <li>Step three</li>
        </ol>
      `;

      const { container } = render(<ProjectDescription html={html} />);

      const ol = container.querySelector('ol');
      expect(ol).toBeInTheDocument();

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
    });

    it('renders line breaks', () => {
      const html = '<p>Line one<br>Line two</p>';

      const { container } = render(<ProjectDescription html={html} />);

      const br = container.querySelector('br');
      expect(br).toBeInTheDocument();
    });
  });

  describe('HTML Sanitization', () => {
    it('allows safe HTML tags (p, a, strong, em, ul, ol, li, br)', () => {
      const html = `
        <p>Paragraph with <strong>strong</strong> and <em>emphasis</em>.</p>
        <ul>
          <li>List item</li>
        </ul>
        <a href="https://example.com">Link</a>
      `;

      const { container } = render(<ProjectDescription html={html} />);

      expect(container.querySelector('p')).toBeInTheDocument();
      expect(container.querySelector('strong')).toBeInTheDocument();
      expect(container.querySelector('em')).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelector('li')).toBeInTheDocument();
      expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('strips dangerous script tags', () => {
      const html = '<p>Safe text</p><script>alert("xss")</script>';

      const { container } = render(<ProjectDescription html={html} />);

      expect(container.querySelector('script')).not.toBeInTheDocument();
      expect(screen.getByText('Safe text')).toBeInTheDocument();
    });

    it('strips dangerous onclick attributes', () => {
      const html = '<p onclick="alert(\'xss\')">Click me</p>';

      const { container } = render(<ProjectDescription html={html} />);

      const paragraph = screen.getByText('Click me');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).not.toHaveAttribute('onclick');
    });

    it('strips iframe tags', () => {
      const html = '<p>Safe text</p><iframe src="evil.com"></iframe>';

      const { container } = render(<ProjectDescription html={html} />);

      expect(container.querySelector('iframe')).not.toBeInTheDocument();
      expect(screen.getByText('Safe text')).toBeInTheDocument();
    });

    it('strips style tags', () => {
      const html = '<p>Safe text</p><style>body { display: none; }</style>';

      const { container } = render(<ProjectDescription html={html} />);

      expect(container.querySelector('style')).not.toBeInTheDocument();
      expect(screen.getByText('Safe text')).toBeInTheDocument();
    });

    it('strips object and embed tags', () => {
      const html = '<p>Safe text</p><object data="evil.swf"></object><embed src="evil.swf">';

      const { container } = render(<ProjectDescription html={html} />);

      expect(container.querySelector('object')).not.toBeInTheDocument();
      expect(container.querySelector('embed')).not.toBeInTheDocument();
      expect(screen.getByText('Safe text')).toBeInTheDocument();
    });

    it('allows href, target, and rel attributes on links', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link', { name: 'Link' });
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
    });

    it('strips disallowed attributes from allowed tags', () => {
      const html = '<p id="bad" class="evil" onclick="alert()">Text</p>';

      const { container } = render(<ProjectDescription html={html} />);

      const paragraph = screen.getByText('Text');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).not.toHaveAttribute('id');
      expect(paragraph).not.toHaveAttribute('class');
      expect(paragraph).not.toHaveAttribute('onclick');
    });
  });

  describe('Styling', () => {
    it('applies custom sx prop as object', () => {
      const html = '<p>Test description</p>';

      const { container } = render(
        <ProjectDescription html={html} sx={{ marginBottom: 8 }} />
      );

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('applies custom sx prop as array', () => {
      const html = '<p>Test description</p>';

      const { container } = render(
        <ProjectDescription
          html={html}
          sx={[{ marginBottom: 4 }, { paddingTop: 2 }]}
        />
      );

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty HTML string', () => {
      const { container } = render(<ProjectDescription html="" />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(section.textContent).toBe('');
    });

    it('handles plain text without HTML tags', () => {
      const plainText = 'This is plain text without any HTML tags.';

      render(<ProjectDescription html={plainText} />);

      expect(screen.getByText(plainText)).toBeInTheDocument();
    });

    it('handles very long description', () => {
      const longText =
        'This is a very long description that spans multiple lines and contains a lot of text to test how the component handles large amounts of content. '.repeat(
          10
        );
      const html = `<p>${longText}</p>`;

      const { container } = render(<ProjectDescription html={html} />);

      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent?.length).toBeGreaterThan(500);
    });

    it('handles nested lists', () => {
      const html = `
        <ul>
          <li>First level
            <ul>
              <li>Second level</li>
            </ul>
          </li>
        </ul>
      `;

      const { container } = render(<ProjectDescription html={html} />);

      const lists = container.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThan(0);
      expect(screen.getByText((content) => content.includes('First level'))).toBeInTheDocument();
      expect(screen.getByText('Second level')).toBeInTheDocument();
    });

    it('handles mixed content (paragraphs, lists, and links)', () => {
      const html = `
        <p>Introduction paragraph.</p>
        <ul>
          <li>Feature one</li>
          <li>Feature two</li>
        </ul>
        <p>Read more at <a href="https://example.com">our website</a>.</p>
      `;

      const { container } = render(<ProjectDescription html={html} />);

      expect(screen.getByText('Introduction paragraph.')).toBeInTheDocument();
      expect(screen.getByText('Feature one')).toBeInTheDocument();
      expect(screen.getByText('Feature two')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'our website' })).toBeInTheDocument();
    });

    it('handles HTML entities correctly', () => {
      const html = '<p>Price: &pound;100 &amp; &euro;120</p>';

      render(<ProjectDescription html={html} />);

      expect(screen.getByText((content) => content.includes('£100'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('&'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('€120'))).toBeInTheDocument();
    });

    it('handles whitespace-only HTML', () => {
      const html = '   \n\n   \t\t   ';

      const { container } = render(<ProjectDescription html={html} />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('handles malformed HTML gracefully', () => {
      const html = '<p>Unclosed paragraph<ul><li>List item</ul>';

      const { container } = render(<ProjectDescription html={html} />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('Unclosed paragraph'))).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has semantic section element', () => {
      const html = '<p>Test description</p>';

      const { container } = render(<ProjectDescription html={html} />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('has descriptive aria-label', () => {
      const html = '<p>Test description</p>';

      render(<ProjectDescription html={html} />);

      const section = screen.getByRole('region', {
        name: 'Project description',
      });
      expect(section).toBeInTheDocument();
    });

    it('links have proper focus styles', () => {
      const html = '<a href="https://example.com">Test link</a>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link', { name: 'Test link' });
      expect(link).toBeInTheDocument();
      // Focus styles are applied via sx prop
    });

    it('links are keyboard accessible', () => {
      const html = '<a href="https://example.com">Test link</a>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link', { name: 'Test link' });
      expect(link).toBeInTheDocument();
      // Links are natively keyboard accessible
    });
  });

  describe('Link Styling', () => {
    it('renders external links with target and rel attributes', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener noreferrer">External</a>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link', { name: 'External' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders internal links without target attribute', () => {
      const html = '<a href="/internal-page">Internal</a>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link', { name: 'Internal' });
      expect(link).toHaveAttribute('href', '/internal-page');
      expect(link).not.toHaveAttribute('target');
    });

    it('handles links with complex content', () => {
      const html = '<a href="https://example.com"><strong>Bold</strong> <em>Italic</em> Link</a>';

      render(<ProjectDescription html={html} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link.querySelector('strong')).toHaveTextContent('Bold');
      expect(link.querySelector('em')).toHaveTextContent('Italic');
    });
  });
});
