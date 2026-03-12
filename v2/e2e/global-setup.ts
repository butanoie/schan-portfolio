/**
 * Playwright global setup — validates that a production build exists.
 *
 * Checks for `.next/BUILD_ID` before the test server starts. Without this,
 * missing-build failures surface as unhelpful "could not connect to server"
 * errors instead of the actionable "run `npm run build` first" message.
 *
 * Browser installation is handled separately via `npm run test:e2e:install`.
 * Playwright surfaces its own clear error if browsers are missing.
 */
import { existsSync } from 'fs';
import { resolve } from 'path';

export default function globalSetup(): void {
  const buildId = resolve(__dirname, '..', '.next', 'BUILD_ID');

  if (!existsSync(buildId)) {
    throw new Error(
      'Production build not found. Run `npm run build` before running E2E tests.\n' +
        `Expected: ${buildId}`
    );
  }
}
