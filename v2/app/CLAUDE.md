# app (Next.js App Router)

## Persistent Layouts Preserve State

Next.js App Router layouts (e.g., `MainLayout`) never unmount during navigation. `useState` does NOT reset when a dependency changes — state persists until explicitly cleared. When refactoring layout components, verify that navigation-related state cleanup (e.g., `useEffect` that clears state on route change) is preserved.
