# Portfolio Modernization Project Plan

## Executive Summary

This document outlines the plan to modernize portfolio.singchan.com from a 2013-era technology stack (Gumby Framework, jQuery, PHP) to a modern React-based application using Next.js, TypeScript, and Material UI.

**Current Stack:**
- Gumby Framework (2013 responsive framework)
- jQuery 1.9.1
- PHP backend with JSON API
- Static HTML pages
- IE6-9 compatibility code

**Target Stack:**
- Next.js 14+ (React framework)
- TypeScript (type safety)
- Material UI v5/v6 (component library)
- Static Site Generation (SSG/ISR)
- Modern deployment (Vercel/Netlify)
- **WCAG 2.2 Level AA Accessibility Compliance**

---

## Phase 1: Foundation & Setup

**Goal:** Establish modern development environment

**Duration:** 1-2 weeks

### Tasks

- [ ] Initialize Next.js project with TypeScript
  ```bash
  npx create-next-app@latest portfolio-modern --typescript --app --tailwind
  ```
- [ ] Install and configure Material UI
  - Install @mui/material, @emotion/react, @emotion/styled
  - Set up MUI theme provider
  - Create custom theme matching current design palette
- [ ] Set up project structure
  ```
  /src
    /app
    /components
    /types
    /utils
    /lib
    /styles
  ```
- [ ] Configure development tools
  - ESLint configuration with accessibility plugins
    - eslint-plugin-jsx-a11y (accessibility rules for JSX)
    - eslint-plugin-react (React best practices)
    - @next/eslint-plugin-next (Next.js specific rules)
    ```bash
    npm install --save-dev eslint-plugin-jsx-a11y
    ```
    Example .eslintrc.json:
    ```json
    {
      "extends": [
        "next/core-web-vitals",
        "plugin:jsx-a11y/recommended"
      ],
      "plugins": ["jsx-a11y"],
      "rules": {
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/click-events-have-key-events": "error",
        "jsx-a11y/heading-has-content": "error",
        "jsx-a11y/no-noninteractive-element-interactions": "error"
      }
    }
    ```
  - Prettier for code formatting
  - TypeScript strict mode (tsconfig.json with "strict": true)
  - Git hooks (Husky) for pre-commit linting
    ```bash
    npm install --save-dev husky lint-staged
    npx husky init
    ```
  - Install accessibility testing tools
    - axe-core (automated accessibility testing)
    - @axe-core/react (React integration)
    ```bash
    npm install --save-dev @axe-core/react axe-core
    ```
- [ ] Create basic layout components
  - Header/Navigation component
  - Footer component
  - Main layout wrapper
  - Responsive container components
- [ ] Implement responsive design system
  - Configure MUI breakpoints
  - Create responsive utilities
  - Test on multiple screen sizes
- [ ] Set up npm scripts for quality checks
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint",
      "lint:fix": "next lint --fix",
      "type-check": "tsc --noEmit",
      "format": "prettier --write .",
      "format:check": "prettier --check .",
      "a11y": "eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.json"
    }
  }
  ```

### Deliverables

- [ ] Working Next.js application running on localhost
- [ ] MUI configured with custom theme
- [ ] Basic routing structure in place
- [ ] Development environment documented

### Success Criteria

- npm run dev launches successfully
- Basic page renders with MUI components
- TypeScript compilation has no errors
- ESLint passes with no accessibility violations
- All accessibility linters configured and running

---

## Phase 2: Data Migration

**Goal:** Convert PHP backend to modern data layer

**Duration:** 1-2 weeks

### Tasks

- [ ] Analyze current data structure
  - Document all data models from PHP
  - Map relationships between entities
  - Identify required vs optional fields
- [ ] Create TypeScript interfaces
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
  }

  interface ProjectVideo {
    type: 'vimeo' | 'youtube';
    id: string;
    width: number;
    height: number;
  }
  ```
- [ ] Convert PHP data to JSON/TypeScript
  - Extract all project data from index.php
  - Create projects.json or projects.ts data file
  - Validate data structure
- [ ] Migrate image assets
  - Move images to /public/images
  - Create @2x retina variants
  - Document image naming conventions
- [ ] Implement data fetching layer
  - Create getProjects() utility function
  - Implement pagination logic
  - Add filtering/search capabilities
- [ ] Set up Next.js Image optimization
  - Configure next.config.js for images
  - Replace img tags with Next/Image component
  - Implement responsive image loading

### Deliverables

- [ ] Complete TypeScript type definitions
- [ ] All project data in JSON/TS format
- [ ] Image assets organized and optimized
- [ ] Data fetching utilities created

### Success Criteria

- All project data accessible via TypeScript functions
- Images load properly with Next.js Image
- Type checking catches data inconsistencies

---

## Phase 3: Core Pages Development

**Goal:** Build main pages with React components

**Duration:** 3-4 weeks

### Tasks

#### 3.1 Homepage (Portfolio)

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

#### 3.2 Resume Page

- [ ] Create resume layout components
  - Header with contact info
  - Work experience section
  - Skills/competencies sidebar
  - Clients list
  - Conference speaking section
- [ ] Implement responsive resume layout
  - Desktop: two-column layout
  - Mobile: single column stacked
- [ ] Add print stylesheet
  - Optimize for PDF generation
  - Hide/show print-specific elements
- [ ] Create PDF download functionality
  - Link to static PDF or generate on-the-fly
  - Download button with icon

#### 3.3 Colophon/About Page

- [ ] Build about section
  - Bio and current role
  - Responsibilities
- [ ] Create technologies showcase
  - List of technologies used
  - Visual presentation (cards or grid)
- [ ] Add design philosophy section
  - Color palette swatches
  - Typography examples
  - Design inspiration
- [ ] Include "Buta" story and images
  - Image gallery for Buta
  - Story text

#### 3.4 Shared Components

- [ ] Navigation component (accessible)
  - Logo/branding with alt text
  - Menu items (Portfolio, Resume, Colophon) as semantic nav
  - Active state indication with aria-current
  - Mobile hamburger menu with aria-label and aria-expanded
  - Keyboard accessible (Tab, Enter, Escape)
  - Skip to main content link
- [ ] Footer component (accessible)
  - Navigation links with descriptive text
  - Copyright notice
  - Buta character with meaningful alt text
  - Proper heading hierarchy
- [ ] Image gallery modal (accessible)
  - Full-screen lightbox with role="dialog"
  - Previous/next navigation (keyboard + screen reader)
  - Caption display with aria-describedby
  - Close button (visible + ESC key support) with aria-label
  - Focus trap within modal
  - Touch/swipe gestures for mobile
  - Return focus to trigger element on close
- [ ] Loading states (accessible)
  - Skeleton screens with aria-busy
  - Spinner components with aria-label
  - Progressive image loading with alt text
  - Live regions for dynamic content (aria-live)

### Deliverables

- [ ] Fully functional homepage with project grid
- [ ] Complete resume page
- [ ] Complete colophon/about page
- [ ] Reusable component library
- [ ] Responsive layouts for all pages

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

- [ ] Implement dark mode
  - MUI theme switcher (light/dark)
  - Persist user preference (localStorage)
  - Smooth theme transitions
  - Toggle button in header
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

- [ ] Dark mode fully implemented (with WCAG 2.2 AA compliant color schemes)
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
- Keyboard navigation works for all interactive elements
- Dark mode toggles smoothly with accessible color schemes
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
| Phase 1: Foundation & Setup | 1-2 weeks | ⬜ Not Started |
| Phase 2: Data Migration | 1-2 weeks | ⬜ Not Started |
| Phase 3: Core Pages Development | 3-4 weeks | ⬜ Not Started |
| Phase 4: Enhanced Features | 2-3 weeks | ⬜ Not Started |
| Phase 5: Performance & Optimization | 1-2 weeks | ⬜ Not Started |
| Phase 6: Deployment & Migration | 1-2 weeks | ⬜ Not Started |
| Phase 7: Post-Launch | Ongoing | ⬜ Not Started |

**Total Estimated Time:** 10-16 weeks

---

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1: Foundation & Setup
4. Schedule regular check-ins to review progress
5. Adjust timeline based on actual progress

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

**Document Version:** 1.1
**Last Updated:** 2026-01-25
**Author:** Sing Chan (with Claude Code)
**Changelog:**
- v1.1: Added WCAG 2.2 Level AA compliance requirements and accessibility linters
- v1.0: Initial version
