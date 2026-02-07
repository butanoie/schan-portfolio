# Accessibility Testing Guide

**For Developers:** How to run, write, and maintain accessibility tests

**Date:** February 6, 2026
**WCAG Standard:** WCAG 2.2 Level AA
**Framework:** Vitest + axe-core

---

## Quick Start

### Run Automated Tests

```bash
# Run all tests
npm test

# Run only accessibility tests
npm test -- --grep "accessibility|axe"

# Run with coverage
npm run test:coverage

# Watch mode for development
npm test -- --watch
```

### Run Browser Audits

```bash
# Run Lighthouse audit
npm run build
npm run preview
# Then open Chrome DevTools → Lighthouse → Accessibility
```

---

## Overview

This project uses **vitest-axe** and **axe-core** for automated accessibility testing. All component tests include accessibility checks using the `testAccessibility()` helper function.

**Key Tools:**
- **vitest-axe** - Vitest integration for axe-core
- **axe-core** - Automated accessibility rule engine
- **@testing-library/react** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation

---

## Test Structure

### Test Location

All accessibility tests are located in `v2/src/__tests__/`:

```
v2/src/__tests__/
├── components/
│   ├── common/
│   │   ├── Header.test.tsx
│   │   ├── Footer.test.tsx
│   │   └── MainLayout.test.tsx
│   ├── project/
│   │   └── ProjectGallery.test.tsx
│   └── settings/
│       ├── SettingsButton.test.tsx
│       ├── ThemeSwitcher.test.tsx
│       ├── LanguageSwitcher.test.tsx
│       └── AnimationsSwitcher.test.tsx
└── utils/
    └── axe-helpers.ts (Testing utilities)
```

### Test Utilities

**File:** `v2/src/__tests__/utils/axe-helpers.ts`

Provides helper functions for accessibility testing:

```typescript
// Run axe audit
export async function runAxe(container: HTMLElement): Promise<AxeResults>

// Full WCAG testing
export async function testAccessibility(renderResult: RenderResult): Promise<void>

// Check focus capability
export function canReceiveFocus(element: HTMLElement): boolean

// Check accessible name
export function hasAccessibleName(element: HTMLElement): boolean
```

---

## Test Patterns

### Pattern 1: Basic Accessibility Audit

```typescript
import { render, screen } from '@testing-library/react';
import { testAccessibility } from '../utils/axe-helpers';

describe('MyComponent', () => {
  /**
   * Basic accessibility test using axe-core
   * Verifies WCAG 2.2 Level AA compliance
   */
  it('should pass axe accessibility tests', async () => {
    const result = render(<MyComponent />);
    await testAccessibility(result);
    // Test passes if no violations found
  });
});
```

**What it tests:**
- Color contrast (WCAG 1.4.3, 1.4.11)
- Link names (WCAG 4.1.2)
- Button names (WCAG 4.1.2)
- Image alt text (WCAG 1.1.1)
- Form labels (WCAG 3.3.2)
- ARIA attributes (WCAG 4.1.2)
- Landmarks (WCAG 1.3.1)
- Target size (WCAG 2.5.8)

---

### Pattern 2: Keyboard Navigation

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { canReceiveFocus } from '../utils/axe-helpers';

/**
 * Test keyboard navigation through interactive elements
 * Verifies WCAG 2.1.1 (Keyboard) compliance
 */
it('should be navigable via keyboard', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  // Tab to first interactive element
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();

  // Tab to next element
  await user.tab();
  expect(screen.getByRole('link')).toHaveFocus();

  // Shift+Tab to go back
  await user.tab({ shift: true });
  expect(screen.getByRole('button')).toHaveFocus();
});
```

**What it tests:**
- Elements can receive focus via Tab
- Focus order is logical
- All interactive elements reachable via keyboard (WCAG 2.1.1)

---

### Pattern 3: Focus Visibility

```typescript
/**
 * Test that focus indicators are visible
 * Verifies WCAG 2.4.7 (Focus Visible) compliance
 */
it('should have visible focus indicator', async () => {
  const user = userEvent.setup();
  const { container } = render(<MyComponent />);

  await user.tab();
  const button = screen.getByRole('button');

  // Check focus styling
  const styles = window.getComputedStyle(button);
  const outline = styles.outline || styles.outlineWidth;
  expect(outline).not.toBe('none');
  expect(outline).not.toBe('0');
});
```

**What it tests:**
- Focus indicators visible (not just color change)
- Outline/border on focus
- Sufficient size/contrast for visibility (WCAG 2.4.7)

---

### Pattern 4: Touch Target Size

```typescript
/**
 * Test that interactive elements meet minimum touch target size
 * Verifies WCAG 2.5.8 (Target Size) compliance
 */
it('should meet minimum touch target size (44px)', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');

  const styles = window.getComputedStyle(button);
  const width = parseInt(styles.minWidth || styles.width);
  const height = parseInt(styles.minHeight || styles.height);

  expect(width).toBeGreaterThanOrEqual(44);
  expect(height).toBeGreaterThanOrEqual(44);
});
```

**What it tests:**
- Interactive elements minimum 44×44px
- Includes padding in sizing
- Mobile touch target adequacy (WCAG 2.5.8)

---

### Pattern 5: ARIA Labels and Roles

```typescript
/**
 * Test proper ARIA labeling and roles
 * Verifies WCAG 4.1.2 (Name, Role, Value) compliance
 */
it('should have proper ARIA labels', () => {
  render(<MyComponent />);

  // Check button has accessible name
  const button = screen.getByRole('button', { name: /settings/i });
  expect(button).toBeInTheDocument();

  // Check ARIA state
  expect(button).toHaveAttribute('aria-expanded', 'false');

  // After interaction
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
```

**What it tests:**
- Elements have accessible names
- Proper ARIA roles assigned
- ARIA states updated correctly (WCAG 4.1.2)

---

### Pattern 6: Image Alt Text

```typescript
/**
 * Test that images have descriptive alt text
 * Verifies WCAG 1.1.1 (Non-text Content) compliance
 */
it('should have alt text on images', () => {
  render(<MyComponent />);

  // All images should have alt text
  const images = screen.getAllByRole('img');
  images.forEach((img) => {
    expect(img).toHaveAttribute('alt');
    expect(img.getAttribute('alt')).not.toBe('');
  });

  // Alt text should be descriptive
  const projectImg = screen.getByAltText(/project/i);
  expect(projectImg).toBeInTheDocument();
});
```

**What it tests:**
- All images have `alt` attributes
- Alt text is descriptive (not just "image")
- Decorative images marked with empty alt
- Meaningful alt content (WCAG 1.1.1)

---

### Pattern 7: Color Contrast (Manual Testing)

```typescript
/**
 * Test color contrast ratio (requires manual verification)
 * Verifies WCAG 1.4.3 (Contrast Minimum) compliance
 */
it('should have sufficient color contrast', () => {
  render(<MyComponent />);

  // Use browser DevTools or WebAIM Contrast Checker
  // to verify computed colors
  // Expected: >= 4.5:1 for normal text, 3:1 for UI components

  const textElement = screen.getByText('Hello');
  const styles = window.getComputedStyle(textElement);

  // Color will be computed property
  console.log('Color:', styles.color);
  console.log('Background:', styles.backgroundColor);
  // Manually verify contrast ratio >= 4.5:1
});
```

**What it tests:**
- Text color to background contrast (WCAG 1.4.3)
- UI component contrast (WCAG 1.4.11)
- Note: Automated contrast checking has limitations in tests

---

### Pattern 8: Form Accessibility

```typescript
/**
 * Test form field accessibility
 * Verifies WCAG 3.3.2 (Labels or Instructions) compliance
 */
it('should have labels associated with form fields', () => {
  render(<MyComponent />);

  // Check label exists
  const label = screen.getByText('Email Address');
  expect(label).toBeInTheDocument();

  // Check label connects to input
  const input = screen.getByRole('textbox');
  expect(input).toHaveAttribute('id');
  expect(label).toHaveAttribute('htmlFor', input.id);
});
```

**What it tests:**
- Form inputs have associated labels
- Label `htmlFor` matches input `id`
- Proper form structure (WCAG 3.3.2)

---

### Pattern 9: Semantic Markup

```typescript
/**
 * Test that semantic HTML is used correctly
 * Verifies WCAG 1.3.1 (Info and Relationships) compliance
 */
it('should use semantic HTML structure', () => {
  render(<MyComponent />);

  // Check landmarks exist
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer

  // Check headings hierarchy
  const headings = screen.getAllByRole('heading');
  expect(headings[0]).toHaveAttribute('aria-level', '1'); // H1
  expect(headings[1]).toHaveAttribute('aria-level', '2'); // H2
});
```

**What it tests:**
- Proper use of semantic elements (`<header>`, `<main>`, `<footer>`, etc.)
- Heading hierarchy (H1, H2, H3, etc.)
- Page landmarks (WCAG 1.3.1)

---

## Complete Component Test Example

Here's a complete example from the actual codebase:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testAccessibility, canReceiveFocus } from '../../utils/axe-helpers';
import Header from './Header';

/**
 * Accessibility test suite for Header component
 * Tests WCAG 2.2 Level AA compliance including:
 * - Keyboard navigation
 * - Color contrast
 * - Touch target size
 * - Screen reader support
 * - Focus management
 */
describe('Header - Accessibility', () => {
  /**
   * Test: Component passes axe accessibility audit
   * WCAG: Multiple criteria (4.1.2, 1.1.1, 1.4.3, etc.)
   */
  it('should pass axe accessibility audit', async () => {
    const result = render(<Header />);
    await testAccessibility(result);
  });

  /**
   * Test: All interactive elements are keyboard navigable
   * WCAG: 2.1.1 (Keyboard), 2.4.3 (Focus Order)
   */
  it('should navigate via keyboard', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Tab to navigation links
    await user.tab();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Tab to LinkedIn button
    const linkedinBtn = screen.getByLabelText(/linkedin/i);
    expect(canReceiveFocus(linkedinBtn)).toBe(true);

    // Tab to GitHub button
    const githubBtn = screen.getByLabelText(/github/i);
    expect(canReceiveFocus(githubBtn)).toBe(true);

    // Tab to Settings button
    const settingsBtn = screen.getByRole('button', { name: /settings/i });
    expect(canReceiveFocus(settingsBtn)).toBe(true);
  });

  /**
   * Test: Touch targets meet minimum size
   * WCAG: 2.5.8 (Target Size Minimum)
   */
  it('should have 44x44px minimum touch targets', () => {
    render(<Header />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      const styles = window.getComputedStyle(button);
      const width = parseInt(styles.minWidth || styles.width);
      const height = parseInt(styles.minHeight || styles.height);

      expect(width).toBeGreaterThanOrEqual(44);
      expect(height).toBeGreaterThanOrEqual(44);
    });
  });

  /**
   * Test: Focus indicators visible
   * WCAG: 2.4.7 (Focus Visible)
   */
  it('should have visible focus indicators', async () => {
    const user = userEvent.setup();
    const { container } = render(<Header />);

    await user.tab();
    const focused = container.querySelector(':focus-visible');
    expect(focused).toBeInTheDocument();
  });

  /**
   * Test: Icon buttons have accessible labels
   * WCAG: 4.1.2 (Name, Role, Value)
   */
  it('should have accessible labels on icon buttons', () => {
    render(<Header />);

    expect(
      screen.getByLabelText(/visit linkedin/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/visit github/i)
    ).toBeInTheDocument();
  });

  /**
   * Test: Logo is navigation element
   * WCAG: 1.3.1 (Info and Relationships)
   */
  it('should have navigation landmark', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

---

## Writing Accessibility Tests: Step-by-Step

### Step 1: Choose Component to Test

Select a component that has:
- Interactive elements (buttons, links, inputs)
- Visual styling that should be tested
- Complex behavior (menus, dialogs)

### Step 2: Create Test File

Create test file at: `v2/src/__tests__/components/[path]/[Component].test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { testAccessibility } from '../../utils/axe-helpers';
import MyComponent from './MyComponent';

describe('MyComponent - Accessibility', () => {
  // Tests go here
});
```

### Step 3: Start with axe Audit

Always start with an axe audit:

```typescript
it('should pass axe accessibility audit', async () => {
  const result = render(<MyComponent />);
  await testAccessibility(result);
});
```

This catches:
- Color contrast issues
- Missing alt text
- ARIA labeling problems
- Landmark issues
- And more!

### Step 4: Add Keyboard Navigation Tests

```typescript
it('should support keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  // Your keyboard tests here
  await user.tab();
  // Verify focus and behavior
});
```

### Step 5: Add Focus Tests

```typescript
it('should have visible focus indicators', () => {
  const { container } = render(<MyComponent />);
  const button = screen.getByRole('button');

  // Verify focus styling exists
  const styles = window.getComputedStyle(button, ':focus-visible');
  expect(styles.outline).not.toBe('none');
});
```

### Step 6: Add ARIA Tests (if applicable)

```typescript
it('should have proper ARIA attributes', () => {
  render(<MyComponent />);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-label');
  expect(button).toHaveAttribute('aria-expanded');
});
```

### Step 7: Run Tests

```bash
npm test -- MyComponent.test.tsx
```

### Step 8: Fix Issues

If tests fail, fix the component first, then the tests.

---

## Common Issues and Solutions

### Issue 1: "Element is not visible"

**Problem:** Screen reader or axe reports element not visible

**Solution:**
```typescript
// Bad: hidden with display:none
<button style={{ display: 'none' }}>Click me</button>

// Good: semantically hidden but keyboard accessible
<button style={{ position: 'absolute', left: '-9999px' }}>
  Skip to main
</button>
```

### Issue 2: "Missing accessible name"

**Problem:** Button or icon has no label

**Solution:**
```typescript
// Bad: Icon button with no label
<IconButton>
  <SettingsIcon />
</IconButton>

// Good: aria-label added
<IconButton aria-label="Open settings">
  <SettingsIcon />
</IconButton>
```

### Issue 3: "Color contrast too low"

**Problem:** Text doesn't meet 4.5:1 contrast ratio

**Solution:**
```typescript
// Use proper theme colors
const styles = {
  color: palette.text.primary,  // Guaranteed sufficient contrast
  backgroundColor: palette.background.default,
};

// Or verify contrast manually
// See WCAG_COMPLIANCE_GUIDE.md for acceptable color combos
```

### Issue 4: "Touch target too small"

**Problem:** Button/link less than 44×44px

**Solution:**
```typescript
// Bad: Small button
<Button size="small">Click</Button>

// Good: Minimum 44px
<Button
  size="medium"
  sx={{
    minWidth: 44,
    minHeight: 44,
  }}
>
  Click
</Button>
```

### Issue 5: "Keyboard trap"

**Problem:** User can Tab into element but not out

**Solution:**
```typescript
// Bad: Focus trap without escape
<Dialog open={true}>
  {/* Can't escape! */}
</Dialog>

// Good: Allow Escape to close
<Dialog
  open={true}
  onClose={handleClose}
  onKeyDown={(e) => {
    if (e.key === 'Escape') handleClose();
  }}
>
  {/* Can press Escape */}
</Dialog>
```

### Issue 6: "Form label not associated"

**Problem:** Input has label but they're not connected

**Solution:**
```typescript
// Bad: Label and input not connected
<label>Email</label>
<input type="email" />

// Good: htmlFor and id connect them
<label htmlFor="email-input">Email</label>
<input id="email-input" type="email" />
```

---

## Debugging Accessibility Tests

### Method 1: Use Testing Playground

```bash
npm test -- --debug
```

This shows the DOM in your browser for inspection.

### Method 2: Console Logging

```typescript
it('should work', async () => {
  const result = render(<MyComponent />);

  // Log the rendered HTML
  screen.debug();

  // Log specific element
  const button = screen.getByRole('button');
  console.log(button.outerHTML);
});
```

### Method 3: DevTools Inspection

```typescript
it('should work', () => {
  render(<MyComponent />);

  // Add a breakpoint and inspect
  debugger;

  const button = screen.getByRole('button');
  // Inspect in browser DevTools
});
```

### Method 4: Check ARIA in DevTools

1. Open browser DevTools
2. Go to Accessibility tab
3. Inspect element
4. View ARIA properties
5. Verify values are correct

---

## Best Practices

### ✅ DO:

- ✅ Start every test with an axe audit
- ✅ Test keyboard navigation for interactive elements
- ✅ Verify focus indicators visible
- ✅ Test in all theme modes (light, dark, high contrast)
- ✅ Use semantic HTML (`<button>`, `<a>`, `<nav>`)
- ✅ Use proper ARIA attributes
- ✅ Test on actual devices (desktop, mobile, tablet)
- ✅ Use WebAIM Contrast Checker for colors
- ✅ Include JSDoc documentation on tests
- ✅ Run tests before committing

### ❌ DON'T:

- ❌ Use `<div>` with `onClick` (use `<button>`)
- ❌ Use `<span>` instead of proper elements
- ❌ Skip keyboard tests
- ❌ Hardcode colors without testing contrast
- ❌ Rely on axe alone (add manual tests too)
- ❌ Use `visibility: hidden` when you need `display: none`
- ❌ Forget about color-blind users (don't rely on color alone)
- ❌ Test only in one browser
- ❌ Ignore focus management
- ❌ Use `aria-hidden` on interactive elements

---

## Running Tests Locally

### Full Test Suite

```bash
# Install dependencies (if needed)
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- Header.test.tsx

# Run tests matching pattern
npm test -- --grep "accessibility"

# Watch mode (re-run on file change)
npm test -- --watch
```

### Check Coverage

```bash
npm run test:coverage

# View coverage report
open coverage/index.html
```

**Target:** 80%+ coverage
**Current:** 87.35% (exceeds target)

---

## CI/CD Integration

Tests run automatically on:
- ✅ Every commit (pre-commit hook)
- ✅ Every pull request
- ✅ Before deployment

**Failures block:** Merge to main branch

---

## Continuous Improvement

### Monthly Tasks

- [ ] Review new accessibility standards
- [ ] Update axe-core if new version available
- [ ] Add tests for new components
- [ ] Review failing tests and fix issues

### Quarterly Tasks

- [ ] Run manual testing checklist
- [ ] Update browser compatibility matrix
- [ ] Review WCAG 2.2 guidelines for changes
- [ ] Update documentation if needed

### Annually

- [ ] Full accessibility audit
- [ ] WCAG guideline review
- [ ] Dependency update sweep
- [ ] Performance optimization review

---

## Resources

### Documentation
- [Accessibility Statement](ACCESSIBILITY_STATEMENT.md)
- [WCAG Compliance Guide](WCAG_COMPLIANCE_GUIDE.md)
- [Testing Checklist](ACCESSIBILITY_TESTING_CHECKLIST.md)

### Tools & Libraries
- **vitest-axe:** https://github.com/nickcolley/vitest-axe
- **axe-core:** https://github.com/dequelabs/axe-core
- **Testing Library:** https://testing-library.com/
- **ARIA:** https://www.w3.org/TR/wai-aria-1.2/

### Standards
- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **ARIA Practices:** https://www.w3.org/WAI/ARIA/apg/

### Training
- **MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **WebAIM:** https://webaim.org/
- **TPGi a11y:** https://www.tpgi.com/

---

**Last Updated:** February 6, 2026
**Maintained By:** Development Team
**Contact:** accessibility@singchan.com
