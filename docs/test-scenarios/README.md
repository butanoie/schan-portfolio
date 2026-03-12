# Test Scenarios

Gherkin-syntax test scenarios for the v2 portfolio application. These are evergreen specifications — they describe *what* the tests verify, independent of the implementation roadmap.

For implementation status and checklists, see the [Testing Roadmap](../active/TESTING_ROADMAP.md).
For technical architecture, see the [Testing Architecture](../guides/TESTING_ARCHITECTURE.md).

## Integration Tests (Vitest)

| File | Feature | Test File |
|------|---------|-----------|
| [INT_LOCALIZATION_PIPELINE.md](INT_LOCALIZATION_PIPELINE.md) | JSON merge pipeline, cross-locale data | `localizationPipeline.test.ts` |
| [INT_SERVER_DATA_FETCHING.md](INT_SERVER_DATA_FETCHING.md) | fetchProjects server action, SSG simulation | `serverDataFetching.test.ts` |
| [INT_USE_PROJECT_LOADER.md](INT_USE_PROJECT_LOADER.md) | Hook lifecycle, locale switching, pagination | `useProjectLoaderIntegration.test.tsx` |
| [INT_ASYNC_PROJECTS_LIST.md](INT_ASYNC_PROJECTS_LIST.md) | Component rendering with real data layer | `asyncProjectsList.test.tsx` |

## E2E Tests (Playwright)

| File | Feature | Spec File |
|------|---------|-----------|
| [E2E_ACCESSIBILITY.md](E2E_ACCESSIBILITY.md) | WCAG 2.2 AA axe scans, keyboard navigation | `accessibility.spec.ts` |
| [E2E_NAVIGATION.md](E2E_NAVIGATION.md) | Route loading, aria-current, preference persistence | `navigation.spec.ts` |
| [E2E_SETTINGS.md](E2E_SETTINGS.md) | Theme, language, animations, popover | `settings.spec.ts` |
| [E2E_HOME_PAGE.md](E2E_HOME_PAGE.md) | Progressive loading, Load More, skeletons | `home.spec.ts` |
| [E2E_LIGHTBOX.md](E2E_LIGHTBOX.md) | Keyboard/button/touch navigation, ARIA | `lightbox.spec.ts` |
| [E2E_CONTENT_PAGES.md](E2E_CONTENT_PAGES.md) | Resume, Colophon, Samples content | `resume.spec.ts`, `colophon.spec.ts`, `samples.spec.ts` |
| [E2E_RESPONSIVE.md](E2E_RESPONSIVE.md) | Mobile hamburger, desktop nav, viewport layouts | `responsive.spec.ts` |
