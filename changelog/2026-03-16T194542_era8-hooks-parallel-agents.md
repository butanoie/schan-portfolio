# Era 8 — Autonomous Enforcement & Parallel Workflows

**Date:** 2026-03-16
**Time:** 19:45:42 EDT
**Type:** Infrastructure
**Version:** 2.x

## Summary

Implemented the first two tiers of Era 8: a deterministic commit-blocking hook that enforces the "never commit unless asked" rule via a `PreToolUse` gate, formalized four parallel review agents (3 code-reviewers + a11y-reviewer) as the standard Phase 6 quality review pipeline, added worktree isolation guidelines, migrated project knowledge from personal memory to portable `.claude/rules/` files, and created the Era 8 planning roadmap.

---

## Changes Implemented

### 1. Commit & Issue Permission Gates (Tier 1)

The Era 5 rule "never commit unless explicitly asked" was the project's most important behavioral constraint, but it existed only as a CLAUDE.md instruction and a feedback memory — advisory, not enforced. This is now a platform-enforced gate.

**Modified:**
- `.claude/settings.json` — Added `permissions.ask` rules for `Bash(git commit:*)` and `Bash(gh issue close:*)`. Forces an interactive user approval prompt before any commit or issue close. Uses Claude Code's native permission system — zero custom code, zero token cost.

### 2. Parallel Review Agents (Tier 2)

Phase 6 (Quality Review) was previously implicit — the feature-dev plugin launched 3 code-reviewer agents, but the a11y-reviewer was ad-hoc. Now all four agents are formalized in CLAUDE.md as a mandatory parallel pipeline.

**Modified:**
- `CLAUDE.md` — Added "Quality Review — Parallel Agents" subsection with agent table and severity triage rules. Added a11y triage step to Post-Review Documentation Gate checklist.
- `v2/CLAUDE.md` — Added accessibility gate callout in Verification Gate section.

### 3. Worktree Isolation Guidelines

**Modified:**
- `CLAUDE.md` — Added "Agent Worktree Isolation" section with concrete use/don't-use scenarios (dependency upgrades, major refactors, architectural spikes vs. read-only agents, small edits).

### 4. Rules Migration (Portability)

Migrated project knowledge from personal memory (`~/.claude/projects/.../memory/`) to `.claude/rules/` — committed to git, auto-loaded for all collaborators. No manual setup required when cloning.

**Created:**
- `.claude/rules/commit-hook.md` — Hook behavior and usage
- `.claude/rules/doc-gates.md` — Inject doc-gate blocker tasks into feature-dev Phase 1
- `.claude/rules/e2e-quality-gate.md` — Include E2E tests in quality gate
- `.claude/rules/changelog-conventions.md` — Version field convention (use "2.x")
- `.claude/rules/wait-for-review.md` — Wait for review agents before offering to commit
- `.claude/rules/architecture-decisions.md` — Key technical decisions with rationale
- `.claude/rules/design-system.md` — Buta mascot and color palette context

### 5. Era 8 Planning Document

**Created:**
- `docs/active/ERA8_ROADMAP.md` — Full planning roadmap with completed items, deferred capabilities grouped by category (hooks, parallel workflows, monitoring, DX), design decisions, and file manifest

### 6. SDLC Evolution Document

**Modified:**
- `docs/SDLC_EVOLUTION.md` — Condensed Era 8 section to match voice of Eras 1–7 (brief bullets, not implementation detail). Linked to ERA8_ROADMAP.md for full plan. Updated header and summary table.

---

## Technical Details

### Permission Gate Architecture

```
Claude issues: git commit -m "fix bug"
         │
         ▼
permissions.ask matches "Bash(git commit:*)"
         │
         ▼
Interactive prompt shown to user: "Allow? [y/n]"
         │
    ┌────┴────┐
    ▼         ▼
  Allow     Deny
    │         │
    ▼         ▼
  Husky    Command
  runs     blocked
```

Uses Claude Code's native `permissions.ask` system — no custom scripts, no token cost, built-in terminal UX. The `ask` rule in project `.claude/settings.json` overrides any `allow` rules in `settings.local.json` for the same pattern.

### Quality gate coverage

| Gate | Enforcement |
|------|-------------|
| Commit permission | `permissions.ask` in `.claude/settings.json` |
| Issue close permission | `permissions.ask` in `.claude/settings.json` |
| Lint + format + typecheck + test | `.husky/pre-commit` (lint-staged, tsc, vitest) |
| E2E tests | CI pipeline (`test-deploy-dev.yml`, e2e job) |
| Code review | 4 parallel agents (CLAUDE.md Phase 6) |
| Documentation | 2 doc gates with checklists (CLAUDE.md) |

---

## Impact Assessment

- **Process governance**: First structurally enforced permission gate — commits and issue closures require interactive user approval via the platform's native permission system
- **Review quality**: a11y-reviewer is now a mandatory part of every feature's quality review, not an ad-hoc afterthought
- **Portability**: `permissions.ask` rules live in project settings (committed to git) — any collaborator gets them automatically
- **Deferred work**: E2E push gate, conventional commit validation, auto-format, agent teams, /batch, monitoring loops, cron tasks, Context7, plan mode, adaptive reasoning documented in `docs/active/ERA8_ROADMAP.md`

---

## Related Files

**Created:**
- `.claude/rules/commit-hook.md`
- `.claude/rules/doc-gates.md`
- `.claude/rules/e2e-quality-gate.md`
- `.claude/rules/changelog-conventions.md`
- `.claude/rules/wait-for-review.md`
- `.claude/rules/architecture-decisions.md`
- `.claude/rules/design-system.md`
- `docs/active/ERA8_ROADMAP.md`
- `changelog/2026-03-16T194542_era8-hooks-parallel-agents.md`

**Modified:**
- `.claude/settings.json`
- `CLAUDE.md`
- `v2/CLAUDE.md`
- `docs/SDLC_EVOLUTION.md`

---

## Status

✅ COMPLETE — Tier 1 (permission gates), Tier 2 (parallel agents, worktree guidelines, rules migration), planning doc, and SDLC Evolution update all complete. Deferred tiers documented in `docs/active/ERA8_ROADMAP.md`.
