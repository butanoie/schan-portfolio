# Portfolio v2 - Modern Next.js Application

Modern portfolio website for Sing Chan, built with Next.js 16+, TypeScript, and Material UI. This is a modernization of the 2013 legacy portfolio (see `../v1`).

## Current Status: Phase 3 - Core Pages Development 🔄

**Completed:**
- ✅ Phase 1: Foundation & Setup
- ✅ Phase 2: Data Migration (18 projects, 239 images, full TypeScript types)
- ✅ Task 3.3: Colophon/About Page ([PR #3](https://github.com/butanoie/schan-portfolio/pull/3))

**In Progress:**
- ⬜ Task 3.1: Homepage (Portfolio)
- ⬜ Task 3.2: Resume Page
- ⬜ Task 3.4: Shared Components (Lightbox, etc.)

## Phase 1 Complete - Foundation & Setup ✅

All Phase 1 tasks from the [Modernization Plan](../docs/MODERNIZATION_PLAN.md) have been completed:

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
- **Styling:** Emotion + Tailwind CSS v4

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
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
v2/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme
│   ├── page.tsx           # Homepage
│   ├── colophon/          # Colophon/About page ✅
│   │   └── page.tsx
│   └── globals.css        # Global styles
├── src/
│   ├── __tests__/        # Test files
│   │   ├── app/          # Page tests
│   │   │   └── colophon/ # Colophon page tests ✅
│   │   ├── components/   # Component tests
│   │   │   └── colophon/ # Colophon component tests ✅
│   │   ├── lib/          # Library tests
│   │   ├── utils/        # Utility tests
│   │   └── README.md     # Testing guide
│   ├── components/        # React components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Site footer (with Buta positioning)
│   │   ├── MainLayout.tsx # Main layout wrapper
│   │   ├── ThemeProvider.tsx # MUI theme provider
│   │   └── colophon/     # Colophon components ✅
│   │       ├── AboutSection.tsx
│   │       ├── TechnologiesShowcase.tsx
│   │       ├── DesignPhilosophy.tsx
│   │       └── ButaStory.tsx
│   ├── constants/        # Centralized constants ✅
│   │   ├── index.ts      # Barrel export
│   │   └── colors.ts     # Brand & UI colors
│   ├── data/             # Content data files
│   │   ├── projects.ts   # Portfolio projects (18)
│   │   └── colophon.ts   # Colophon page content ✅
│   ├── lib/              # Libraries and utilities
│   │   └── theme.ts      # MUI theme configuration
│   ├── types/            # TypeScript type definitions
│   │   ├── project.ts    # Project types
│   │   └── colophon.ts   # Colophon types ✅
│   ├── utils/            # Utility functions
│   └── styles/           # Style utilities
├── public/               # Static assets
│   └── images/
│       ├── gallery/      # Project images (239)
│       └── buta/         # Buta mascot images ✅
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

Per the [modernization plan](../docs/MODERNIZATION_PLAN.md):

| Metric | Threshold | Current Status |
|--------|-----------|----------------|
| Lines | 80% | ✅ 100% (sample code) |
| Functions | 80% | ✅ 100% (sample code) |
| Branches | 80% | ✅ 100% (sample code) |
| Statements | 80% | ✅ 100% (sample code) |

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
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/src/utils/formatDate';

describe('formatDate', () => {
  it('should format dates correctly', () => {
    // Arrange: Set up test data
    const input = '2024-01-15T12:00:00Z';

    // Act: Execute the function
    const result = formatDate(input);

    // Assert: Verify the result
    expect(result).toBe('January 15, 2024');
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
import { describe, it, expect, vi } from 'vitest';

describe('API calls', () => {
  it('should fetch data correctly', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ data: 'test' }),
    });

    const result = await fetchData();
    expect(result).toEqual({ data: 'test' });
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
it('should handle async operations', async () => {
  const promise = fetchData();
  await expect(promise).resolves.toEqual({ data: 'test' });
});
```

#### Testing Error Handling

```typescript
it('should throw error for invalid input', () => {
  expect(() => processData(null)).toThrow('Invalid input');
});
```

#### Testing React Hooks

```typescript
import { renderHook } from '@testing-library/react';

it('should update state correctly', () => {
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
- **Testing Conventions:** [src/__tests__/README.md](src/__tests__/README.md)
- **Vitest Documentation:** [vitest.dev](https://vitest.dev/)
- **Testing Library Docs:** [testing-library.com](https://testing-library.com/docs/react-testing-library/intro/)
- **Sample Tests:** [src/__tests__/utils/formatDate.test.ts](src/__tests__/utils/formatDate.test.ts)

### CI/CD Integration

Tests run automatically:
- **Pre-commit:** Git hooks run tests on staged files
- **Pre-push:** All tests must pass before pushing
- **CI Pipeline:** (Coming in Phase 6) Tests run on every PR

### Test Metrics (Current)

- **Total Tests:** 50+ (Phase 2 data layer + Phase 3 colophon components)
- **Test Files:** 15+
- **Coverage:** 88%+ (data layer) / Growing (components)
- **Average Test Time:** <50ms per test
- **Status:** ✅ All passing

## Accessibility

This project is committed to WCAG 2.2 Level AA compliance:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Skip to main content link
- Focus indicators
- Screen reader compatible

## Security

**Important:** Never commit secrets or sensitive information to source control.

- All environment variables must be in `.env.local` (gitignored)
- See `.env.example` for required variables
- Secrets like API keys should never be committed
- See [Security Requirements](../docs/MODERNIZATION_PLAN.md#security-requirements) for details

## Next Steps

See the [Modernization Plan](../docs/MODERNIZATION_PLAN.md) for the full roadmap:
- ✅ Phase 1: Foundation & Setup
- ✅ Phase 2: Data Migration
- 🔄 Phase 3: Core Pages Development (current - [detailed plan](../docs/PHASE3_DETAILED_PLAN.md))
  - ✅ Task 3.3: Colophon/About Page
  - ⬜ Task 3.1: Homepage (Portfolio)
  - ⬜ Task 3.2: Resume Page
  - ⬜ Task 3.4: Shared Components
- ⬜ Phase 4: Enhanced Features
- ⬜ Phase 5: Performance & Optimization
- ⬜ Phase 6: Deployment & Migration
- ⬜ Phase 7: Post-Launch

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

## License

© 2026 Sing Chan. All rights reserved.
