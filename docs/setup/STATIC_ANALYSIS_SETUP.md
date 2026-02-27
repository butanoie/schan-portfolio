# Static Code Analysis Setup Guide

This guide covers setting up static code analyzers to enforce documentation requirements and code quality standards.

## Current Setup (v2)

The v2 project currently has:
- ✅ ESLint 9 with Next.js and TypeScript configs
- ✅ Prettier for code formatting
- ✅ Husky + lint-staged for pre-commit hooks
- ✅ TypeScript strict mode

## Adding JSDoc Documentation Enforcement

### Step 1: Install eslint-plugin-jsdoc

```bash
cd v2
npm install --save-dev eslint-plugin-jsdoc
```

### Step 2: Update ESLint Configuration

Update `v2/eslint.config.mjs`:

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      jsdoc,
    },
    rules: {
      // Enhanced accessibility rules for WCAG 2.2 Level AA compliance
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "error",

      // JSDoc documentation requirements
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSEnumDeclaration",
          ],
          // Exempt simple React components and config objects
          exemptEmptyFunctions: false,
          checkConstructors: true,
        },
      ],
      "jsdoc/require-description": [
        "error",
        {
          contexts: ["any"],
          descriptionStyle: "body",
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off", // TypeScript provides types
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off", // TypeScript provides types
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "off", // TypeScript handles this
      "jsdoc/no-undefined-types": "off", // TypeScript handles this
      "jsdoc/valid-types": "off", // TypeScript handles this
      "jsdoc/check-alignment": "warn",
      "jsdoc/check-indentation": "warn",
      "jsdoc/multiline-blocks": "warn",
      "jsdoc/tag-lines": ["warn", "any", { startLines: 1 }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

### Step 3: Configure JSDoc Settings (Optional but Recommended)

For even more control, add a `jsdoc` settings section:

```javascript
{
  settings: {
    jsdoc: {
      mode: "typescript",
      tagNamePreference: {
        returns: "returns",
        augments: "extends",
      },
      // Configure preferred tags
      preferredTypes: {
        object: "Object",
        "object.<>": "Object<>",
      },
    },
  },
}
```

### Step 4: Update package.json Scripts

Add a documentation check script to `v2/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:docs": "eslint . --rule 'jsdoc/require-jsdoc: error'",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "validate": "npm run typecheck && npm run lint && npm run format:check",
    "prepare": "husky"
  }
}
```

### Step 5: Gradual Adoption Strategy (Optional)

If you have existing code without documentation, you can adopt gradually:

#### Option A: Warning Mode First
Change `"error"` to `"warn"` for JSDoc rules initially:

```javascript
"jsdoc/require-jsdoc": ["warn", { /* config */ }],
```

Then upgrade to `"error"` once all code is documented.

#### Option B: Ignore Existing Files
Create `.eslintignore` to exclude existing files temporarily:

```
# Temporarily exclude until documented
app/legacy/**
```

#### Option C: Per-File Overrides
Use ESLint overrides to enforce documentation only in new directories:

```javascript
{
  files: ["app/new-features/**/*.{ts,tsx}"],
  rules: {
    "jsdoc/require-jsdoc": "error",
  },
}
```

## Additional Recommended Tools

### 1. TypeDoc (Documentation Generator)

Generates beautiful documentation websites from your JSDoc comments.

```bash
npm install --save-dev typedoc
```

Add to `package.json`:
```json
{
  "scripts": {
    "docs:generate": "typedoc --out docs-output src"
  }
}
```

### 2. TypeScript Strict Mode

Ensure `v2/tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 3. Additional ESLint Plugins

Consider these plugins for enhanced code quality:

```bash
# Enforce React best practices
npm install --save-dev eslint-plugin-react-hooks

# Enforce accessibility
# (Already included via eslint-plugin-jsx-a11y)

# Detect security vulnerabilities
npm install --save-dev eslint-plugin-security

# Enforce import order and organization
npm install --save-dev eslint-plugin-import
```

## CI/CD Integration

Add to your CI/CD pipeline (e.g., `.github/workflows/ci.yml`):

```yaml
name: CI
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd v2 && npm ci
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

Ensure VSCode ESLint extension is installed and add to `.vscode/settings.json`:

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

## Pre-commit Hook Verification

Your existing lint-staged configuration will automatically check documentation on commit. Verify it's working:

```bash
cd v2
# Make a change without documentation
echo "export function test() { return true; }" > app/test.ts
git add app/test.ts
git commit -m "Test commit"
# Should fail with JSDoc requirement error
```

## Testing the Setup

1. Create a test file without documentation:
```typescript
// app/test-doc.ts
export function addNumbers(a: number, b: number): number {
  return a + b;
}
```

2. Run ESLint:
```bash
cd v2
npm run lint
```

3. Should see error:
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

5. Run ESLint again:
```bash
npm run lint
```

Should pass without errors.

## Exempting Specific Code

If certain code shouldn't require documentation (e.g., simple config files), use inline comments:

```typescript
/* eslint-disable jsdoc/require-jsdoc */
export const config = {
  apiUrl: process.env.API_URL,
};
/* eslint-enable jsdoc/require-jsdoc */
```

Or for a single function:
```typescript
// eslint-disable-next-line jsdoc/require-jsdoc
export const simpleConfig = () => ({});
```

## Summary

With this setup, you'll have:
- ✅ Automatic documentation enforcement via ESLint
- ✅ Pre-commit hooks preventing undocumented code
- ✅ CI/CD integration to catch issues before merge
- ✅ IDE integration for real-time feedback
- ✅ Flexible configuration for gradual adoption

All code will be required to have proper JSDoc documentation before it can be committed, enforcing the standards defined in `.claude/claude.md`.
