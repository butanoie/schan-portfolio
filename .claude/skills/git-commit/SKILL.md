---
name: git-commit
description: Commit changes using a haiku sub-agent for efficient token usage
disable-model-invocation: false
allowed-tools: Task
argument-hint: [optional commit message guidance]
---

# Git Commit with Haiku Agent

Execute a complete git commit workflow using a haiku sub-agent for optimal token efficiency.

## How It Works

This skill launches a specialized haiku agent to handle the git commit process. The haiku model is perfect for structured tasks like git operations, reducing token usage by 60-70% compared to the main model.

## Workflow

The haiku agent will:

1. **Check Status & Review Changes**
   - Run `git status` to see all files (never use -uall flag)
   - Run `git diff --staged` and `git diff` to review changes
   - Run `git log --oneline -10` to understand commit message style

2. **Verify Documentation Requirements**
   - **CRITICAL**: All code changes must be properly documented
   - Functions need JSDoc/TSDoc with purpose, parameters, returns
   - Classes need documentation explaining responsibility
   - Interfaces/types need comments explaining purpose
   - Complex logic needs inline comments explaining "why"
   - If documentation is missing: STOP, add it, then commit

3. **Stage Files**
   - If $ARGUMENTS provided: stage those specific files
   - If empty: analyze changes and stage relevant files
   - Prefer specific file names over `git add .` or `git add -A`

4. **Create Commit Message**
   - Analyze changes and draft appropriate message
   - Follow repository's commit message style
   - Format: Brief subject (50 chars) + detailed body
   - Use imperative mood ("Add feature" not "Added feature")
   - Explain the "why" not just the "what"

5. **Commit & Verify**
   - Use heredoc for proper message formatting
   - Verify success with `git status`
   - Never skip hooks or use `--no-verify`

## Usage Examples

**Commit all changes:**
```
/git-commit
```

**Commit with guidance:**
```
/git-commit Fix authentication bug
```

**Commit specific files:**
```
/git-commit Add user profile feature
```

## Instructions

Launch a haiku agent to perform the git commit:

```
Use the Task tool with:
- subagent_type: "general-purpose"
- model: "haiku"
- description: "Create git commit"
- prompt: [Detailed workflow instructions]
```

The agent should receive these instructions:

---

**Git Commit Workflow Instructions for Agent:**

Please create a git commit following this workflow:

1. **Review Changes** - Run these in parallel:
   ```bash
   git status
   git diff --staged
   git diff
   git log --oneline -10
   ```

2. **Verify Documentation**
   - Check that all code changes have proper documentation
   - Functions must have JSDoc/TSDoc (purpose, params, returns)
   - Classes must document their responsibility
   - Interfaces/types must have comments
   - Complex logic must have inline comments
   - If missing documentation: STOP and report what needs documentation

3. **Stage Files**
   - If $ARGUMENTS provided: use those
   - Otherwise: stage specific relevant files by name
   - Avoid `git add .` or `git add -A` (prefer specific files)

4. **Create Commit Message**
   - Follow the repository's commit style from git log
   - Subject line: imperative mood, under 50 chars
   - Body: explain why changes were made, wrap at 72 chars
   - If $ARGUMENTS provided: incorporate as guidance

5. **Commit Using Heredoc**
   ```bash
   git commit -m "$(cat <<'EOF'
   Subject line here

   Detailed explanation here.
   EOF
   )"
   ```

6. **Verify Success**
   ```bash
   git log -1 --pretty=format:"%h %s%n%n%b"
   git status
   ```

**Important Rules:**
- Never push to remote unless explicitly requested
- Never use `--amend` unless explicitly requested
- Never skip hooks with `--no-verify`
- Never use force push or destructive git commands
- Documentation is mandatory - treat missing docs as a blocker
- Keep commits focused and atomic

---

## Token Efficiency

- **Traditional approach**: ~60K-100K tokens with main model
- **Haiku agent approach**: ~15K-30K tokens (60-70% reduction)
- **Best for**: Routine commits, standard workflows
- **Use main model when**: Complex merge conflicts, major refactors requiring deep context

## Notes

- The haiku agent has full access to your git repository
- All documentation requirements are enforced
- The agent follows the same quality standards as the old skill
- Failed pre-commit hooks are reported for you to fix
- Agent ID is returned if you need to resume work
