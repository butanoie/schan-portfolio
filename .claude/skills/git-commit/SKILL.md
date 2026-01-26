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

### 2. Verify Documentation Requirements

**CRITICAL**: Before staging any code changes, verify that all code is properly documented:

**For all code changes, ensure:**
- All new functions have JSDoc/TSDoc comments explaining:
  - Purpose of the function
  - Parameters with types and descriptions
  - Return value with type and description
  - Any side effects or important behavior
- All new classes have documentation explaining their purpose and responsibility
- All new interfaces/types have comments explaining their purpose
- Complex logic has inline comments explaining the "why"
- Public APIs are fully documented

**Documentation Examples:**

TypeScript/JavaScript:
```typescript
/**
 * Calculates the total price including tax and discounts.
 *
 * @param basePrice - The initial price before any modifications
 * @param taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @param discountPercent - Optional discount percentage (0-100)
 * @returns The final price after tax and discounts
 */
function calculateTotal(basePrice: number, taxRate: number, discountPercent?: number): number {
  // Implementation
}
```

React Components:
```typescript
/**
 * A button component that displays a loading spinner while an async action is in progress.
 *
 * @param onClick - Async function to execute when clicked
 * @param children - Button label text
 * @param variant - Visual style variant (default: 'primary')
 */
export function AsyncButton({ onClick, children, variant = 'primary' }: AsyncButtonProps) {
  // Implementation
}
```

**If documentation is missing:**
- Stop the commit process
- Add the required documentation first
- Then proceed with the commit

### 3. Stage Files

**If $ARGUMENTS is provided** (e.g., `/git-commit README.md src/`):
```bash
git add $ARGUMENTS
```

**If $ARGUMENTS is empty** (e.g., `/git-commit`):
- Analyze the git status output from step 1
- Stage specific relevant files by name (prefer this approach)
- Example: `git add README.md docs/PLAN.md src/ .husky/`
- Avoid `git add .` or `git add -A` unless explicitly requested

### 4. Create Commit Message

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

### 5. Verify Success

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

- **All code MUST be documented before committing** - this is a strict requirement
- Never use `--amend` unless explicitly requested by the user
- Never use `--no-verify` to skip hooks
- Never force push or use destructive git commands
- Ask user for clarification if commit scope is unclear
- Keep commits focused and atomic when possible
- Documentation is not optional - treat missing documentation as a blocker
