# Portfolio v2 - Modern Next.js Application

Modern portfolio website for Sing Chan, built with Next.js 16+, TypeScript, and Material UI. This is a modernization of the 2013 legacy portfolio (see `../v1`).

## Current Status: Phase 5 Complete ✅ — Phase 6 Next

**Completed:**

- ✅ Phase 1: Foundation & Setup
- ✅ Phase 2: Data Migration (18 projects, 239 images, full TypeScript types)
- ✅ Phase 3: Core Pages Development
  - ✅ Task 3.1: Homepage/Portfolio with project grid, filtering, and load more ([PR #4](https://github.com/butanoie/schan-portfolio/pull/4))
  - ✅ Task 3.2: Resume Page with work experience, skills, and clients ([PR #5](https://github.com/butanoie/schan-portfolio/pull/5))
  - ✅ Task 3.3: Colophon/About Page with design system and mascot story ([PR #3](https://github.com/butanoie/schan-portfolio/pull/3))
  - ✅ Task 3.4: Shared Components - Lightbox, skeleton loaders, thought bubbles, and more ([PR #6](https://github.com/butanoie/schan-portfolio/pull/6))
- ✅ Phase 4: Enhanced Features
  - ✅ Task 4.1: Theme switching (light, dark, high contrast modes)
  - ✅ Task 4.2: Internationalization (i18n) - English and French support
  - ✅ Task 4.3: Animations & Transitions - Polished UI with `prefers-reduced-motion` respect
  - ✅ Task 4.4: WCAG 2.2 Level AA Compliance - 120+ accessibility tests, 0 violations
  - ✅ Task 4.5: SEO Optimization - Meta tags, structured data, sitemap, OG images
- ✅ Phase 5: Performance & Optimization
  - ✅ Task 5.1: Bundle analysis baseline (`@next/bundle-analyzer`)
  - ✅ Task 5.2: Font loading migration (CSS `@import` → `next/font/google`, CLS = 0)
  - ✅ Task 5.3: Lazy loading (3 heavy components with `next/dynamic`)
  - ✅ Task 5.4: Client/server boundary audit (6 components converted to server)
  - ✅ Task 5.5: Static Site Generation (home page SSG)
  - ✅ Task 5.6: Performance audits (Lighthouse desktop 97–100, mobile 90–92, SEO 100)

**Next: Phase 6 — Deployment & Migration**

## Phase 1 Complete - Foundation & Setup ✅

All Phase 1 tasks from the [Modernization Plan](../docs/active/MODERNIZATION_PLAN.md) have been completed:

- ✅ Next.js 14+ with TypeScript and App Router
- ✅ Material UI v5+ with custom theme
- ✅ Project structure organized ([src/components](src/components/), [src/lib](src/lib/), [src/types](src/types/), [src/utils](src/utils/), [src/styles](src/styles/))
- ✅ ESLint with accessibility plugins (jsx-a11y)
- ✅ Prettier for code formatting
- ✅ TypeScript strict mode enabled
- ✅ Git hooks with Husky and lint-staged
- ✅ Accessibility testing tools (axe-core)
- ✅ Basic layout components (Header, Footer, MainLayout)
- ✅ Custom MUI theme with portfolio color palette
- ✅ Security: .gitignore configured for secrets management

## Technology Stack

### Core

- **Framework:** Next.js 16.1.4 (React 19.2.3)
- **Language:** TypeScript 5+
- **UI Library:** Material UI v7.3.7
- **Styling:** Emotion (MUI's styling solution)
- **Theming:** MUI theme with Light, Dark, and High Contrast modes
- **Internationalization:** i18next with React hooks integration

### Development Tools

- **Testing:** Vitest 4 + React Testing Library
- **Linting:** ESLint 9 with Next.js and accessibility rules
- **Formatting:** Prettier 3.8
- **Git Hooks:** Husky 9 + lint-staged
- **Accessibility:** axe-core + @axe-core/react

## Getting Started

### Prerequisites

- Node.js 18+ LTS (v25.4.0 recommended)
- npm 11+ (v11.7.0 recommended)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables (if needed):

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with interactive UI

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
v2/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme and metadata ✅
│   ├── page.tsx           # Homepage/Portfolio with SEO ✅
│   ├── sitemap.ts         # Dynamic sitemap generation ✅
│   ├── robots.ts          # Robots.txt generator ✅
│   ├── resume/            # Resume page ✅
│   │   ├── layout.tsx     # Resume metadata wrapper ✅
│   │   └── page.tsx
│   ├── colophon/          # Colophon/About page ✅
│   │   └── page.tsx
│   ├── projects/          # Project detail pages ✅
│   │   └── [id]/
│   │       └── page.tsx
│   └── globals.css        # Global styles with animations ✅
├── src/
│   ├── __tests__/        # Test files
│   │   ├── app/          # Page tests
│   │   │   ├── portfolio/ # Homepage tests ✅
│   │   │   ├── resume/    # Resume page tests ✅
│   │   │   └── colophon/  # Colophon page tests ✅
│   │   ├── components/   # Component tests
│   │   │   ├── portfolio/ # Portfolio components ✅
│   │   │   ├── gallery/   # Lightbox component tests ✅
│   │   │   ├── resume/    # Resume component tests ✅
│   │   │   └── colophon/  # Colophon component tests ✅
│   │   ├── lib/          # Library tests
│   │   ├── utils/        # Utility tests
│   │   └── README.md     # Testing guide
│   ├── components/        # React components
│   │   ├── Header.tsx    # Navigation header ✅
│   │   ├── Footer.tsx    # Site footer (with Buta) ✅
│   │   ├── MainLayout.tsx # Main layout wrapper
│   │   ├── ThemeProvider.tsx # MUI theme provider
│   │   ├── portfolio/    # Portfolio page components ✅
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── LoadMoreButton.tsx
│   │   │   └── VideoEmbed.tsx
│   │   ├── gallery/      # Gallery components ✅
│   │   │   ├── Lightbox.tsx
│   │   │   └── ThoughtBubble.tsx
│   │   ├── resume/       # Resume components ✅
│   │   │   ├── ResumeHeader.tsx
│   │   │   ├── WorkExperience.tsx
│   │   │   ├── CoreCompetencies.tsx
│   │   │   ├── ClientList.tsx
│   │   │   └── ConferenceSpeaker.tsx
│   │   ├── colophon/     # Colophon components ✅
│   │   │   ├── AboutSection.tsx
│   │   │   ├── TechnologiesShowcase.tsx
│   │   │   ├── DesignPhilosophy.tsx
│   │   │   └── ButaStory.tsx
│   │   └── common/       # Common/shared components ✅
│   │       ├── LoadingSkeleton.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── TagChip.tsx
│   ├── constants/        # Centralized constants ✅
│   │   ├── index.ts      # Barrel export
│   │   ├── colors.ts     # Brand & UI colors
│   │   └── seo.ts        # SEO constants and metadata ✅
│   ├── data/             # Content data files
│   │   ├── projects.ts   # Portfolio projects (18) ✅
│   │   ├── resume.ts     # Resume content ✅
│   │   └── colophon.ts   # Colophon content ✅
│   ├── hooks/            # Custom React hooks
│   │   ├── useSwipe.ts   # Touch gesture detection ✅
│   │   └── useInView.ts  # Intersection observer ✅
│   ├── lib/              # Libraries and utilities
│   │   ├── theme.ts      # MUI theme configuration
│   │   ├── i18n.ts       # Internationalization setup ✅
│   │   ├── seo.ts        # SEO utilities and schema generators ✅
│   │   └── sanitize.ts   # HTML sanitization ✅
│   ├── types/            # TypeScript type definitions
│   │   ├── project.ts    # Project types
│   │   ├── resume.ts     # Resume types ✅
│   │   └── colophon.ts   # Colophon types ✅
│   ├── utils/            # Utility functions
│   └── styles/           # Style utilities
├── public/               # Static assets
│   ├── images/
│   │   ├── gallery/      # Project images (239) ✅
│   │   └── buta/         # Buta mascot images ✅
│   ├── og-image.png      # Open Graph social preview image ✅
│   ├── humans.txt        # Developer credits file ✅
│   ├── robots.txt        # (generated at build time) ✅
│   └── videos/           # Self-hosted videos (as needed) ✅
└── .husky/               # Git hooks
```

## Design System

### Color Palette

- **Primary:** Sky Blue (#87CEEB) - Main accent color
- **Secondary:** Duck Egg (#C8E6C9) - Pastel green accent
- **Background:** Sakura (#FFF0F5) - Cherry blossom pink
- **Text:** Graphite (#2C2C2C) - Dark neutral

### Typography

- **Body:** Open Sans
- **Headings:** Oswald
- **Buta's Bubbles:** Gochi Hand

## Testing

This project uses **Vitest 4.0.18** and **React Testing Library 16.3.2** for comprehensive test coverage with an 80% coverage threshold.

### Testing Stack

- **Test Runner:** Vitest 4.0.18 (fast, modern, ESM-native)
- **Component Testing:** @testing-library/react 16.3.2
- **DOM Matchers:** @testing-library/jest-dom 6.9.1
- **User Interactions:** @testing-library/user-event 14.6.1
- **Coverage:** @vitest/coverage-v8 4.0.18
- **Environment:** JSDOM 27.4.0

### Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report (HTML + terminal)
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

### Test Coverage Requirements

Per the [modernization plan](../docs/active/MODERNIZATION_PLAN.md):

| Metric     | Threshold | Current Status        |
| ---------- | --------- | --------------------- |
| Lines      | 80%       | ✅ 100% (sample code) |
| Functions  | 80%       | ✅ 100% (sample code) |
| Branches   | 80%       | ✅ 100% (sample code) |
| Statements | 80%       | ✅ 100% (sample code) |

**Rules:**

- All tests must pass before committing (enforced by git hooks)
- Data layer utilities require **80%+ coverage**
- Critical business logic requires **100% coverage**
- Coverage reports generated in HTML, JSON, LCOV, and text formats

### Test File Organization

```
src/__tests__/
├── components/        # Component tests (*.test.tsx)
│   └── Header.test.tsx
├── lib/              # Library tests (*.test.ts)
│   └── theme.test.ts
├── utils/            # Utility tests (*.test.ts)
│   └── formatDate.test.ts
├── integration/      # Integration tests
└── README.md         # Detailed testing guide
```

**Naming Conventions:**

- Test files: `[ComponentName].test.tsx` or `[functionName].test.ts`
- Place tests in `__tests__/` directory mirroring source structure
- Use descriptive test names: `should [expected behavior] when [condition]`

### Writing Tests

#### Basic Test Structure (Arrange-Act-Assert)

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "@/src/utils/formatDate";

describe("formatDate", () => {
  it("should format dates correctly", () => {
    // Arrange: Set up test data
    const input = "2024-01-15T12:00:00Z";

    // Act: Execute the function
    const result = formatDate(input);

    // Assert: Verify the result
    expect(result).toBe("January 15, 2024");
  });
});
```

#### Component Testing Example

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/src/components/Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

#### Testing with Mocks

```typescript
import { describe, it, expect, vi } from "vitest";

describe("API calls", () => {
  it("should fetch data correctly", async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ data: "test" }),
    });

    const result = await fetchData();
    expect(result).toEqual({ data: "test" });
  });
});
```

### Coverage Reports

After running `npm run test:coverage`, view the detailed HTML report:

```bash
open coverage/index.html
```

The report shows:

- **Line coverage** - Percentage of executed code lines
- **Function coverage** - Percentage of called functions
- **Branch coverage** - Percentage of executed conditional branches
- **Statement coverage** - Percentage of executed statements

**Interpreting Reports:**

- 🟢 Green (80%+): Good coverage
- 🟡 Yellow (50-79%): Needs improvement
- 🔴 Red (<50%): Insufficient coverage

### Testing Best Practices

1. **Write tests first** - Consider TDD for complex logic
2. **Test behavior, not implementation** - Test what the code does, not how
3. **Use descriptive test names** - Explain what is being tested
4. **One assertion per test** - Keep tests focused and simple
5. **Test edge cases** - Include boundary conditions and error cases
6. **Mock external dependencies** - Isolate units under test
7. **Avoid test interdependence** - Each test should run independently
8. **Keep tests fast** - Fast tests encourage frequent running

### Common Testing Patterns

#### Testing Async Functions

```typescript
it("should handle async operations", async () => {
  const promise = fetchData();
  await expect(promise).resolves.toEqual({ data: "test" });
});
```

#### Testing Error Handling

```typescript
it("should throw error for invalid input", () => {
  expect(() => processData(null)).toThrow("Invalid input");
});
```

#### Testing React Hooks

```typescript
import { renderHook } from "@testing-library/react";

it("should update state correctly", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Troubleshooting

**Tests fail with "Cannot find module" errors:**

- Check path aliases in `tsconfig.json` and `vitest.config.ts`
- Ensure paths use `@/` prefix for absolute imports

**Coverage is lower than expected:**

- Check `coverage/index.html` for uncovered lines
- Add tests for edge cases and error paths
- Remove dead code if coverage is not achievable

**Tests are slow:**

- Use `test:watch` for incremental testing during development
- Mock expensive operations (API calls, large computations)
- Consider splitting large test suites

**"ReferenceError: window is not defined":**

- Ensure `vitest.config.ts` has `environment: 'jsdom'`
- Import JSDOM-dependent code only in component tests

### Additional Resources

- **Detailed Setup Guide:** [docs/TESTING_SETUP.md](../docs/TESTING_SETUP.md)
- **Testing Conventions:** [src/**tests**/README.md](src/__tests__/README.md)
- **Vitest Documentation:** [vitest.dev](https://vitest.dev/)
- **Testing Library Docs:** [testing-library.com](https://testing-library.com/docs/react-testing-library/intro/)
- **Sample Tests:** [src/**tests**/utils/formatDate.test.ts](src/__tests__/utils/formatDate.test.ts)

### CI/CD Integration

Tests run automatically:

- **Pre-commit:** Git hooks run tests on staged files
- **Pre-push:** All tests must pass before pushing
- **CI Pipeline:** (Coming in Phase 6) Tests run on every PR

### Test Metrics (Phase 5 Complete)

- **Total Tests:** 1,123
- **Test Files:** 57
- **Coverage:** 87%+ overall (exceeds 80% target)
- **Linting:** 0 ESLint violations
- **Type Safety:** 0 TypeScript errors
- **Accessibility:** WCAG 2.2 Level AA — 0 violations
- **Lighthouse Desktop:** 97–100
- **Lighthouse Mobile:** 90–92
- **SEO Score:** 100
- **Status:** ✅ All passing

## SEO Optimization

This project includes comprehensive SEO infrastructure (Phase 4.5):

- **Meta Tags:** Title, description, keywords on all pages
- **Open Graph & Twitter Cards:** Rich previews for social sharing
- **Structured Data:** JSON-LD schemas (Person, BreadcrumbList, CreativeWork)
- **Sitemap:** Dynamic sitemap.xml for search engine discovery
- **Robots.txt:** Crawling instructions and sitemap reference
- **Canonical URLs:** Prevent duplicate content issues
- **OG Images:** Social preview images (1200x630px)

**Implementation Files:**
- `src/constants/seo.ts` - SEO constants and site metadata
- `src/lib/seo.ts` - Schema generators and utilities
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt generator
- `app/resume/layout.tsx` - Resume page metadata wrapper

**Verification:**
- ✅ Lighthouse SEO audit (target: 100/100)
- ✅ Google Rich Results Test - structured data validation
- ✅ Facebook Debugger - OG tag verification
- ✅ Twitter Card Validator - social previews
- ✅ Schema.org validator - JSON-LD compliance

## Accessibility

This project is committed to WCAG 2.2 Level AA compliance:

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Skip to main content link
- Focus indicators
- Screen reader compatible
- Full accessibility test suite (120+ test cases)
- Zero WCAG 2.2 AA violations

## Security

**Important:** Never commit secrets or sensitive information to source control.

- All environment variables must be in `.env.local` (gitignored)
- See `.env.example` for required variables
- Secrets like API keys should never be committed
- See [Security Requirements](../docs/active/MODERNIZATION_PLAN.md#security-requirements) for details

## Project Roadmap

See the [Modernization Plan](../docs/active/MODERNIZATION_PLAN.md) for the complete roadmap:

### Completed Phases

- ✅ **Phase 1:** Foundation & Setup - Next.js, TypeScript, MUI, testing infrastructure
- ✅ **Phase 2:** Data Migration - 18 projects, 239 images, full data layer
- ✅ **Phase 3:** Core Pages Development ([detailed plan](../docs/archive/PHASE3_DETAILED_PLAN.md))
  - ✅ Task 3.1: Homepage/Portfolio - Project grid with load more, responsive design
  - ✅ Task 3.2: Resume Page - 5 components, work experience, skills, clients
  - ✅ Task 3.3: Colophon/About Page - Design system, technologies, Buta story
  - ✅ Task 3.4: Shared Components - Lightbox, skeleton loaders, thought bubbles
- ✅ **Phase 4:** Enhanced Features - Theme switching, i18n, animations, WCAG AA, SEO

### Upcoming Phases

- ⬜ **Phase 6:** Deployment & Migration - Hosting, CI/CD, production launch
- ⬜ **Phase 7:** Post-Launch - Monitoring, analytics, ongoing enhancements

### Key Achievements (Phase 5 Complete)

- **1,123 tests** passing across 57 test files
- **87%+ code coverage** (exceeds 80% target)
- **WCAG 2.2 Level AA** compliance with 0 violations
- **3 theme modes** — Light, Dark, High Contrast (WCAG AAA on high contrast)
- **i18n infrastructure** — English + French with DeepL auto-translation
- **Full SEO** — Meta tags, JSON-LD, sitemap, robots.txt, OG images
- **Polished animations** — Page transitions, scroll effects, `prefers-reduced-motion` support
- **Lighthouse Desktop 97–100**, **Mobile 90–92**, **SEO 100**
- **Self-hosted fonts** via `next/font/google` with CLS = 0
- **3 components lazy-loaded** with `next/dynamic` for smaller initial bundle
- **6 server components** converted from unnecessary client components
- **Home page SSG** with `dynamic = 'error'` regression guard
- **Zero TypeScript errors**, **zero ESLint errors**

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

## License

© 2026 Sing Chan. All rights reserved.
