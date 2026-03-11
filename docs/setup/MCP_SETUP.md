# MCP (Model Context Protocol) Setup Guide

This project uses MCP servers for enhanced functionality with Claude Code. Servers are configured at two levels: **project-level** (shared via the repo) and **user-level** (Claude Code plugins, per-developer).

## Architecture

```
MCP Servers
├── Project-level (.mcp.json) — shared via git
│   ├── filesystem         (npx, no secrets)
│   ├── sequential-thinking (npx, no secrets)
│   └── deepl              (launcher script, requires DEEPL_API_KEY)
│
└── User-level (Claude Code plugins) — per-developer, not in repo
    ├── context7           (documentation search)
    ├── playwright         (browser automation)
    ├── posthog            (analytics queries)
    └── github             (GitHub API — disabled by default)
```

## Project-Level Servers (`.mcp.json`)

These servers are configured in `.mcp.json` at the project root and are available to all developers who clone the repo.

### filesystem

Provides file system read/write access to Claude Code.

- **Config:** `npx -y @modelcontextprotocol/server-filesystem`
- **Secrets:** None

### sequential-thinking

Enables multi-step reasoning for complex problem solving.

- **Config:** `npx -y @modelcontextprotocol/server-sequential-thinking`
- **Secrets:** None

### deepl

Translation service used for i18n workflows (see [Translation Workflow](../guides/TRANSLATION_WORKFLOW.md)).

- **Config:** Uses `./scripts/mcp-launcher.sh deepl` to load environment variables before starting the server
- **Secrets:** `DEEPL_API_KEY` (in `.env`)

## User-Level Servers (Claude Code Plugins)

These servers are managed through Claude Code's plugin system. They are configured per-user in `~/.claude/settings.json` under `enabledPlugins` and are **not** part of the project repository.

To install or manage plugins:
1. Open Claude Code
2. Use `/plugins` or the plugin marketplace to browse available plugins
3. Enable/disable plugins as needed

Recommended plugins for this project:

| Plugin | Purpose | Used For |
|--------|---------|----------|
| `context7` | Library documentation search | Looking up Next.js, MUI, React docs |
| `playwright` | Browser automation & testing | Visual testing, screenshots |
| `posthog` | PostHog analytics queries | Querying analytics data, managing dashboards |
| `github` | GitHub API access | PR management, issue tracking (optional) |

> **Note:** The `github` plugin is separate from the `GITHUB_TOKEN` environment variable. Claude Code can also access GitHub via the `gh` CLI if authenticated (see [Git Auth memory note](#troubleshooting)).

## Setup Steps

### Step 1: Create your `.env` file

```bash
cp .env.example .env
```

### Step 2: Add your secrets to `.env`

Edit `.env` and add your actual values:

```env
# DeepL API Key for translation service (required for deepl MCP server)
DEEPL_API_KEY=your_deepl_key_here
```

### Step 3: Verify `.env` is gitignored

Already configured — `.env` is in `.gitignore`.

### Step 4: Restart Claude Code

Restart Claude Code to reload MCP configuration:
1. Close Claude Code completely
2. Reopen Claude Code
3. The MCP servers defined in `.mcp.json` will start automatically

## How the Launcher Script Works

**File:** `scripts/mcp-launcher.sh`

The launcher script is used for MCP servers that require environment variables (currently only DeepL). It:

1. Finds the project root directory
2. Loads variables from `.env` using `set -a` / `source`
3. Validates the required variable is set (e.g., `DEEPL_API_KEY`)
4. Starts the requested server via `npx`

Servers that don't need secrets (filesystem, sequential-thinking) use `npx` directly in `.mcp.json` without the launcher.

## Getting Your Tokens

### DeepL API Key

1. Visit [DeepL API](https://www.deepl.com/pro#developer) and sign up for a free or pro plan
2. Go to your [account settings](https://www.deepl.com/account/summary) to find your API key
3. The free tier provides 500,000 characters/month

### GitHub Token (for `gh` CLI)

If using the `gh` CLI for GitHub operations:

```bash
# Authenticate via browser (recommended):
gh auth login

# Or check existing token:
gh auth token
```

> **Note:** `GITHUB_TOKEN` in `.env` is checked by the launcher script for a `github` MCP server case, but `.mcp.json` does not currently define a github server entry — GitHub access is handled via the `gh` CLI or the Claude Code GitHub plugin instead.

## Troubleshooting

### "Warning: .env file not found"

The launcher script could not find `.env`. Run:
```bash
cp .env.example .env
```
Then add your token values.

### MCP server fails to start

1. Check that `.env` file exists at the project root
2. Ensure the launcher script is executable: `chmod +x scripts/mcp-launcher.sh`
3. Verify token values in `.env` are correct
4. Restart Claude Code

### DeepL translation not working

1. Verify `DEEPL_API_KEY` is set in `.env`
2. Check your DeepL API quota at [deepl.com/account](https://www.deepl.com/account/summary)
3. Test the key: `curl -H "Authorization: DeepL-Auth-Key YOUR_KEY" https://api-free.deepl.com/v2/usage`

### `gh` CLI authentication issues

The `GITHUB_TOKEN` environment variable can conflict with `gh` CLI authentication in Claude Code sessions. If you encounter auth errors:

```bash
unset GITHUB_TOKEN
```

This allows `gh` to fall back to keyring-based authentication.

## Security Notes

**NEVER:**
- Commit `.env` file to git
- Share your API keys or tokens
- Paste tokens in code comments or documentation
- Include secrets in logs or error messages

**DO:**
- Keep `.env` in `.gitignore` (already configured)
- Regenerate tokens immediately if exposed
- Use the free tiers where available (DeepL free: 500K chars/month)

## Files

| File | Purpose |
|------|---------|
| `.mcp.json` | Project-level MCP server configuration |
| `.env` | Local secrets file (gitignored, never committed) |
| `.env.example` | Template showing required variables |
| `scripts/mcp-launcher.sh` | Loads `.env` and starts secret-dependent MCP servers |

## Related Documentation

- [Translation Workflow](../guides/TRANSLATION_WORKFLOW.md) — How DeepL MCP is used for i18n
- [Localization](../guides/LOCALIZATION.md) — i18n quick reference
