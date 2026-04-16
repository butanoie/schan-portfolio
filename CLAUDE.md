# Claude Code Guidelines for Portfolio Project

## Project Layout
```
v2/                  # Active app (v1/ is legacy, do not modify)
docs/                # Infrastructure & setup docs
changelog/           # Changelog entries
.claude/rules/       # Project policy (architecture, commit rules, doc gates, etc.) — auto-loaded into Claude context
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

(See `.claude/rules/commit-hook.md` for the "never commit without explicit approval" behavior norm and the interactive-approval hook.)

## Feature Development Workflow

### Documentation Gates

See `.claude/rules/doc-gates.md` for doc-gate task creation (Phase 1) and the Post-Architecture / Post-Review checklists.

### Quality Review — Parallel Agents

Launch four review agents in parallel during Phase 6. All must complete before closing the review phase. The three `code-reviewer` rows invoke the same agent with different task prompts passed as the focus description.

| Agent (focus) | Review scope |
|---------------|-------------|
| `code-reviewer` — simplicity | DRY, elegance, unnecessary complexity |
| `code-reviewer` — correctness | Bugs, edge cases, functional correctness |
| `code-reviewer` — conventions | Project abstractions, naming, file placement |
| `a11y-reviewer` | WCAG 2.2 Level AA — semantic HTML, ARIA, keyboard nav, contrast, motion |

The `a11y-reviewer` agent is defined at `.claude/agents/a11y-reviewer.md`. Pass it the list of changed component files. Any **Critical** finding blocks merge; **Warning** findings must be triaged (fix or file as tracked issue) before the doc gate proceeds. **Info** findings are advisory only.

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

## Agent Worktree Isolation

See `.claude/rules/worktree-isolation.md` for when to use `isolation: "worktree"` on sub-agents.

