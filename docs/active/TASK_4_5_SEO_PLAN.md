# Task 4.5: SEO Optimization Implementation Plan

## Context

This implements comprehensive SEO optimization for the Next.js portfolio application. The site currently has basic metadata (title and description only) but lacks critical SEO infrastructure including Open Graph tags, structured data (JSON-LD), sitemap, robots.txt, and canonical URLs.

**Why this is needed:**
- Improve search engine visibility and rankings
- Enable rich social media previews when sharing links
- Help search engines understand site structure and content
- Provide proper crawling instructions to search bots
- Support future expansion to project detail pages

**Current state:**
- Basic metadata in root layout
- 18 portfolio projects with rich data structure
- Three main pages: home (/), resume (/resume), colophon (/colophon)
- No sitemap, robots.txt, or structured data
- Missing Open Graph and Twitter card tags

## Implementation Strategy

### Approach

We'll build SEO infrastructure in this order:

1. **Constants** - Centralize all SEO values (URLs, metadata strings)
2. **Utilities** - Create schema generators for JSON-LD structured data
3. **Metadata** - Enhance all pages with comprehensive meta tags
4. **Infrastructure** - Generate sitemap and robots.txt
5. **Assets** - Add Open Graph preview image

### Key Decisions

**Project Detail Pages:** Skip for now since they don't exist yet. Sitemap will include only current routes (/, /resume, /colophon). When project pages are added later, sitemap can be easily extended.

**Resume Page Metadata:** Resume is a client component, so we'll create a layout wrapper (`/app/resume/layout.tsx`) to provide metadata without converting the page itself.

**OG Image:** Start with a single generic 1200x630 image for all pages. This is the fastest path to functional social previews. Can upgrade to dynamic per-page images later.

**Structured Data:** Implement Person schema in root layout to establish site ownership and author information for search engines.

## Files to Create

### 1. `/v2/src/constants/seo.ts` - SEO Constants
Centralizes site URL, author info, social links, and all metadata strings. All other files import from here to ensure consistency.

**Key exports:**
- `SITE_URL` - Base URL for canonical URLs
- `AUTHOR` - Name, job title, tagline
- `SOCIAL_LINKS` - LinkedIn, GitHub
- `SITE_METADATA` - Default title, description, keywords
- `PAGE_METADATA` - Page-specific metadata for home, resume, colophon

### 2. `/v2/src/lib/seo.ts` - SEO Utilities
Schema.org JSON-LD generators for structured data. Fully documented per CLAUDE.md requirements.

**Functions:**
- `getPersonSchema()` - Author/creator information
- `getBreadcrumbSchema(items)` - Navigation hierarchy
- `getProjectSchema(project)` - Portfolio project metadata
- `getOrganizationSchema()` - Site ownership info
- `stripHtml(html)` - Remove HTML tags from strings
- `truncate(text, maxLength)` - Truncate descriptions to 160 chars

**Dependencies:** Requires `schema-dts` package for TypeScript types

### 3. `/v2/app/sitemap.ts` - Sitemap Generation
Dynamic sitemap using Next.js MetadataRoute.Sitemap format. Includes all static pages with lastModified, changeFrequency, and priority.

**Pages included:**
- `/` (priority: 1.0, weekly)
- `/resume` (priority: 0.8, monthly)
- `/colophon` (priority: 0.5, yearly)

### 4. `/v2/app/robots.ts` - Robots.txt
Instructs search crawlers using Next.js MetadataRoute.Robots format. Allows all crawlers, points to sitemap.

### 5. `/v2/app/resume/layout.tsx` - Resume Metadata Wrapper
Provides metadata for the client component resume page without converting the page itself.

### 6. `/v2/public/og-image.png` - Social Preview Image
1200x630px image for Open Graph social previews. Can use temporary placeholder initially, recommend creating dedicated branded image with Buta mascot.

## Files to Modify

### 1. `/v2/app/layout.tsx` - Root Layout
**Changes:**
- Import SEO constants and schema functions
- Replace basic metadata with comprehensive metadata export including:
  - OpenGraph tags (title, description, images, type, locale)
  - Twitter card tags
  - Keywords array
  - Robots directives
  - metadataBase for canonical URL generation
- Add JSON-LD script tag in body with Person schema

### 2. `/v2/app/page.tsx` - Home Page
**Changes:**
- Add metadata export with page-specific title, description, keywords
- Add canonical URL
- Add OpenGraph page-specific tags

### 3. `/v2/app/resume/page.tsx` - Resume Page
**Changes:**
- No changes needed (metadata handled by new layout.tsx)

### 4. `/v2/app/colophon/page.tsx` - Colophon Page
**Changes:**
- Import SEO constants
- Replace existing metadata with enhanced version including:
  - Keywords
  - Canonical URL
  - OpenGraph tags

## Implementation Sequence

### Step 1: Install Dependencies (2 min)
```bash
npm install --save-dev schema-dts
```

### Step 2: Create Constants (10 min)
- Create `/v2/src/constants/seo.ts` with all SEO values
- Run type-check to verify no errors

### Step 3: Create SEO Library (20 min)
- Create `/v2/src/lib/seo.ts` with schema generators
- Ensure full JSDoc documentation
- Run type-check

### Step 4: Update Root Layout (15 min)
- Modify `/v2/app/layout.tsx` with enhanced metadata
- Add Person schema JSON-LD script
- Test that page still renders

### Step 5: Update Pages (15 min)
- Add metadata to `/v2/app/page.tsx`
- Create `/v2/app/resume/layout.tsx`
- Update `/v2/app/colophon/page.tsx`
- Test all pages render correctly

### Step 6: Create Infrastructure (10 min)
- Create `/v2/app/sitemap.ts`
- Create `/v2/app/robots.ts`
- Test locally: `npm run dev` then visit `/sitemap.xml` and `/robots.txt`

### Step 7: Add OG Image (Variable)
- Add `/v2/public/og-image.png` (1200x630px)
- Use placeholder initially if needed

## Testing & Verification

### 1. Local Testing
```bash
# Build and verify no errors
npm run build

# Start dev server
npm run dev

# Test endpoints
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

### 2. Metadata Verification
- Open DevTools > Elements > `<head>`
- Verify presence of:
  - `<title>` tags on all pages
  - `<meta name="description">`
  - `<meta property="og:*">` (Open Graph)
  - `<meta name="twitter:*">` (Twitter cards)
  - `<link rel="canonical">`
  - `<script type="application/ld+json">` (structured data)

### 3. Structured Data Validation
- Use Google Rich Results Test: https://search.google.com/test/rich-results
- Validate Person schema with Schema.org validator: https://validator.schema.org/
- Check for warnings or errors

### 4. Social Preview Testing
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### 5. Lighthouse SEO Audit
- Run in Chrome DevTools > Lighthouse
- Select "SEO" category only
- Target score: 100/100

### 6. Post-Deployment
- Submit sitemap to Google Search Console
- Submit sitemap to Bing Webmaster Tools
- Monitor for crawl errors

## Critical Files

The following files are essential and interdependent:

1. **`/v2/src/constants/seo.ts`** - Foundation for all SEO; defines site URL and metadata
2. **`/v2/src/lib/seo.ts`** - Schema generators; depends on constants
3. **`/v2/app/layout.tsx`** - Root metadata; imports both above files
4. **`/v2/app/sitemap.ts`** - Depends on SITE_URL from constants
5. **`/v2/app/robots.ts`** - Depends on SITE_URL from constants

## Edge Cases Handled

1. **Missing OG Image**: Metadata will reference image but won't crash if file doesn't exist
2. **Projects Without Images**: `getProjectSchema()` uses optional chaining for image URL
3. **HTML in Project Titles**: `stripHtml()` utility removes tags before schema generation
4. **Long Descriptions**: `truncate()` utility caps meta descriptions at 160 characters
5. **Client Component Metadata**: Resume page uses layout wrapper pattern

## Success Criteria

- ✅ Type-check passes (0 errors)
- ✅ All pages render correctly
- ✅ Sitemap.xml accessible at `/sitemap.xml`
- ✅ Robots.txt accessible at `/robots.txt`
- ✅ All meta tags present in page `<head>`
- ✅ Person schema validates with Google Rich Results Test
- ✅ Social previews show correctly on Facebook/Twitter/LinkedIn
- ✅ Lighthouse SEO score: 100/100
- ✅ All new code fully documented per CLAUDE.md guidelines

## Future Enhancements (Out of Scope)

These can be added in future tasks:
- Project detail pages (`/projects/[id]`) with dynamic sitemap entries
- Dynamic OG images generated per page
- Multi-language SEO with hreflang tags
- Video schema for project videos
- Blog with Article schema (if blog is added)
