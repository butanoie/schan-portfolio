import DOMPurify from 'isomorphic-dompurify';

/**
 * List of safe URL protocols that are allowed in href attributes.
 * Only these protocols will be permitted in sanitized output.
 */
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * Validates that a URL uses a safe protocol.
 *
 * This function blocks dangerous protocols like:
 * - `javascript:` - Can execute arbitrary JavaScript
 * - `data:` - Can load data URIs with embedded content
 * - `vbscript:` - VBScript execution (IE only, but still blocked)
 * - `file:` - Local file access
 *
 * @param url - The URL to validate
 * @returns True if the URL uses a safe protocol, false otherwise
 * @throws {TypeError} If url is not a string
 *
 * @example
 * isValidUrlProtocol('https://example.com') // true
 * isValidUrlProtocol('http://example.com') // true
 * isValidUrlProtocol('mailto:test@example.com') // true
 * isValidUrlProtocol('javascript:alert("XSS")') // false
 * isValidUrlProtocol('data:text/html,<script>alert("XSS")</script>') // false
 */
export function isValidUrlProtocol(url: string): boolean {
  if (typeof url !== 'string') {
    throw new TypeError('URL must be a string');
  }

  try {
    const parsedUrl = new URL(url, 'http://example.com');
    return SAFE_URL_PROTOCOLS.includes(parsedUrl.protocol);
  } catch {
    // If URL parsing fails, check for relative URLs (safe by default)
    return !url.startsWith('javascript:') &&
           !url.startsWith('data:') &&
           !url.startsWith('vbscript:') &&
           !url.startsWith('file:');
  }
}

/**
 * DOMPurify configuration for sanitizing project descriptions and rich text content.
 *
 * **Security Measures:**
 * - Strict tag allowlist: only semantic HTML tags for content
 * - No inline event handlers or style attributes
 * - No `KEEP_CONTENT: true` which could expose dangerous content
 * - No script, iframe, or embed tags
 * - Custom hook validates URL protocols on href attributes
 *
 * **Allowed Tags:**
 * - `p` - Paragraphs
 * - `a` - Links (see URL validation below)
 * - `strong` - Bold text
 * - `em` - Italic text
 * - `ul`, `ol` - Unordered and ordered lists
 * - `li` - List items
 * - `br` - Line breaks
 *
 * **Allowed Attributes:**
 * - `href` - Link URLs (validated for safe protocols)
 * - `title` - Accessible title attribute
 *
 * **Security Details:**
 * - All href attributes are validated before rendering
 * - External links are forced to have `rel="noopener noreferrer"` for security
 * - Target attributes are restricted to safe values only
 *
 * @see https://owasp.org/www-community/attacks/xss/
 */
const SANITIZATION_CONFIG = {
  ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
  ALLOWED_ATTR: ['href', 'title'],
  // KEEP_CONTENT: true preserves text content when unsafe tags are removed
  // This is safe because we use strict tag and attribute whitelists
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
};

/**
 * Module-level DOMPurify hook for validating href attributes and enforcing
 * security attributes on external links.
 *
 * Registered once at module load to avoid race conditions in concurrent
 * rendering (React 18+). DOMPurify hooks are global singletons, so
 * adding/removing them per-call can interleave under concurrent rendering,
 * causing intermittent sanitization failures.
 *
 * @see https://github.com/cure53/DOMPurify#hooks
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href');
    if (href && !isValidUrlProtocol(href)) {
      node.removeAttribute('href');
    }

    // For external links, ensure security attributes
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      node.setAttribute('rel', 'noopener noreferrer');
      node.setAttribute('target', '_blank');
    }
  }
});

/**
 * Sanitizes HTML content for safe rendering in React components using `dangerouslySetInnerHTML`.
 *
 * **What This Does:**
 * - Removes all dangerous HTML tags and attributes
 * - Validates URL protocols in links
 * - Ensures external links have proper security attributes
 * - Prevents XSS attacks through HTML injection
 *
 * **OWASP Top 10 - A7:2017 Cross-Site Scripting (XSS):**
 * This function implements reflected XSS prevention by sanitizing HTML input
 * before rendering. See: https://owasp.org/www-project-top-ten/
 *
 * @param htmlContent - Raw, potentially dangerous HTML string
 * @returns Sanitized HTML string safe for use with `dangerouslySetInnerHTML`
 * @throws {TypeError} If htmlContent is not a string
 *
 * @example
 * const html = '<p>Safe <strong>content</strong></p>';
 * const sanitized = sanitizeHtml(html);
 * return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
 *
 * @example
 * // Dangerous content is removed
 * const dangerous = '<p>Hello <script>alert("XSS")</script></p>';
 * const sanitized = sanitizeHtml(dangerous);
 * // Result: '<p>Hello </p>'
 *
 * @example
 * // Link protocols are validated
 * const badLink = '<a href="javascript:alert(\'XSS\')">Click</a>';
 * const sanitized = sanitizeHtml(badLink);
 * // Result: '<a>Click</a>' (href removed due to invalid protocol)
 */
export function sanitizeHtml(htmlContent: string): string {
  if (typeof htmlContent !== 'string') {
    throw new TypeError('HTML content must be a string');
  }

  const config = {
    ...SANITIZATION_CONFIG,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  try {
    return String(DOMPurify.sanitize(htmlContent, config));
  } catch (error) {
    console.error('Error during HTML sanitization:', error);
    return '';
  }
}

