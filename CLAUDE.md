# Claude Code Guidelines for Portfolio Project

This document defines coding standards and requirements for all code produced in this project.

## Quick Reference

### Tech Stack
Next.js 16 (App Router) · React 19 · TypeScript (strict) · MUI 7 · Vitest · Sentry · PostHog · i18next

### Commands (run from `v2/`)
```bash
npm run dev          # Start dev server
npm run build        # Production build (+ source map strip)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run typecheck    # TypeScript type check (tsc --noEmit)
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
npm run test:coverage # Vitest with coverage
npm run format:check # Prettier check
npm run format       # Prettier auto-format
```

### Project Structure
```
v2/                  # Active app (v1/ is legacy, do not modify)
├── app/             # Next.js App Router (routes, layouts, pages)
├── src/
│   ├── components/  # React components
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Core libraries (i18n, etc.)
│   ├── contexts/    # React contexts
│   ├── data/        # Static data / content
│   ├── types/       # TypeScript types
│   ├── utils/       # Utility functions
│   ├── constants/   # Constants
│   ├── styles/      # Global styles
│   ├── locales/     # Translation files
│   └── __tests__/   # Test files
├── public/          # Static assets
└── vitest.config.ts # Test configuration
docs/                # Infrastructure & setup docs
changelog/           # Changelog entries
```

### Key Files
- `v2/app/layout.tsx` — Root layout (persistent across navigation)
- `v2/src/lib/i18n.ts` — i18n configuration and translation keys
- `v2/next.config.ts` — Next.js configuration
- `v2/vitest.config.ts` — Test configuration
- `v2/eslint.config.mjs` — Lint rules

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

> See [JSDOC_EXAMPLES.md](docs/guides/JSDOC_EXAMPLES.md) for full examples and copy-paste templates.

#### React Components
All React components must document:
- **Purpose**: What the component renders and its responsibility
- **Props**: Each prop with type, description, and default value
- **Context**: Any context or hooks used
- **State**: Complex state management explanations

#### Interfaces and Types
All interfaces and types must include:
- **Purpose**: What the interface/type represents
- **Property Descriptions**: Each property should be documented

#### Classes
All classes must document:
- **Purpose**: What the class represents and its responsibility
- **Constructor**: Parameters and initialization behavior
- **Public Methods**: Full documentation as per function requirements
- **Important Properties**: Complex or public properties

#### Complex Logic
Complex algorithms, business logic, or non-obvious code must include:
- **Inline comments** explaining the "why" not just the "what"
- **Algorithm descriptions** for complex logic
- **References** to external documentation or specifications if applicable

### Documentation Enforcement

- **No exceptions**: All code must be documented before committing
- **Review requirement**: During code review, check that documentation is complete
- **Git commit blocks**: The git-commit skill will verify documentation exists
- **Quality over quantity**: Documentation should be clear, accurate, and helpful
- **JSDoc review on modification**: When modifying any file, always review and update existing JSDoc/TSDoc comments in that file to ensure they remain accurate. This includes verifying parameter names, types, return values, descriptions, and `@example` blocks still match the current implementation. Treat stale JSDoc as a bug.

### When Documentation Is Missing

If you discover code without documentation:
1. **Stop the current task**
2. **Add the required documentation**
3. **Then proceed**

**CRITICAL: Treat missing documentation as a critical blocker, equivalent to a compile error.**

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
- **Persistent layouts preserve state**: Next.js App Router layouts (e.g., `MainLayout`) never unmount during navigation. `useState` does NOT reset when a dependency changes — state persists until explicitly cleared. When refactoring layout components, verify that navigation-related state cleanup (e.g., `useEffect` that clears state on route change) is preserved.

### Refactoring Safety
**CRITICAL: Before removing or replacing any code during refactoring, check its git history (`git log -p --follow` or `git blame`) to understand WHY it exists.** Code that looks redundant may be a deliberate bug fix. Specifically:
- **Never remove a `useEffect` without understanding its purpose** — it may handle cleanup, state resets, or edge cases that aren't obvious from reading the code alone
- **Check if the code was added as a bug fix** — look at commit messages and PR descriptions for context like "fix:", "bugfix", or issue references
- **If replacing logic, verify behavioral equivalence** — a replacement that handles the "happy path" but drops an edge-case cleanup (e.g., clearing stale state on navigation) introduces a regression
- **Do not write comments claiming behavior that isn't implemented** — e.g., never claim state "resets automatically" unless the mechanism (like a `key` prop) actually exists in the code

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

**See [LOCALIZATION_ARCHITECTURE.md](docs/guides/LOCALIZATION_ARCHITECTURE.md) for architecture, patterns, and translation workflows.**

## Infrastructure & Setup Documentation

Infrastructure docs live in `docs/`. Key references:
- `docs/setup/MCP_SETUP.md` — MCP server configuration and tokens
- `docs/setup/RAILWAY_DEPLOYMENT.md` — Railway hosting and CI/CD
- `docs/setup/POSTHOG_SETUP.md` — PostHog analytics configuration
- `docs/setup/SENTRY_SETUP.md` — Sentry error tracking configuration
- `docs/setup/TESTING_SETUP.md` — Testing infrastructure
- `docs/guides/LOCALIZATION_ARCHITECTURE.md` — i18n architecture, patterns, and translation workflows
- `docs/guides/MAINTENANCE_WORKFLOW.md` — Operational maintenance procedures

When adding new infrastructure, create docs in the appropriate `docs/` subdirectory. 
**CRITICAL: Never document actual tokens or secrets — only how to obtain them.**

## Commit Standards

- Write clear, descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable
- Keep commits atomic and focused

### Automatic Git Commits

**CRITICAL: Never commit unless the user explicitly asks** (e.g., "commit these changes", `/git-commit`, or explicit approval after being asked). Completing a task, running tests, or "proceed" does NOT grant commit permission. After finishing work, always ask "Would you like me to commit?" and wait for confirmation.

## Feature Development Workflow

### Post-Architecture Documentation Gate

**CRITICAL: After Phase 4 (Architecture Design) is approved by the user, you MUST update documentation BEFORE proceeding to Phase 5 (Implementation).** Do NOT skip this step. Do NOT start writing code until docs are updated. Treat missing doc updates as a blocker, equivalent to a failing build.

Phase 3 captures user preferences; Phase 4 translates them into concrete technical choices. Documentation should reflect the fully-formed decisions, not partial ones.

**Checklist (review each item explicitly):**

- **Scenario docs** (`docs/test-scenarios/`) — Update with confirmed implementation decisions, refined scope, or amended Gherkin
- **Architecture docs** (`docs/guides/`) — Update specifications with confirmed details, refined selectors, or new technical constraints
- **Roadmaps** (`docs/active/`) — Reflect scope changes, new checklist items, or adjusted priorities
- **GitHub issues** — Post a comment syncing the latest decisions and technical notes
- **CLAUDE.md** — Add new conventions or standards that emerged from the discussion

This ensures documentation stays ahead of implementation, not behind it.

### Verification Gate

**Before considering any implementation phase complete, run the full automated quality gate:**
```bash
cd v2 && npm run lint && npm run typecheck && npm run format:check && npm test
```
This catches issues that code-review agents miss (JSDoc, React hooks rules, formatting). Run this after Phase 5 (Implementation) and after Phase 6 (Quality Review) fixes.

### Post-Review Documentation Gate

**CRITICAL: After Phase 6 (Quality Review) issues have been fixed, you MUST update documentation BEFORE proceeding to Phase 7 (Summary).** Do NOT skip this step. Treat missing doc updates as a blocker, equivalent to a failing build.

**Checklist (complete both steps):**

1. **Update project docs** — sync architecture specs with implementation reality, check off completed roadmap items, and note any deferred work.
2. **Run `/claude-md-management:revise-claude-md`** — capture gotchas and conventions into directory-scoped CLAUDE.md files (e.g., `v2/e2e/CLAUDE.md`, `v2/src/components/CLAUDE.md`). Create new scoped CLAUDE.md files when a feature introduces a new directory with its own conventions. Only add to root CLAUDE.md if the learning applies project-wide.

### CLAUDE.md Authoring Pattern

When adding workflow gates to CLAUDE.md, use the `CRITICAL` + imperative pattern: start with `**CRITICAL:**`, use explicit `Do NOT skip` / `Do NOT combine`, and include `Treat as a blocker, equivalent to a failing build`. Descriptive/suggestive language (e.g., "always update...") gets deprioritized against active skill prompts and is unreliable as a gate.

## Changelog

Create a changelog entry for:
- **Phase Completions** - When a major phase of work is completed
- **Infrastructure Changes** - New tools, frameworks, or development setup
- **Feature Additions** - New functionality or components
- **Breaking Changes** - Changes that affect existing functionality
- **Configuration Updates** - Major changes to build, lint, or test configuration
- **Documentation Standards** - New standards or enforcement mechanisms

### Changelog Format

**Location:** `changelog/` directory at project root. Filename: `YYYY-MM-DDTHHMMSS_descriptive-name.md`

**Generate timestamp:** `date '+%Y-%m-%dT%H%M%S'`

See `changelog/CLAUDE.md` for required sections, template structure, and best practices.

### Changelog Enforcement

- **Significant changes require changelog**
- **Commit references** - Link changelog in commit message when applicable
- **Review requirement** - Verify changelog entry during code review
- **Historical record** - Changelogs help track project evolution

---

**Remember: Documentation is not optional. All code must be documented before it can be committed.**
