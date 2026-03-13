# Claude Code Guidelines for Portfolio Project

## Project Layout
```
v2/                  # Active app (v1/ is legacy, do not modify)
docs/                # Infrastructure & setup docs
changelog/           # Changelog entries
```

## Documentation Requirements

**CRITICAL: All new code MUST include comprehensive JSDoc/TSDoc documentation.** See [JSDOC_EXAMPLES.md](docs/guides/JSDOC_EXAMPLES.md) for templates covering functions, components, interfaces, and classes.

### Enforcement

- **No exceptions**: All code must be documented before committing
- **Git commit blocks**: The git-commit skill will verify documentation exists
- **JSDoc review on modification**: When modifying any file, review and update existing JSDoc/TSDoc to match the current implementation. Treat stale JSDoc as a bug.
- **Missing documentation is a blocker**: Stop the current task, add docs, then proceed. Treat as equivalent to a compile error.

## Infrastructure & Setup Documentation

Infrastructure docs live in `docs/`. Key references:
- `docs/setup/MCP_SETUP.md` — MCP server configuration and tokens
- `docs/setup/RAILWAY_DEPLOYMENT.md` — Railway hosting and CI/CD
- `docs/setup/POSTHOG_SETUP.md` — PostHog analytics configuration
- `docs/setup/SENTRY_SETUP.md` — Sentry error tracking configuration
- `docs/setup/TESTING_SETUP.md` — Testing infrastructure
- `docs/guides/LOCALIZATION_ARCHITECTURE.md` — i18n architecture, patterns, and translation workflows
- `docs/guides/MAINTENANCE_WORKFLOW.md` — Operational maintenance procedures

When adding new infrastructure, create docs in the appropriate `docs/` subdirectory.
**CRITICAL: Never document actual tokens or secrets — only how to obtain them.**

## Commit Standards

- Write clear, descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable
- Keep commits atomic and focused

### Automatic Git Commits

**CRITICAL: Never commit unless the user explicitly asks** (e.g., "commit these changes", `/git-commit`, or explicit approval after being asked). Completing a task, running tests, or "proceed" does NOT grant commit permission. After finishing work, always ask "Would you like me to commit?" and wait for confirmation.

## Feature Development Workflow

### Documentation Gate Tasks — Required at Task Creation

**CRITICAL: When creating the initial task list (Phase 1), you MUST create two documentation gate tasks and set them as blockers.** Do NOT skip this.

**Required tasks:**

1. **"Doc gate: update docs before implementation"** — Create as a task. Set it as `blockedBy` the architecture task (Phase 4) and as `blocks` the implementation task (Phase 5). Description must include the Post-Architecture checklist below.
2. **"Doc gate: update docs before summary"** — Create as a task. Set it as `blockedBy` the quality review task (Phase 6) and as `blocks` the summary task (Phase 7). Description must include the Post-Review checklist below.

### Post-Architecture Documentation Gate

**CRITICAL: After Phase 4 (Architecture Design) is approved by the user, you MUST update documentation BEFORE proceeding to Phase 5 (Implementation).** Do NOT skip this step. Do NOT start writing code until docs are updated. Treat missing doc updates as a blocker, equivalent to a failing build.

**Checklist (review each item explicitly):**

- **Scenario docs** (`docs/test-scenarios/`) — Update with confirmed implementation decisions, refined scope, or amended Gherkin
- **Architecture docs** (`docs/guides/`) — Update specifications with confirmed details, refined selectors, or new technical constraints
- **Roadmaps** (`docs/active/`) — Reflect scope changes, new checklist items, or adjusted priorities
- **GitHub issues** — Post a comment syncing the latest decisions and technical notes
- **CLAUDE.md** — Add new conventions or standards that emerged from the discussion

### Post-Review Documentation Gate

**CRITICAL: After Phase 6 (Quality Review) issues have been fixed, you MUST update documentation BEFORE proceeding to Phase 7 (Summary).** Do NOT skip this step. Treat missing doc updates as a blocker, equivalent to a failing build.

**Checklist (complete both steps):**

1. **Update project docs** — sync architecture specs with implementation reality, check off completed roadmap items, and note any deferred work.
2. **Run `/claude-md-management:revise-claude-md`** — capture gotchas and conventions into directory-scoped CLAUDE.md files (e.g., `v2/e2e/CLAUDE.md`, `v2/src/components/CLAUDE.md`). Create new scoped CLAUDE.md files when a feature introduces a new directory with its own conventions. Only add to root CLAUDE.md if the learning applies project-wide.

## Changelog

Create a changelog entry for:
- **Phase Completions** - When a major phase of work is completed
- **Infrastructure Changes** - New tools, frameworks, or development setup
- **Feature Additions** - New functionality or components
- **Breaking Changes** - Changes that affect existing functionality
- **Configuration Updates** - Major changes to build, lint, or test configuration
- **Documentation Standards** - New standards or enforcement mechanisms

### Changelog Format

**Location:** `changelog/` directory at project root. Filename: `YYYY-MM-DDTHHMMSS_descriptive-name.md`

**Generate timestamp:** `date '+%Y-%m-%dT%H%M%S'`

See `changelog/CLAUDE.md` for required sections, template structure, and best practices.

### Changelog Enforcement

- **Significant changes require changelog**
- **Commit references** - Link changelog in commit message when applicable
- **Review requirement** - Verify changelog entry during code review

