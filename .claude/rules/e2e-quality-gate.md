Include E2E tests (`npm run test:e2e`) in the quality gate alongside lint, typecheck, format, and unit tests.

Unit tests can pass while E2E accessibility axe scans catch real violations (e.g., contrast issues introduced by theme changes). The CLAUDE.md quality gate command only lists unit tests, but E2E tests catch integration-level issues that unit tests miss.

After `npm run lint && npm run typecheck && npm run format:check && npm test`, also run `npm run build && npm run test:e2e` before considering implementation complete. The build step is required before E2E tests can run.
