# Translation Workflow Guide

Quick reference for translating new strings in the portfolio's localization system.

**Refer to [LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md) for detailed architecture overview.**

## Architecture Overview

The portfolio uses **two localization patterns**:

1. **Direct i18n (Pages)** - For resume, colophon, portfolio pages
   - Uses `v2/src/locales/[lang]/[file].json` files
   - Translations pulled via `getLocalized*Data(t)` functions
   - Uses `{ ns: 'pages' }` namespace
   - Example: `v2/src/locales/en/resume.json`

2. **JSON Merge (Projects)** - For project collection
   - Uses `v2/src/locales/[lang]/projects.json`
   - Async loading with runtime merge
   - Example: `v2/src/locales/en/projects.json`

## Quick Start

### Step 1: Identify Which Pattern to Use

**Use Direct i18n if:**
- Adding text to resume, colophon, or home pages
- Content is page-level (not dynamic projects)
- Strings are in `v2/src/data/resume.ts`, `colophon.ts`, or `portfolio.ts`

**Use JSON Merge if:**
- Adding/updating a project
- Content is in the projects collection
- String is indexed or dynamic

### Step 2: Add English Text to JSON

#### For Pages (Direct i18n Pattern)

Edit the appropriate locale file in `v2/src/locales/en/`:

```json
// v2/src/locales/en/resume.json
{
  "resume": {
    "pageTitle": "Resume | Sing Chan's Portfolio",
    "pageDescription": "Sing Chan's resume - 25+ years experience in UX, product management, and software development.",
    "header": {
      "tagline": "Full-Stack Developer & Product Manager"
    }
  }
}
```

#### For Projects (JSON Merge Pattern)

Edit `v2/src/locales/en/projects.json`:

```json
{
  "projectId": {
    "title": "Project Name",
    "desc": "Project description...",
    "circa": "2023–Present",
    "captions": ["Screenshot description", "Another description"]
  }
}
```

### Step 3: Request DeepL Translation via Claude

**Ask Claude to translate your strings using DeepL MCP:**

```
I need to translate these strings to French for the portfolio site.

FILE: v2/src/locales/en/resume.json
SECTION: resume

STRINGS:
- "Resume | Sing Chan's Portfolio" (page title)
- "Sing Chan's resume - 25+ years experience in UX, product management, and software development." (page description)
- "Full-Stack Developer & Product Manager" (tagline)

Please translate using DeepL and provide the formatted JSON for v2/src/locales/fr/resume.json
```

Claude will use DeepL to produce French translations and format them as JSON ready to paste.

### Step 4: Add French Translations to Locale File

Claude will provide formatted JSON like:

```json
// v2/src/locales/fr/resume.json
{
  "resume": {
    "pageTitle": "CV | Portefeuille de Sing Chan",
    "pageDescription": "CV de Sing Chan - Plus de 25 ans d'expérience en UX, gestion de produits et développement de logiciels.",
    "header": {
      "tagline": "Développeur Full-Stack et Chef de Produit"
    }
  }
}
```

Paste this into the corresponding French locale file.

### Step 5: Update Data File to Use Translation (If New)

If you added a new translatable field, update the corresponding data file to use the translation function:

```typescript
// v2/src/data/resume.ts
export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  return {
    pageTitle: t('resume.pageTitle', { ns: 'pages' }),
    pageDescription: t('resume.pageDescription', { ns: 'pages' }),
    header: {
      tagline: t('resume.header.tagline', { ns: 'pages' }),
      // ...
    }
  };
}
```

### Step 6: Verify & Test

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm test

# Test in browser:
# - Switch locale to French via language selector
# - Verify translated text displays correctly
```

## Batch Translation Example

When translating multiple strings at once, group them by context:

```
I need to translate these strings to French for the portfolio site.

FILE: v2/src/locales/en/colophon.json
SECTION: colophon

STRINGS:
- "Colophon | Sing Chan's Portfolio" (page title)
- "About Sing Chan, the technologies behind this portfolio site, design philosophy, and the story of Buta the mascot." (description)
- "Design Philosophy" (section heading)
- "The Design System" (subsection)

Please translate using DeepL and provide formatted JSON for v2/src/locales/fr/colophon.json
```

Claude will:
1. Translate all strings using DeepL MCP
2. Return formatted JSON ready to paste
3. Maintain nested structure from English file

## Naming Convention

Translation keys in locale files use **dot notation with logical hierarchy**:

```json
{
  "resume": {
    "pageTitle": "...",           // resume.pageTitle
    "pageDescription": "...",     // resume.pageDescription
    "header": {
      "tagline": "...",           // resume.header.tagline
      "contactLinks": [...]       // resume.header.contactLinks
    }
  }
}
```

### Common Top-Level Sections

| Section | Location | Namespace | Examples |
|---------|----------|-----------|----------|
| `home` | `locales/[lang]/home.json` | `ns: 'pages'` | title, subtitle, pageDeck |
| `resume` | `locales/[lang]/resume.json` | `ns: 'pages'` | pageTitle, header, jobs, skills |
| `colophon` | `locales/[lang]/colophon.json` | `ns: 'pages'` | pageTitle, designPhilosophy, technologies |
| `[projectId]` | `locales/[lang]/projects.json` | N/A | title, desc, circa, captions |

## Adding a New Page (Direct i18n Pattern)

When creating a new page that needs localization:

### Step 1: Create Data File
```typescript
// v2/src/data/newpage.ts
import type { TranslationFunction } from '../hooks/useI18n';

export function getLocalizedNewPageData(t: TranslationFunction): NewPageData {
  return {
    pageTitle: t('newpage.pageTitle', { ns: 'pages' }),
    pageDescription: t('newpage.pageDescription', { ns: 'pages' }),
    // ... other fields using t()
  };
}
```

### Step 2: Create Locale Files
```json
// v2/src/locales/en/newpage.json
{
  "newpage": {
    "pageTitle": "New Page | Sing Chan's Portfolio",
    "pageDescription": "Description of the new page...",
    "section": {
      "heading": "Section Heading",
      "content": "Section content..."
    }
  }
}
```

### Step 3: Request French Translation
Provide Claude with the English JSON structure and ask for French translation via DeepL MCP.

### Step 4: Add French File
Paste the translated JSON from Claude into `v2/src/locales/fr/newpage.json`.

### Step 5: Use in Component
```typescript
'use client';

import { useI18n } from '@/src/hooks/useI18n';
import { getLocalizedNewPageData } from '@/src/data/newpage';

export default function NewPageComponent() {
  const { t } = useI18n();
  const data = getLocalizedNewPageData(t);

  return (
    <div>
      <h1>{data.pageTitle}</h1>
      <p>{data.pageDescription}</p>
    </div>
  );
}
```

## Adding a New Project (JSON Merge Pattern)

When adding a project to the portfolio:

### Step 1: Add to projects.ts
```typescript
// v2/src/data/projects.ts
export const PROJECTS: readonly Project[] = [
  // ... existing projects
  {
    id: 'newProjectId',
    title: '',        // Will be filled from JSON
    desc: '',         // Will be filled from JSON
    circa: '',        // Will be filled from JSON
    tags: ['React', 'TypeScript'],
    images: [
      {
        url: '/images/new-project/screenshot1.png',
        caption: '',  // Will be filled from JSON
      }
    ]
  }
];
```

### Step 2: Add English Translations
```json
// v2/src/locales/en/projects.json
{
  "newProjectId": {
    "title": "Project Title",
    "desc": "Project description with details about technologies, challenges, and outcomes.",
    "circa": "2023–Present",
    "captions": ["Screenshot description", "Another screenshot description"]
  }
}
```

### Step 3: Request French Translation
Ask Claude to translate the project entry to French using DeepL MCP.

### Step 4: Add French Entry
Add the translated entry to `v2/src/locales/fr/projects.json` under the same `newProjectId`.

## Verification Checklist

After adding translations:

- [ ] English strings added to appropriate locale file (en/*)
- [ ] French translations added via DeepL MCP
- [ ] JSON syntax is valid (no trailing commas, proper nesting)
- [ ] If new page: Data file uses translation function for new keys
- [ ] If new project: Entry exists in both en/projects.json and fr/projects.json
- [ ] TypeScript compilation passes: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Visually tested in both English and French
- [ ] No console errors or warnings in browser

## Tips for Accurate Translations

1. **Provide context** - Mention what the string is used for in your request to Claude
2. **Keep it concise** - Shorter strings are easier to translate accurately
3. **Use formal language** - Professional tone for professional portfolio sites
4. **Account for length** - French is typically 20-30% longer than English
5. **Review translations** - Check that translated text makes sense in context
6. **Maintain terminology** - Ensure technical terms are consistent across all translations

## File Locations

| Purpose | English | French |
|---------|---------|--------|
| Resume page | `v2/src/locales/en/resume.json` | `v2/src/locales/fr/resume.json` |
| Colophon page | `v2/src/locales/en/colophon.json` | `v2/src/locales/fr/colophon.json` |
| Home/Portfolio page | `v2/src/locales/en/home.json` | `v2/src/locales/fr/home.json` |
| Projects collection | `v2/src/locales/en/projects.json` | `v2/src/locales/fr/projects.json` |
| Data functions | `v2/src/data/resume.ts`, `colophon.ts`, `portfolio.ts` | (JSON files only) |
| Localization utils | `v2/src/data/localization.ts` | (No localization needed) |

## Quick Commands

```bash
# Type check (catches missing translations)
npm run type-check

# Run tests (verifies i18n works)
npm test

# Lint (checks code quality)
npm run lint

# Format JSON files
npm run format
```

## Related Documentation

- **[LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md)** - Detailed architecture and patterns
- **[LOCALIZATION.md](./LOCALIZATION.md)** - Additional localization guidance
- **[.claude/CLAUDE.md](../.claude/CLAUDE.md)** - Code standards and documentation requirements
- **Source code:**
  - `v2/src/hooks/useI18n.ts` - Translation hook and TranslationFunction type
  - `v2/src/data/localization.ts` - Project merge utility functions
  - `v2/src/lib/i18n.ts` - i18next configuration

## Example: Complete Translation Workflow

**Scenario:** Add a new testimonial section to the home page

1. **Add English text** to `v2/src/locales/en/home.json`:
```json
{
  "home": {
    "testimonials": {
      "heading": "What Others Say",
      "items": [
        { "text": "Great work!", "author": "Client Name" }
      ]
    }
  }
}
```

2. **Request translation** from Claude:
```
Please translate this section to French using DeepL MCP:

FILE: v2/src/locales/en/home.json
SECTION: home.testimonials

STRINGS:
- "What Others Say"
- "Great work!"
- "Client Name"

Provide formatted JSON for v2/src/locales/fr/home.json
```

3. **Add French translations** to `v2/src/locales/fr/home.json`:
```json
{
  "home": {
    "testimonials": {
      "heading": "Ce qu'en disent les autres",
      "items": [
        { "text": "Excellent travail!", "author": "Nom du client" }
      ]
    }
  }
}
```

4. **Update data file** if accessing through getLocalizedPortfolioData:
```typescript
testimonials: {
  heading: t('home.testimonials.heading', { ns: 'pages' }),
  items: t('home.testimonials.items', { ns: 'pages' }),
}
```

5. **Test and verify**:
```bash
npm run type-check
npm run lint
npm test
# Then manually test in browser with both languages
```
