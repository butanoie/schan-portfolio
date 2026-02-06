# Localization Guide

Quick reference for implementing and managing localization in the portfolio site.

**Supported Languages:** English (en), French (fr)

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

## Overview

The portfolio uses **two localization patterns**:

### 1. Direct i18n Pattern (Pages)
Used for static page content (resume, colophon, home):
- Translation function (`t()`) injected into data files
- Synchronous, works in Client Components
- Example: `v2/src/data/resume.ts`

### 2. JSON Merge Pattern (Projects)
Used for dynamic project collections:
- Base data in TypeScript, translations in JSON
- Async loading with runtime merge
- Example: `v2/src/data/projects.ts` + `v2/src/locales/[lang]/projects.json`

---

## Key Files

| File | Purpose |
|------|---------|
| `v2/src/hooks/useI18n.ts` | Translation hook and TranslationFunction type |
| `v2/src/lib/i18n.ts` | i18n utilities and re-exports |
| `v2/src/lib/i18nServer.ts` | Server-side i18n utilities |
| `v2/src/data/localization.ts` | Project merge and localization functions |
| `v2/src/locales/[lang]/` | Translation JSON files |

---

## Common Tasks

### Adding Translation Keys

**For Page Content (Direct i18n):**

1. Edit the locale file: `v2/src/locales/en/[page].json`
2. Add your new key with English text
3. Request French translation via Claude + DeepL MCP
4. Add translated key to `v2/src/locales/fr/[page].json`
5. Update data file to use the new key

**For Projects (JSON Merge):**

1. Edit `v2/src/locales/en/projects.json`
2. Add your project entry with English strings
3. Request French translation
4. Add translated entry to `v2/src/locales/fr/projects.json`

See [TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md) for complete examples.

### Using Translations in Components

**Client Component (Direct i18n):**

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

**Server Component (Server-side):**

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

**Last Updated:** 2026-02-06
