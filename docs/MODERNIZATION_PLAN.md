# Portfolio Modernization Project Plan

## Executive Summary

This document outlines the plan to modernize portfolio.singchan.com from a 2013-era technology stack (Gumby Framework, jQuery, PHP) to a modern React-based application using Next.js, TypeScript, and Material UI.

**Current Stack:**
- Gumby Framework 2.0 (2013 responsive framework)
- jQuery 1.9.1
- PHP backend with JSON API
- Static HTML pages
- IE6-9 compatibility code (removed)

**Target Stack:**
- Next.js 14+ (React framework)
- TypeScript (type safety)
- Material UI v5/v6 (component library)
- Static Site Generation (SSG/ISR)
- Modern deployment (Vercel/Netlify)
- **WCAG 2.2 Level AA Accessibility Compliance**

---

## Gumby Framework Migration

The V1 site uses Gumby Framework 2.0 for layout, styling, and basic UI components. This section documents what features are being replaced and with what modern equivalents.

### Gumby Features Used in V1

Based on analysis of the V1 codebase, Gumby is used for:

1. **12-Column Grid System**
   - Classes: `container`, `row`, `twelve columns`, `seven columns`, etc.
   - Used throughout all pages for responsive layout
   - Files: [v1/index.html](../v1/index.html), [v1/colophon.html](../v1/colophon.html), [v1/resume.html](../v1/resume.html)

2. **Button Components**
   - Classes: `btn`, `metro`, `rounded`, `primary`, `secondary`, `medium`
   - Icon integration: `icon-left`, `entypo`
   - Used in footer navigation
   - Files: [v1/colophon.html:100-113](../v1/colophon.html#L100-L113)

3. **Entypo Icon Font**
   - Icons: `icon-picture`, `icon-doc-text`, `icon-info-circled`
   - Used in navigation buttons
   - Included in Gumby CSS bundle

4. **Retina Image Support**
   - Custom attribute: `gumby-retina`
   - Automatically swaps to @2x images on high-DPI displays
   - Used on logo, Buta character images
   - Files: [v1/colophon.html:34](../v1/colophon.html#L34), [v1/colophon.html:120](../v1/colophon.html#L120)

5. **Typography System**
   - Base styles for headings (h1-h6)
   - Font families: Open Sans, Oswald, Gochi Hand
   - Defined in [v1/css/gumby.css](../v1/css/gumby.css)

6. **CSS Reset & Base Styles**
   - Normalize.css-style reset
   - Box-sizing: border-box on all elements
   - Base color and spacing values

7. **Minimal JavaScript**
   - `Gumby.ready()` initialization
   - Old IE placeholder polyfill
   - `Gumby.isOldie` browser detection
   - Files: [v1/js/main.js:1-9](../v1/js/main.js#L1-L9), [v1/js/libs/gumby.js](../v1/js/libs/gumby.js)

### Migration Mapping

| Gumby Feature | Modern Replacement | Implementation Phase |
|---------------|-------------------|---------------------|
| Grid system (`container`, `row`, `columns`) | Material UI Grid v2 or CSS Grid | Phase 1 ✅ (MUI Grid available) |
| Button styles (`btn`, `metro`, `rounded`) | Material UI Button component | Phase 3 |
| Icon font (Entypo) | Material UI Icons (@mui/icons-material) | Phase 3 |
| Retina images (`gumby-retina`) | Next.js Image component (automatic optimization) | Phase 2 |
| Typography styles | Material UI Typography + custom theme | Phase 1 ✅ (Theme configured) |
| CSS reset | Material UI CssBaseline | Phase 1 ✅ (Already applied) |
| Old IE support (IE6-9) | **Removed** - Next.js supports modern browsers only | Phase 1 ✅ |
| `Gumby.ready()` initialization | React useEffect hooks | Phase 3 |

### Removed Features

The following Gumby features are being **completely removed** in V2:

- **IE6-9 Support**: Conditional comments, IE-specific stylesheets, oldIE detection
- **jQuery Dependency**: Replaced with React state management and hooks
- **PHP Backend**: Replaced with Next.js API routes or static JSON files
- **Gumby JavaScript Plugins**: Most unnecessary in React (tabs, toggles, checkboxes handled by MUI)

### Notes for Implementation

1. **Grid System**: Material UI Grid v2 (already configured) provides similar responsive breakpoints to Gumby's 12-column system
2. **Icons**: Material UI Icons package should be installed during Phase 3. Choose icons that match the visual style of Entypo icons used in V1
3. **Retina Images**: Next.js Image component handles responsive images and high-DPI displays automatically - no need for separate @2x files
4. **Typography**: V1 fonts (Open Sans, Oswald, Gochi Hand) already configured in V2 theme
5. **Browser Support**: V2 will support modern browsers only (last 2 versions, no IE)

---

## Phase 1: Foundation & Setup ✅

**Goal:** Establish modern development environment

**Duration:** 1-2 weeks

**Status:** ✅ COMPLETED (2026-01-25)

### Tasks

- [x] Initialize Next.js project with TypeScript
  - Created Next.js 16.1.4 project with TypeScript and App Router
  - Project located in `/v2` directory
  - Installed Node.js v25.4.0 and npm v11.7.0
- [x] Install and configure Material UI
  - Installed @mui/material v7.3.7, @emotion/react, @emotion/styled
  - Created MUI theme provider component
  - Configured custom theme with portfolio color palette (Sakura, Duck Egg, Sky Blue, Graphite)
  - Integrated Google Fonts (Open Sans, Oswald, Gochi Hand)
- [x] Set up project structure
  - Created organized directory structure:
    - `/v2/src/components` - React components
    - `/v2/src/lib` - Libraries and utilities
    - `/v2/src/types` - TypeScript type definitions
    - `/v2/src/utils` - Utility functions
    - `/v2/src/styles` - Style utilities
- [x] Configure development tools
  - ESLint 9 configured with Next.js defaults and accessibility rules
  - eslint-plugin-jsx-a11y installed for accessibility linting
  - Next.js already includes jsx-a11y plugin in core-web-vitals config
  - Prettier 3.8 configured with formatting rules and .prettierignore
  - TypeScript strict mode enabled (default in tsconfig.json)
  - Git hooks configured with Husky 9 and lint-staged
    - Pre-commit hook runs linting and formatting
    - Hook located at `/.husky/pre-commit`
  - Accessibility testing tools installed:
    - @axe-core/react for React integration
    - axe-core for automated accessibility testing
- [x] Create basic layout components
  - Header component with accessible navigation and active page indication
  - Footer component with copyright and navigation links
  - MainLayout wrapper with skip-to-content link
  - ThemeProvider for MUI integration
- [x] Implement responsive design system
  - MUI responsive breakpoints configured in theme
  - Theme integrated into root layout
  - Components use MUI's responsive utilities
- [x] Set up npm scripts for quality checks
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run start` - Start production server
  - `npm run lint` - Run ESLint
  - `npm run lint:fix` - Auto-fix ESLint errors
  - `npm run type-check` - Run TypeScript type checking
  - `npm run format` - Format code with Prettier
  - `npm run format:check` - Check code formatting
- [x] Security configuration
  - Updated .gitignore with comprehensive environment variable exclusions
  - Created .env.example template for documentation
  - Added security requirements to modernization plan

### Deliverables

- [x] Working Next.js application running on localhost
- [x] MUI configured with custom theme
- [x] Basic routing structure in place
- [x] Development environment documented (v2/README.md)

### Success Criteria

- ✅ npm run dev launches successfully on http://localhost:3000
- ✅ Basic page renders with MUI components
- ✅ TypeScript compilation has no errors
- ✅ ESLint passes with no accessibility violations
- ✅ All accessibility linters configured and running

### Components Created

- `v2/src/components/Header.tsx` - Navigation with ARIA support
- `v2/src/components/Footer.tsx` - Site footer with semantic markup
- `v2/src/components/MainLayout.tsx` - Main layout with skip link
- `v2/src/components/ThemeProvider.tsx` - MUI theme provider
- `v2/src/lib/theme.ts` - Custom theme configuration

---

## Phase 2: Data Migration

**Goal:** Convert PHP backend to modern data layer

**Duration:** 1-2 weeks

**Status:** ✅ COMPLETE (2026-01-27)

**Completion Summary:**
- ✅ All 18 projects migrated from PHP to TypeScript
- ✅ 239 image files migrated with Next.js optimization
- ✅ 87 tests passing with 88.13% coverage
- ✅ Comprehensive data fetching layer implemented
- ✅ Full documentation compliance

**Detailed Changelog:** [changelog/2026-01-27T154623_phase2-data-migration-complete.md](../changelog/2026-01-27T154623_phase2-data-migration-complete.md)

### Tasks

- [x] Analyze current data structure
  - ✅ Documented PHP data structure from `v1/get_projects/index.php` (478 lines)
  - ✅ Identified PHP classes: Project, ProjectImage, ProjectVideo, ProjectLink, Response
  - ✅ Mapped ~20+ projects with images in `v1/img/gallery/`
  - ✅ Identified retina image support (@2x files present)
- [x] Create TypeScript interfaces
  - ✅ Created `v2/src/types/project.ts` (106 lines)
  - ✅ Created `v2/src/types/typeGuards.ts` (99 lines)
  - ✅ Created `v2/src/types/index.ts` (18 lines)
  - ✅ Interfaces: Project, ProjectImage, ProjectVideo, ProjectsResponse, ProjectQueryOptions
  - ✅ Runtime type validation with type guards
  ```typescript
  interface Project {
    id: string;
    title: string;
    desc: string;
    circa: string;
    tags: string[];
    images: ProjectImage[];
    videos: ProjectVideo[];
    altGrid: boolean;
  }

  interface ProjectImage {
    url: string;
    tnUrl: string;
    caption: string;
    tnUrl2x?: string; // Optional retina variant
  }

  interface ProjectVideo {
    type: 'vimeo' | 'youtube';
    id: string;
    width: number;
    height: number;
  }
  ```
- [x] Convert PHP data to JSON/TypeScript
  - ✅ Extracted all 18 projects from PHP to TypeScript
  - ✅ Created `v2/src/data/projects.ts` (755 lines)
  - ✅ Created `v2/src/data/validateProjects.ts` (55 lines)
  - ✅ Validated data structure (all 18 projects pass validation)
  - ✅ Updated image paths from `/img/gallery/` to `/images/gallery/`
- [x] Migrate image assets
  - ✅ Created `scripts/migrateImages.sh` (41 lines)
  - ✅ Migrated 239 image files across 18 project folders
  - ✅ Images moved to `v2/public/images/gallery/`
  - ✅ Preserved @2x retina variants
  - ✅ Documented structure in changelog
- [x] Implement data fetching layer
  - ✅ Created `v2/src/lib/projectData.ts` (195 lines, 100% test coverage)
  - ✅ Created `v2/src/lib/projectDataServer.ts` (51 lines)
  - ✅ Created `v2/src/hooks/useProjects.ts` (63 lines)
  - ✅ Implemented getProjects() with pagination (default 6 per page)
  - ✅ Implemented AND-logic tag filtering
  - ✅ Implemented case-insensitive search
  - ✅ Added related projects algorithm
  - ✅ Full JSDoc documentation
- [x] Set up Next.js Image optimization
  - ✅ Configured `v2/next.config.ts` for image optimization
  - ✅ Created `v2/src/components/ProjectImage.tsx` (94 lines)
  - ✅ Created `v2/src/components/ProjectGallery.tsx` (73 lines)
  - ✅ Automatic WebP/AVIF conversion
  - ✅ Responsive image loading with blur placeholder
  - ✅ Error fallback handling
- [x] Set up unit testing framework
  - ✅ Installed Vitest 4.0.18 (modern, fast test runner)
  - ✅ Installed @testing-library/react 16.3.2 for component testing
  - ✅ Installed @testing-library/jest-dom 6.9.1 for DOM matchers
  - ✅ Installed @testing-library/user-event 14.6.1 for user interaction simulation
  - ✅ Installed @vitest/coverage-v8 4.0.18 for coverage reporting
  - ✅ Configured `vitest.config.ts` with JSDOM environment and 80% coverage thresholds
  - ✅ Created `vitest.setup.ts` for test environment setup
  - ✅ Configured test scripts in package.json: `test`, `test:watch`, `test:coverage`, `test:ui`
  - ✅ Set up test file structure in `v2/src/__tests__/` (components, lib, utils)
  - ✅ Created comprehensive testing guide (`v2/src/__tests__/README.md`)
  - ✅ Updated TypeScript config with Vitest types
  - ✅ Created sample utility (`formatDate.ts`) with 11 tests and 100% coverage
  - ✅ All quality checks passing (TypeScript, ESLint, Tests)
  - ✅ Documentation: `docs/TESTING_SETUP.md` (350+ lines)
- [x] Create unit tests for project data
  - ✅ Created `v2/src/__tests__/types/typeGuards.test.ts` (18 tests, 245 lines)
  - ✅ Created `v2/src/__tests__/lib/projectData.test.ts` (37 tests, 281 lines)
  - ✅ Created `v2/src/__tests__/data/projects.test.ts` (14 tests, 103 lines)
  - ✅ Created `v2/src/__tests__/integration/dataLayer.test.ts` (7 tests, 76 lines)
  - ✅ All 87 tests passing
  - ✅ Achieved 88.13% code coverage (exceeding 80% target)
  - ✅ Core utilities at 100% coverage

### Deliverables

- [x] Complete TypeScript type definitions
  - ✅ 3 type files (project.ts, typeGuards.ts, index.ts)
  - ✅ 6 core interfaces with full JSDoc documentation
- [x] All project data in JSON/TS format
  - ✅ 18 projects migrated from PHP
  - ✅ projects.ts with type-safe data (755 lines)
- [x] Image assets organized and optimized
  - ✅ 239 images migrated to v2/public/images/gallery/
  - ✅ Next.js Image optimization configured
- [x] Data fetching utilities created
  - ✅ 6 utility functions with 100% test coverage
  - ✅ Server actions and React hook
- [x] Unit tests for all data layer functions
  - ✅ 87 total tests across 5 test files
  - ✅ 88.13% overall coverage
- [x] Test coverage report
  - ✅ HTML, JSON, LCOV, text formats
  - ✅ Coverage exceeds all 80% thresholds

### Success Criteria

- ✅ All project data accessible via TypeScript functions
  - ✅ getProjects(), getProjectById(), getAllTags(), getTagCounts(), getRelatedProjects()
- ✅ Images load properly with Next.js Image
  - ✅ ProjectImage and ProjectGallery components created
  - ✅ Automatic WebP/AVIF conversion configured
- ✅ Type checking catches data inconsistencies
  - ✅ Runtime type guards implemented
  - ✅ 0 TypeScript errors
- ✅ All unit tests pass
  - ✅ 87/87 tests passing
- ✅ Test coverage >80% for data layer
  - ✅ 88.13% overall coverage (exceeds target)
  - ✅ 100% coverage on core projectData.ts
- ✅ Data validation prevents invalid entries
  - ✅ validateProjects() with comprehensive checks
  - ✅ All 18 projects validated successfully
- ✅ Testing infrastructure production-ready
  - ✅ Vitest + React Testing Library configured
- ✅ Coverage thresholds configured
  - ✅ 80% for lines, functions, branches, statements
- ✅ Documentation compliance
  - ✅ Full JSDoc documentation per CLAUDE.md standards
  - ✅ 0 ESLint errors

---

## Phase 3: Core Pages Development

**Goal:** Build main pages with React components

**Duration:** 3-4 weeks

**Status:** ✅ COMPLETED (2026-02-02) - All 4 tasks complete

### Tasks

#### 3.1 Homepage (Portfolio)

> **⚠️ OBSOLETE - Original implementation plan superseded by MVP approach**
>
> **See:** [docs/PROJECTS_PAGE_MVP_PLAN.md](./PROJECTS_PAGE_MVP_PLAN.md) for the new simplified MVP plan.
>
> The checklist below represents the original comprehensive approach and is preserved for reference only.

- [ ] Create project grid layout
  - MUI Grid or Masonry component
  - Responsive column layout (12/8/4 columns)
  - Hover effects and transitions
- [ ] Implement project cards
  - Thumbnail image
  - Title and tags
  - Circa date
  - Click to expand
- [ ] Add pagination or infinite scroll
  - Load more button
  - Or infinite scroll with intersection observer
  - Loading states and skeletons
- [ ] Create project detail modal/page
  - Full project description
  - Image gallery
  - Video embeds (Vimeo/YouTube)
  - Navigation between projects
- [ ] Implement filtering/search
  - Filter by technology tags
  - Search by title/description
  - Clear filters functionality

#### 3.2 Resume Page ✅

**Status:** ✅ COMPLETED (2026-01-29)

- [x] Create resume layout components
  - [x] Header with contact info (ResumeHeader.tsx)
  - [x] Work experience section (WorkExperience.tsx)
  - [x] Skills/competencies sidebar (CoreCompetencies.tsx)
  - [x] Clients list (ClientList.tsx)
  - [x] Conference speaking section (ConferenceSpeaker.tsx)
- [x] Implement responsive resume layout
  - [x] Desktop: two-column layout (70% / 30%)
  - [x] Mobile: single column stacked
- [x] Add print stylesheet
  - [x] Optimize for PDF generation
  - [x] Hide/show print-specific elements
- [x] Create PDF download functionality
  - [x] Link to static PDF with download button

**Implementation Summary:**
- 5 React components with full JSDoc documentation
- 8 TypeScript interfaces for complete type safety
- Contact obfuscation (ROT13/ROT5) for email/phone
- 71 unit tests with 100% pass rate
- Responsive two-column desktop layout, single column mobile
- Print-friendly CSS with 15 organized sections
- 0 TypeScript errors, 0 ESLint errors
- **Changelog:** [changelog/2026-01-29T212054_phase-3-2-resume-page-complete.md](../changelog/2026-01-29T212054_phase-3-2-resume-page-complete.md)

#### 3.3 Colophon/About Page ✅

**Status:** ✅ COMPLETED (2026-01-27)

- [x] Build about section
  - [x] Bio and current role
  - [x] Responsibilities
  - [x] Social links
- [x] Create technologies showcase
  - [x] V2 tech stack grid (Framework, UI, Tools, Testing)
  - [x] V1 technologies accordion (historical context)
- [x] Add design philosophy section
  - [x] Color palette swatches (Sakura, Duck Egg, Sky Blue, Graphite, Sage, Maroon)
  - [x] Typography examples (Open Sans, Oswald, Gochi Hand)
  - [x] Design inspiration documentation
- [x] Include "Buta" story and images
  - [x] Buta story with paragraphs and images
  - [x] Buta vs. Boo comparison image
  - [x] Thought bubble styling

**Implementation Summary:**
- 4 React components with full JSDoc documentation
- 10 TypeScript interfaces for complete type safety
- HTML sanitization with isomorphic-dompurify for SSR compatibility
- 54 unit tests with 100% pass rate
- Responsive mobile-first design
- Accessibility attributes throughout (aria-labels, roles, landmarks)
- 0 TypeScript errors, 0 ESLint errors
- **Changelog:** [changelog/2026-01-27T202317_phase3-1-colophon-page.md](../changelog/2026-01-27T202317_phase3-1-colophon-page.md)

#### 3.4 Shared Components ✅

**Status:** ✅ COMPLETED (2026-02-02)

- [x] Navigation component (accessible)
  - Logo/branding with alt text
  - Menu items (Portfolio, Resume, Colophon) as semantic nav
  - Active state indication with aria-current
  - Mobile hamburger menu with aria-label and aria-expanded
  - Keyboard accessible (Tab, Enter, Escape)
  - Skip to main content link
- [x] Footer component (accessible)
  - Navigation links with descriptive text
  - Copyright notice
  - Buta character with meaningful alt text
  - Proper heading hierarchy
  - ThoughtBubble component for interactive thought display
- [x] Image gallery modal (accessible)
  - Full-screen lightbox with role="dialog"
  - Previous/next navigation (keyboard + screen reader)
  - Caption display with aria-describedby
  - Close button (visible + ESC key support) with aria-label
  - Focus trap within modal
  - Touch/swipe gestures for mobile
  - Return focus to trigger element on close
- [x] Loading states (accessible)
  - Skeleton screens with aria-busy
  - Spinner components with aria-label
  - Progressive image loading with alt text
  - Live regions for dynamic content (aria-live)

**Implementation Summary:**
- ThoughtBubble component extracted for reusability
- Skeleton loading screens with smooth transitions
- Footer restructuring with improved accessibility
- LoadMoreButton refactoring for better UX
- All components with full JSDoc documentation
- Comprehensive test coverage
- 0 TypeScript errors, 0 ESLint errors

### Deliverables

- [x] Fully functional homepage with project grid ✅ (2026-02-02)
- [x] Complete resume page ✅ (2026-01-29)
- [x] Complete colophon/about page ✅ (2026-01-27)
- [x] Reusable component library ✅ (13+ components created)
- [x] Responsive layouts for all pages ✅ (all pages completed)

### Success Criteria

- All pages render correctly on desktop and mobile
- Navigation works seamlessly (mouse, keyboard, touch)
- Image galleries function properly with full accessibility
- Content matches original site
- No ESLint accessibility violations
- Basic keyboard navigation functional
- All images have appropriate alt text

---

## Phase 4: Enhanced Features

**Goal:** Add modern UX improvements

**Duration:** 2-3 weeks

### Tasks

- [ ] Implement theme switching
  - MUI theme switcher supporting multiple themes:
    - Light theme (default)
    - Dark theme
    - High contrast black and white theme (accessibility)
  - Persist user preference (localStorage)
  - Respect prefers-color-scheme and prefers-contrast media queries
  - Smooth theme transitions
  - Theme toggle in header with accessible controls
  - Ensure all themes meet WCAG 2.2 AA contrast requirements
- [ ] Implement localization (i18n)
  - String externalization for all user-facing text
  - Number formatting (locale-aware formatting for dates, numbers, currencies)
  - Support for multiple locales (start with en-US, structure for expansion)
  - Use next-intl or react-i18next for internationalization
  - RTL (right-to-left) layout support foundation
  - Language switcher component (if multiple languages added)
- [ ] Add animations and transitions
  - Page transition animations
  - Hover effects on cards
  - Scroll animations (fade-in, slide-in)
  - Consider Framer Motion for advanced animations
- [ ] Ensure WCAG 2.2 Level AA compliance
  - **Perceivable:**
    - Provide text alternatives for all non-text content
    - Ensure color contrast ratios meet WCAG 2.2 AA standards (4.5:1 for normal text, 3:1 for large text)
    - Do not rely on color alone to convey information
    - Ensure all content is accessible without loss of information in portrait/landscape orientations
    - Add captions and transcripts for video content
  - **Operable:**
    - All functionality available via keyboard
    - No keyboard traps
    - Provide skip links for navigation
    - Adequate time for users to read and interact with content
    - No content that flashes more than 3 times per second
    - Descriptive page titles and headings
    - Visible focus indicators on all interactive elements
    - Multiple ways to navigate (navigation menu, search, sitemap)
  - **Understandable:**
    - Set language of page (lang attribute)
    - Consistent navigation across pages
    - Clear error messages and input labels
    - Predictable component behavior
  - **Robust:**
    - Valid HTML/semantic markup
    - Proper ARIA labels and roles
    - Compatible with assistive technologies
  - **Testing:**
    - Automated testing with axe DevTools
    - Manual keyboard navigation testing
    - Screen reader testing (NVDA, JAWS, VoiceOver)
    - Browser extension testing (WAVE, Lighthouse)
    - Color contrast verification
  - **Documentation:**
    - Create accessibility statement
    - Document WCAG 2.2 compliance measures
- [ ] Implement SEO optimization
  - Meta tags (title, description, OG tags)
  - Structured data (JSON-LD for Person/Organization)
  - Sitemap generation
  - robots.txt
  - Canonical URLs
- [ ] Add contact functionality (if needed)
  - Contact form component
  - Email integration (SendGrid, Resend)
  - Form validation
  - Success/error states
- [ ] Integrate analytics
  - Google Analytics 4 or Plausible
  - Track page views
  - Track user interactions
  - Privacy-compliant implementation
- [ ] Social media sharing
  - Share buttons for projects
  - OG image generation
  - Twitter/LinkedIn card support

### Deliverables

- [ ] Theme switching fully implemented (light, dark, high contrast B&W)
- [ ] All themes WCAG 2.2 AA compliant color schemes
- [ ] Localization infrastructure in place with externalized strings
- [ ] Locale-aware number/date formatting implemented
- [ ] Polished animations throughout (respecting prefers-reduced-motion)
- [ ] WCAG 2.2 Level AA accessibility compliance achieved
- [ ] Accessibility statement published
- [ ] SEO meta tags on all pages
- [ ] Analytics tracking active

### Success Criteria

- Lighthouse accessibility score 100
- WCAG 2.2 Level AA compliance verified (zero violations)
- axe DevTools reports zero critical or serious issues
- Screen reader testing passes on NVDA, JAWS, and VoiceOver
- All color contrast ratios meet WCAG 2.2 AA standards
- High contrast theme passes WCAG AAA contrast requirements (7:1)
- Keyboard navigation works for all interactive elements
- Theme switching works smoothly with user preference persistence
- Localization strings externalized (no hardcoded user-facing text)
- Number/date formatting respects user locale
- Analytics capturing data correctly
- SEO meta tags validated

---

## Phase 5: Performance & Optimization

**Goal:** Optimize for production

**Duration:** 1-2 weeks

### Tasks

- [ ] Implement Static Site Generation (SSG)
  - Use generateStaticParams for project pages
  - Pre-render all routes at build time
  - Consider ISR for frequently updated content
- [ ] Optimize bundle size
  - Analyze bundle with @next/bundle-analyzer
  - Implement code splitting
  - Tree shaking verification
  - Remove unused dependencies
- [ ] Configure CDN for assets
  - Move images to CDN (Cloudinary, AWS S3)
  - Configure Next.js image loader
  - Add cache headers
- [ ] Implement lazy loading
  - Lazy load below-the-fold components
  - Dynamic imports for heavy components
  - Image lazy loading with loading="lazy"
- [ ] Performance audits
  - Run Lighthouse audits
  - Measure Core Web Vitals
  - Test on slow network (3G throttling)
  - Test on low-end devices
- [ ] Add compression
  - Enable gzip/brotli compression
  - Minimize CSS/JS
  - Optimize fonts
- [ ] Cache strategy
  - Configure cache headers
  - Service worker for offline support (optional)
  - Implement stale-while-revalidate

### Deliverables

- [ ] Production build optimized
- [ ] Bundle size minimized
- [ ] Images served from CDN
- [ ] Lighthouse score >90 on all metrics

### Success Criteria

- Lighthouse Performance score >90
- First Contentful Paint <1.5s
- Time to Interactive <3.5s
- Bundle size <200KB (initial load)

---

## Phase 6: Deployment & Migration

**Goal:** Launch modernized site

**Duration:** 1-2 weeks

### Tasks

- [ ] Choose hosting platform
  - Recommended: Vercel (built for Next.js)
  - Alternative: Netlify, AWS Amplify
  - Evaluate pricing and features
- [ ] Set up hosting environment
  - Create Vercel/Netlify account
  - Connect GitHub repository
  - Configure build settings
- [ ] Configure domain
  - Update DNS records
  - Point portfolio.singchan.com to new host
  - Set up SSL certificate (automatic with Vercel)
- [ ] Set up CI/CD pipeline
  - Automatic deployments on git push
  - Preview deployments for PRs
  - Build status notifications
- [ ] Create staging environment
  - staging.portfolio.singchan.com
  - Test all features in production-like environment
  - UAT (User Acceptance Testing)
- [ ] Comprehensive testing
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Mobile device testing (iOS, Android)
  - **Accessibility testing (WCAG 2.2 AA):**
    - Automated testing with axe DevTools
    - Lighthouse accessibility audit (score 100)
    - WAVE browser extension
    - Keyboard navigation testing
    - Screen reader testing (NVDA on Windows, JAWS, VoiceOver on macOS/iOS)
    - Color contrast verification
    - Focus management verification
  - Performance testing
  - Link checking
- [ ] Create deployment documentation
  - Deployment process
  - Rollback procedures
  - Environment variables
  - Monitoring and alerts
- [ ] Deploy to production
  - Final review
  - Deploy to production domain
  - Monitor for errors
  - Verify all functionality

### Deliverables

- [ ] Site live on production domain
- [ ] CI/CD pipeline operational
- [ ] Staging environment available
- [ ] Deployment documentation complete

### Success Criteria

- Site accessible at portfolio.singchan.com
- All pages load without errors
- Forms and interactive features work
- Analytics tracking correctly

---

## Phase 7: Post-Launch

**Goal:** Maintain and enhance

**Duration:** Ongoing

### Tasks

- [ ] Monitor performance metrics
  - Check Core Web Vitals weekly
  - Review analytics monthly
  - Track error rates
  - Monitor uptime
- [ ] Gather user feedback
  - Set up feedback mechanism
  - Monitor contact form submissions
  - Track user behavior in analytics
- [ ] Bug fixes and issues
  - Create issue tracking system
  - Prioritize and fix bugs
  - Release patches as needed
- [ ] Dependency updates
  - Update Next.js quarterly
  - Update MUI and other dependencies
  - Security patches immediately
  - Test after each update
- [ ] Content updates
  - Add new projects as completed
  - Update resume with new experience
  - Keep skills and technologies current
- [ ] Feature enhancements
  - Blog functionality (optional)
  - Case studies for projects
  - Testimonials section
  - Interactive project demos

### Deliverables

- [ ] Monthly performance reports
- [ ] Quarterly dependency updates
- [ ] Regular content updates

---

## Technology Stack Details

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ | React framework with SSG/SSR |
| React | 18+ | UI library |
| TypeScript | 5+ | Type safety |
| Material UI | 5/6 | Component library |
| Node.js | 18+ LTS | Runtime environment |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| eslint-plugin-jsx-a11y | JSX accessibility linting |
| eslint-plugin-react | React best practices |
| @next/eslint-plugin-next | Next.js specific rules |
| Prettier | Code formatting |
| Husky | Git hooks |
| TypeScript | Static type checking |
| Vitest (or Jest) | Unit testing framework |
| @testing-library/react | React component testing |
| @testing-library/jest-dom | DOM matchers for testing |
| axe-core | Automated accessibility testing |
| @axe-core/react | React accessibility testing integration |

### Accessibility Testing Tools

| Tool | Purpose |
|------|---------|
| axe DevTools | Browser extension for accessibility testing |
| Lighthouse | Automated audits (performance, accessibility, SEO) |
| WAVE | Web accessibility evaluation tool |
| NVDA | Screen reader testing (Windows) |
| JAWS | Screen reader testing (Windows) |
| VoiceOver | Screen reader testing (macOS/iOS) |
| Color Contrast Analyzer | WCAG color contrast verification |

### Optional Enhancements

| Technology | Purpose |
|------------|---------|
| Framer Motion | Advanced animations |
| React Hook Form | Form handling |
| Zustand | State management |
| Contentful/Sanity | Headless CMS |
| Cloudinary | Image CDN |
| Plausible/GA4 | Analytics |
| next-intl | Internationalization for Next.js |
| react-i18next | Alternative i18n library |
| Intl API | Native number/date formatting |

---

## Design Considerations

### Color Palette (from current site)

- **Sakura** (Cherry Blossom) - Darkened pastels for backgrounds
- **Duck Egg** - Pastel accent color
- **Sky Blue** - Accent color
- **Graphite** - Dark neutral

### Typography

- **Open Sans** - Body text and UI elements
- **Oswald** - Headings
- **Gochi Hand** - Buta's thought bubble

### MUI Theme Configuration

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#YOUR_PRIMARY_COLOR',
    },
    secondary: {
      main: '#YOUR_SECONDARY_COLOR',
    },
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h1: {
      fontFamily: '"Oswald", sans-serif',
    },
    h2: {
      fontFamily: '"Oswald", sans-serif',
    },
  },
});
```

---

## Risk Management

### Potential Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data migration errors | High | Thorough testing, backup original data |
| Browser compatibility issues | Medium | Cross-browser testing, polyfills |
| SEO ranking loss | High | Implement proper redirects, maintain URLs |
| Performance degradation | Medium | Regular performance audits |
| Scope creep | Medium | Stick to phased approach, document changes |
| **Accessibility non-compliance** | **High** | **Automated linting, manual testing, screen reader testing, early and continuous accessibility validation** |

### Rollback Plan

- Keep original site available at old.portfolio.singchan.com
- Maintain original codebase in separate branch
- DNS can be quickly reverted if critical issues arise
- Document rollback procedures

---

## Success Metrics

### Technical Metrics

- [ ] Lighthouse Performance score >90
- [ ] **Lighthouse Accessibility score 100**
- [ ] Lighthouse Best Practices score >90
- [ ] Lighthouse SEO score >90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3.5s
- [ ] **WCAG 2.2 Level AA compliance (zero violations)**
- [ ] **axe DevTools: zero critical or serious accessibility issues**
- [ ] **All color contrast ratios ≥4.5:1 (normal text) and ≥3:1 (large text)**
- [ ] **100% keyboard navigable**
- [ ] **Screen reader compatible (NVDA, JAWS, VoiceOver)**

### Business Metrics

- [ ] Site loads on all modern browsers
- [ ] Mobile responsive on all devices
- [ ] All content successfully migrated
- [ ] Zero broken links
- [ ] Analytics tracking properly

---

## Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation & Setup | 1-2 weeks | ✅ Complete (2026-01-25) |
| Phase 2: Data Migration | 1-2 weeks | ✅ Complete (2026-01-27) |
| Phase 3: Core Pages Development | 3-4 weeks | ✅ Complete (2026-02-02) |
| Phase 4: Enhanced Features | 2-3 weeks | ⬜ Not Started |
| Phase 5: Performance & Optimization | 1-2 weeks | ⬜ Not Started |
| Phase 6: Deployment & Migration | 1-2 weeks | ⬜ Not Started |
| Phase 7: Post-Launch | Ongoing | ⬜ Not Started |

**Total Estimated Time:** 10-16 weeks

**Time Spent:**
- Phase 1: Completed in 1 session (2026-01-25)
- Phase 2 (Testing Infrastructure): Completed in 1 session (2026-01-27)

---

## Next Steps

1. ✅ ~~Review and approve this plan~~ - COMPLETE
2. ✅ ~~Set up development environment~~ - COMPLETE
3. ✅ ~~Begin Phase 1: Foundation & Setup~~ - COMPLETE (2026-01-25)
4. ✅ ~~Complete Phase 2: Data Migration~~ - COMPLETE (2026-01-27)
   - ✅ TypeScript interfaces for Project, ProjectImage, ProjectVideo
   - ✅ Migrated project data to JSON/TypeScript format
   - ✅ Migrated image assets to /public/images
   - ✅ Implemented data fetching utilities
   - ✅ Unit tests for data layer with 88.13% coverage
5. ✅ ~~Complete Phase 3: Core Pages Development~~ - COMPLETE (2026-02-02)
   - ✅ Task 3.1: Homepage (Portfolio) - COMPLETE (2026-02-02)
     - Project grid layout with responsive columns
     - Project cards with filtering and search
     - Load more button pagination
     - Full accessibility support
   - ✅ Task 3.2: Resume Page - COMPLETE (2026-01-29)
     - 5 components, 8 TypeScript interfaces, 71 tests
     - Changelog: [changelog/2026-01-29T212054_phase-3-2-resume-page-complete.md](../changelog/2026-01-29T212054_phase-3-2-resume-page-complete.md)
   - ✅ Task 3.3: Colophon/About Page - COMPLETE (2026-01-27)
     - 4 components, 10 TypeScript interfaces, 54 tests
     - Changelog: [changelog/2026-01-27T202317_phase3-1-colophon-page.md](../changelog/2026-01-27T202317_phase3-1-colophon-page.md)
   - ✅ Task 3.4: Shared Components - COMPLETE (2026-02-02)
     - Navigation and Footer components (accessible)
     - Image gallery modal with lightbox functionality
     - Loading states and skeleton screens
     - ThoughtBubble component for interactive content
6. 🔄 **Begin Phase 4: Enhanced Features**
   - Plan and implement theme switching (light, dark, high contrast)
   - Set up internationalization (i18n) infrastructure
   - Add animations and transitions
   - Implement WCAG 2.2 Level AA compliance verification
   - SEO optimization
7. Merge Phase 3 work to main
8. Schedule review for Phase 4 implementation approach
9. Schedule regular check-ins to review progress

---

## Notes

- This plan is a living document and will be updated as the project progresses
- Each phase should be reviewed and approved before moving to the next
- Regular backups of the current site should be maintained throughout the project
- Consider setting up a staging environment early for continuous testing

---

## Accessibility Compliance Requirements

This project **must** meet WCAG 2.2 Level AA standards. The following are key requirements:

### WCAG 2.2 Level AA Criteria

1. **Perceivable**
   - 1.1.1 Non-text Content (Level A)
   - 1.2.1 Audio-only and Video-only (Level A)
   - 1.2.2 Captions (Level A)
   - 1.2.3 Audio Description or Media Alternative (Level A)
   - 1.3.1 Info and Relationships (Level A)
   - 1.3.2 Meaningful Sequence (Level A)
   - 1.3.3 Sensory Characteristics (Level A)
   - 1.4.1 Use of Color (Level A)
   - 1.4.2 Audio Control (Level A)
   - 1.4.3 Contrast (Minimum) (Level AA) - 4.5:1 for normal text
   - 1.4.4 Resize Text (Level AA)
   - 1.4.5 Images of Text (Level AA)
   - 1.4.10 Reflow (Level AA)
   - 1.4.11 Non-text Contrast (Level AA) - 3:1 for UI components
   - 1.4.12 Text Spacing (Level AA)
   - 1.4.13 Content on Hover or Focus (Level AA)

2. **Operable**
   - 2.1.1 Keyboard (Level A)
   - 2.1.2 No Keyboard Trap (Level A)
   - 2.1.4 Character Key Shortcuts (Level A)
   - 2.2.1 Timing Adjustable (Level A)
   - 2.2.2 Pause, Stop, Hide (Level A)
   - 2.3.1 Three Flashes or Below Threshold (Level A)
   - 2.4.1 Bypass Blocks (Level A)
   - 2.4.2 Page Titled (Level A)
   - 2.4.3 Focus Order (Level A)
   - 2.4.4 Link Purpose (In Context) (Level A)
   - 2.4.5 Multiple Ways (Level AA)
   - 2.4.6 Headings and Labels (Level AA)
   - 2.4.7 Focus Visible (Level AA)
   - 2.4.11 Focus Not Obscured (Minimum) (Level AA) - NEW in WCAG 2.2
   - 2.5.1 Pointer Gestures (Level A)
   - 2.5.2 Pointer Cancellation (Level A)
   - 2.5.3 Label in Name (Level A)
   - 2.5.4 Motion Actuation (Level A)
   - 2.5.7 Dragging Movements (Level AA) - NEW in WCAG 2.2
   - 2.5.8 Target Size (Minimum) (Level AA) - NEW in WCAG 2.2

3. **Understandable**
   - 3.1.1 Language of Page (Level A)
   - 3.1.2 Language of Parts (Level AA)
   - 3.2.1 On Focus (Level A)
   - 3.2.2 On Input (Level A)
   - 3.2.3 Consistent Navigation (Level AA)
   - 3.2.4 Consistent Identification (Level AA)
   - 3.2.6 Consistent Help (Level A) - NEW in WCAG 2.2
   - 3.3.1 Error Identification (Level A)
   - 3.3.2 Labels or Instructions (Level A)
   - 3.3.3 Error Suggestion (Level AA)
   - 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)
   - 3.3.7 Redundant Entry (Level A) - NEW in WCAG 2.2
   - 3.3.8 Accessible Authentication (Minimum) (Level AA) - NEW in WCAG 2.2

4. **Robust**
   - 4.1.1 Parsing (Level A) - DEPRECATED in WCAG 2.2
   - 4.1.2 Name, Role, Value (Level A)
   - 4.1.3 Status Messages (Level AA)

### Testing Methodology

1. **Automated Testing** (catches ~30% of issues)
   - Run during development with ESLint plugins
   - CI/CD integration with axe-core
   - Lighthouse CI for every build

2. **Manual Testing** (required for full compliance)
   - Keyboard navigation testing
   - Screen reader testing
   - Color contrast verification
   - Visual inspection

3. **User Testing** (recommended)
   - Test with users who rely on assistive technologies
   - Gather feedback on accessibility barriers

---

## Security Requirements

### Secrets Management

**CRITICAL:** Secrets, tokens, API keys, and other sensitive information must **NEVER** be stored in source control.

#### Requirements

1. **Environment Variables**
   - All sensitive data must be stored in environment variables
   - Use `.env.local` for local development (automatically gitignored by Next.js)
   - Configure environment variables in hosting platform (Vercel/Netlify) for production

2. **Git Protection**
   - Ensure `.env`, `.env.local`, `.env.production` are in `.gitignore`
   - Never commit files containing:
     - API keys
     - Authentication tokens
     - Database credentials
     - Private keys
     - OAuth secrets
     - Third-party service credentials

3. **Example `.gitignore` entries:**
   ```
   # Environment variables
   .env
   .env*.local
   .env.development
   .env.production

   # Secrets and credentials
   *.key
   *.pem
   secrets.json
   credentials.json
   ```

4. **Documentation**
   - Provide `.env.example` file with dummy values showing required variables
   - Document all required environment variables in README
   - Never include actual values in documentation

5. **Code Review**
   - Review all commits for accidentally committed secrets
   - Use git hooks to scan for potential secrets before commit
   - Consider tools like `git-secrets` or `truffleHog` for automated scanning

#### If Secrets Are Accidentally Committed

1. **Immediately rotate/revoke** the exposed credentials
2. Remove from git history using `git filter-branch` or BFG Repo-Cleaner
3. Force push the cleaned history (coordinate with team)
4. Treat the secret as compromised even after removal

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [WebAIM Resources](https://webaim.org/)

---

**Document Version:** 1.8
**Last Updated:** 2026-02-02
**Author:** Sing Chan (with Claude Code)
**Changelog:**
- v1.8: Updated Phase 3 status to ✅ COMPLETE (2026-02-02). All 4 tasks now complete: Task 3.1 Homepage, Task 3.2 Resume, Task 3.3 Colophon, Task 3.4 Shared Components. Updated Timeline, Deliverables, and Next Steps sections. Ready to begin Phase 4: Enhanced Features.
- v1.7: Updated Phase 3 status to reflect Task 3.2 (Resume Page) and Task 3.3 (Colophon/About Page) completion. Updated Timeline, Deliverables, and Next Steps to show 2 of 3 Phase 3 tasks complete. Added implementation summaries and changelog references for both completed tasks.
- v1.6: Added localization (i18n) requirements and expanded theme switching to include high contrast black and white theme for accessibility. Updated Phase 4 deliverables and success criteria.
- v1.5: Updated Phase 2 with completed testing infrastructure setup (Vitest, React Testing Library, 80% coverage thresholds, sample tests with 100% coverage). Analyzed PHP data structure from v1. Updated Timeline and Next Steps to reflect Phase 2 progress.
- v1.4: Added comprehensive Gumby Framework migration section with feature mapping and replacement strategy
- v1.3: Marked Phase 1 as complete with detailed completion notes and components created
- v1.2: Added unit testing requirements for Phase 2 (project data validation)
- v1.1: Added WCAG 2.2 Level AA compliance requirements and accessibility linters
- v1.0: Initial version
