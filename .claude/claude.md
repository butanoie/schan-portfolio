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

### Documentation Resources

**Detailed Examples:** See [JSDOC_EXAMPLES.md](../docs/guides/JSDOC_EXAMPLES.md) for comprehensive real-world patterns and templates:
- Simple functions and async operations
- React components with complex props
- Custom hooks with state and effects
- Type definitions and interfaces
- Error handling patterns
- Common anti-patterns to avoid
- Quick copy-paste templates

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

### Localization (i18n)
**CRITICAL: All user-facing strings MUST be localized via the i18n system. No hardcoded strings in components.**

- Use `useI18n()` hook for all UI text
- Add new translation keys to `v2/src/lib/i18n.ts`
- Supported languages: English (en), French (fr)
- Auto-translate new strings using DeepL MCP
- User's language preference is persisted to localStorage

**See [LOCALIZATION.md](../docs/guides/LOCALIZATION.md) for quick reference and best practices. For detailed architecture, see [LOCALIZATION_ARCHITECTURE.md](../docs/guides/LOCALIZATION_ARCHITECTURE.md). For translation workflows, see [TRANSLATION_WORKFLOW.md](../docs/guides/TRANSLATION_WORKFLOW.md).**

## File Organization

- Keep files focused and single-purpose
- Use clear, descriptive file names
- Group related files in directories
- Maintain consistent directory structure

## Infrastructure & Setup Documentation

**Location:** All infrastructure and setup documentation goes in the `/docs` folder

### Required Infrastructure Documentation

Create comprehensive markdown files in `/docs` for all infrastructure, tools, and configuration:

#### MCP (Model Context Protocol) Setup
**File:** `docs/setup/MCP_SETUP.md`

Document:
- **Purpose**: What MCP servers are available and what they do
- **Installation**: Step-by-step setup instructions
- **Configuration**: How to configure `.mcp.json` and environment variables
- **Token Management**: How to obtain and manage API tokens
- **Troubleshooting**: Common issues and solutions
- **Security**: Best practices for handling secrets

**Example sections:**
- Available MCP Servers (with capabilities)
- Getting Your Tokens (links to services)
- Setting Up `.env` File
- Environment Variable Loading
- File Structure and Organization

#### Development Setup
**File:** `docs/DEVELOPMENT_SETUP.md` (if needed)

Document:
- Development environment prerequisites
- Installation instructions
- Configuration files and what they do
- How to run development server
- Environment variables required

#### Localization & i18n
**Files:** `docs/guides/LOCALIZATION.md`, `docs/guides/LOCALIZATION_ARCHITECTURE.md`, `docs/guides/TRANSLATION_WORKFLOW.md`

Three-part documentation structure:
- **LOCALIZATION.md** - Quick reference and overview (entry point)
- **LOCALIZATION_ARCHITECTURE.md** - Technical architecture and implementation patterns
- **TRANSLATION_WORKFLOW.md** - Step-by-step translation workflow and procedures

### Security Guidelines for Documentation

When documenting configuration and setup:

✅ **DO Document:**
- How to obtain tokens (links to official sources)
- `.env.example` file locations and structure
- Configuration file format and options
- Error messages and troubleshooting
- Security best practices

❌ **NEVER Document:**
- Actual token values
- API keys or secrets
- Hardcoded credentials
- Private authentication details

### Documentation File Standards

Infrastructure documentation files should include:

1. **Clear Overview** - What the system is and why it exists
2. **Quick Start** - Get users started in 5 minutes
3. **Detailed Setup** - Step-by-step instructions
4. **Configuration Reference** - All available options
5. **Troubleshooting** - Common issues and solutions
6. **Security Notes** - Important security considerations
7. **Related Documentation** - Links to other relevant docs

### Keeping Documentation Updated

- Update documentation when changing configuration
- Update when adding new environment variables
- Update when changing MCP setup or tools
- Keep examples current with actual file structures
- Review documentation during code reviews

## Commit Standards

- Write clear, descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable
- Keep commits atomic and focused

### Automatic Git Commits

**CRITICAL: Never automatically create git commits under any circumstances unless explicitly requested by the user.**

#### What "Explicitly Requested" Means

Git commits should ONLY be created when the user:
- Calls `/git-commit` skill directly
- Says "create a commit" or "commit these changes"
- Says "commit with message: ..." (with specific message)
- Directly requests a PR or commit action
- Explicitly approves after being asked

#### What Does NOT Count as a Request

**These do NOT grant permission to commit:**
- "proceed" or "start implementing" (means: begin work, NOT commit when done)
- "implement this feature" (means: write code, NOT commit automatically)
- Completing tasks or fixing issues successfully
- Running tests or linters successfully
- Any task completion without explicit commit request
- General workflow instructions without commit language

#### Implementation Workflow (REQUIRED)

1. User requests a feature/fix/task
2. You implement and complete the work
3. You describe what was completed and changes made
4. **YOU MUST ASK:** "Would you like me to commit these changes?" or "Should I create a commit for this?"
5. **WAIT for explicit approval** before committing
6. Only then proceed with commit

#### When in Doubt: Always Ask First

**Never assume permission to commit.** This includes:
- Do NOT commit after completing a task unless asked
- Do NOT commit after running tests successfully unless asked
- Do NOT commit after fixing all errors unless asked
- Do NOT commit during implementation cleanup
- Do NOT commit when making follow-up fixes

This ensures full control over git history, commit timing, and workflow consistency.

**Remember:** The user maintains authority over all commits to their repository.

## Changelog Requirements

**IMPORTANT: All significant changes must be documented in the project changelog.**

### When to Create a Changelog Entry

Create a changelog entry for:
- **Phase Completions** - When a major phase of work is completed
- **Infrastructure Changes** - New tools, frameworks, or development setup
- **Feature Additions** - New functionality or components
- **Breaking Changes** - Changes that affect existing functionality
- **Configuration Updates** - Major changes to build, lint, or test configuration
- **Documentation Standards** - New standards or enforcement mechanisms

### Changelog File Format

**Location:** `changelog/` directory at project root

**Filename Format:** `YYYY-MM-DDTHHMMSS_descriptive-name.md`

**Example:** `2026-01-27T082828_testing-infrastructure-setup.md`

**Generate Timestamp:**
```bash
date '+%Y-%m-%dT%H%M%S'
```

### Required Sections

Every changelog entry must include:

#### Header Metadata
```markdown
# Title - Brief Description

**Date:** YYYY-MM-DD
**Time:** HH:MM:SS TZ
**Type:** [Phase Completion | Infrastructure | Feature | Configuration | etc.]
**Phase:** [If applicable]
**Version:** vX.Y.Z
```

#### Core Sections
1. **Summary** - Brief overview of what was accomplished (2-3 sentences)
2. **Changes Implemented** - Detailed breakdown of all changes
3. **Technical Details** - Configuration, code snippets, technical specifics
4. **Validation & Testing** - Proof that changes work (test results, quality checks)
5. **Impact Assessment** - How this affects development, team, or project
6. **Related Files** - List of created/modified/deleted files
7. **Status** - ✅ COMPLETE or current status

#### Optional Sections (Use When Relevant)
- **Documentation Benefits** - How this improves documentation
- **Next Steps** - What can be done after this change
- **Future Enhancements** - Recommended improvements
- **References** - Links to documentation, guides, or external resources
- **Summary Statistics** - Numbers (files changed, tests added, coverage %, etc.)
- **Comparison** - Before/after comparisons or tool comparisons
- **Bug Fixes** - Issues resolved during implementation

### Changelog Best Practices

**Level of Detail:**
- Be comprehensive - changelogs are historical records
- Include specific file paths, line counts, and metrics
- Show verification results (test output, lint results, build success)
- Document configuration changes with code examples
- Explain WHY changes were made, not just WHAT changed

**Writing Style:**
- Use clear headings and subsections
- Include code blocks for examples
- Use checkmarks (✅) for completed items
- Use tables for structured data
- Include command examples with output
- Link to related documentation files

**Examples to Follow:**
- See `changelog/2026-01-25T231357_phase1-completion.md` for phase completion example
- See `changelog/2026-01-25T233843_static-analysis-documentation-enforcement.md` for infrastructure example
- See `changelog/2026-01-27T082828_testing-infrastructure-setup.md` for detailed technical example

### Changelog Template Structure

```markdown
# Title - Brief Description

**Date:** YYYY-MM-DD
**Time:** HH:MM:SS TZ
**Type:** [Type]
**Version:** vX.Y.Z

## Summary

[2-3 sentence overview]

---

## Changes Implemented

### 1. [Category]

[Detailed description]

**Created:**
- File paths and purposes

**Modified:**
- File paths and changes

---

## Technical Details

### [Subsection]

[Code examples, configuration details]

---

## Validation & Testing

### Quality Checks

**TypeScript:**
```bash
$ npm run type-check
✅ Result
```

**ESLint:**
```bash
$ npm run lint
✅ Result
```

**Tests:**
```bash
$ npm test
✅ Result
```

---

## Impact Assessment

### Immediate Impact
- ✅ Item 1
- ✅ Item 2

### Long-term Benefits
- 🔒 Benefit 1
- 📚 Benefit 2

---

## Related Files

### Created Files (N)
1. **`path/file.ext`** - Description (X lines)

### Modified Files (N)
1. **`path/file.ext`** - Changes made

---

## Summary Statistics

- **Files Created:** N
- **Files Modified:** N
- **[Metric]:** Value

---

## References

- **Link:** [Description](url)

---

**Status:** ✅ COMPLETE

[Final summary statement]
```

### Changelog Enforcement

- **Significant changes require changelog** - Use the `/changelog-create` skill
- **Commit references** - Link changelog in commit message when applicable
- **Review requirement** - Verify changelog entry during code review
- **Historical record** - Changelogs help track project evolution

---

**Remember: Documentation is not optional. All code must be documented before it can be committed.**
