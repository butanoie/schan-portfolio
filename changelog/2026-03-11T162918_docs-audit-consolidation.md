# Docs Audit — Consolidate, Prune, and Update Project Documentation

**Date:** 2026-03-11
**Time:** 16:29:18 PDT
**Type:** Documentation
**PR:** #125
**Version:** v2.x

## Summary

Comprehensive documentation audit that removed ~5,300 lines of stale, duplicated, or inaccurate docs while consolidating overlapping guides, fixing incorrect references across setup docs, and updating tooling configuration to match the current project state.

---

## Changes Implemented

### 1. CLAUDE.md Overhaul

Condensed the root `CLAUDE.md` from verbose inline examples to a streamlined quick-reference format. Moved detailed JSDoc/TSDoc code examples into `docs/guides/JSDOC_EXAMPLES.md`. Added quick reference section covering tech stack, commands, project structure, and key files.

### 2. Setup Documentation Fixes

Fixed inaccuracies across all setup docs to match current implementation:

- **RAILWAY_DEPLOYMENT.md** — Replaced incorrect `RAILWAY_STAGING_ENVIRONMENT_ID` with `RAILWAY_STAGING_DEPLOY_ENV_NAME`, documented GitHub Deployments API staging gate, added manual staging deployment section
- **POSTHOG_SETUP.md** — Corrected env var defaults (`/ingest` proxy), added reverse proxy section and `privacy.ts` to files table
- **STATIC_ANALYSIS_SETUP.md** — Removed entirely (mostly restated config files); useful JSDoc rules table merged into `JSDOC_EXAMPLES.md`
- **MCP_SETUP.md** — Separated project-level (`.mcp.json`) from user-level config (Claude Code plugins), corrected server list
- **TESTING_SETUP.md** — Updated test counts (1,199 tests / 65 files), documented `renderWithProviders` and `axe-helpers` utilities
- **SENTRY_SETUP.md** — Documented three-layer error boundary hierarchy

### 3. Guide Consolidation

- **i18n docs** — Merged `LOCALIZATION.md` and `TRANSLATION_WORKFLOW.md` into `LOCALIZATION_ARCHITECTURE.md`, eliminating heavy duplication while preserving unique content (DeepL workflow, translation tips, verification checklist)
- **Removed `THEME_SWITCHING.md`** — Contained multiple inaccuracies (wrong component names, nonexistent hooks) and duplicated JSDoc comments in source
- **Removed `CODE_REVIEW_GUIDELINES.md`** — Replaced by pr-review-toolkit agents and CLAUDE.md standards
- **Removed `CODE_QUALITY_DASHBOARD.md`** — Stale manual tracker superseded by CI and pre-commit hooks

### 4. Obsolete Content Removal

- **Haiku agent tooling** — Removed 3 docs and 3 scripts for custom haiku sub-agent workflows (git commits, changelog creation), replaced by built-in Claude Code skills and native Agent tool
- **`PROJECT_CONTEXT.md`** (664 lines) — ~70% redundant with CLAUDE.md; non-derivable content (phase history, architecture decisions, design rationale) migrated to Claude Code auto-memory
- **`MODERNIZATION_PLAN.md`** — Archived to `docs/archive/` (all 7 phases complete)
- **Obsolete scripts** — Removed `capture-linting-metrics.sh`, `mcp-launcher.sh`, `migrateImages.sh`, `translate-strings.ts`, and empty `scripts/` directory

### 5. Tooling & Configuration Updates

- **MCP config** — Migrated DeepL MCP to native `${VAR}` expansion in `.mcp.json`, removing `mcp-launcher.sh` wrapper. Removed filesystem and sequential-thinking servers, added Sentry server
- **Claude Code skills** — Added `translation-sync` (i18n gap detection + DeepL) and `changelog` (entry generator from git history)
- **a11y-reviewer agent** — Added WCAG 2.2 Level AA compliance checker
- **Prettier** — Fixed `singleQuote` setting to `true` to match codebase convention
- **Colophon** — Updated AI-Powered Development section to reflect current MCP servers (Sentry, PostHog, Playwright)

---

## Technical Details

### Net Line Impact

| Metric | Count |
|---|---|
| Lines added | ~1,073 |
| Lines removed | ~6,331 |
| Net reduction | ~5,258 |
| Files changed | 41 |
| Files deleted | 16 |
| Files created | 5 |

### Files Deleted

- `docs/active/PROJECT_CONTEXT.md`
- `docs/guides/CODE_QUALITY_DASHBOARD.md`
- `docs/guides/CODE_REVIEW_GUIDELINES.md`
- `docs/guides/LOCALIZATION.md`
- `docs/guides/THEME_SWITCHING.md`
- `docs/guides/TRANSLATION_WORKFLOW.md`
- `docs/setup/STATIC_ANALYSIS_SETUP.md`
- `docs/tooling/changelog-create-haiku-usage.md`
- `docs/tooling/git-commit-haiku-usage.md`
- `docs/tooling/haiku-agents-overview.md`
- `scripts/capture-linting-metrics.sh`
- `scripts/changelog-create-haiku.sh`
- `scripts/git-commit-haiku.sh`
- `scripts/mcp-launcher.sh`
- `scripts/migrateImages.sh`
- `scripts/translate-strings.ts`

### Files Created

- `.claude/agents/a11y-reviewer.md`
- `.claude/skills/add-project/SKILL.md`
- `.claude/skills/changelog/SKILL.md`
- `.claude/skills/quality-check/SKILL.md`
- `.claude/skills/translation-sync/SKILL.md`

---

## Impact Assessment

- **Reduced doc maintenance burden** — Eliminated ~5,300 lines of docs that were drifting from implementation reality
- **Single source of truth** — Consolidated 3 overlapping i18n docs into 1; removed guides that restated config files or were superseded by tooling
- **Accurate setup docs** — All setup guides now match current env vars, file paths, and tool configurations
- **Modern tooling** — Replaced custom shell scripts with native Claude Code skills and agents
- **Auto-memory migration** — Non-derivable project context preserved in Claude Code's persistent memory system rather than a sprawling doc

---

## Status

✅ COMPLETE
