# Testing Infrastructure Setup

This document covers the project's testing setup: Vitest, React Testing Library, accessibility testing with vitest-axe, and test utilities.

## Overview

| Tool                        | Purpose                                           |
| --------------------------- | ------------------------------------------------- |
| Vitest                      | Test runner (native ESM, parallel execution)      |
| React Testing Library       | Component rendering and user-centric queries      |
| @testing-library/jest-dom   | Enhanced DOM assertions (e.g., `toBeVisible()`)   |
| @testing-library/user-event | Realistic user interaction simulation             |
| vitest-axe                  | Automated accessibility testing (axe-core engine) |
| @vitest/coverage-v8         | Code coverage reporting                           |
| jsdom                       | DOM environment for Node.js                       |

**Current stats:** 1,203 tests across 68 test files (as of 2026-03-13).

## Commands

Run from `v2/`:

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode (re-runs on file changes)
npm run test:coverage # Run with coverage report
npm run test:ui       # Interactive browser-based test UI
```

## Configuration

### vitest.config.ts

**File:** `v2/vitest.config.ts`

Key settings:

| Setting               | Value               | Purpose                                              |
| --------------------- | ------------------- | ---------------------------------------------------- |
| `environment`         | `jsdom`             | DOM simulation for component tests                   |
| `globals`             | `true`              | `describe`, `it`, `expect` available without imports |
| `setupFiles`          | `./vitest.setup.ts` | Global mocks and matchers                            |
| `coverage.provider`   | `v8`                | V8-based coverage (fast, accurate)                   |
| `coverage.thresholds` | 80% all             | Lines, functions, branches, statements               |
| `resolve.alias`       | `@` → project root  | Matches Next.js path aliases (`@/src/*`)             |

Coverage reports are generated in multiple formats: text (console), HTML (`coverage/index.html`), JSON, and LCOV (for CI).

### vitest.setup.ts

**File:** `v2/vitest.setup.ts`

The setup file runs before each test file and configures the global test environment:

| Setup                               | Purpose                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `@testing-library/jest-dom`         | DOM matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.)                        |
| `vitest-axe/matchers`               | Accessibility matchers (`toHaveNoViolations`)                                      |
| `configureAxe`                      | Enables WCAG 2.2 AA rules (region, color-contrast, landmark-one-main)              |
| `next/font/google` mock             | Mocks `Open_Sans`, `Oswald`, `Gochi_Hand` — these are build-time only              |
| `next/dynamic` mock                 | Replaces `next/dynamic` with `React.lazy` + `Suspense`                             |
| `window.matchMedia` mock            | Required for `useReducedMotion` hook and responsive components                     |
| `HTMLCanvasElement.getContext` mock | Prevents canvas errors from MUI/icon libraries                                     |
| `IntersectionObserver` mock         | Required for `useScrollAnimation` hook — auto-triggers with `isIntersecting: true` |
| `localStorage` mock                 | Clean mock with `clear()` between tests                                            |
| MUI warning suppression             | Filters kebab-case sx property warnings                                            |
| `afterEach` cleanup                 | DOM cleanup + localStorage clear after every test                                  |

### TypeScript Configuration

`v2/tsconfig.json` includes Vitest and Testing Library types:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## Test Utilities

### renderWithProviders

**File:** `v2/src/__tests__/test-utils.tsx`

Custom render function that wraps components with all required context providers, matching the actual app's provider hierarchy:

```
LocaleProviderErrorFallback
  └── LocaleProvider (initialLocale)
        └── ThemeContextProvider
              └── AnimationsContextProvider
                    └── ThemeProvider (MUI)
                          └── {children}
```

**Usage:**

```tsx
import { renderWithProviders } from "@/__tests__/test-utils";

// Default (English locale)
renderWithProviders(<MyComponent />);

// French locale
renderWithProviders(<MyComponent />, { initialLocale: "fr" });
```

The module also re-exports everything from `@testing-library/react`, so you can import `screen`, `waitFor`, `fireEvent`, etc. from the same file.

### Accessibility Helpers

**File:** `v2/src/__tests__/utils/axe-helpers.ts`

Provides convenience functions for accessibility testing with axe-core:

| Function                          | Purpose                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `runAxe(container, options?)`     | Run axe on a DOM container and assert no violations                                  |
| `testAccessibility(renderResult)` | Full WCAG 2.2 AA test suite (color contrast, landmarks, ARIA, labels, touch targets) |
| `canReceiveFocus(element)`        | Check if an element can receive keyboard focus                                       |
| `hasAccessibleName(element)`      | Check if an element has an accessible name (aria-label, text content, etc.)          |

**Usage:**

```tsx
import { testAccessibility, runAxe } from "@/__tests__/utils/axe-helpers";

it("should be accessible", async () => {
  const result = renderWithProviders(<MyComponent />);
  await testAccessibility(result);
});

// Or with custom axe options:
it("should pass color contrast", async () => {
  const { container } = renderWithProviders(<MyComponent />);
  await runAxe(container, {
    rules: { "color-contrast": { enabled: true } },
  });
});
```

## Directory Structure

```
v2/src/__tests__/
├── test-utils.tsx              # renderWithProviders and re-exports
├── README.md                   # Testing conventions guide
├── app/                        # Page-level tests
│   ├── colophon/
│   └── global-error.test.tsx
├── components/                 # Component tests
│   ├── colophon/
│   ├── common/                 # Header, Footer, MainLayout, ErrorBoundary, etc.
│   ├── i18n/
│   ├── portfolio/
│   ├── project/
│   ├── resume/
│   ├── samples/
│   ├── settings/
│   └── PostHogProvider.test.tsx
├── contexts/                   # Context tests
├── data/                       # Data validation tests
├── hooks/                      # Custom hook tests
├── integration/                # Integration tests (data layer)
├── lib/                        # Library tests (i18n, webVitals, privacy)
├── types/                      # Type guard tests
└── utils/                      # Utility tests + axe-helpers.ts
```

## Writing Tests

### Conventions

- **File naming:** `{component}.test.tsx` or `{util}.test.ts`
- **Location:** Mirror source structure under `__tests__/`
- **Pattern:** Arrange-Act-Assert
- **Naming:** Use descriptive `it('should ...')` statements
- **Imports:** Use `@/` path aliases (e.g., `@/src/components/...`)

### Component Test Template

```tsx
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { testAccessibility } from "@/__tests__/utils/axe-helpers";
import MyComponent from "@/src/components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });

  it("should be accessible", async () => {
    const result = renderWithProviders(<MyComponent />);
    await testAccessibility(result);
  });
});
```

### Testing Dynamic Imports

Components loaded with `next/dynamic` are mocked via `React.lazy` in the setup file. Use `waitFor` to wait for lazy components to resolve:

```tsx
import { renderWithProviders, screen, waitFor } from "@/__tests__/test-utils";

it("should render dynamic component", async () => {
  renderWithProviders(<PageWithDynamic />);
  await waitFor(() => {
    expect(screen.getByText("Dynamic content")).toBeInTheDocument();
  });
});
```

## Coverage

Coverage thresholds are set to 80% for all metrics (per the [modernization plan](../archive/MODERNIZATION_PLAN.md)):

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 80%       |
| Functions  | 80%       |
| Branches   | 80%       |
| Statements | 80%       |

Coverage reports:

- **Console:** text summary after `npm run test:coverage`
- **HTML:** `v2/coverage/index.html` (interactive, open in browser)
- **JSON:** `v2/coverage/coverage-final.json`
- **LCOV:** `v2/coverage/lcov.info` (CI integration)

## Files

| File                                    | Purpose                                               |
| --------------------------------------- | ----------------------------------------------------- |
| `v2/vitest.config.ts`                   | Vitest configuration (environment, coverage, aliases) |
| `v2/vitest.setup.ts`                    | Global test setup (mocks, matchers, cleanup)          |
| `v2/src/__tests__/test-utils.tsx`       | `renderWithProviders` custom render + re-exports      |
| `v2/src/__tests__/utils/axe-helpers.ts` | Accessibility testing helpers                         |
| `v2/src/__tests__/README.md`            | Testing conventions guide                             |

## Testing Level Guidelines

When writing new tests, choose the correct level to avoid redundancy across the test pyramid.

### When to write a unit test (Vitest)

- **Pure logic**: functions, type guards, formatters, validators — no DOM or browser needed
- **Component rendering**: verifying ARIA attributes, prop variations, conditional rendering
- **Hook behavior**: state transitions, error guards, context provider contracts
- **Event listener lifecycle**: attach/detach, cleanup on unmount, ref-based updates

### When to write an E2E test (Playwright)

- **Persistence**: localStorage round-trips across reloads or navigation
- **CSS computed styles**: `data-theme` attribute, `transition-property`, contrast
- **Real browser APIs**: touch events, focus management, `next/dynamic` chunk loading
- **Cross-component integration**: settings popover + MUI `aria-hidden` side effects
- **Full user flows**: navigation → state change → page transition → state persists

### Avoiding redundancy

- **Do not re-test delegation chains.** If `isProjectVideo` delegates to `isValidVideoId`, test the ID validation in `isValidVideoId`'s suite. Only test `isProjectVideo` for its own logic (type checking, field extraction, wiring).
- **Do not duplicate "Enhanced Security" blocks.** Security-specific inputs (injection strings, path traversal) belong in the lowest-level function's test suite. Higher-level guards inherit coverage through delegation.
- **Cross-level overlap is OK when complementary.** Unit tests for keyboard navigation (isolated, fast) and E2E tests for keyboard navigation (real browser focus) are both valuable — they catch different failure modes.
- **Use `test.each` for pattern groups.** When 4+ tests follow the same structure (same function, same assertion, varying input), group them under a shared `describe` with separate `it` blocks for clear failure names.

## Related Documentation

- [Testing Architecture](../guides/TESTING_ARCHITECTURE.md) — Integration & E2E test architecture (POM, Playwright, axe)
- [Testing Roadmap](../archive/TESTING_ROADMAP.md) — Integration & E2E test implementation roadmap (completed)
- [Accessibility Testing](../accessibility/ACCESSIBILITY_TESTING.md) — Manual and automated a11y testing procedures
- [Accessibility Testing Checklist](../accessibility/ACCESSIBILITY_TESTING_CHECKLIST.md) — Testing checklist
- [Modernization Plan](../archive/MODERNIZATION_PLAN.md) — Coverage goals and testing strategy
