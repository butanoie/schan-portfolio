Documentation gates (Post-Architecture and Post-Review) must be created as **blocker tasks** in the initial task list during Phase 1, not relied upon as passive CLAUDE.md instructions.

The feature-dev skill's active step-by-step prompt consistently wins the attention battle over passive background instructions. The only reliable enforcement is embedding the gates in the task list itself, where they surface as blockers at the right time.

## Task Creation (Phase 1)

When creating the Phase 1 task list for any feature-dev workflow, create two additional tasks:

1. **"Doc gate: update docs before implementation"** — `blockedBy` Phase 4, `blocks` Phase 5, description includes the Post-Architecture checklist below
2. **"Doc gate: update docs before summary"** — `blockedBy` Phase 6, `blocks` Phase 7, description includes the Post-Review checklist below

## Post-Architecture Documentation Gate

**CRITICAL: After Phase 4 (Architecture Design) is approved by the user, you MUST update documentation BEFORE proceeding to Phase 5 (Implementation).** Do NOT skip this step. Do NOT start writing code until docs are updated. Treat missing doc updates as a blocker, equivalent to a failing build.

**Checklist (review each item explicitly):**

- **Scenario docs** (`docs/test-scenarios/`) — Update with confirmed implementation decisions, refined scope, or amended Gherkin
- **Architecture docs** (`docs/guides/`) — Update specifications with confirmed details, refined selectors, or new technical constraints
- **Roadmaps** (`docs/active/`) — Reflect scope changes, new checklist items, or adjusted priorities
- **GitHub issues** — Post a comment syncing the latest decisions and technical notes
- **CLAUDE.md** — Add new conventions or standards that emerged from the discussion

## Post-Review Documentation Gate

**CRITICAL: After Phase 6 (Quality Review) issues have been fixed, you MUST update documentation BEFORE proceeding to Phase 7 (Summary).** Do NOT skip this step. Treat missing doc updates as a blocker, equivalent to a failing build.

**Checklist (complete all steps):**

1. **Confirm a11y triage** — all `a11y-reviewer` Critical findings are resolved; all Warning findings are fixed or filed as tracked issues.
2. **Update project docs** — sync architecture specs with implementation reality, check off completed roadmap items, and note any deferred work.
3. **Run `/claude-md-management:revise-claude-md`** — capture gotchas and conventions into directory-scoped CLAUDE.md files (e.g., `v2/e2e/CLAUDE.md`, `v2/src/components/CLAUDE.md`). Create new scoped CLAUDE.md files when a feature introduces a new directory with its own conventions. Only add to root CLAUDE.md if the learning applies project-wide.
