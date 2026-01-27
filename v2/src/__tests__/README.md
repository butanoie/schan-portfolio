# Testing Guide

This directory contains all unit and integration tests for the v2 portfolio application.

## Test Structure

Tests are organized to mirror the source code structure:

```
src/__tests__/
├── components/     # Component tests
├── lib/           # Library and configuration tests
├── utils/         # Utility function tests
└── README.md      # This file
```

## Testing Conventions

### File Naming

- Test files should be named `{filename}.test.ts` or `{filename}.test.tsx`
- Place tests in the `__tests__` directory matching the source location
- Example: `src/utils/formatDate.ts` → `src/__tests__/utils/formatDate.test.ts`

### Test Structure

Each test file should follow this structure:

```typescript
import { describe, it, expect } from 'vitest';

/**
 * Tests for {functionality description}
 */
describe('{Component/Function name}', () => {
  it('should {expected behavior}', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Component Testing

For React components, use React Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@/src/components/ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Expected result')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Arrange-Act-Assert Pattern**: Structure tests with clear setup, execution, and verification phases
2. **Descriptive Test Names**: Use "should" statements that describe expected behavior
3. **Test Isolation**: Each test should be independent and not rely on other tests
4. **Mock External Dependencies**: Use Vitest mocks for external services and APIs
5. **Test User Behavior**: Focus on testing from the user's perspective, not implementation details
6. **Accessibility Testing**: Include accessibility checks in component tests

### Coverage Goals

Per the modernization plan, aim for:
- **80%+ coverage** for data layer utilities
- **100% coverage** for critical business logic
- **Meaningful tests** over achieving coverage numbers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in UI mode (interactive)
npm run test:ui
```

### Coverage Reports

After running `npm run test:coverage`, view the HTML report:
- Open `coverage/index.html` in your browser for detailed coverage analysis

### Accessibility Testing

Include accessibility checks using jest-dom matchers:

```typescript
import { axe } from 'vitest-axe'; // If added later

it('should have no accessibility violations', async () => {
  const { container } = render(<ComponentName />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
