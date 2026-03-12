---
name: quality-check
description: Run all quality gates (typecheck, lint, test, build)
disable-model-invocation: true
---

# Quality Check

Run all project quality gates from `v2/`. Report results as pass/fail for each step.

## Steps

Run these sequentially from the `v2/` directory. Continue through all steps even if one fails, then summarize results.

1. **TypeScript** — `npm run typecheck`
2. **ESLint** — `npm run lint`
3. **Prettier** — Check only changed files: `git diff --name-only --diff-filter=ACMR HEAD -- '*.ts' '*.tsx' '*.mjs' '*.json' '*.css' '*.md' | xargs -r npx prettier --check`. If no files changed, skip and report as ✅ (skipped).
4. **Tests** — `npm test`
5. **Build** — `npm run build`

## Output

Summarize as a table:

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript | ✅/❌ | error count if any |
| ESLint | ✅/❌ | error count if any |
| Prettier | ✅/❌ | files needing format |
| Tests | ✅/❌ | pass/fail counts |
| Build | ✅/❌ | error details if any |

If any check fails, suggest fixes.
