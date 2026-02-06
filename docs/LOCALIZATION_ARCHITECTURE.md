# Localization Architecture

**Version:** 2.0
**Last Updated:** 2026-02-05
**Status:** Complete

This document describes the localization (i18n) architecture for the portfolio application, covering both patterns used across different content types and the unified type system.

---

## Table of Contents

1. [Overview](#overview)
2. [Localization Patterns](#localization-patterns)
3. [Type System](#type-system)
4. [Directory Structure](#directory-structure)
5. [Implementation Guide](#implementation-guide)
6. [Migration Path](#migration-path)
7. [Best Practices](#best-practices)

---

## Overview

The portfolio uses **two distinct localization patterns** optimized for different use cases:

1. **Direct i18n Pattern** - For page-level content (resume, colophon, portfolio)
2. **JSON Merge Pattern** - For project collections (projects)

Both patterns are fully integrated with:
- **i18next** for translation management
- **React i18next** for component integration
- **TypeScript** for type safety
- **DeepL** for automated translation (setup ready)

---

## Localization Patterns

### Pattern 1: Direct i18n (Pages)

**Used For:**
- Resume page
- Colophon page
- Portfolio/Home page

**Key Characteristics:**
- Synchronous translation at component render time
- `getLocalized*Data(t)` functions receive translation function
- Minimal caching requirements
- Direct integration with React components via `useI18n()` hook
- Consistent `{ ns: 'pages' }` namespace

**Implementation Location:**
```
v2/src/data/
├── colophon.ts          (getLocalizedColophonData)
├── portfolio.ts         (getLocalizedPortfolioData)
└── resume.ts            (getLocalizedResumeData)
```

**Translation Files:**
```
v2/src/locales/
├── en/
│   ├── colophon.json
│   ├── home.json
│   └── resume.json
└── fr/
    ├── colophon.json
    ├── home.json
    └── resume.json
```

**Example Usage:**

```typescript
// In a component
const { t } = useI18n();
const colophonData = getLocalizedColophonData(t);

// colophon.ts function signature
export function getLocalizedColophonData(t: TranslationFunction): ColophonData {
  return {
    pageTitle: t('colophon.pageTitle', { ns: 'pages' }),
    pageDescription: t('colophon.pageDescription', { ns: 'pages' }),
    // ... more fields
  };
}
```

**Advantages:**
- ✅ Synchronous, no async overhead
- ✅ Works seamlessly in Client Components
- ✅ Direct access to translation function from hook
- ✅ Type-safe with unified TranslationFunction type
- ✅ Minimal setup required

**Disadvantages:**
- ❌ Requires Client Component for useI18n() hook
- ❌ Translation function must be passed to function
- ❌ Not suitable for large dynamic data sets

---

### Pattern 2: JSON Merge (Projects)

**Used For:**
- Portfolio projects collection

**Key Characteristics:**
- Asynchronous loading of locale data
- Base data in TypeScript, translations in JSON
- Dynamic imports with caching
- Image captions indexed by position
- Runtime merge of data and translations

**Implementation Location:**
```
v2/src/data/
├── projects.ts          (base project data)
└── localization.ts      (merge functions)
```

**Translation Files:**
```
v2/src/locales/
├── en/projects.json     (project translations)
└── fr/projects.json     (project translations)
```

**JSON Structure:**

```json
{
  "projectId": {
    "title": "Project Title",
    "desc": "Project description",
    "circa": "2023–Present",
    "captions": ["Caption 1", "Caption 2", ...]
  }
}
```

**TypeScript Structure:**

```typescript
// projects.ts
export const PROJECTS: readonly Project[] = [
  {
    id: 'projectId',
    title: '',              // Empty, filled from JSON
    desc: '',               // Empty, filled from JSON
    circa: '',              // Empty, filled from JSON
    tags: ['.NET', 'React'],// Non-translatable
    images: [
      { url: '...', caption: '' },  // Caption filled from JSON
    ]
  }
];
```

**Example Usage:**

```typescript
// Get single project with translations
const project = await getLocalizedProject('projectId', 'fr');

// Get all projects with translations
const projects = await getLocalizedProjects('en');

// localization.ts function signatures
export async function getLocalizedProject(
  projectId: string,
  locale: Locale
): Promise<Project | undefined>

export async function getLocalizedProjects(
  locale: Locale
): Promise<Project[]>
```

**Advantages:**
- ✅ Supports large dynamic data sets
- ✅ Non-developers can edit translations without code
- ✅ Clean separation of concerns (data vs. translations)
- ✅ Easy to add new projects
- ✅ Efficient caching of locale data
- ✅ Works in Server Components (async)

**Disadvantages:**
- ❌ Asynchronous, requires async/await or suspense
- ❌ Slightly more complex implementation
- ❌ Image captions must be indexed by position
- ❌ Requires careful type management

---

## Type System

### Unified TranslationFunction Type

All data localization functions use a **single, unified type** for the translation function:

**Location:** `src/hooks/useI18n.ts`

**Definition:**

```typescript
/**
 * Unified type for the translation function used across data files.
 *
 * @param key - Translation key (e.g., 'colophon.title')
 * @param options - Optional configuration:
 * - TranslationOptions: { ns?: string, variables?: Record<string, string | number> }
 * - Record<string, string | number>: Direct variable substitution
 * @returns Translated string for the current locale
 */
export type TranslationFunction = (
  key: string,
  options?: TranslationOptions | Record<string, string | number>
) => string;
```

**Usage:**

```typescript
import type { TranslationFunction } from '@/src/hooks/useI18n';

export function getLocalizedColophonData(t: TranslationFunction): ColophonData {
  // ... implementation
}

export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  // ... implementation
}

export function getLocalizedPortfolioData(t: TranslationFunction): ProjectsPageData {
  // ... implementation
}
```

**Benefits:**
- ✅ Consistent type signature across all data files
- ✅ Easier to understand and maintain
- ✅ Less boilerplate and duplication
- ✅ Single source of truth for type definition

---

## Directory Structure

```
v2/
├── src/
│   ├── data/                       # Data layer
│   │   ├── colophon.ts             # Colophon page data
│   │   ├── portfolio.ts            # Home/portfolio page data
│   │   ├── resume.ts               # Resume page data
│   │   ├── projects.ts             # Project base data
│   │   ├── localization.ts         # Project localization utilities
│   │   └── validateProjects.ts     # Project validation
│   │
│   ├── hooks/
│   │   └── useI18n.ts              # i18n hook (provides TranslationFunction)
│   │
│   ├── locales/                    # Translation files
│   │   ├── en/
│   │   │   ├── colophon.json       # Colophon translations
│   │   │   ├── home.json           # Home page translations
│   │   │   ├── resume.json         # Resume translations
│   │   │   └── projects.json       # Project translations
│   │   └── fr/
│   │       ├── colophon.json
│   │       ├── home.json
│   │       ├── resume.json
│   │       └── projects.json
│   │
│   ├── lib/
│   │   └── i18n.ts                 # i18n configuration and utilities
│   │
│   ├── components/i18n/
│   │   └── LocaleProvider.tsx      # Locale context provider
│   │
│   └── contexts/
│       └── LocaleContext.tsx       # Locale context definition
│
└── docs/
    └── LOCALIZATION_ARCHITECTURE.md (this file)
```

---

## Implementation Guide

### Adding a New Page (Using Direct i18n Pattern)

**Step 1:** Create the data file

```typescript
// src/data/newpage.ts
import type { NewPageData } from '../types/newpage';
import type { TranslationFunction } from '../hooks/useI18n';

export const newPageData: NewPageData = {
  pageTitle: "New Page | Portfolio",  // Can leave hardcoded for fallback
  pageDescription: "Page description",
  // ... other static data
};

export function getLocalizedNewPageData(t: TranslationFunction): NewPageData {
  return {
    pageTitle: t('newpage.pageTitle', { ns: 'pages' }),
    pageDescription: t('newpage.pageDescription', { ns: 'pages' }),
    // ... translate all user-facing strings
  };
}
```

**Step 2:** Create translation files

```json
// src/locales/en/newpage.json
{
  "newpage": {
    "pageTitle": "New Page | Sing Chan's Portfolio",
    "pageDescription": "Description of the new page...",
    "section1": {
      "heading": "Section 1",
      "content": "..."
    }
  }
}
```

**Step 3:** Use in components

```typescript
// In a client component
'use client';

import { useI18n } from '@/src/hooks/useI18n';
import { getLocalizedNewPageData } from '@/src/data/newpage';

export default function NewPageComponent() {
  const { t } = useI18n();
  const data = getLocalizedNewPageData(t);

  return (
    <div>
      <h1>{data.section1.heading}</h1>
      <p>{data.section1.content}</p>
    </div>
  );
}
```

### Adding a New Project (Using JSON Merge Pattern)

**Step 1:** Add to projects.ts

```typescript
// src/data/projects.ts
export const PROJECTS: readonly Project[] = [
  // ... existing projects
  {
    id: 'newProjectId',
    title: '',              // Leave empty
    desc: '',               // Leave empty
    circa: '',              // Leave empty
    tags: ['React', 'TypeScript'],
    images: [
      {
        url: '/images/new-project/screenshot1.png',
        tnUrl: '/images/new-project/screenshot1_tn.png',
        caption: '',        // Leave empty
      }
    ],
    videos: [],
    altGrid: false
  }
];
```

**Step 2:** Add translations

```json
// src/locales/en/projects.json
{
  "newProjectId": {
    "title": "New Project Title",
    "desc": "Project description...",
    "circa": "2024–Present",
    "captions": ["Screenshot description"]
  }
}
```

**Step 3:** Use in components

```typescript
// In a server or client component
import { getLocalizedProject, getLocalizedProjects } from '@/src/data/localization';

// Get specific project
const project = await getLocalizedProject('newProjectId', locale);

// Get all projects
const projects = await getLocalizedProjects(locale);
```

---

## Migration Path

### From Old System to New Architecture

If migrating from a different localization pattern:

**Phase 1: Type Unification**
1. Update all data files to import `TranslationFunction`
2. Replace custom type signatures with `TranslationFunction`
3. Run type-check to verify changes

**Phase 2: Translation File Updates**
1. Add `pageTitle` and `pageDescription` to locale files
2. Verify all translatable strings are in locale files
3. Run validation to check completeness

**Phase 3: Component Updates**
1. Update components to use `getLocalized*Data(t)`
2. Verify behavior in both English and French
3. Run full test suite

**Phase 4: Documentation**
1. Update code comments in data files
2. Update this architecture document
3. Add developer notes for future changes

---

## Best Practices

### Naming Conventions

**Translation Keys:**
- Use dot notation: `colophon.title`, `resume.header.tagline`
- Use descriptive names: `pageTitle`, `pageDescription`
- Group related strings: `contact.email`, `contact.phone`

**Namespace:**
- Pages use `ns: 'pages'`
- Components use `ns: 'components'`
- Common strings use `ns: 'common'`

**File Names:**
- Match content location: `colophon.json`, `resume.json`, `projects.json`
- Use standard structure: `locales/[lang]/[file].json`

### Translation Quality

**Text Guidelines:**
- Keep source text (English) accurate and complete
- Use consistent terminology across all pages
- Provide context in code comments for translators
- Keep translations concise but clear

**Automated Translation:**
- Use DeepL MCP for initial translations
- Review and refine machine translations
- Test in both languages before deployment
- Keep source and translated versions in sync

### Type Safety

**Always Use TranslationFunction Type:**
```typescript
// ✅ Good
export function getLocalizedData(t: TranslationFunction): DataType {
  return { title: t('key') };
}

// ❌ Bad - Custom type signature
export function getLocalizedData(t: (key: string) => string): DataType {
  return { title: t('key') };
}
```

**Validate Translation Keys:**
```typescript
// ✅ Use consistent namespaces
t('colophon.title', { ns: 'pages' })

// ❌ Inconsistent namespace
t('colophon.title', { ns: 'colophon' })
```

### Performance

**Caching:**
- Projects use caching in `localization.ts`
- Page translations are lightweight (no caching needed)
- Clear cache when locale changes

**Async Operations:**
- Use `getLocalizedProjects(locale)` in server components
- Use suspense boundaries for async data
- Avoid blocking renders with translations

**Code Splitting:**
- Locales are dynamically imported
- No translation bundles loaded upfront
- Minimal impact on initial page load

---

## Common Patterns

### Handling Interpolation

**Pattern 1: Direct Variables**

```typescript
// In translation function call
t('greeting', { name: 'John', ns: 'common' })

// In JSON file
{
  "greeting": "Hello, {{name}}!"
}
```

**Pattern 2: Array Properties**

```typescript
// For indexed lists (like image captions)
const captions = t('project.captions.0', { ns: 'pages' })

// In JSON file
{
  "project": {
    "captions": {
      "0": "First caption",
      "1": "Second caption"
    }
  }
}
```

### Error Handling

**Translation Not Found:**
```typescript
// i18next returns the key if translation not found
const title = t('missing.key', { ns: 'pages' });
// Result: 'missing.key' (fallback to key)

// Prevent in development:
i18next.init({
  saveMissing: true,  // Log missing translations
  missingKeyHandler: (key) => {
    console.warn(`Missing translation: ${key}`);
  }
});
```

### Testing Translations

**Unit Tests:**
```typescript
import { getLocalizedColophonData } from '@/src/data/colophon';

describe('Localization', () => {
  it('should include translated title', () => {
    const mockT = (key: string) => `[${key}]`;
    const data = getLocalizedColophonData(mockT);

    expect(data.pageTitle).toBe('[colophon.pageTitle]');
  });
});
```

---

## Troubleshooting

### Missing Translations

**Problem:** Text shows the key instead of translation
```
Expected: "About this site"
Actual: "colophon.description"
```

**Solution:**
1. Check locale file exists: `src/locales/[lang]/[file].json`
2. Verify key path matches exactly
3. Check namespace is correct: `{ ns: 'pages' }`
4. Restart development server

### Type Errors

**Problem:** `TranslationFunction` not found
```
Error: Cannot find module 'TranslationFunction'
```

**Solution:**
```typescript
// ✅ Correct import
import type { TranslationFunction } from '@/src/hooks/useI18n';

// Use in function signature
export function getLocalizedData(t: TranslationFunction): DataType {}
```

### Locale Not Switching

**Problem:** Changing locale doesn't update translations

**Solution:**
1. Verify `LocaleProvider` wraps component tree
2. Check `LocaleContext` is properly initialized
3. Ensure components use `useI18n()` hook
4. Verify locale value in context

---

## Related Documentation

- **[LOCALIZATION.md](./LOCALIZATION.md)** - Workflow and setup guide
- **[data/projects.ts](../v2/src/data/projects.ts)** - Project data structure
- **[data/localization.ts](../v2/src/data/localization.ts)** - Project merge functions
- **[hooks/useI18n.ts](../v2/src/hooks/useI18n.ts)** - i18n hook and types

---

## Summary

The portfolio's localization architecture provides:

✅ **Type Safety** - Unified TranslationFunction type across all data files
✅ **Flexibility** - Two patterns optimized for different use cases
✅ **Performance** - Async loading with caching, minimal overhead
✅ **Maintainability** - Clear separation of data and translations
✅ **Scalability** - Easy to add new pages or projects
✅ **Quality** - Comprehensive type checking and validation

This architecture scales from simple page content to complex project collections while maintaining consistency, type safety, and developer experience.

---

**Document Version:** 2.0
**Last Updated:** 2026-02-05
**Status:** ✅ Complete and documented
