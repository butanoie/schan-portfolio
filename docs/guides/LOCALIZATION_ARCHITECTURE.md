# Localization Architecture

**Version:** 3.0
**Last Updated:** 2026-02-12
**Status:** JSON-First Pattern (Standardized)

This document describes the localization (i18n) architecture for the portfolio application following industry best practices.

---

## Table of Contents

1. [Architecture Philosophy](#architecture-philosophy)
2. [JSON-First Pattern](#json-first-pattern)
3. [Type System](#type-system)
4. [Server-Side Architecture Pattern](#server-side-architecture-pattern)
5. [Directory Structure](#directory-structure)
6. [Implementation Guide](#implementation-guide)
7. [Best Practices](#best-practices)

---

## Architecture Philosophy

### JSON-First Content Strategy

All translatable content is stored in external JSON files, not in TypeScript code.

**Rationale:**
- TypeScript files define structure and logic
- JSON files contain content for each language
- Clear separation enables better tooling, translation workflows, and maintenance

### Single Source of Truth

Each language has exactly one source of truth:
- **English:** `locales/en/*.json`
- **French:** `locales/fr/*.json`

TypeScript code never contains translatable strings (except as translation keys).

### Why This Approach?

✅ **Separation of concerns** - Code = logic/structure, JSON = content
✅ **Translation-ready** - Professional translators work with JSON files
✅ **No language bias** - English isn't "special" compared to French
✅ **CMS-friendly** - Content can be managed by non-developers
✅ **Tool-friendly** - Translation management tools parse JSON
✅ **Maintainable** - Single source of truth per language
✅ **Industry standard** - Recommended by i18next and i18n communities

The portfolio uses **JSON-First localization** following industry best practices:

- **All translatable content in JSON files** (including English)
- **TypeScript contains only structure** (IDs, URLs, arrays)
- **All languages treated equally** (no "default" language in code)
- **Fully integrated with:**
  - **i18next** for translation management
  - **React i18next** for component integration
  - **TypeScript** for type safety
  - **DeepL** for automated translation (setup ready)

---

## JSON-First Pattern

### Core Principles

All translatable content follows the **JSON-First pattern**:

1. **Structure in TypeScript**
   - Data files define structure and IDs only
   - Functions use `t()` to fetch content from JSON
   - No translatable strings in code

2. **Content in JSON Files**
   - All language variants in `locales/[lang]/*.json`
   - Single source of truth per language
   - Professional translators work with JSON

3. **Consistent Implementation**
   - All pages use `getLocalized*Data(t)` functions
   - All projects use async `getLocalizedProject()` functions
   - Unified TranslationFunction type across codebase

### Two Implementation Approaches (Same Pattern)

While all content follows JSON-First, implementation varies by use case:

#### Pages (Synchronous)

**Used For:** Resume, Colophon, Home, Portfolio

**Implementation:**
```typescript
// v2/src/data/resume.ts
export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  return {
    pageTitle: t('resume.pageTitle', { ns: 'pages' }),
    header: {
      name: t('resume.header.name', { ns: 'pages' }),
      // ... more fields using t()
    },
  };
}
```

**Characteristics:**
- ✅ Synchronous - called at render time
- ✅ Works in Client Components
- ✅ Minimal overhead
- ✅ Direct access to `t()` from `useI18n()` hook

#### Projects (Asynchronous)

**Used For:** Project collection with rich metadata

**Implementation:**
```typescript
// v2/src/data/localization.ts
export async function getLocalizedProjects(locale: Locale): Promise<Project[]> {
  const projectsJson = await import(`../locales/${locale}/projects.json`);
  // ... merge and return with translations
}
```

**Characteristics:**
- ✅ Asynchronous - loaded server-side
- ✅ Works in Server Components
- ✅ Supports large data sets
- ✅ Efficient caching

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

## Server-Side Architecture Pattern

### Overview

For Server Components and server-side operations, the application uses a separate server-side i18n pattern that avoids importing client-side dependencies like i18next and React hooks.

### Key Modules

#### 1. **i18n-constants.ts**

Contains all locale-related constants used throughout the application:

**Location:** `src/lib/i18n-constants.ts`

**Definition:**

```typescript
// LOCALES and DEFAULT_LOCALE constants
export const LOCALES = ['en', 'fr'] as const;
export const DEFAULT_LOCALE = 'en';
export type Locale = (typeof LOCALES)[number];
```

**Usage:**
- Re-exported by `src/lib/i18n.ts` for client-side use
- Directly imported by `src/lib/i18nServer.ts` for server-side use
- Provides single source of truth for supported locales

#### 2. **i18next-config.ts**

Initializes and configures i18next for client-side usage.

**Location:** `src/lib/i18next-config.ts`

**Responsibilities:**
- i18next initialization with all supported namespaces
- Dynamic loading of translation files
- Detection of user locale from browser/app context
- Configuration of fallback languages and missing translation handling

**Note:** This file is NOT imported by server-side code to avoid pulling client-side dependencies into the server bundle.

#### 3. **i18nServer.ts**

Server-side utilities for accessing locale information without client-side dependencies.

**Location:** `src/lib/i18nServer.ts`

**Key Function:**

```typescript
/**
 * Get the user's preferred locale from cookies (server-side).
 *
 * @param cookieString - The cookie header string from the request
 * @returns The user's preferred locale or default
 */
export function getLocaleFromCookie(cookieString: string): Locale
```

**Usage in Server Components:**

```typescript
import { cookies } from 'next/headers';
import { getLocaleFromCookie } from '@/src/lib/i18nServer';

export default async function ServerComponent() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.toString());

  // Use locale for server-side data fetching
  const projects = await getLocalizedProjects(locale);

  return <div>{/* render with locale-aware data */}</div>;
}
```

**Advantages:**
- ✅ Works in Server Components without client-side overhead
- ✅ No React hooks required
- ✅ Minimal dependencies (only i18n-constants)
- ✅ Reads locale from cookie set by LocaleProvider

#### 4. **projectDataServer.ts**

Server actions for fetching project data with locale support.

**Location:** `src/lib/projectDataServer.ts`

**Key Functions:**

```typescript
/**
 * Server action to fetch projects.
 */
export async function fetchProjects(
  options: ProjectQueryOptions = {}
): Promise<ProjectsResponse>

/**
 * Server action to fetch a single project by ID with locale.
 */
export async function fetchProjectById(
  id: string,
  locale: string = 'en'
): Promise<Project | null>

/**
 * Server action to fetch all unique tags.
 */
export async function fetchAllTags(): Promise<string[]>
```

**Usage in Server Components:**

```typescript
import { fetchProjects } from '@/src/lib/projectDataServer';

export default async function ProjectsPage() {
  const projects = await fetchProjects({ page: 1, pageSize: 6 });

  return <div>{/* render projects */}</div>;
}
```

### Client vs. Server Pattern Comparison

| Aspect | Client-Side | Server-Side |
|--------|------------|-----------|
| **Module** | `useI18n()` hook | `i18nServer.ts` utilities |
| **Data Access** | `getLocalized*Data(t)` functions | `getLocalizedProject()` functions |
| **Locale Source** | Context (from cookies) | Cookies via `getLocaleFromCookie()` |
| **Dependencies** | React hooks, i18next | None (i18n-constants only) |
| **Bundle Impact** | Lightweight (hook) | Zero (server-only code) |
| **Use Case** | Client Components | Server Components, API routes |

### When to Use Each Pattern

**Use Client-Side Pattern When:**
- Building Client Components (pages, components with `'use client'`)
- Directly accessing translation function with `useI18n()`
- Rendering locale-aware UI in the browser

**Use Server-Side Pattern When:**
- Building Server Components (default in Next.js 13+)
- Fetching projects or other localized data server-side
- Accessing locale from request context (cookies)
- Avoiding unnecessary client-side JavaScript

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
│   │   │   ├── common.json         # Common/shared translations
│   │   │   ├── components.json     # Component translations
│   │   │   ├── home.json           # Home page translations
│   │   │   ├── resume.json         # Resume translations
│   │   │   └── projects.json       # Project translations
│   │   └── fr/
│   │       ├── colophon.json
│   │       ├── common.json
│   │       ├── components.json
│   │       ├── home.json
│   │       ├── resume.json
│   │       └── projects.json
│   │
│   ├── lib/
│   │   ├── i18n.ts                 # i18n utilities and re-exports
│   │   ├── i18n-constants.ts       # Locale constants (LOCALES, DEFAULT_LOCALE)
│   │   ├── i18next-config.ts       # i18next initialization and configuration
│   │   ├── i18nServer.ts           # Server-side i18n utilities
│   │   ├── projectData.ts          # Client-side project data utilities
│   │   └── projectDataServer.ts    # Server-side project data actions
│   │
│   ├── components/i18n/
│   │   ├── LocaleProvider.tsx      # Client-side locale context provider
│   │   ├── LocaleProviderErrorFallback.tsx  # Error boundary for locale provider
│   │   └── LocalizedPortfolioDeck.tsx       # Localized portfolio deck component
│   │
│   ├── contexts/
│   │   └── LocaleContext.tsx       # Locale context definition
│   │
│   └── types/
│       └── [various type definitions used by i18n]
│
└── docs/
    └── LOCALIZATION_ARCHITECTURE.md (this file)
```

---

## Implementation Guide

### Adding a New Page (JSON-First Pattern)

**Step 1:** Create the data file with ONLY the getter function

```typescript
// src/data/newpage.ts
import type { NewPageData } from '../types/newpage';
import type { TranslationFunction } from '../hooks/useI18n';

/**
 * Get new page data localized for the current language.
 * All content comes from locales/[lang]/newpage.json
 *
 * @param t - Translation function from useI18n() hook
 * @returns Localized page data
 */
export function getLocalizedNewPageData(t: TranslationFunction): NewPageData {
  return {
    pageTitle: t('newpage.pageTitle', { ns: 'pages' }),
    pageDescription: t('newpage.pageDescription', { ns: 'pages' }),
    section1: {
      heading: t('newpage.section1.heading', { ns: 'pages' }),
      content: t('newpage.section1.content', { ns: 'pages' }),
    }
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

```json
// src/locales/fr/newpage.json
{
  "newpage": {
    "pageTitle": "Nouvelle Page | Portefeuille de Sing Chan",
    "pageDescription": "Description de la nouvelle page...",
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

### Adding a New Project (JSON-First Pattern)

**Step 1:** Add to projects.ts with empty strings

```typescript
// src/data/projects.ts
export const PROJECTS: readonly Project[] = [
  // ... existing projects
  {
    id: 'newProjectId',
    title: '',              // Will be filled from JSON
    desc: '',               // Will be filled from JSON
    circa: '',              // Will be filled from JSON
    tags: ['React', 'TypeScript'],  // Non-translatable, keep in code
    images: [
      {
        url: '/images/new-project/screenshot1.png',
        tnUrl: '/images/new-project/screenshot1_tn.png',
        caption: '',        // Will be filled from JSON
      }
    ],
    videos: [],
    altGrid: false
  }
];
```

**Step 2:** Add translations to both languages

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

```json
// src/locales/fr/projects.json
{
  "newProjectId": {
    "title": "Titre du Nouveau Projet",
    "desc": "Description du projet...",
    "circa": "2024–Présent",
    "captions": ["Description de la capture d'écran"]
  }
}
```

**Step 3:** Use in components

```typescript
// In a server or client component
import { getLocalizedProject, getLocalizedProjects } from '@/src/data/localization';

// Get specific project (async)
const project = await getLocalizedProject('newProjectId', locale);

// Get all projects (async)
const projects = await getLocalizedProjects(locale);
```

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

- **[TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)** - Translation workflow and procedures
- **[data/projects.ts](../v2/src/data/projects.ts)** - Project data structure and base data
- **[data/localization.ts](../v2/src/data/localization.ts)** - Project merge and localization functions
- **[hooks/useI18n.ts](../v2/src/hooks/useI18n.ts)** - i18n hook, types, and utilities
- **[lib/i18nServer.ts](../v2/src/lib/i18nServer.ts)** - Server-side i18n utilities
- **[lib/projectDataServer.ts](../v2/src/lib/projectDataServer.ts)** - Server-side project data actions
- **[lib/i18n-constants.ts](../v2/src/lib/i18n-constants.ts)** - Locale constants and types

---

## Summary

The portfolio's localization architecture provides:

✅ **JSON-First Strategy** - All translatable content in JSON files (industry best practice)
✅ **Single Source of Truth** - One language version per locale
✅ **Type Safety** - Unified TranslationFunction type across all data files
✅ **Performance** - Async loading with caching, minimal overhead
✅ **Maintainability** - Clear separation of structure (TS) and content (JSON)
✅ **Scalability** - Easy to add new pages or projects
✅ **Quality** - Comprehensive type checking and validation

This architecture follows industry best practices for i18n, treating all languages equally, separating code concerns, and enabling professional translation workflows.

---

**Document Version:** 3.0
**Last Updated:** 2026-02-12
**Status:** ✅ JSON-First Pattern Standardized

**Change Log:**
- **v3.0** (2026-02-12): Standardized to JSON-First pattern per [I18N_STANDARDIZATION_PLAN.md](../archive/I18N_STANDARDIZATION_PLAN.md), removed dual-pattern description, clarified single pattern approach
- **v2.1** (2026-02-06): Added server-side architecture pattern, documented i18n-constants and i18next-config, updated directory structure
- **v2.0** (2026-02-05): Initial complete architecture documentation
