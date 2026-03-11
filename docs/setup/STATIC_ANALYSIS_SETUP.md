# Static Code Analysis Setup

This guide documents the project's static analysis tooling — ESLint, Prettier, Husky, and JSDoc enforcement — and how to extend or customize it.

## Current Setup

The v2 project uses the following static analysis tools:

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 9.x | Linting (flat config) |
| Prettier | 3.x | Code formatting |
| Husky | 9.x | Git hooks |
| lint-staged | 16.x | Run linters on staged files |
| eslint-plugin-jsdoc | 62.x | JSDoc documentation enforcement |
| eslint-plugin-jsx-a11y | 6.x | Accessibility linting (via eslint-config-next) |
| TypeScript | 5.x | Type checking (strict mode) |

### Available Scripts

Run all commands from `v2/`:

```bash
npm run lint          # ESLint check
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # TypeScript type check (tsc --noEmit)
npm run format        # Prettier auto-format
npm run format:check  # Prettier check (no changes)
npm test              # Vitest (run once)
```

## ESLint Configuration

**File:** `v2/eslint.config.mjs`

The project uses ESLint 9's flat config format with `defineConfig` from `eslint/config`.

```javascript
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";

const eslintConfig = defineConfig([
  // Global ignores — must be a standalone config object with only `ignores`
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...nextVitals,
  ...nextTs,
  {
    plugins: { jsdoc },
    settings: {
      jsdoc: {
        mode: "typescript",
        tagNamePreference: {
          returns: "returns",
          augments: "extends",
        },
      },
    },
    rules: {
      // Accessibility
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "error",

      // JSDoc enforcement (see rules breakdown below)
      "jsdoc/require-jsdoc": ["error", { /* ... */ }],
      // ... additional rules
    },
  },
]);

export default eslintConfig;
```

> **Note:** ESLint 9 flat config does **not** export `globalIgnores` from `eslint/config`. Global ignores are defined as a standalone config object containing only an `ignores` array — this must appear before other config entries so the ignored paths are excluded from all subsequent rules.

### JSDoc Rules

The following JSDoc rules are enforced at `"error"` level:

| Rule | Effect |
|------|--------|
| `jsdoc/require-jsdoc` | Requires JSDoc on functions, methods, classes, interfaces, types, enums |
| `jsdoc/require-description` | Requires a body description in every JSDoc block |
| `jsdoc/require-param` | Requires `@param` for each parameter |
| `jsdoc/require-param-description` | Requires description text for each `@param` |
| `jsdoc/require-returns` | Requires `@returns` tag |
| `jsdoc/require-returns-description` | Requires description text for `@returns` |
| `jsdoc/check-param-names` | Validates `@param` names match actual parameters |
| `jsdoc/check-tag-names` | Validates JSDoc tag names are recognized |

The following rules are set to `"warn"`:

| Rule | Effect |
|------|--------|
| `jsdoc/check-alignment` | Checks alignment of JSDoc block asterisks |
| `jsdoc/check-indentation` | Checks indentation within JSDoc blocks |
| `jsdoc/multiline-blocks` | Enforces multiline JSDoc formatting |
| `jsdoc/tag-lines` | Controls blank lines between tags |

TypeScript-redundant rules (`require-param-type`, `require-returns-type`, `check-types`, `no-undefined-types`, `valid-types`) are set to `"off"` since TypeScript already provides type information.

### Customizing Rules

To adjust JSDoc strictness (e.g., during gradual adoption):

**Warning mode** — change `"error"` to `"warn"` for JSDoc rules:
```javascript
"jsdoc/require-jsdoc": ["warn", { /* config */ }],
```

**Per-directory overrides** — enforce only in specific paths:
```javascript
{
  files: ["src/new-features/**/*.{ts,tsx}"],
  rules: {
    "jsdoc/require-jsdoc": "error",
  },
}
```

**Inline exemptions** — disable for specific code:
```typescript
// eslint-disable-next-line jsdoc/require-jsdoc
export const simpleConfig = () => ({});
```

## Pre-commit Hooks

**File:** `.husky/pre-commit`

The pre-commit hook runs lint-staged, which processes only staged files:

```sh
#!/bin/sh
cd v2 && npx lint-staged
```

**lint-staged config** (in `v2/package.json`):

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

This means every commit automatically:
1. Runs ESLint (including JSDoc rules) with auto-fix on staged JS/TS files
2. Runs Prettier formatting on staged files
3. Blocks the commit if ESLint errors remain after auto-fix

> **Note:** TypeScript type checking (`tsc --noEmit`) and tests are **not** run in the pre-commit hook — they run in CI instead. This keeps commits fast while CI catches type and test errors.

## CI/CD Integration

The CI workflow (`.github/workflows/test-deploy-dev.yml`) runs the full validation suite on push and PR:

```yaml
steps:
  - name: Type check
    run: cd v2 && npm run typecheck
  - name: Lint (including JSDoc)
    run: cd v2 && npm run lint
  - name: Format check
    run: cd v2 && npm run format:check
  - name: Build
    run: cd v2 && npm run build
```

## VSCode Integration

For real-time ESLint feedback, install the ESLint extension and add to `.vscode/settings.json`:

```json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "v2/node_modules/typescript/lib"
}
```

## Testing the Setup

To verify JSDoc enforcement is working:

1. Create a test file without documentation:
```typescript
// v2/src/test-doc.ts
export function addNumbers(a: number, b: number): number {
  return a + b;
}
```

2. Run ESLint:
```bash
cd v2 && npm run lint
```

3. Should see:
```
error  Missing JSDoc comment  jsdoc/require-jsdoc
```

4. Fix by adding documentation:
```typescript
/**
 * Adds two numbers together.
 *
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 */
export function addNumbers(a: number, b: number): number {
  return a + b;
}
```

5. Run ESLint again — should pass.

## Files

| File | Purpose |
|------|---------|
| `v2/eslint.config.mjs` | ESLint flat config with JSDoc rules |
| `v2/package.json` | Scripts and lint-staged config |
| `.husky/pre-commit` | Git pre-commit hook (runs lint-staged) |
| `CLAUDE.md` | Documentation standards and enforcement policy |
| `docs/guides/JSDOC_EXAMPLES.md` | JSDoc templates and examples |

## Related Documentation

- [JSDoc Examples](../guides/JSDOC_EXAMPLES.md) — Copy-paste JSDoc templates
- [Code Review Guidelines](../guides/CODE_REVIEW_GUIDELINES.md) — Review standards including doc checks
