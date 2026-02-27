## Description
<!-- Briefly describe what this PR does -->

## Type of Change
<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Related Issues
<!-- Link to related issues using #issue-number -->
Fixes #
Related to #

---

## Pre-Submission Checklist

### Code Quality
- [ ] I have run `npm run lint` and resolved all linting errors
- [ ] I have run `npm run typecheck` and resolved all type errors
- [ ] I have run `npm test` and all tests pass
- [ ] No `any` types in my code (used proper type definitions instead)
- [ ] No unused variables or imports

### Documentation
- [ ] All new functions have JSDoc comments with @param, @returns, and description
- [ ] All React components document their props with proper types
- [ ] All interfaces/types include property descriptions
- [ ] Complex logic includes inline comments explaining the "why"
- [ ] Updated `.claude/CLAUDE.md` if adding new coding patterns

### React Best Practices (if applicable)
- [ ] No missing dependencies in useCallback/useMemo hooks
- [ ] No direct state mutations
- [ ] No hook violations (rules of hooks followed)
- [ ] Components are focused and follow Single Responsibility Principle

### Testing (if applicable)
- [ ] Tests added/updated for new functionality
- [ ] Edge cases and error conditions tested
- [ ] Test names clearly describe what is being tested
- [ ] All tests pass: `npm test`

---

## Review Notes
<!-- Any additional context for reviewers -->

## Verification
<!-- Help reviewers understand how to test your changes -->

**Steps to verify:**
1.
2.
3.

**Expected behavior:**

---

**Remember:** Automated checks (linting, type-checking, tests) will run on this PR. All must pass before merging.
