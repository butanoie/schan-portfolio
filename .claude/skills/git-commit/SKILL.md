---
name: git-commit
description: Commit staged or all changes with a clean workflow (status check, diff review, commit without Co-Authored-By, verification)
disable-model-invocation: false
allowed-tools: Bash(git*)
argument-hint: [file-paths or empty for all]
---

# Git Commit Workflow

Execute a complete git commit workflow without Co-Authored-By footers.

## Workflow Steps

Follow these steps in order:

### 1. Check Status & Review Changes

Run these commands in parallel to see what will be committed:

```bash
git status
```

```bash
git diff
```

```bash
git log --oneline -5
```

This shows:
- Current branch and untracked files (git status)
- Actual code changes (git diff)
- Recent commit messages for style reference (git log)

### 2. Stage Files

**If $ARGUMENTS is provided** (e.g., `/git-commit README.md src/`):
```bash
git add $ARGUMENTS
```

**If $ARGUMENTS is empty** (e.g., `/git-commit`):
- Analyze the git status output from step 1
- Stage specific relevant files by name (prefer this approach)
- Example: `git add README.md docs/PLAN.md src/ .husky/`
- Avoid `git add .` or `git add -A` unless explicitly requested

### 3. Create Commit Message

Based on the diff and changes, create a commit message following this format:

**Format:**
```
Brief descriptive subject line (50 chars max)

More detailed explanation of what changed and why.
Wrap body lines at 72 characters. Include relevant
context for future developers.
```

**Important Rules:**
- NEVER include `Co-Authored-By:` or any other trailers
- First line should be imperative mood (e.g., "Add feature" not "Added feature")
- Leave blank line between subject and body
- Body should explain the "why" not just the "what"

**Commit using heredoc:**
```bash
git commit -m "$(cat <<'EOF'
Your subject line here

Your detailed explanation here.
Multiple paragraphs are fine.
EOF
)"
```

### 4. Verify Success

After committing, verify:

```bash
git log -1 --pretty=format:"%h %s%n%n%b"
```

```bash
git status
```

This confirms:
- The commit was created successfully
- The commit message is formatted correctly
- Working tree is clean

## Example Usage

**Commit specific files:**
```
/git-commit README.md docs/plan.md
```

**Commit all changes:**
```
/git-commit
```

**With message guidance:**
```
/git-commit src/ -m "Add user authentication"
```

## Notes

- Never use `--amend` unless explicitly requested by the user
- Never use `--no-verify` to skip hooks
- Never force push or use destructive git commands
- Ask user for clarification if commit scope is unclear
- Keep commits focused and atomic when possible
