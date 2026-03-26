/**
 * Unit tests for llms-content utility functions.
 *
 * Validates that both `buildLlmsTxt()` and `buildLlmsFullTxt()` produce
 * spec-compliant markdown content with correct metadata from SEO constants.
 *
 * @see {@link @/src/utils/llms-content.ts} for the content builders under test
 */

import { describe, it, expect } from 'vitest';
import { buildLlmsTxt, buildLlmsFullTxt } from '@/src/utils/llms-content';
import {
  SITE_URL,
  AUTHOR,
  SOCIAL_LINKS,
  SITE_METADATA,
} from '@/src/constants/seo';

describe('buildLlmsTxt', () => {
  /** Cached result to avoid rebuilding in every test. */
  const content = buildLlmsTxt();

  it('starts with an H1 containing the site title', () => {
    expect(content).toMatch(new RegExp(`^# ${SITE_METADATA.title}`));
  });

  it('includes a blockquote summary', () => {
    expect(content).toContain(`> ${SITE_METADATA.description}`);
  });

  it('includes the author tagline', () => {
    expect(content).toContain(AUTHOR.tagline);
  });

  it('lists all four page URLs', () => {
    expect(content).toContain(`${SITE_URL}/`);
    expect(content).toContain(`${SITE_URL}/resume`);
    expect(content).toContain(`${SITE_URL}/samples`);
    expect(content).toContain(`${SITE_URL}/colophon`);
  });

  it('includes social links', () => {
    expect(content).toContain(SOCIAL_LINKS.github);
    expect(content).toContain(SOCIAL_LINKS.linkedin);
  });

  it('includes a resume PDF link', () => {
    expect(content).toContain(`${SITE_URL}/Sing_Chan_Resume.pdf`);
  });

  it('does not contain raw undefined values', () => {
    expect(content).not.toContain('undefined');
  });
});

describe('buildLlmsFullTxt', () => {
  /** Cached result to avoid rebuilding in every test. */
  const content = buildLlmsFullTxt();

  it('starts with an H1 containing the site title', () => {
    expect(content).toMatch(new RegExp(`^# ${SITE_METADATA.title}`));
  });

  it('includes a professional summary section', () => {
    expect(content).toContain('## Professional Summary');
    expect(content).toContain('enterprise SaaS');
  });

  it('includes portfolio projects section with all 18 projects', () => {
    expect(content).toContain('## Portfolio Projects');
    expect(content).toContain('Collabspace Export Downloader');
    expect(content).toContain('grASP CMS');
    const projectHeadings = content.match(/^### /gm);
    expect(projectHeadings).toHaveLength(23);
  });

  it('includes technology tags for projects', () => {
    expect(content).toContain('Technologies:');
    expect(content).toContain('React.js');
    expect(content).toContain('.NET 9');
  });

  it('includes writing samples section', () => {
    expect(content).toContain('## Writing Samples');
    expect(content).toContain('Defining the Vision');
    expect(content).toContain('Measuring the Impact');
  });

  it('includes the Additional Cost Savings Roadmap artifact', () => {
    expect(content).toContain('Additional Cost Savings Roadmap');
    expect(content).toContain('Contact Sing to request');
  });

  it('includes download links for writing samples', () => {
    expect(content).toContain('/documents/');
    expect(content).toContain('Product Roadmap');
    expect(content).toContain('WCAG 2.2 Compliance Guide');
  });

  it('includes social links and resume PDF', () => {
    expect(content).toContain(SOCIAL_LINKS.github);
    expect(content).toContain(SOCIAL_LINKS.linkedin);
    expect(content).toContain(`${SITE_URL}/Sing_Chan_Resume.pdf`);
  });

  it('does not contain raw undefined values', () => {
    expect(content).not.toContain('undefined');
  });

  it('does not contain HTML tags', () => {
    expect(content).not.toMatch(/<\/?[a-z][^>]*>/i);
  });
});
