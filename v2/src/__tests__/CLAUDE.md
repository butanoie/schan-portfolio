# src/**tests**

## JSDoc in Tests

- **Inline test helpers need full JSDoc** — `jsdoc/require-jsdoc` applies to `const` arrow functions inside `it()` bodies, not just module exports. Do not downgrade JSDoc to `//` comments on these helpers.
- **Functions with return types need `@returns`** — `jsdoc/require-returns` fires on any function with an explicit return type annotation, including test helpers.
