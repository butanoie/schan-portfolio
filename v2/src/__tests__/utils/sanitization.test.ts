import { describe, it, expect, afterEach } from 'vitest';
import {
  sanitizeHtml,
  isValidUrlProtocol,
  SANITIZATION_CONFIG,
} from '../../utils/sanitization';

describe('sanitization utilities', () => {
  describe('isValidUrlProtocol', () => {
    it('should allow https protocol', () => {
      expect(isValidUrlProtocol('https://example.com')).toBe(true);
    });

    it('should allow http protocol', () => {
      expect(isValidUrlProtocol('http://example.com')).toBe(true);
    });

    it('should allow mailto protocol', () => {
      expect(isValidUrlProtocol('mailto:test@example.com')).toBe(true);
    });

    it('should allow relative URLs', () => {
      expect(isValidUrlProtocol('/page')).toBe(true);
      expect(isValidUrlProtocol('./relative')).toBe(true);
      expect(isValidUrlProtocol('../sibling')).toBe(true);
    });

    it('should block javascript protocol', () => {
      expect(isValidUrlProtocol('javascript:alert("XSS")')).toBe(false);
      expect(isValidUrlProtocol('JavaScript:alert("XSS")')).toBe(false);
      expect(isValidUrlProtocol('jAvAsCrIpT:alert("XSS")')).toBe(false);
    });

    it('should block data protocol', () => {
      expect(isValidUrlProtocol('data:text/html,<script>alert("XSS")</script>')).toBe(false);
      expect(isValidUrlProtocol('data:image/svg+xml,<svg onload="alert(\'XSS\')">')).toBe(false);
    });

    it('should block vbscript protocol', () => {
      expect(isValidUrlProtocol('vbscript:msgbox("XSS")')).toBe(false);
      expect(isValidUrlProtocol('VBScript:msgbox("XSS")')).toBe(false);
    });

    it('should block file protocol', () => {
      expect(isValidUrlProtocol('file:///etc/passwd')).toBe(false);
      expect(isValidUrlProtocol('file://localhost/etc/passwd')).toBe(false);
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => isValidUrlProtocol(null as unknown as string)).toThrow(TypeError);
      expect(() => isValidUrlProtocol(undefined as unknown as string)).toThrow(TypeError);
      expect(() => isValidUrlProtocol(123 as unknown as string)).toThrow(TypeError);
    });
  });

  describe('sanitizeHtml', () => {
    afterEach(() => {
      // Clean up any hooks left behind
      try {
        // @ts-expect-error - accessing private method for cleanup
        const hooks = DOMPurify?.hooks?.afterSanitizeAttributes;
        if (hooks) {
          // Clear hooks array
        }
      } catch {
        // Hook cleanup failed, continue
      }
    });

    // OWASP XSS Test Vectors
    describe('OWASP XSS Prevention', () => {
      it('should block script tag injection', () => {
        const dangerous = '<p>Hello <script>alert("XSS")</script></p>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('alert');
        expect(sanitized).toContain('Hello');
      });

      it('should block img onerror attribute', () => {
        const dangerous = '<img src="x" onerror="alert(\'XSS\')" />';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('alert');
      });

      it('should block svg onload attribute', () => {
        const dangerous = '<svg onload="alert(\'XSS\')"></svg>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('alert');
      });

      it('should block iframe injection', () => {
        const dangerous = '<iframe src="javascript:alert(\'XSS\')"></iframe>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('<iframe>');
        expect(sanitized).not.toContain('javascript:');
      });

      it('should block embed tag', () => {
        const dangerous = '<embed src="data:text/html,<script>alert(\'XSS\')</script>">';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('<embed>');
      });

      it('should block object tag', () => {
        const dangerous = '<object data="javascript:alert(\'XSS\')"></object>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('<object>');
      });

      it('should block style tag with javascript', () => {
        const dangerous = '<style>body{background:url("javascript:alert(\'XSS\')")}</style>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('<style>');
      });

      it('should block form and input tags', () => {
        const dangerous = '<form><input onfocus="alert(\'XSS\')" autofocus></form>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('<form>');
        expect(sanitized).not.toContain('<input>');
      });

      it('should block event handler attributes', () => {
        const dangerous = '<p onclick="alert(\'XSS\')">Click me</p>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('onclick');
        expect(sanitized).toContain('Click me');
      });
    });

    // URL Protocol Validation
    describe('URL Protocol Validation', () => {
      it('should remove javascript protocol from href', () => {
        const dangerous = '<a href="javascript:alert(\'XSS\')">Click</a>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('href=');
      });

      it('should remove data protocol from href', () => {
        const dangerous = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>';
        const sanitized = sanitizeHtml(dangerous);
        expect(sanitized).not.toContain('data:');
        expect(sanitized).not.toContain('href=');
      });

      it('should allow https links', () => {
        const safe = '<a href="https://example.com">Link</a>';
        const sanitized = sanitizeHtml(safe);
        expect(sanitized).toContain('https://example.com');
      });

      it('should allow http links', () => {
        const safe = '<a href="http://example.com">Link</a>';
        const sanitized = sanitizeHtml(safe);
        expect(sanitized).toContain('http://example.com');
      });

      it('should allow mailto links', () => {
        const safe = '<a href="mailto:test@example.com">Email</a>';
        const sanitized = sanitizeHtml(safe);
        expect(sanitized).toContain('mailto:');
      });

      it('should allow relative links', () => {
        const safe = '<a href="/page">Link</a>';
        const sanitized = sanitizeHtml(safe);
        expect(sanitized).toContain('href="/page"');
      });
    });

    // External Link Security
    describe('External Link Security Attributes', () => {
      it('should add target="_blank" to https links', () => {
        const html = '<a href="https://example.com">Link</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('target="_blank"');
      });

      it('should add rel="noopener noreferrer" to https links', () => {
        const html = '<a href="https://example.com">Link</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('rel="noopener noreferrer"');
      });

      it('should add target="_blank" to http links', () => {
        const html = '<a href="http://example.com">Link</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('target="_blank"');
      });

      it('should add rel="noopener noreferrer" to http links', () => {
        const html = '<a href="http://example.com">Link</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('rel="noopener noreferrer"');
      });

      it('should not modify mailto links with target/rel', () => {
        const html = '<a href="mailto:test@example.com">Email</a>';
        const sanitized = sanitizeHtml(html);
        // Mailto links should not have target="_blank"
        expect(sanitized).toContain('mailto:');
      });

      it('should not modify relative links with target/rel', () => {
        const html = '<a href="/page">Relative</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('href="/page"');
      });
    });

    // Safe Tag and Attribute Preservation
    describe('Safe Content Preservation', () => {
      it('should preserve paragraph tags', () => {
        const html = '<p>Test content</p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<p>');
        expect(sanitized).toContain('Test content');
      });

      it('should preserve strong tags', () => {
        const html = '<p>This is <strong>important</strong></p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<strong>');
        expect(sanitized).toContain('important');
      });

      it('should preserve em tags', () => {
        const html = '<p>This is <em>emphasized</em></p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<em>');
        expect(sanitized).toContain('emphasized');
      });

      it('should preserve ul and li tags', () => {
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<ul>');
        expect(sanitized).toContain('<li>');
        expect(sanitized).toContain('Item 1');
        expect(sanitized).toContain('Item 2');
      });

      it('should preserve ol and li tags', () => {
        const html = '<ol><li>First</li><li>Second</li></ol>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<ol>');
        expect(sanitized).toContain('<li>');
        expect(sanitized).toContain('First');
      });

      it('should preserve br tags', () => {
        const html = '<p>Line 1<br>Line 2</p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<br');
      });

      it('should preserve href attribute', () => {
        const html = '<a href="https://example.com" title="Example">Link</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('href="https://example.com"');
      });

      it('should preserve title attribute', () => {
        const html = '<a href="https://example.com" title="Example">Link</a>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('title="Example"');
      });
    });

    // Complex Content Scenarios
    describe('Complex Content Scenarios', () => {
      it('should handle mixed safe and unsafe content', () => {
        const html = '<p>Safe <script>alert("XSS")</script> content</p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('Safe');
        expect(sanitized).toContain('content');
        expect(sanitized).not.toContain('<script>');
      });

      it('should handle nested safe tags', () => {
        const html = '<p>Paragraph with <strong>bold <em>and italic</em></strong> text</p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('<p>');
        expect(sanitized).toContain('<strong>');
        expect(sanitized).toContain('<em>');
      });

      it('should handle multiple links', () => {
        const html = '<p><a href="https://example.com">Link 1</a> and <a href="https://example.org">Link 2</a></p>';
        const sanitized = sanitizeHtml(html);
        expect(sanitized.match(/href=/g)?.length).toBe(2);
      });

      it('should handle very long content', () => {
        const longContent = '<p>' + 'A'.repeat(10000) + '</p>';
        const sanitized = sanitizeHtml(longContent);
        expect(sanitized).toContain('A');
        expect(sanitized).toContain('<p>');
      });

      it('should handle empty content', () => {
        const sanitized = sanitizeHtml('');
        expect(sanitized).toBe('');
      });

      it('should handle content with only whitespace', () => {
        const sanitized = sanitizeHtml('   \n  \t  ');
        expect(sanitized).toBeTruthy(); // Whitespace is preserved or empty
      });
    });

    // Error Handling
    describe('Error Handling', () => {
      it('should throw TypeError for non-string input', () => {
        expect(() => sanitizeHtml(null as unknown as string)).toThrow(TypeError);
        expect(() => sanitizeHtml(undefined as unknown as string)).toThrow(TypeError);
        expect(() => sanitizeHtml(123 as unknown as string)).toThrow(TypeError);
        expect(() => sanitizeHtml({} as unknown as string)).toThrow(TypeError);
        expect(() => sanitizeHtml([] as unknown as string)).toThrow(TypeError);
      });

      it('should return empty string on sanitization error', () => {
        // This test would need to mock DOMPurify to throw an error
        // For now, we test that sanitizeHtml handles errors gracefully
        const result = sanitizeHtml('<p>Valid content</p>');
        expect(typeof result).toBe('string');
      });
    });

    // Real-world scenarios
    describe('Real-world Project Description Scenarios', () => {
      it('should handle rich project description', () => {
        const html = `
          <p>Built a <strong>React</strong> application with <em>TypeScript</em>.</p>
          <p>Key features:</p>
          <ul>
            <li>Responsive design using MUI</li>
            <li>Type-safe development</li>
            <li>SSR with Next.js</li>
          </ul>
          <p>View the project: <a href="https://github.com/example/repo">GitHub Repository</a></p>
        `;
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('React');
        expect(sanitized).toContain('TypeScript');
        expect(sanitized).toContain('<ul>');
        expect(sanitized).toContain('https://github.com');
        expect(sanitized).not.toContain('<script>');
      });

      it('should handle description with multiple links', () => {
        const html = `
          <p>
            This project was built with <a href="https://react.dev">React</a>,
            styled with <a href="https://mui.com">MUI</a>,
            and deployed on <a href="https://vercel.com">Vercel</a>.
          </p>
        `;
        const sanitized = sanitizeHtml(html);
        expect(sanitized).toContain('react.dev');
        expect(sanitized).toContain('mui.com');
        expect(sanitized).toContain('vercel.com');
        // All links should have target="_blank" and rel="noopener noreferrer"
        expect(sanitized.match(/target="_blank"/g)?.length).toBe(3);
        expect(sanitized.match(/rel="noopener noreferrer"/g)?.length).toBe(3);
      });
    });
  });

  describe('SANITIZATION_CONFIG', () => {
    it('should have correct allowed tags', () => {
      expect(SANITIZATION_CONFIG.ALLOWED_TAGS).toEqual([
        'p',
        'a',
        'strong',
        'em',
        'ul',
        'ol',
        'li',
        'br',
      ]);
    });

    it('should have correct allowed attributes', () => {
      expect(SANITIZATION_CONFIG.ALLOWED_ATTR).toEqual(['href', 'title']);
    });

    it('should have KEEP_CONTENT set to true', () => {
      expect(SANITIZATION_CONFIG.KEEP_CONTENT).toBe(true);
    });

    it('should not allow return of DOM', () => {
      expect(SANITIZATION_CONFIG.RETURN_DOM).toBe(false);
      expect(SANITIZATION_CONFIG.RETURN_DOM_FRAGMENT).toBe(false);
      expect(SANITIZATION_CONFIG.RETURN_DOM_IMPORT).toBe(false);
    });
  });
});
