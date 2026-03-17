# Era 8: Autonomous Enforcement & Parallel Workflows

**Status:** In progress
**Started:** 2026-03-16
**Theme:** Turn advisory rules into deterministic gates; turn sequential work into parallel pipelines.

---

## Completed

### Tier 1: Commit & Issue Permission Gates

The Era 5 rule "never commit unless explicitly asked" was the project's most important behavioral constraint, but it existed only as a CLAUDE.md instruction and a feedback memory. A sufficiently long conversation or a context compaction could lose it.

**Implementation:**
- `permissions.ask` rules in `.claude/settings.json` force an interactive user approval prompt:
  - `Bash(git commit:*)` — every commit requires explicit user approval
  - `Bash(gh issue close:*)` — issues must be closed by PRs, not directly
- Husky pre-commit hook (`lint-staged && typecheck && test`) handles quality gate after approval
- Corresponding `Bash(git commit:*)` and `Bash(gh issue:*)` removed from `settings.local.json` allow list so project-level `ask` rules take precedence

**Design decisions:**
- `permissions.ask` over custom PreToolUse hooks — uses the platform's native permission UX (interactive "Allow? [y/n]" prompt), zero custom code, zero token cost
- Initially prototyped as Python hook scripts (exit code 2 = hard block), but hard blocks have no bypass mechanism — the user could never approve even when they explicitly asked to commit
- Husky handles the quality gate at commit time, so no separate quality-gate hook was needed

### Tier 2a: Parallel Review Agents

Phase 6 (Quality Review) formalized as a four-agent parallel pipeline in CLAUDE.md:

| Agent (focus) | Review scope |
|---------------|-------------|
| `code-reviewer` — simplicity | DRY, elegance, unnecessary complexity |
| `code-reviewer` — correctness | Bugs, edge cases, functional correctness |
| `code-reviewer` — conventions | Project abstractions, naming, file placement |
| `a11y-reviewer` | WCAG 2.2 Level AA — semantic HTML, ARIA, keyboard nav, contrast, motion |

- Three `code-reviewer` rows invoke the same agent with different task prompts
- `a11y-reviewer` promoted from ad-hoc to mandatory; Critical findings block merge
- Post-Review Documentation Gate checklist now includes a11y triage step

### Tier 2b: Worktree Isolation Guidelines

Documented in CLAUDE.md when to use `isolation: "worktree"` for sub-agents:
- **Use for:** dependency upgrades, major refactors, architectural spikes, parallel destructive agents
- **Skip for:** read-only agents, single-file edits, agents running against build artifacts

### Tier 2c: Rules Migration

Migrated project knowledge from personal memory (`~/.claude/projects/.../memory/`) to `.claude/rules/` (committed to git, auto-loaded for all collaborators):
- `commit-hook.md` — hook behavior and usage
- `doc-gates.md` — inject doc-gate blocker tasks into feature-dev Phase 1
- `e2e-quality-gate.md` — include E2E tests in quality gate
- `changelog-conventions.md` — version field convention
- `wait-for-review.md` — wait for review agents before offering to commit
- `architecture-decisions.md` — key technical decisions with rationale
- `design-system.md` — Buta mascot and color palette context

---

## Deferred — Additional Hooks

### E2E Gate on Push
- **Hook type:** `PreToolUse`, matcher: `Bash` (matching `git push`)
- **Action:** Run `npm run build && npm run test:e2e` before code leaves the local machine
- **Rationale:** Catches integration failures before CI; shifts E2E gate further left
- **Blocker:** Adds significant latency (~60s build + test) to every push. Consider only for production branch pushes.

### Conventional Commit Validation
- **Hook type:** `PostToolUse`, matcher: `Bash` (after `git commit` succeeds)
- **Action:** Inspect the last commit message for `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `ci:` prefix and optional issue reference
- **Rationale:** Safety net for commits that bypass the `/commit` skill
- **Priority:** Low — the `/commit` skill already generates conforming messages

### Auto-Format on Edit
- **Hook type:** `PostToolUse`, matcher: `Edit|Write`
- **Action:** Run Prettier on the edited file
- **Decision:** Deferred — lint-staged already auto-formats at commit time. Per-edit hook adds latency for marginal benefit.

### Task Completion Quality Gate
- **Hook type:** `TaskCompleted`
- **Action:** Auto-trigger quality gate when any task is marked done
- **Rationale:** Replaces the convention of remembering to run the gate at phase boundaries

---

## Deferred — Parallel Workflows

### Agent Teams for Large Features
- Spawn teammates for parallel work across layers (component + API + tests + docs)
- Teammates share a task list and message each other directly
- Evolution of the 7-phase workflow — implementation and review could run concurrently across layers
- **Blocker:** Experimental feature, requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env var

### `/batch` for Cross-Cutting Changes
- Spawn 5–30 parallel worktree agents for sweeping file modifications
- Use cases: rename constants, update all JSDoc, migrate import paths
- The Era 3 "199 linting issues" sweep would have been a candidate

---

## Deferred — Continuous Monitoring

### Post-Deploy Health Checks (`/loop`)
- After production deploy: `loop 5m "check Sentry for new errors and PostHog for anomalous traffic"`
- Uses existing MCP servers (Sentry, PostHog)
- Run for configurable window (e.g., 30 minutes)

### Recurring Maintenance (`CronCreate`)
- Weekly dependency audits
- Lighthouse score checks
- Stale-branch cleanup

---

## Deferred — Developer Experience

### Context7 for Live Documentation
- Query `mcp__context7__query-docs` for current MUI/Next.js/Playwright API docs
- Reduces hallucination risk for framework API changes across major versions

### Plan Mode for Architecture Phases
- Use `--permission-mode plan` during Phase 4 (Architecture Design)
- Guarantees read-only exploration — AI reads files and asks questions but cannot edit or execute

### Adaptive Reasoning Effort
- `effortLevel: "high"` for architecture design and code review phases
- `effortLevel: "low"` for routine operations (commits, changelogs)
- Optimizes token cost without sacrificing quality where it matters

### Session Resume from PR
- `claude --from-pr 123` resumes context for long-running feature branches
- Eliminates the "where were we?" problem across review cycles

---

## Files Changed by Era 8

| File | Action | Description |
|------|--------|-------------|
| `.claude/settings.json` | Modified | Added `permissions.ask` rules for commit and issue close |
| `.claude/rules/commit-hook.md` | Created | Permission gate documentation |
| `.claude/rules/doc-gates.md` | Created | Doc-gate task injection rule |
| `.claude/rules/e2e-quality-gate.md` | Created | E2E quality gate rule |
| `.claude/rules/changelog-conventions.md` | Created | Changelog version convention |
| `.claude/rules/wait-for-review.md` | Created | Review-before-commit rule |
| `.claude/rules/architecture-decisions.md` | Created | Architecture decision record |
| `.claude/rules/design-system.md` | Created | Mascot and color palette context |
| `CLAUDE.md` | Modified | Phase 6 agents, worktree isolation, a11y triage |
| `v2/CLAUDE.md` | Modified | a11y gate in Verification Gate |
| `docs/SDLC_EVOLUTION.md` | Modified | Era 8 section |
