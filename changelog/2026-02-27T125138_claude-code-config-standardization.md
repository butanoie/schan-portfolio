# Claude Code Config Standardization

**Date:** 2026-02-27
**Time:** 12:51:38 EST
**Type:** Configuration
**Branch:** sc/agent-update

## Summary

Migrated Claude Code configuration from legacy `.claude/` directory structure to the standard root-level `CLAUDE.md` convention. Consolidated custom agents and skills into plugin-based equivalents, standardized script naming, and cleaned up project references to the new config location.

---

## Changes Implemented

### 1. Claude Code Config Migration

Moved project instructions from `.claude/claude.md` to root `CLAUDE.md`, following the standard Claude Code convention. Removed custom agent and skill definitions that are now handled by plugins.

**Deleted:**
- `.claude/agents/code-reviewer/AGENT.md` — replaced by `feature-dev:code-reviewer` plugin agent
- `.claude/agents/git-commit/AGENT.md` — replaced by `commit-commands` plugin skill
- `.claude/agents/git-commit/system-prompt.md` — no longer needed
- `.claude/skills/changelog-create/SKILL.md` — replaced by `commit-commands:changelog-create` plugin skill
- `.claude/skills/code-review/SKILL.md` — replaced by plugin agent
- `.claude/skills/git-commit/SKILL.md` — replaced by `commit-commands:commit` plugin skill

**Created:**
- `CLAUDE.md` — root-level project instructions (migrated from `.claude/claude.md`)
- `.claude/settings.json` — plugin and permission configuration
- `changelog/CLAUDE.md` — extracted changelog format guide (previously embedded in skill)

**Modified:**
- `.mcp.json` — added `sequential-thinking` MCP server; changed deepl launcher to relative path
- `.gitignore` — added `.claude/` ignore patterns for local-only files

### 2. Script Naming Standardization

Renamed `type-check` script to `typecheck` across the codebase for consistency with common TypeScript tooling conventions.

**Modified:**
- `v2/package.json` — renamed script `type-check` → `typecheck`
- `v2/.husky/pre-commit` — updated hook to call `typecheck`
- `.github/workflows/test-deploy-dev.yml` — updated CI to call `typecheck`

### 3. Documentation Path Updates

Updated all references from `.claude/claude.md` to `CLAUDE.md` across documentation and changelog files (30+ files updated).

---

## Technical Details

### Plugin Configuration (`.claude/settings.json`)

Enabled the following plugins to replace custom agents/skills:
- `commit-commands` — git commit and branch management
- `explanatory-output-style` — educational output formatting
- `skill-creator` — skill creation tooling
- `frontend-design` — frontend design assistance

### MCP Server Changes

Added `sequential-thinking` server for structured reasoning:
```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

Changed deepl MCP launcher from absolute path to relative:
```json
"command": "./scripts/mcp-launcher.sh"
```

---

## Impact Assessment

- **Simpler project structure** — removes 6 custom agent/skill files (~600 lines) in favor of maintained plugins
- **Portable config** — relative paths and root-level `CLAUDE.md` work across machines
- **Consistent naming** — `typecheck` aligns with community conventions (`tsc`, `vue-tsc`, etc.)
- **No functional changes** — all capabilities preserved through plugin equivalents

## Related Files

**Created (3):**
- `CLAUDE.md`
- `.claude/settings.json`
- `changelog/CLAUDE.md`

**Deleted (6):**
- `.claude/agents/code-reviewer/AGENT.md`
- `.claude/agents/git-commit/AGENT.md`
- `.claude/agents/git-commit/system-prompt.md`
- `.claude/skills/changelog-create/SKILL.md`
- `.claude/skills/code-review/SKILL.md`
- `.claude/skills/git-commit/SKILL.md`

**Modified (45):**
- `.mcp.json`, `.gitignore`, `.github/pull_request_template.md`
- `v2/package.json`, `v2/.husky/pre-commit`, `v2/README.md`
- `.github/workflows/test-deploy-dev.yml`
- 30+ changelog and documentation files (path reference updates)
- `scripts/capture-linting-metrics.sh`, `scripts/changelog-create-haiku.sh`

## Summary Statistics

- **54 files changed** across 3 commits
- **189 insertions**, **876 deletions** (net -687 lines)
- **6 custom config files removed**, replaced by 1 plugin settings file

## Status

✅ COMPLETE
