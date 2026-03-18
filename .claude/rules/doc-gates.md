Documentation gates (Post-Architecture and Post-Review) must be created as **blocker tasks** in the initial task list during Phase 1, not relied upon as passive CLAUDE.md instructions.

The feature-dev skill's active step-by-step prompt consistently wins the attention battle over passive background instructions. The only reliable enforcement is embedding the gates in the task list itself, where they surface as blockers at the right time.

When creating the Phase 1 task list for any feature-dev workflow, create two additional tasks:
1. "Doc gate: update docs before implementation" — `blockedBy` Phase 4, `blocks` Phase 5, description includes the Post-Architecture checklist
2. "Doc gate: update docs before summary" — `blockedBy` Phase 6, `blocks` Phase 7, description includes the Post-Review checklist
