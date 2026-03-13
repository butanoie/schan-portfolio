# v2 Application

## Quick Reference

### Tech Stack
Next.js 16 (App Router) · React 19 · TypeScript (strict) · MUI 7 · Vitest · Sentry · PostHog · i18next

### Commands
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
app/             # Next.js App Router (routes, layouts, pages)
src/
├── components/  # React components
├── hooks/       # Custom hooks
├── lib/         # Core libraries (i18n, etc.)
├── contexts/    # React contexts
├── data/        # Static data / content
├── types/       # TypeScript types
├── utils/       # Utility functions
├── constants/   # Constants
├── styles/      # Global styles
├── locales/     # Translation files
└── __tests__/   # Test files
public/          # Static assets
vitest.config.ts # Test configuration
```

### Key Files
- `app/layout.tsx` — Root layout (persistent across navigation)
- `src/lib/i18n.ts` — i18n configuration and translation keys
- `next.config.ts` — Next.js configuration
- `vitest.config.ts` — Test configuration
- `eslint.config.mjs` — Lint rules

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

### Color Palette Changes
**CRITICAL: When modifying any color in `BRAND_COLORS` or `NAV_COLORS` (in `src/constants/colors.ts`), check ALL related states** — hover, active, disabled — across the full constant file. Colors are cross-referenced (e.g., `BRAND_COLORS.sage` is the default background, `NAV_COLORS.inactiveHover` is its hover state). Changing one without the other eliminates visual hover feedback.

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
- Add new translation keys to `src/lib/i18n.ts`
- Supported languages: English (en), French (fr)
- Auto-translate new strings using DeepL MCP
- User's language preference is persisted to localStorage

**See [LOCALIZATION_ARCHITECTURE.md](../docs/guides/LOCALIZATION_ARCHITECTURE.md) for architecture, patterns, and translation workflows.**

### Verification Gate

**Before considering any implementation phase complete, run the full automated quality gate:**
```bash
npm run lint && npm run typecheck && npm run format:check && npm test
```
This catches issues that code-review agents miss (JSDoc, React hooks rules, formatting). Run this after Phase 5 (Implementation) and after Phase 6 (Quality Review) fixes.
