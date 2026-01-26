# Claude Code Guidelines for Portfolio Project

This document defines coding standards and requirements for all code produced in this project.

## Documentation Requirements

**CRITICAL: All new code MUST include comprehensive documentation.**

### Required Documentation

Every piece of code produced must include appropriate documentation:

#### Functions and Methods
All functions must have JSDoc/TSDoc comments that include:
- **Purpose**: Clear description of what the function does
- **Parameters**: Type and description for each parameter
- **Return Value**: Type and description of what is returned
- **Side Effects**: Any state changes, API calls, or important behavior
- **Examples**: For complex functions, include usage examples

**Example:**
```typescript
/**
 * Calculates the total price including tax and discounts.
 *
 * @param basePrice - The initial price before any modifications
 * @param taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @param discountPercent - Optional discount percentage (0-100)
 * @returns The final price after tax and discounts
 * @throws {Error} If basePrice or taxRate is negative
 *
 * @example
 * const total = calculateTotal(100, 0.08, 10);
 * // Returns 97.2 (100 - 10% discount + 8% tax on $90)
 */
function calculateTotal(
  basePrice: number,
  taxRate: number,
  discountPercent?: number
): number {
  if (basePrice < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be non-negative');
  }
  // Apply discount first, then calculate tax
  const discounted = discountPercent
    ? basePrice * (1 - discountPercent / 100)
    : basePrice;
  return discounted * (1 + taxRate);
}
```

#### React Components
All React components must document:
- **Purpose**: What the component renders and its responsibility
- **Props**: Each prop with type, description, and default value
- **Context**: Any context or hooks used
- **State**: Complex state management explanations

**Example:**
```typescript
/**
 * A button component that displays a loading spinner while an async action is in progress.
 * Automatically handles loading state and error display.
 *
 * @param onClick - Async function to execute when clicked
 * @param children - Button label text
 * @param variant - Visual style variant (default: 'primary')
 * @param disabled - Whether the button is disabled (default: false)
 * @returns A button element with loading state management
 *
 * @example
 * <AsyncButton onClick={async () => await saveData()} variant="primary">
 *   Save Changes
 * </AsyncButton>
 */
export function AsyncButton({
  onClick,
  children,
  variant = 'primary',
  disabled = false
}: AsyncButtonProps) {
  const [loading, setLoading] = useState(false);
  // Implementation...
}
```

#### Interfaces and Types
All interfaces and types must include:
- **Purpose**: What the interface/type represents
- **Property Descriptions**: Each property should be documented

**Example:**
```typescript
/**
 * Configuration options for the API client.
 */
interface ApiConfig {
  /** Base URL for all API requests */
  baseUrl: string;

  /** Authentication token for API requests */
  authToken: string;

  /** Request timeout in milliseconds (default: 5000) */
  timeout?: number;

  /** Custom headers to include with every request */
  headers?: Record<string, string>;
}
```

#### Classes
All classes must document:
- **Purpose**: What the class represents and its responsibility
- **Constructor**: Parameters and initialization behavior
- **Public Methods**: Full documentation as per function requirements
- **Important Properties**: Complex or public properties

**Example:**
```typescript
/**
 * Manages user session state and authentication.
 * Handles token refresh, session expiry, and user data caching.
 */
class SessionManager {
  /**
   * Creates a new SessionManager instance.
   *
   * @param config - Session configuration options
   * @param storage - Storage adapter for persisting session data
   */
  constructor(config: SessionConfig, storage: StorageAdapter) {
    // Implementation...
  }

  // All public methods must be documented...
}
```

#### Complex Logic
Complex algorithms, business logic, or non-obvious code must include:
- **Inline comments** explaining the "why" not just the "what"
- **Algorithm descriptions** for complex logic
- **References** to external documentation or specifications if applicable

**Example:**
```typescript
function calculateShipping(weight: number, distance: number): number {
  // Use tiered pricing based on weight brackets
  // Tier 1: 0-5kg = $5 base + $0.50/km
  // Tier 2: 5-20kg = $10 base + $0.75/km
  // Tier 3: 20kg+ = $20 base + $1.00/km

  let baseRate: number;
  let perKmRate: number;

  if (weight <= 5) {
    baseRate = 5;
    perKmRate = 0.5;
  } else if (weight <= 20) {
    baseRate = 10;
    perKmRate = 0.75;
  } else {
    baseRate = 20;
    perKmRate = 1.0;
  }

  return baseRate + (distance * perKmRate);
}
```

### Documentation Enforcement

- **No exceptions**: All code must be documented before committing
- **Review requirement**: During code review, check that documentation is complete
- **Git commit blocks**: The git-commit skill will verify documentation exists
- **Quality over quantity**: Documentation should be clear, accurate, and helpful

### When Documentation Is Missing

If you discover code without documentation:
1. **Stop the current task**
2. **Add the required documentation**
3. **Then proceed**

Treat missing documentation as a critical blocker, equivalent to a compile error.

## Code Quality Standards

### TypeScript Best Practices
- Use explicit types; avoid `any`
- Leverage type inference where appropriate
- Use strict mode (`strict: true` in tsconfig.json)
- Prefer interfaces over type aliases for object shapes
- Use const assertions for literal types

### React Best Practices
- Use functional components with hooks
- Avoid prop drilling; use Context or composition
- Memoize expensive computations with `useMemo`
- Memoize callback functions with `useCallback`
- Keep components small and focused (Single Responsibility Principle)

### Testing Requirements
- Write tests for all new functionality
- Aim for high test coverage (80%+ for critical paths)
- Test edge cases and error conditions
- Use descriptive test names that explain what is being tested

### Error Handling
- Always handle errors appropriately
- Use try-catch for async operations
- Provide meaningful error messages
- Log errors for debugging

### Security
- Validate all user input
- Sanitize data before rendering
- Use environment variables for sensitive data
- Never commit secrets or API keys

## File Organization

- Keep files focused and single-purpose
- Use clear, descriptive file names
- Group related files in directories
- Maintain consistent directory structure

## Commit Standards

- Write clear, descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable
- Keep commits atomic and focused

---

**Remember: Documentation is not optional. All code must be documented before it can be committed.**
