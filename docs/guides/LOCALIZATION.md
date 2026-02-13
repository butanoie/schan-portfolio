# Localization Guide

Quick reference for implementing and managing localization in the portfolio site.

**Supported Languages:** English (en), French (fr)

---

## Best Practices

The portfolio follows **industry-standard i18n best practices**:

✅ **All translatable content in JSON files** (including English)
✅ **TypeScript contains only structure** (IDs, URLs, arrays)
✅ **All languages treated equally** (no "default" language in code)
✅ **Use `t()` function** to access translations

### Why JSON-First?

1. **Separation of concerns** - Code handles logic, JSON handles content
2. **Translation-ready** - Professional translators work with JSON files
3. **Maintainable** - Single source of truth per language
4. **Flexible** - Content can be updated without code changes
5. **Tool-friendly** - Translation management tools parse JSON easily

---

## 🚀 Quick Start

Choose your task:

### I need to translate new strings
→ Read **[TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)** for step-by-step instructions on adding translations.

### I need to understand how localization works
→ Read **[LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md)** for detailed technical architecture.

### I'm adding a new page
→ Follow the **Implementation Guide** in [LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md#implementation-guide).

---

## Standard Pattern

All modules with translatable content follow this pattern:

### 1. Structure in TypeScript

```typescript
// data/mydata.ts
import type { TranslationFunction } from '@/src/hooks/useI18n';

/**
 * Get my data localized for the current language.
 * All content comes from locales/[lang]/mydata.json
 */
export function getLocalizedMyData(t: TranslationFunction): MyData {
  return {
    title: t('mydata.title', { ns: 'pages' }),
    description: t('mydata.description', { ns: 'pages' }),
    items: [
      {
        id: 'item1',
        name: t('mydata.items.item1.name', { ns: 'pages' }),
      },
    ],
  };
}
```

### 2. Content in JSON Files

```json
// locales/en/mydata.json
{
  "mydata": {
    "title": "My Title",
    "description": "My description",
    "items": {
      "item1": {
        "name": "Item One"
      }
    }
  }
}
```

```json
// locales/fr/mydata.json
{
  "mydata": {
    "title": "Mon Titre",
    "description": "Ma description",
    "items": {
      "item1": {
        "name": "Article Un"
      }
    }
  }
}
```

### 3. Usage in Components

```typescript
'use client';

import { useI18n } from '@/src/hooks/useI18n';
import { getLocalizedMyData } from '@/src/data/mydata';

export default function MyComponent() {
  const { t } = useI18n();
  const data = getLocalizedMyData(t);

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
```

---

## Current Implementation

### Pages (Resume, Colophon, Home, Portfolio)
- **Structure:** `v2/src/data/[page].ts` (function only, no static exports)
- **English:** `v2/src/locales/en/[page].json`
- **French:** `v2/src/locales/fr/[page].json`
- **Function:** `getLocalized[Page]Data(t)` receives translation function
- **Pattern:** JSON-first with synchronous `t()` calls

### Projects
- **Structure:** `v2/src/data/projects.ts` (base structure with empty strings)
- **English:** `v2/src/locales/en/projects.json`
- **French:** `v2/src/locales/fr/projects.json`
- **Function:** `getLocalizedProjects(locale)` - async with merge
- **Pattern:** JSON-first with runtime merge

---

## Key Files

| File | Purpose |
|------|---------|
| `v2/src/hooks/useI18n.ts` | Translation hook and TranslationFunction type |
| `v2/src/lib/i18n.ts` | i18n utilities and re-exports |
| `v2/src/lib/i18nServer.ts` | Server-side i18n utilities |
| `v2/src/data/localization.ts` | Project localization functions |
| `v2/src/locales/[lang]/` | Translation JSON files |

---

## Common Tasks

### Adding Translation Keys

1. Edit the locale file: `v2/src/locales/en/[page].json`
2. Add your new key with English text
3. Request French translation via Claude + DeepL MCP
4. Add translated key to `v2/src/locales/fr/[page].json`
5. Update data file to use the new key in `getLocalized*Data(t)` function

See [TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md) for complete examples.

### Using Translations in Components

**Client Component (Pages):**

```typescript
'use client';

import { useI18n } from '@/src/hooks/useI18n';
import { getLocalizedResumeData } from '@/src/data/resume';

export default function ResumeComponent() {
  const { t } = useI18n();
  const data = getLocalizedResumeData(t);

  return <h1>{data.pageTitle}</h1>;
}
```

**Server Component (Projects with async):**

```typescript
import { cookies } from 'next/headers';
import { getLocaleFromCookie } from '@/src/lib/i18nServer';
import { getLocalizedProjects } from '@/src/data/localization';

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.toString());

  const projects = await getLocalizedProjects(locale);
  return <div>{/* render projects */}</div>;
}
```

---

## What NOT to Translate

Keep these in code (not JSON):

- **Proper nouns:** Company names, product names, people's names
- **Technical terms:** Programming language names, framework names
- **URLs and email addresses**
- **Icons and image paths**
- **Numeric IDs**

---

## Verification

After adding translations, run:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm test

# Manual testing in browser
# - Switch language via locale selector
# - Verify text displays in selected language
```

---

## Documentation Structure

- **[LOCALIZATION.md](./LOCALIZATION.md)** (this file) - Quick reference and overview
- **[LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md)** - Technical deep-dive into patterns, architecture, and implementation
- **[TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)** - Step-by-step workflow for adding translations

---

## Need Help?

- **For translation questions:** See [TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)
- **For technical details:** See [LOCALIZATION_ARCHITECTURE.md](./LOCALIZATION_ARCHITECTURE.md)
- **For code patterns:** See [LOCALIZATION_ARCHITECTURE.md#implementation-guide](./LOCALIZATION_ARCHITECTURE.md#implementation-guide)

---

**Last Updated:** 2026-02-12
