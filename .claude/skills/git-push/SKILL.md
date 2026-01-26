---
name: git-push
description: Push commits to remote repository with safety checks (branch verification, force-push warnings, success confirmation)
disable-model-invocation: false
allowed-tools: Bash(git*)
argument-hint: [remote branch or empty for current]
---

# Git Push Workflow

Safely push commits to the remote repository with proper verification and safety checks.

## Workflow Steps

Follow these steps in order:

### 1. Pre-Push Verification

Check current state before pushing:

```bash
git status
```

```bash
git rev-parse --abbrev-ref HEAD
```

```bash
git log origin/$(git rev-parse --abbrev-ref HEAD)..HEAD --oneline 2>/dev/null || echo "No upstream branch set"
```

This shows:
- Working directory status (should be clean)
- Current branch name
- Commits that will be pushed

### 2. Safety Checks

**Check for unpushed commits:**
- If no commits to push, inform user and stop
- If commits exist, show them to user for confirmation

**Branch Protection:**
- Identify current branch from step 1
- If pushing to `main` or `master` with force flag, WARN user and ask for explicit confirmation
- NEVER use `--force` or `--force-with-lease` unless explicitly requested

### 3. Determine Push Command

**If $ARGUMENTS is empty:**
```bash
git push
```

**If $ARGUMENTS contains a remote/branch (e.g., `/git-push origin main`):**
```bash
git push $ARGUMENTS
```

**If first-time push (no upstream):**
```bash
git push -u origin $(git rev-parse --abbrev-ref HEAD)
```

**Common scenarios:**
- `/git-push` → Push current branch to its upstream
- `/git-push origin main` → Push to origin/main
- `/git-push -u origin feature-branch` → Push and set upstream

### 4. Execute Push

Based on the scenario identified in step 3, execute the appropriate push command.

**Important:**
- NEVER add `--force` unless user explicitly includes it in $ARGUMENTS
- If `--force` detected in $ARGUMENTS and target is main/master, show warning first
- If no upstream branch exists, use `-u` flag to set it up

### 5. Verify Success

After pushing, verify:

```bash
git status
```

```bash
git log origin/$(git rev-parse --abbrev-ref HEAD)..HEAD --oneline
```

This confirms:
- Push was successful
- No remaining unpushed commits
- Branch is in sync with remote

## Example Usage

**Push current branch:**
```
/git-push
```

**Push to specific remote/branch:**
```
/git-push origin main
```

**Set upstream and push (first time):**
```
/git-push -u origin feature-branch
```

**Force push (after explicit user request):**
```
/git-push --force-with-lease
```

## Safety Rules

- ❌ NEVER force push to main/master without explicit user confirmation and warning
- ❌ NEVER use `--force` instead of `--force-with-lease` (unless explicitly requested)
- ❌ NEVER push if working directory has uncommitted changes (warn user)
- ✅ ALWAYS show what commits will be pushed before pushing
- ✅ ALWAYS verify push success after execution
- ✅ ALWAYS warn about destructive operations

## Warning Messages

**Force push to main/master:**
```
⚠️  WARNING: You are about to force push to main/master branch!
This can overwrite history and affect other developers.
Are you sure you want to proceed? (This requires explicit confirmation)
```

**Uncommitted changes:**
```
⚠️  WARNING: You have uncommitted changes.
Commit or stash them before pushing.
```

## Notes

- The skill will automatically detect if this is the first push and set upstream
- Use `--force-with-lease` over `--force` for safety when force pushing is necessary
- Always review commits before pushing to avoid pushing sensitive data
- If push fails (e.g., merge conflicts), provide helpful next steps
