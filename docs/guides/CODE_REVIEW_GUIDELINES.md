# Code Review Guidelines

Guidelines for reviewing code quality, documentation standards, and best practices.

---

## Pre-Review Checklist

Before leaving a detailed review, verify:

- [ ] GitHub Actions CI passed (lint, type-check, tests)
- [ ] PR template checklist is complete
- [ ] All files are within scope of PR description

If any of these fail, request changes and stop here.

---

## Documentation Review

**Critical:** All changes must include documentation per [CLAUDE.md](../.claude/CLAUDE.md).

### Functions & Methods ✓

**Verify:**
- [ ] All functions have JSDoc comments
- [ ] `@param` tags for each parameter with type and description
- [ ] `@returns` tag with type and description
- [ ] `@throws` documented if function throws errors
- [ ] Complex functions include `@example` usage

**Example to compare against:**
[Simple Functions](./JSDOC_EXAMPLES.md#simple-functions) in JSDOC_EXAMPLES.md

**What to flag:**
```typescript
// ❌ BLOCK: No documentation
function calculateTotal(price, tax) {
  return price + tax;
}

// ✅ APPROVE: Complete documentation
/**
 * Calculates total price with tax.
 * @param price - Base price before tax
 * @param tax - Tax amount to add
 * @returns Total price including tax
 */
function calculateTotal(price: number, tax: number): number {
  return price + tax;
}
```

---

### React Components ✓

**Verify:**
- [ ] Component purpose is clearly documented
- [ ] Props interface has JSDoc comments
- [ ] All props documented with type, description, and default value
- [ ] Context/hooks usage documented if used
- [ ] Complex state logic explained

**Example to compare against:**
[React Components](./JSDOC_EXAMPLES.md#react-components) in JSDOC_EXAMPLES.md

**What to flag:**
```typescript
// ❌ BLOCK: Props not documented
interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function Button({ onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>Click</button>;
}

// ✅ APPROVE: Full prop documentation
/**
 * A reusable button component with loading state.
 * @returns A button element
 */
interface ButtonProps {
  /** Callback fired when button is clicked */
  onClick: () => void;
  /** Whether the button is disabled (default: false) */
  disabled?: boolean;
}

export function Button({ onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>Click</button>;
}
```

---

### Custom Hooks ✓

**Verify:**
- [ ] Hook purpose documented
- [ ] Parameters documented with `@param` tags
- [ ] Return value documented with `@returns` tag
- [ ] Dependency array explained in comments (if using useEffect/useCallback/useMemo)
- [ ] Side effects documented
- [ ] Cleanup functions explained (if applicable)

**Example to compare against:**
[Custom Hooks](./JSDOC_EXAMPLES.md#custom-hooks) in JSDOC_EXAMPLES.md

**What to flag:**
```typescript
// ❌ REQUEST CHANGES: Missing documentation
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return data;
}

// ✅ APPROVE: Complete hook documentation
/**
 * Fetches data from an API endpoint.
 * @param url - The API URL to fetch from
 * @returns The fetched data (null while loading)
 * **Dependencies:** [url]
 */
function useData(url: string) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return data;
}
```

---

### Type Definitions & Interfaces ✓

**Verify:**
- [ ] Interface/type has a JSDoc comment explaining its purpose
- [ ] Each property has a description (can be brief)
- [ ] Generic types have documentation
- [ ] No unexplained `any` types

**Example to compare against:**
[Type Definitions](./JSDOC_EXAMPLES.md#type-definitions) in JSDOC_EXAMPLES.md

**What to flag:**
```typescript
// ❌ REQUEST CHANGES: No documentation
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ APPROVE: Type documentation
/**
 * User profile information from the database.
 */
interface User {
  /** Unique user identifier */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Account creation timestamp */
  createdAt: Date;
}
```

---

### Complex Logic ✓

**Verify:**
- [ ] Non-obvious algorithms have explanatory comments
- [ ] Comments explain "why" not just "what"
- [ ] Business logic is clearly documented
- [ ] References to external specs or documentation included if applicable

**What to flag:**
```typescript
// ❌ REQUEST CHANGES: What but not why
if (weight <= 5) {
  baseRate = 5;
  perKmRate = 0.5;
}

// ✅ APPROVE: Why and what
// Use tiered pricing based on weight brackets
// Tier 1: 0-5kg = $5 base + $0.50/km
if (weight <= 5) {
  baseRate = 5;
  perKmRate = 0.5;
}
```

---

## Type Safety & Code Quality

### TypeScript ✓

**Verify:**
- [ ] No `any` types (unless justified with comment explaining why)
- [ ] All function parameters typed
- [ ] All component props typed
- [ ] Return types specified or inferred appropriately
- [ ] No type casts (`as`) unless necessary

**What to flag:**
```typescript
// ❌ BLOCK: Loose typing
const handleClick = (event: any) => {
  console.log(event.target.value);
};

// ✅ APPROVE: Proper typing
const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};
```

### Unused Code ✓

**Verify:**
- [ ] No unused variables or imports
- [ ] No dead code
- [ ] No commented-out code

**What to flag:**
```typescript
// ❌ REQUEST CHANGES: Unused variables
const { container, debug } = render(<Component />);
const element = screen.getByRole('button');

// ✅ APPROVE: Clean
render(<Component />);
const element = screen.getByRole('button');
```

---

## React Best Practices

### Hooks ✓

**Verify:**
- [ ] All dependencies included in dependency arrays
- [ ] No missing dependencies in `useCallback`, `useMemo`
- [ ] No direct state mutations
- [ ] `useEffect` cleanup functions if needed
- [ ] No hooks called conditionally

**What to flag:**
```typescript
// ❌ BLOCK: Missing dependency
function Component() {
  const callback = () => console.log('clicked');
  useEffect(() => {
    window.addEventListener('click', callback);
    return () => window.removeEventListener('click', callback);
  }, []); // ❌ Missing dependency: callback
}

// ✅ APPROVE: Dependency included
function Component() {
  const callback = useCallback(() => {
    console.log('clicked');
  }, []);
  useEffect(() => {
    window.addEventListener('click', callback);
    return () => window.removeEventListener('click', callback);
  }, [callback]); // ✅ Includes dependency
}
```

### Component Design ✓

**Verify:**
- [ ] Components are focused (Single Responsibility)
- [ ] Prop drilling avoided where appropriate
- [ ] No over-memoization (memoize what matters)
- [ ] State at appropriate level

---

## What To Do in Each Situation

### 🟢 APPROVE
- All automated checks passed
- Documentation is complete and clear
- Code follows all standards
- Type safety verified
- No blocking issues

**Action:** Approve the PR

---

### 🟡 REQUEST CHANGES
- Missing documentation (but fixable)
- Incomplete JSDoc or type definitions
- Minor code quality issues
- Better examples or explanations needed

**Action:**
1. Point to the specific issue
2. Reference JSDOC_EXAMPLES.md if showing a pattern
3. Be specific about what's missing
4. Example: "Missing @param documentation. See [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md#simple-functions) for the pattern."

**Do not merge** until resolved.

---

### 🔴 BLOCK / REQUEST CHANGES (Critical)
- Automated checks failed
- No documentation on public functions/components
- TypeScript errors
- `any` types without justification
- Missing prop types
- Hook rule violations

**Action:**
1. Request changes
2. Be clear about why it's blocking
3. Provide link to standards (CLAUDE.md)
4. Example: "Functions require JSDoc per [CLAUDE.md](../.claude/CLAUDE.md). See [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md) for the pattern."

**Do not merge** until resolved.

---

## Common Review Comments

### For Missing JSDoc
```
This function needs complete JSDoc documentation.

Please add:
- Description of what the function does
- @param tags for each parameter
- @returns tag with return type
- @example if complex

See [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md#simple-functions) for the pattern.
```

### For Incomplete Props
```
Component props need individual documentation.

Instead of:
```typescript
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
```

Do:
```typescript
interface ButtonProps {
  /** Callback when button is clicked */
  onClick?: () => void;
  /** Whether button is disabled (default: false) */
  disabled?: boolean;
}
```

See [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md#react-components) for the pattern.
```

### For Missing Dependencies
```
This useEffect is missing a dependency in the array.

Current:
```typescript
useEffect(() => {
  window.addEventListener('click', callback);
}, []) // Missing: callback
```

Fix:
```typescript
useEffect(() => {
  window.addEventListener('click', callback);
}, [callback]) // ✅ Added
```

See [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md#hook-with-effect--cleanup) for the pattern.
```

---

## Review Workflow

1. **Check CI Status**
   - GitHub Actions passed?
   - Linting passed?
   - Type-check passed?
   - Tests passed?

2. **Review PR Description & Checklist**
   - Is PR template completed?
   - Are changes within scope?
   - Were docs reviewed?

3. **Review Code Quality**
   - Type safety verified
   - Best practices followed
   - No unused code

4. **Review Documentation** ← PRIMARY FOCUS
   - Functions documented
   - Components have prop docs
   - Hooks documented
   - Complex logic explained
   - Types documented

5. **Make Decision**
   - All good? → Approve
   - Minor issues? → Request changes
   - Blocking issues? → Block and comment

---

## Quick Reference

| Issue Type | Action | Reference |
|-----------|--------|-----------|
| Missing JSDoc | Block | [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md) |
| No prop types | Block | [JSDOC_EXAMPLES.md#react-components](./JSDOC_EXAMPLES.md#react-components) |
| Missing dependencies | Block | [JSDOC_EXAMPLES.md#hook-with-effect--cleanup](./JSDOC_EXAMPLES.md#hook-with-effect--cleanup) |
| Incomplete docs | Request changes | [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md) |
| Using `any` type | Block | [CLAUDE.md](../.claude/CLAUDE.md#typescript-best-practices) |
| No type definitions | Block | [CLAUDE.md](../.claude/CLAUDE.md#typescript-best-practices) |

---

## Related Documentation

- **Standards & Requirements:** [CLAUDE.md](../.claude/CLAUDE.md)
- **Code Examples & Patterns:** [JSDOC_EXAMPLES.md](./JSDOC_EXAMPLES.md)
- **PR Checklist:** [pull_request_template.md](../.github/pull_request_template.md)
- **Quality Metrics:** [CODE_QUALITY_DASHBOARD.md](./CODE_QUALITY_DASHBOARD.md)

---

**Remember:** The goal is consistency and clarity. Use these guidelines to help developers improve, not to be overly critical.
