---
name: add-project
description: Add a new portfolio project with data, images, and translations
disable-model-invocation: true
---

# Add Portfolio Project

Add a new project to the portfolio. Follows the maintenance workflow in `docs/guides/MAINTENANCE_WORKFLOW.md`.

## Required Input

Ask the user for:
1. Project ID (kebab-case, e.g., `my-new-project`)
2. Project title, description, circa date, and tags
3. Image files (location on disk to copy from)

## Steps

1. **Add project data** to `v2/src/data/projects.ts`
   - Follow the existing `Project` interface in `v2/src/types/project.ts`
   - Add to the projects array in chronological order

2. **Copy images** to `v2/public/images/gallery/{projectId}/`
   - Ensure thumbnail variants exist (`*_tn.jpg`)
   - Include @2x retina variants if available

3. **Add translations** for the project title and description
   - Add English keys to `v2/src/lib/i18n.ts`
   - Use DeepL MCP (`mcp__deepl__translate-text`) to generate French translations
   - Add French translations to the same file

4. **Run quality checks**
   - `cd v2 && npm run typecheck`
   - `cd v2 && npm run lint`
   - `cd v2 && npm test`

5. **Verify** by listing the project with `getProjectById('{projectId}')` in a test
