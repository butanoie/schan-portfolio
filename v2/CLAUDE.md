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
npm run test:e2e     # Playwright E2E tests (requires build first)
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

### Root-Level File Patterns
- **Metadata routes** (`robots.ts`, `sitemap.ts`) — use Next.js `MetadataRoute` convention with typed exports. Only for files Next.js has built-in support for.
- **Custom text files** (`llms.txt/route.ts`, `llms-full.txt/route.ts`) — use App Router route handlers at `app/<filename>/route.ts`. Require `export const dynamic = 'force-static'` for SSG (route handlers default to dynamic).

## Code Quality Standards

### React Best Practices
- **Persistent layouts preserve state**: Next.js App Router layouts (e.g., `MainLayout`) never unmount during navigation. `useState` does NOT reset when a dependency changes — state persists until explicitly cleared. When refactoring layout components, verify that navigation-related state cleanup (e.g., `useEffect` that clears state on route change) is preserved.

### Color Palette Changes
**CRITICAL: When modifying any color in `BRAND_COLORS` or `NAV_COLORS` (in `src/constants/colors.ts`), check ALL related states** — hover, active, disabled — across the full constant file. Colors are cross-referenced (e.g., `BRAND_COLORS.sage` is the default background, `NAV_COLORS.inactiveHover` is its hover state). Changing one without the other eliminates visual hover feedback.

### Refactoring Safety
**CRITICAL: Before removing or replacing any code during refactoring, check its git history (`git log -p --follow` or `git blame`) to understand WHY it exists.** Code that looks redundant may be a deliberate bug fix. Specifically:
- **Never remove a `useEffect` without understanding its purpose** — it may handle cleanup, state resets, or edge cases that aren't obvious from reading the code alone
- **Check if the code was added as a bug fix** — look at commit messages and PR descriptions for context like "fix:", "bugfix", or issue references
- **If replacing logic, verify behavioral equivalence** — a replacement that handles the "happy path" but drops an edge-case cleanup (e.g., clearing stale state on navigation) introduces a regression
- **Do not write comments claiming behavior that isn't implemented** — e.g., never claim state "resets automatically" unless the mechanism (like a `key` prop) actually exists in the code

### JSDoc in Tests
- **Inline test helpers need full JSDoc** — `jsdoc/require-jsdoc` applies to `const` arrow functions inside `it()` bodies, not just module exports. Do not downgrade JSDoc to `//` comments on these helpers.
- **Functions with return types need `@returns`** — `jsdoc/require-returns` fires on any function with an explicit return type annotation, including test helpers.

### Localization (i18n)
**CRITICAL: All user-facing strings MUST be localized via the i18n system. No hardcoded strings in components.**

- Use `useI18n()` hook for all UI text
- Add new translation keys to `src/lib/i18n.ts`
- Supported languages: English (en), French (fr)
- Auto-translate new strings using DeepL MCP
- User's language preference is persisted to localStorage

**See [LOCALIZATION_ARCHITECTURE.md](../docs/guides/LOCALIZATION_ARCHITECTURE.md) for architecture, patterns, and translation workflows.**

### Resume Data (src/data/resume.ts)
- `t()` calls repeat `{ ns: 'pages' }` ~65 times — this is intentional. Dynamic key generation would break i18next static extraction.
- All jobs use `Role.contributions` (per-role bullets). `Job.description` and `Job.keyContributions` were removed — do not re-add them.
- `getLocalizedResumeData(t)` is memoized in `page.tsx` via `useMemo(() => ..., [t])` — this stabilizes downstream `useMemo` dependencies (e.g., `ClientList`'s bin-packing).

### Verification Gate

**Before considering any implementation phase complete, run the full automated quality gate:**
```bash
npm run lint && npm run typecheck && npm run format:check && npm test
```

**Accessibility gate (Phase 6):** Any component added or modified must be reviewed by the `a11y-reviewer` agent as part of Phase 6. This supplements the automated axe tests in the unit test suite. See `.claude/agents/a11y-reviewer.md` for the full checklist.
