# src/data

## Resume Data (resume.ts)

- `t()` calls repeat `{ ns: 'pages' }` ~65 times — this is intentional. Dynamic key generation would break i18next static extraction.
- All jobs use `Role.contributions` (per-role bullets). `Job.description` and `Job.keyContributions` were removed — do not re-add them.
- `getLocalizedResumeData(t)` is memoized in `page.tsx` via `useMemo(() => ..., [t])` — this stabilizes downstream `useMemo` dependencies (e.g., `ClientList`'s bin-packing).
