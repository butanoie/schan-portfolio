When spawning sub-agents, use `isolation: "worktree"` for work that modifies the working tree in ways that could conflict with the parent session.

## Use worktree isolation when

- **Dependency upgrades** — `npm install` / lockfile changes corrupt the parent session's `node_modules` if run in the same tree
- **Major refactors** — widespread file renames or moves that would conflict if the parent agent also has files open
- **Architectural spikes** — exploratory branches where the agent may abandon or rewrite files; keeps the main tree clean
- **Parallel destructive agents** — any time two or more agents would write to overlapping files simultaneously

## Do not use worktree isolation for

- Read-only agents (code reviewers, `a11y-reviewer`, analysis tasks) — no writes, so isolation adds overhead with no benefit
- Single-file edits or small additive changes — coordination cost outweighs the protection
- Agents that only run shell commands against a build artifact (e.g., Playwright against `next start`)
