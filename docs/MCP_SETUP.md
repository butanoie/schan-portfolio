# MCP (Model Context Protocol) Setup Guide

This project uses MCP servers for enhanced functionality with Claude Code. Tokens and secrets are managed securely using environment variables.

## Setup Steps

### 1. Create your `.env` file

Copy the example file and fill in your actual values:

```bash
cp .env.example .env
```

### 2. Add your secrets to `.env`

Edit `.env` and add your actual tokens:

```env
GITHUB_TOKEN=gho_your_actual_token_here
DEEPL_API_KEY=your_deepl_key_here
```

### 3. Ensure `.env` is in `.gitignore`

✓ Already configured - `.env` is ignored by git

### 4. Restart Claude Code

Restart VSCode/Claude Code to reload the MCP configuration:

- Close Claude Code completely
- Reopen Claude Code
- The MCP launcher script will automatically load your `.env` file

## How It Works

- **`mcp-launcher.sh`** - Launcher script that loads `.env` and starts MCP servers
- **`.env`** - Your local secrets file (never committed)
- **`.env.example`** - Template for required variables (committed to git)
- **`.mcp.json`** - MCP server configuration (now uses launcher script)

## Available MCP Servers

1. **github** - GitHub API access
   - Requires: `GITHUB_TOKEN`
   - Access: Public and private repositories

2. **deepl** - Translation service
   - Requires: `DEEPL_API_KEY`
   - Function: Translate content automatically

3. **context7** - Documentation search
   - No secrets required
   - Function: Search library documentation

4. **filesystem** - File system access
   - No secrets required
   - Function: Read/write files

5. **sequential-thinking** - Reasoning enhancement
   - No secrets required
   - Function: Multi-step problem solving

## Getting Your Tokens

### GitHub Token
```bash
# If you have gh CLI authenticated (recommended):
gh auth token

# Or create one at: https://github.com/settings/tokens
# Required scopes: repo, workflow, gist
```

### DeepL API Key
Visit: https://www.deepl.com/pro/change-subscription

## Troubleshooting

### "⚠ Warning: .env file not found"

Run: `cp .env.example .env` and add your token values

### MCP server fails to start

1. Check that `.env` file exists
2. Ensure launcher script is executable: `chmod +x scripts/mcp-launcher.sh`
3. Verify token values in `.env` are correct
4. Restart Claude Code

### Variable substitution not working

The old approach with `${VARIABLE}` in `.mcp.json` doesn't work because JSON doesn't support variable expansion. This new setup uses a launcher script instead, which properly loads from `.env`.

## Security Notes

⚠️ **NEVER**:
- Commit `.env` file to git
- Share your tokens
- Paste tokens in code comments
- Include secrets in logs

✓ **DO**:
- Keep `.env` in `.gitignore`
- Regenerate tokens if exposed
- Use different tokens for different services
- Store only in `.env` file locally

## File Structure

```
project-root/
├── .env                    (local, gitignored - never commit)
├── .env.example           (template, committed to git)
├── .mcp.json              (MCP configuration)
├── scripts/
│   └── mcp-launcher.sh    (loads .env and starts servers)
└── MCP_SETUP.md          (this file)
```
