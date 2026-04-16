Commits and issue closures require explicit user approval via `permissions.ask` in `.claude/settings.json`.

- `Bash(git commit:*)` — forces an interactive approval prompt before any commit
- `Bash(gh issue close:*)` — forces an interactive approval prompt before closing any issue

Issues must be closed by pull requests using `closes #NNN` or `fixes #NNN` in the PR body, not by direct `gh issue close` commands.

When the user asks to commit, use `/commit` or run `git commit` via Bash — the permission prompt will appear and the user approves. The existing husky pre-commit hook (`lint-staged && typecheck && test`) runs after approval, so no separate quality gate is needed.

## Behavior Norm

**CRITICAL: Never commit unless the user explicitly asks** (e.g., "commit these changes", `/git-commit`, or explicit approval after being asked). Completing a task, running tests, or "proceed" does NOT grant commit permission. After finishing work, always ask "Would you like me to commit?" and wait for confirmation.
