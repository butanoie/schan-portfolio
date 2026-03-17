# SDLC Evolution: schan-portfolio (Jan 25 – Mar 16, 2026)

**50 days, ~523 commits, 50 changelogs, 50 merge commits across 8+ phases.**

---

## Foreword

This project started with a simple premise: *I need to update my portfolio.* My previous site — a 2013-era stack of Gumby Framework, jQuery, and PHP — had served its purpose, but it was a time capsule, not a reflection of where I am now. So I set out to rebuild it in a modern stack. That part was straightforward.

What wasn't straightforward was the question that surfaced almost immediately: *what if the portfolio itself could demonstrate everything I know?*

Not just the final product — the polished pages, the responsive layouts, the accessibility compliance — but the **process** behind it. The commit discipline. The CI/CD pipelines. The documentation gates. The testing strategy. The observability stack. The way you evolve a codebase from a messy first draft into something governed, repeatable, and self-enforcing.

A portfolio site is, by nature, a small project. Nobody needs documentation gates or staged deployments for a personal website. But that's precisely the point. The constraint of a small, well-understood domain gave me the freedom to focus on *how* I build, not just *what* I build. Every phase became an opportunity to demonstrate a different facet of software engineering: infrastructure-as-code thinking during deployment, shift-left testing during the E2E phase, process-as-code when CLAUDE.md became the project's machine-readable constitution.

This document traces that evolution — not as a prescriptive guide, but as an honest record of how a solo project's SDLC grew from "plan → build → commit → move on" into a documentation-gated, CI-enforced, AI-assisted development workflow. The eras below reflect genuine inflection points where the process leveled up, sometimes deliberately, sometimes because a mistake (like an overeager AI committing without permission) forced a new rule into existence.

If you're reading this as a hiring manager or fellow engineer: the site at [portfolio.singchan.com](https://portfolio.singchan.com) is the deliverable, but this document is the résumé.

---

## Era 1: "Just Ship It" (Jan 25–27) — Phases 1–2

The project started as a **v1-to-v2 modernization** of a legacy PHP/Gumby portfolio into Next.js 16 + TypeScript + MUI. The early process was minimal and fast:

- **No formal commit convention** — messages like `"Complete Phase 1"`, `"Add testing infrastructure"`, `"Update both README files"`
- **No changelogs** — the first changelog was written retroactively after Phase 1 was already done
- **No CI** — validation was local only (ESLint, Prettier, Husky pre-commit hooks)
- **No code review** — work went straight to `main` or was self-merged
- **Documentation was aspirational** — a MODERNIZATION_PLAN.md existed from day one, but it was a roadmap, not a process gate

Phase 1 (foundation) and Phase 2 (data migration) were completed in **2 days**. The SDLC was essentially: plan → build → commit → move on.

---

## Era 2: "Add Process Tooling" (Jan 28 – Feb 2) — Phase 3

As the project moved into page development (colophon, resume, projects), process tooling started appearing:

- **Custom Claude Code skills** were created for git commits and changelog creation — the first attempt at standardizing workflow through AI tooling
- **Haiku sub-agents** (Jan 29) were introduced to reduce token cost by 60–70% for routine tasks like commits and changelogs. This was the first sign of **optimizing the AI-assisted development process itself**
- **Changelogs became mandatory** — entries started appearing for each significant piece of work
- **Branching and PRs** emerged — PR #3 (colophon), #4 (resume), #5 (projects), #6 (phase 3.4) show feature branches being merged via pull requests
- **Duplicate commits appear** — many commits show up twice (once on the feature branch, once on main), indicating a rebase-or-merge workflow was being figured out

The SDLC evolved to: plan → branch → build → changelog → PR → merge.

---

## Era 3: "Quality Gates & Standards" (Feb 2–12) — Phases 4–5

This era marked a shift from "build features" to "build features correctly":

- **Code review agents** were introduced — a dedicated `.claude/agents/code-reviewer/` appeared, later replaced by plugin-based `feature-dev:code-reviewer`
- **Linting compliance sweep** — 199 linting issues were resolved in one pass; code quality standards were documented
- **Security hardening** — XSS prevention, input validation, ROT13 contact obfuscation
- **Code review remediation plan** — a formal 4-phase plan was created to address review findings (security → performance → magic numbers → polish)
- **FOUC fix, print styling, i18n** — quality-of-life features got their own branches and PRs
- **Conventional commits** started appearing — `feat:`, `fix:`, `refactor:`, `docs:` prefixes became standard

The SDLC became: plan → branch → build → lint/typecheck → code review → remediate → changelog → PR → merge.

---

## Era 4: "Config Standardization & Plugin Migration" (Feb 27) — Inflection Point

A significant **process refactoring** happened in late February:

- **Custom agents/skills deleted** — `.claude/agents/code-reviewer/`, `.claude/agents/git-commit/`, `.claude/skills/changelog-create/`, `.claude/skills/git-commit/` were all removed
- **Replaced by plugins** — `feature-dev:code-reviewer`, `commit-commands:commit`, `commit-commands:changelog-create` took over
- **Root `CLAUDE.md` created** — project instructions moved from `.claude/claude.md` to the standard location, establishing the project's "constitution"
- **`CLAUDE.md` became the governance document** — documentation gates, commit standards, changelog enforcement, and the feature development workflow were all codified here

This was the moment the project went from "process via convention" to **"process via code"** — the SDLC rules were now machine-readable and enforced by the AI tooling itself.

---

## Era 5: "Documentation Gates & Formal Workflow" (Mar 1–8) — Phases 5–7

The CLAUDE.md was iterated on heavily, adding:

- **Two mandatory documentation gates** in every feature workflow:
  1. Post-Architecture gate (before implementation)
  2. Post-Review gate (before summary)
- **"Never commit unless explicitly asked"** rule — added after the AI was too eager to commit
- **Feature development became a 7-phase process**: Requirements → Codebase Analysis → Scenario Docs → Architecture Design → **Doc Gate** → Implementation → **Doc Gate** → Quality Review → Summary
- **Feedback memories** were saved — "wait for review agents to finish", "always check CLAUDE.md workflow gates", "run E2E tests as quality gate", "no version numbers in changelogs"
- **CI pipelines matured** — GitHub Actions for lint, unit tests, staging deploys, production deploys with staging gates, rollback support
- **Issue numbers on every PR** — commits started referencing `(#106)`, `(#107)`, etc.

The SDLC became: issue → branch → plan → architecture → **doc gate** → implement → lint/typecheck/test → code review → **doc gate** → changelog → PR → CI → staging → production.

---

## Era 6: "Testing as a First-Class Citizen" (Mar 12–13) — Phase 8

This era introduced comprehensive testing infrastructure:

- **Playwright E2E** with Page Object Model scaffolding
- **Gherkin test scenarios** written before tests (11 scenario files)
- **13-phase testing roadmap** documented
- **76+ E2E tests** across accessibility, navigation, settings, responsive layout, and content pages
- **Pre-commit formatting enforcement** via lint-staged + Prettier
- **Test redundancy audit** — pruned redundant unit tests after E2E covered the same ground
- **CI integration** — Playwright E2E runs in the GitHub Actions pipeline

---

## Era 7: "Continuous Refinement" (Mar 13–14)

The current state shows a mature, iterative process:

- **Scoped CLAUDE.md files** — `v2/e2e/CLAUDE.md`, `v2/src/components/CLAUDE.md` for directory-specific conventions
- **`/claude-md-management:revise-claude-md`** skill runs at phase boundaries to capture learnings
- **Specialized review agents** — code-reviewer, code-simplifier, a11y-reviewer all run as part of the quality process
- **Dependabot + automated dependency PRs** — chore commits for bumping dependencies
- **Observability stack** — PostHog analytics, Sentry error tracking, Core Web Vitals, Better Stack uptime

---

## Era 8: "Autonomous Enforcement & Parallel Workflows" (Mar 16) — Current

This era introduced the project's first **deterministic process gate** and formalized parallel agent workflows:

- **Commit and issue permission gates** — `permissions.ask` rules in `.claude/settings.json` force an interactive approval prompt before any `git commit` or `gh issue close` command. The Era 5 rule "never commit unless asked" is now structurally enforced via the platform's native permission system rather than relying on CLAUDE.md instructions
- **Four parallel review agents** — Phase 6 (Quality Review) formalized in CLAUDE.md as a mandatory four-agent parallel pipeline: three `code-reviewer` instances (simplicity, correctness, conventions) plus `a11y-reviewer` (WCAG 2.2 Level AA). Critical a11y findings block merge
- **Worktree isolation guidelines** — CLAUDE.md documents when sub-agents should use `isolation: "worktree"` (dependency upgrades, major refactors, architectural spikes) vs. when to skip it (read-only agents, small edits)
- **`.claude/rules/` migration** — project knowledge moved from personal memory (`~/.claude/projects/.../memory/`) to committed `.claude/rules/*.md` files, making workflow conventions portable across collaborators

See [ERA8_ROADMAP.md](active/ERA8_ROADMAP.md) for implementation details and deferred capabilities (additional hooks, agent teams, monitoring, DX improvements).

The SDLC became: issue → branch → plan → architecture → **doc gate** → implement → **commit permission gate** → lint/typecheck/test (husky) → **parallel review (4 agents)** → **doc gate** → changelog → PR → CI → staging → production.

---

## Summary: The Arc

| Aspect | Early (Jan 25) | Era 7 (Mar 14) | Era 8 (Mar 16) |
|--------|----------------|-----------------|----------------|
| Commits | Free-form messages | Conventional commits with issue refs | Permission-gated commits + issue closes |
| Branching | Direct to main | Feature branches → PR → CI → merge | + worktree isolation guidelines |
| Code review | None | Plugin-based AI agents + human review | 4 parallel review agents (3 code + a11y) |
| Testing | Local lint only | Unit + Integration + E2E (Playwright) + a11y | *(unchanged — mature)* |
| CI/CD | None | GitHub Actions: lint, test, E2E, staging gate, prod deploy | *(unchanged — mature)* |
| Documentation | Aspirational plan | Enforced gates with checklists | + a11y triage step in Post-Review gate |
| Changelogs | Retroactive | Mandatory per significant change | *(unchanged — mature)* |
| Process governance | Informal | Codified in CLAUDE.md, machine-enforced | First structural permission gate |
| AI tooling | Basic Claude Code | Plugins, specialized agents, skills, memory, hooks | Permission gates, parallel agents, portable rules |
| Deploys | Manual | Automated staging → gated production with rollback | *(unchanged — mature)* |

The project's SDLC evolved from a solo developer's "plan and build" sprint into a **documentation-gated, CI-enforced, AI-assisted development workflow** — all within 50 days. The most distinctive characteristic is that the process itself is version-controlled and AI-readable: CLAUDE.md serves as both human documentation and machine instruction, making the SDLC self-enforcing.

Era 8 crossed a threshold: **the first rule that cannot be forgotten**. Where Era 5 said "never commit unless asked" and relied on the AI's compliance, Era 8 made it a `permissions.ask` gate — the platform's native permission system forces an interactive approval prompt before the command executes. Where Era 7 ran review agents one at a time as convention, Era 8 formalized four parallel agents as the standard quality review pipeline. The process is no longer just self-documenting; it is beginning to self-enforce.
