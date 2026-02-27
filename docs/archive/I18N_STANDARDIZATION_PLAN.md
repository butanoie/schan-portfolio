# I18n Standardization Plan: JSON-First Pattern

**Issue:** [GitHub Issue #17 - Review i18n implementation re: default strings](https://github.com/butanoie/schan-portfolio/issues/17)
**Date Created:** 2026-02-12
**Status:** Planning
**Approach:** JSON-First i18n (Industry Best Practice)

---

## Executive Summary

Eliminate string duplication and standardize the portfolio's i18n implementation following **industry best practices**: all translatable content in JSON files, all languages treated equally, clear separation between code (structure) and content (translations).

**Goal:** Fix duplication issues while maintaining the correct pattern of keeping all translatable strings in external JSON files.

**Key Insight:** The projects pattern (empty strings in TS, content in JSON) is actually MORE correct than the resume pattern (English in TS + JSON). We need to fix resume/colophon to match, not the other way around.

---

## Context

### Industry Best Practice for i18n

According to react-i18next and i18next documentation:

**✅ Recommended Pattern:**
- All translatable strings in JSON files (including default language)
- Code contains only structure, IDs, and translation keys
- All languages treated equally
- Components use `t()` function to access translations

**❌ Anti-Pattern:**
- Default language strings hardcoded in TypeScript
- Duplication across code and JSON files
- One language "privileged" over others
- Mixing content and structure

**Why JSON-first is better:**
1. **Separation of concerns** - Code = logic/structure, JSON = content
2. **Translation-ready** - Professional translators work with JSON/XLIFF files
3. **No language bias** - English isn't "special" compared to French
4. **CMS-friendly** - Content can be managed by non-developers
5. **Tool-friendly** - Translation management tools parse JSON
6. **Maintainable** - Single source of truth per language

---

## Current State Analysis

### Pattern 1: Projects (CORRECT APPROACH) ✅

**Files:** `v2/src/data/projects.ts`, `v2/src/data/localization.ts`

**Structure:**
```typescript
// projects.ts - structure only, empty strings
export const PROJECTS = [
  {
    id: 'collabspace',
    title: '',  // ✅ Empty - content comes from JSON
    desc: '',   // ✅ Empty - content comes from JSON
    circa: '',  // ✅ Empty - content comes from JSON
    tags: ['.NET 8', 'C#', 'React.js'], // ✅ Proper nouns, don't translate
    images: [
      { url: '/image.png', tnUrl: '/image_tn.png', caption: '' } // ✅ Empty
    ],
  },
];
```

**Content:**
```json
// locales/en/projects.json - English content ✅
{
  "collabspace": {
    "title": "Collabware - Collabspace",
    "desc": "<p>Collabspace is a FedRAMP certified...</p>",
    "circa": "Fall 2017 - Present",
    "captions": ["Analytics", "Email Previews..."]
  }
}

// locales/fr/projects.json - French content ✅
{
  "collabspace": {
    "title": "Collabware - Collabspace",
    "desc": "<p>Collabspace est une solution...</p>",
    "circa": "Automne 2017 - Présent",
    "captions": ["Analytiques", "Aperçus d'email..."]
  }
}
```

**Assessment:**
- ✅ **Structure separated from content**
- ✅ **All languages in JSON files**
- ✅ **No duplication**
- ⚠️ **Complexity:** Async loading with caching (could be simplified)

---

### Pattern 2: Resume/Colophon (DUPLICATION ISSUE) ❌

**Files:** `v2/src/data/resume.ts`, `v2/src/data/colophon.ts`

**Problem: Triple Duplication**

```typescript
// Location 1: Static English export ❌
export const resumeData: ResumeData = {
  header: {
    name: "Sing Chan",
    tagline: "I develop useful, intuitive, and engaging applications...",
  },
  // ... lots of English content
};

// Location 2: Function with t() calls ❌ (duplicates Location 3)
export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  return {
    header: {
      name: t('resume.header.name', { ns: 'pages' }),
      tagline: t('resume.header.tagline', { ns: 'pages' }),
    },
    // ... more t() calls
  };
}

// Location 3: JSON files ❌ (duplicates Location 1 and 2)
// locales/en/resume.json
{
  "header": {
    "name": "Sing Chan",
    "tagline": "I develop useful, intuitive, and engaging applications..."
  }
}
```

**Assessment:**
- ❌ **English strings in THREE places**
- ❌ **Unclear canonical source**
- ❌ **Maintenance burden** - update same string in multiple locations
- ❌ **Code bloat** - resume.ts is ~488 lines, ~50% is duplicated content

---

## The Real Problem

**Issue #17 identified the right concern but the wrong culprit:**

❌ **Not the problem:** Projects using JSON for English content
✅ **Actual problem:** Resume/Colophon duplicating English content in code AND JSON

**The fix is simple:** Remove the static English exports, keep JSON as single source of truth.

---

## Recommended Solution

### Strategy: Fix Duplication, Simplify Complexity

**Phase 1:** Remove static English exports from resume.ts and colophon.ts
**Phase 2:** Simplify projects async loading (optional optimization)
**Phase 3:** Update documentation to reflect best practices

---

## Detailed Implementation Plan

### Phase 1: Fix Resume/Colophon Duplication

#### Step 1.1: Remove Static English Export from resume.ts

**File:** `v2/src/data/resume.ts`

**Changes:**

1. **DELETE** the entire static `resumeData` export (lines ~70-250)
2. **KEEP** only the `getLocalizedResumeData(t)` function
3. **RENAME** shared constants to a separate section

**Before (~488 lines with duplication):**
```typescript
// Constants
const LINKEDIN_LINK: ContactLink = { ... };
const GITHUB_LINK: ContactLink = { ... };
// ... more constants

// ❌ DELETE THIS - Static English data (duplication)
export const resumeData: ResumeData = {
  pageTitle: "Resume | Sing Chan's Portfolio",
  pageDescription: "Sing Chan's resume - 25+ years...",
  header: {
    name: "Sing Chan",
    tagline: "I develop useful, intuitive...",
    contactLinks: [LINKEDIN_LINK, GITHUB_LINK, ...],
  },
  jobs: [
    {
      company: "Collabware Systems",
      roles: [
        { title: "VP, Product", startDate: "May 2020", endDate: "Present" },
        // ... more roles
      ],
      description: "Long description...",
    },
    // ... more jobs
  ],
  // ... more static data
};

// ✅ KEEP THIS - Uses t() to get content from JSON
export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  return {
    pageTitle: t('resume.pageTitle', { ns: 'pages' }),
    pageDescription: t('resume.pageDescription', { ns: 'pages' }),
    header: {
      name: t('resume.header.name', { ns: 'pages' }),
      tagline: t('resume.header.tagline', { ns: 'pages' }),
      contactLinks: [
        LINKEDIN_LINK,
        GITHUB_LINK,
        EMAIL_LINK,
        PHONE_LINK,
        {
          label: t('resume.header.downloadLabel', { ns: 'pages' }),
          url: '/Sing_Chan_Resume.pdf',
          icon: 'download',
        },
      ],
    },
    // ... rest of function using t()
  };
}
```

**After (~250 lines, no duplication):**
```typescript
/**
 * Resume page data - comprehensive professional history and skills.
 *
 * This module provides localized resume data using the i18n system.
 * All translatable content is stored in locale JSON files (locales/[lang]/resume.json).
 * Use getLocalizedResumeData(t) to get resume data in the current language.
 *
 * @module data/resume
 */

import type { ContactLink, ResumeData } from "../types/resume";
import type { TranslationFunction } from '../hooks/useI18n';

/**
 * Contact link constants (language-agnostic).
 *
 * These constants contain URLs, icons, and obfuscated contact information
 * that doesn't require translation.
 */
const LINKEDIN_LINK: ContactLink = {
  label: "linkedin.com/in/sing-chan",
  url: "https://www.linkedin.com/in/sing-chan/",
  icon: "linkedin",
};

const GITHUB_LINK: ContactLink = {
  label: "github.com/butanoie",
  url: "https://github.com/butanoie",
  icon: "github",
};

const EMAIL_LINK: ContactLink = {
  label: "fvat@fvatpuna.pbz", // ROT13 obfuscated
  url: "znvygb:fvat@fvatpuna.pbz?fhowrpg=Pbagnpg ivn Cbegsbyvb Fvgr",
  icon: "email",
};

const PHONE_LINK: ContactLink = {
  label: "+6-159-228-7398", // ROT13/ROT5 obfuscated
  url: "gry:+6-159-228-7398",
  icon: "phone",
};

/**
 * Get resume data localized for the current language.
 *
 * Retrieves all resume content from i18n locale files using the translation
 * function. All translatable strings are stored in:
 * - locales/en/resume.json (English)
 * - locales/fr/resume.json (French)
 *
 * @param t - Translation function from useI18n() hook
 * @returns Complete resume data structure with translations
 *
 * @example
 * import { useI18n } from '@/src/hooks/useI18n';
 * import { getLocalizedResumeData } from '@/src/data/resume';
 *
 * function ResumePage() {
 *   const { t } = useI18n();
 *   const resumeData = getLocalizedResumeData(t);
 *   // resumeData now contains all content in the current language
 * }
 */
export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  return {
    pageTitle: t('resume.pageTitle', { ns: 'pages' }),
    pageDescription: t('resume.pageDescription', { ns: 'pages' }),

    header: {
      name: t('resume.header.name', { ns: 'pages' }),
      tagline: t('resume.header.tagline', { ns: 'pages' }),
      contactLinks: [
        LINKEDIN_LINK,
        GITHUB_LINK,
        EMAIL_LINK,
        PHONE_LINK,
        {
          label: t('resume.header.downloadLabel', { ns: 'pages' }),
          url: '/Sing_Chan_Resume.pdf',
          icon: 'download',
        },
      ],
    },

    jobs: [
      {
        company: "Collabware Systems",
        roles: [
          {
            title: t('resume.workExperience.jobs.0.roles.0.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.0.roles.0.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.0.roles.0.endDate', { ns: 'pages' }),
          },
          // ... more roles with t() calls
        ],
        description: t('resume.workExperience.jobs.0.description', { ns: 'pages' }),
      },
      // ... more jobs
    ],

    skillCategories: [
      {
        label: t('resume.skills.coreCompetencies', { ns: 'pages' }),
        skills: [
          // Tech names don't need translation (proper nouns)
          "JavaScript",
          "TypeScript",
          "React.js",
          ".NET",
          "C#",
          // ...
        ],
      },
      // ... more categories
    ],

    clients: [
      // Company names don't need translation (proper nouns)
      "Collabware Systems",
      "Habanero Consulting Group",
      // ...
    ],

    speaking: {
      intro: t('resume.conferenceSpeaker.intro', { ns: 'pages' }),
      events: [
        // Event names and dates (minimal translation needed)
        {
          name: "EnergizeIT",
          year: "2008",
          location: "Vancouver, BC",
        },
        // ...
      ],
    },
  };
}
```

**Result:**
- ✅ File reduced from ~488 lines to ~250 lines
- ✅ Zero duplication - JSON is single source of truth
- ✅ Clear documentation of i18n pattern
- ✅ Simpler, more maintainable

---

#### Step 1.2: Remove Static English Export from colophon.ts

**File:** `v2/src/data/colophon.ts`

**Changes:** Same pattern as resume.ts

1. **DELETE** static `colophonData` export
2. **KEEP** only `getLocalizedColophonData(t)` function
3. **MOVE** language-agnostic constants (tool links) to separate section

**Before:**
```typescript
export const colophonData: ColophonData = {
  // Static English content (duplication) ❌
};

export function getLocalizedColophonData(t: TranslationFunction): ColophonData {
  // Uses t() for translations ✅
}
```

**After:**
```typescript
/**
 * Colophon page data - tools, technologies, and site information.
 *
 * All translatable content stored in locale JSON files.
 * Use getLocalizedColophonData(t) to get content in current language.
 *
 * @module data/colophon
 */

// Language-agnostic constants (URLs, icons)
const TOOL_LINKS = {
  nextjs: { url: 'https://nextjs.org/', icon: 'nextjs' },
  react: { url: 'https://react.dev/', icon: 'react' },
  // ...
};

/**
 * Get colophon data localized for the current language.
 *
 * @param t - Translation function from useI18n() hook
 * @returns Complete colophon data with translations
 */
export function getLocalizedColophonData(t: TranslationFunction): ColophonData {
  return {
    pageTitle: t('colophon.pageTitle', { ns: 'pages' }),
    intro: t('colophon.intro', { ns: 'pages' }),
    // ... rest using t()
  };
}
```

---

#### Step 1.3: Update Component Imports

**Files to Update:**
- `v2/app/resume/page.tsx`
- `v2/app/colophon/page.tsx`
- Any other components importing static data

**Search for:**
```bash
grep -r "import.*resumeData.*from.*resume" v2/
grep -r "import.*colophonData.*from.*colophon" v2/
```

**Before:**
```typescript
import { resumeData } from '@/src/data/resume';

export default function ResumePage() {
  return <ResumeDisplay data={resumeData} />;
}
```

**After:**
```typescript
'use client';

import { getLocalizedResumeData } from '@/src/data/resume';
import { useI18n } from '@/src/hooks/useI18n';

export default function ResumePage() {
  const { t } = useI18n();
  const resumeData = getLocalizedResumeData(t);

  return <ResumeDisplay data={resumeData} />;
}
```

**Key Changes:**
- Add `'use client'` directive (if not already present)
- Import `getLocalizedResumeData` instead of static `resumeData`
- Import and use `useI18n()` hook
- Call function with `t` parameter

---

### Phase 2: Simplify Projects Pattern (Optional Optimization)

The projects pattern is fundamentally correct (JSON-first), but could be simplified.

#### Current Complexity

**File:** `v2/src/data/localization.ts`

**Issues:**
- Async loading with dynamic imports
- Manual caching implementation
- Requires Server Components or suspense
- Extra abstraction layer

**Current Pattern:**
```typescript
// Async with caching
const localeData = await getLocaleData(locale);
const projects = await getLocalizedProjects(locale);
```

---

#### Option 2.1: Keep Current Pattern (Recommended)

**Pros:**
- ✅ Already working
- ✅ Follows best practice (JSON-first)
- ✅ No changes needed
- ✅ Good performance with caching

**Cons:**
- ⚠️ Async complexity
- ⚠️ Requires Server Components or suspense

**Recommendation:** **Keep as-is.** The pattern is correct, and the async complexity is justified for 18 projects with rich content.

---

#### Option 2.2: Simplify to Synchronous (Alternative)

**Only consider this if async is causing issues.**

**File:** `v2/src/data/projects.ts`

**Add synchronous helper:**
```typescript
import { useTranslation } from 'react-i18next';

/**
 * Get all projects localized synchronously.
 * Requires i18next to be initialized.
 *
 * @param t - Translation function from useI18n() hook
 * @returns Array of localized projects
 */
export function getLocalizedProjects(t: TranslationFunction): Project[] {
  return PROJECTS.map(project => ({
    ...project,
    title: t(`${project.id}.title`, { ns: 'projects' }),
    desc: t(`${project.id}.desc`, { ns: 'projects' }),
    circa: t(`${project.id}.circa`, { ns: 'projects' }),
    images: project.images.map((image, index) => ({
      ...image,
      caption: t(`${project.id}.captions.${index}`, { ns: 'projects' }),
    })),
  }));
}
```

**Delete:** `v2/src/data/localization.ts` (no longer needed)

**Update consumers:**
```typescript
'use client';

import { getLocalizedProjects } from '@/src/data/projects';
import { useI18n } from '@/src/hooks/useI18n';

export default function PortfolioPage() {
  const { t } = useI18n();
  const projects = getLocalizedProjects(t); // Synchronous!

  return <ProjectGallery projects={projects} />;
}
```

**Pros:**
- ✅ Simpler mental model
- ✅ No async/await complexity
- ✅ Works in Client Components natively
- ✅ Consistent with resume/colophon pattern

**Cons:**
- ⚠️ Requires changing existing components
- ⚠️ Loses caching optimization (i18next has its own caching)

**Recommendation:** **Only if needed.** Current pattern works fine.

---

### Phase 3: Documentation Updates

#### Step 3.1: Update LOCALIZATION.md

**File:** `docs/guides/LOCALIZATION.md`

**Changes:**

1. **Add "Best Practices" section at the top**
2. **Clarify JSON-first pattern**
3. **Remove any suggestions to put strings in TypeScript**

**New Content:**
```markdown
# Localization Guide

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
    title: t('mydata.title', { ns: 'mydata' }),
    description: t('mydata.description', { ns: 'mydata' }),
    items: [
      {
        id: 'item1',
        name: t('mydata.items.item1.name', { ns: 'mydata' }),
      },
    ],
  };
}
```

### 2. Content in JSON Files

```json
// locales/en/mydata.json
{
  "title": "My Title",
  "description": "My description",
  "items": {
    "item1": {
      "name": "Item One"
    }
  }
}
```

```json
// locales/fr/mydata.json
{
  "title": "Mon Titre",
  "description": "Ma description",
  "items": {
    "item1": {
      "name": "Article Un"
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

## Current Implementation

### Projects
- **Structure:** `v2/src/data/projects.ts` (empty strings)
- **English:** `v2/src/locales/en/projects.json`
- **French:** `v2/src/locales/fr/projects.json`
- **Function:** `getLocalizedProjects(locale)` or `getLocalizedProjects(t)`

### Resume
- **Structure:** `v2/src/data/resume.ts` (function only)
- **English:** `v2/src/locales/en/resume.json`
- **French:** `v2/src/locales/fr/resume.json`
- **Function:** `getLocalizedResumeData(t)`

### Colophon
- **Structure:** `v2/src/data/colophon.ts` (function only)
- **English:** `v2/src/locales/en/colophon.json`
- **French:** `v2/src/locales/fr/colophon.json`
- **Function:** `getLocalizedColophonData(t)`

## What NOT to Translate

Keep these in code (not JSON):

- **Proper nouns:** Company names, product names, people's names
- **Technical terms:** Programming language names, framework names
- **URLs and email addresses**
- **Icons and image paths**
- **Numeric IDs**

## Adding New Translatable Content

1. Add structure to TypeScript file
2. Create `getLocalized*Data(t)` function with `t()` calls
3. Add English strings to `locales/en/*.json`
4. Use DeepL MCP to translate to French
5. Add French strings to `locales/fr/*.json`
6. Use `useI18n()` hook in component

See [TRANSLATION_WORKFLOW.md](TRANSLATION_WORKFLOW.md) for detailed steps.
```

---

#### Step 3.2: Update LOCALIZATION_ARCHITECTURE.md

**File:** `docs/guides/LOCALIZATION_ARCHITECTURE.md`

**Changes:**

1. Remove any "Direct i18n Pattern" vs "JSON Merge Pattern" comparison
2. Document single standard pattern
3. Add section on "Why JSON-First"
4. Update architecture diagrams

**Key Additions:**
```markdown
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

### Data Flow

```
User selects language
       ↓
localStorage saves preference
       ↓
i18next loads JSON for selected locale
       ↓
Component calls useI18n()
       ↓
Component calls getLocalized*Data(t)
       ↓
Function calls t('key', { ns: 'namespace' })
       ↓
i18next returns translated string from JSON
       ↓
Component renders localized content
```
```

---

#### Step 3.3: Update CLAUDE.md

**File:** `.claude/CLAUDE.md`

**Changes:**

1. Update Localization section to emphasize JSON-first
2. Add explicit anti-patterns to avoid
3. Update examples

**New Content:**
```markdown
### Localization (i18n)

**CRITICAL: All user-facing strings MUST be localized via the i18n system.**

#### Standard Pattern: JSON-First

✅ **DO:**
- Store ALL translatable content in JSON files (`locales/[lang]/*.json`)
- Use `useI18n()` hook to get `t()` function
- Create `getLocalized*Data(t)` wrapper functions for data modules
- Keep only structure (IDs, URLs, arrays) in TypeScript
- Treat all languages equally (no "default" language in code)

❌ **DON'T:**
- Put translatable strings directly in TypeScript files
- Create static English data exports
- Duplicate content across TypeScript and JSON
- Hardcode strings in JSX

#### Example: Data Module

```typescript
// ❌ WRONG - English strings in code
export const myData = {
  title: "My Title",  // Don't do this!
  description: "My description",
};

// ✅ CORRECT - Structure only, content in JSON
export function getLocalizedMyData(t: TranslationFunction) {
  return {
    title: t('mydata.title', { ns: 'mydata' }),
    description: t('mydata.description', { ns: 'mydata' }),
  };
}
```

#### Example: Component

```typescript
// ✅ CORRECT
'use client';

import { useI18n } from '@/src/hooks/useI18n';

export function MyComponent() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('mypage.title')}</h1>
      <p>{t('mypage.description')}</p>
    </div>
  );
}
```

#### Non-Translatable Content

Keep these in code (proper nouns, technical terms):
- Company names: "Collabware Systems", "Microsoft"
- Tech stack: "React.js", "TypeScript", ".NET"
- URLs and email addresses
- Icon names and image paths

**See [LOCALIZATION.md](../docs/guides/LOCALIZATION.md) for complete guide.**
```

---

## File Impact Summary

### Files to Modify

| File | Changes | Lines Changed (Est.) |
|------|---------|---------------------|
| `v2/src/data/resume.ts` | Remove static export | -238 lines |
| `v2/src/data/colophon.ts` | Remove static export | -80 lines |
| `v2/app/resume/page.tsx` | Update imports/usage | ~5 lines |
| `v2/app/colophon/page.tsx` | Update imports/usage | ~5 lines |
| `docs/guides/LOCALIZATION.md` | Clarify JSON-first pattern | ~100 lines |
| `docs/guides/LOCALIZATION_ARCHITECTURE.md` | Update architecture | ~80 lines |
| `docs/guides/TRANSLATION_WORKFLOW.md` | Simplify (single pattern) | ~30 lines |
| `.claude/CLAUDE.md` | Update i18n requirements | ~40 lines |

**Total:** ~8 files modified, **-318 lines net** (removing duplication)

### Files to Delete (Optional Phase 2)

| File | Reason |
|------|--------|
| `v2/src/data/localization.ts` | Only if simplifying to synchronous pattern |

---

## Testing Strategy

### Unit Tests

No unit tests needed - these are data transformations, tested via integration.

### Integration Testing

**Test Matrix:**

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Resume EN | 1. Load `/resume`<br>2. Verify language = EN | English content displays |
| Resume FR | 1. Load `/resume`<br>2. Switch to FR | French content displays |
| Colophon EN | 1. Load `/colophon`<br>2. Verify language = EN | English content displays |
| Colophon FR | 1. Load `/colophon`<br>2. Switch to FR | French content displays |
| Projects EN | 1. Load `/` (home)<br>2. Verify language = EN | English projects display |
| Projects FR | 1. Load `/` (home)<br>2. Switch to FR | French projects display |
| Language persistence | 1. Switch to FR<br>2. Refresh page | FR language persists |
| No console errors | 1. Open DevTools<br>2. Navigate all pages | No errors or warnings |

### Manual QA Checklist

- [ ] All pages load without errors
- [ ] Language toggle works on all pages
- [ ] Content updates immediately when switching languages
- [ ] No missing translations (no blank spots)
- [ ] No English showing when FR selected
- [ ] No FR showing when EN selected
- [ ] localStorage saves `locale` correctly
- [ ] Page refresh maintains selected language
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] Production build succeeds

### Automated Checks

```bash
# TypeScript type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Verify no runtime errors in console
npm run dev
# Open http://localhost:3000 and check DevTools console
```

---

## Rollback Plan

### Option 1: Git Revert

```bash
# If issues discovered after merge
git revert <commit-hash>
git push origin main
```

### Option 2: Branch Strategy (Recommended)

1. Create feature branch: `git checkout -b fix/i18n-duplication`
2. Make all changes in feature branch
3. Test thoroughly before merging
4. Create PR for review
5. Merge only after approval
6. If issues arise, revert PR merge

### Rollback Checklist

- [ ] Restore deleted static exports
- [ ] Revert component import changes
- [ ] Revert documentation changes
- [ ] Test all pages in both languages
- [ ] Verify language switching works
- [ ] Redeploy to production

---

## Implementation Timeline

### Phase 1: Fix Duplication (1-2 hours)

- [ ] Step 1.1: Remove static export from resume.ts (30 min)
- [ ] Step 1.2: Remove static export from colophon.ts (20 min)
- [ ] Step 1.3: Update component imports (20 min)
- [ ] Test resume and colophon pages (20 min)

### Phase 2: Simplify Projects (Optional, 1-2 hours)

- [ ] Only if needed - assess first
- [ ] Can be done in separate PR later

### Phase 3: Documentation (1-2 hours)

- [ ] Step 3.1: Update LOCALIZATION.md (30 min)
- [ ] Step 3.2: Update LOCALIZATION_ARCHITECTURE.md (30 min)
- [ ] Step 3.3: Update CLAUDE.md (20 min)
- [ ] Create changelog entry (30 min)

**Total Time:** 2-4 hours (Phase 1 + Phase 3 only)

### Suggested Schedule

**Day 1 (2 hours):**
- Complete Phase 1
- Test thoroughly

**Day 2 (2 hours):**
- Complete Phase 3
- Final review and PR

---

## Success Criteria

### Functional Requirements

- ✅ All pages render correctly in English
- ✅ All pages render correctly in French
- ✅ Language switching works without page refresh
- ✅ No console errors or warnings
- ✅ Language preference persists in localStorage
- ✅ No missing translations
- ✅ No layout shifts or broken formatting

### Code Quality

- ✅ **Zero string duplication** across files
- ✅ **One source per language** (JSON files)
- ✅ **No static English exports** in data files
- ✅ **Clear separation** of structure (TS) and content (JSON)
- ✅ TypeScript compiles without errors
- ✅ ESLint passes with no warnings
- ✅ Production build succeeds

### Documentation

- ✅ LOCALIZATION.md reflects JSON-first pattern
- ✅ LOCALIZATION_ARCHITECTURE.md updated
- ✅ CLAUDE.md has correct requirements
- ✅ Changelog entry completed
- ✅ All files properly documented per CLAUDE.md

### Performance

- ✅ No perceivable performance degradation
- ✅ Language switching feels instant
- ✅ No layout shifts during translation updates
- ✅ First Contentful Paint (FCP) unchanged
- ✅ Largest Contentful Paint (LCP) unchanged

---

## Risk Assessment

### Low Risk ✅

- **Simple code changes** - Just removing duplicates
- **No external dependencies** - Using existing i18next
- **No database changes** - Static content only
- **Easy rollback** - Git revert if needed
- **Proven pattern** - Following industry best practices

### Medium Risk ⚠️

- **Component imports** - Must update all consumers correctly
- **Missing translation** - Could cause blank content if t() key is wrong
- **TypeScript errors** - Must fix compilation errors before merge

### Mitigation Strategies

1. **Feature branch** - Isolate changes, test before merge
2. **TypeScript strict mode** - Catch errors at compile time
3. **Manual QA** - Visual verification of all pages
4. **Peer review** - Second pair of eyes on PR
5. **Gradual rollout** - Test in dev → staging → production
6. **Monitoring** - Watch for console errors after deploy

---

## Post-Implementation

### Immediate Follow-up

1. Monitor production for errors (first 24 hours)
2. Check analytics for bounce rate changes
3. Verify SEO ranking maintained
4. Collect user feedback on language switching

### Future Enhancements

1. Add more languages (Spanish, German, etc.)
2. Implement translation coverage reports
3. Add automated translation sync with DeepL
4. Create translation management UI for non-developers
5. Add A/B testing for translation quality

### Maintenance

- **When adding content:** Add to JSON files for all languages
- **When updating content:** Update JSON files only (not code)
- **Quarterly review:** Check translation quality and completeness
- **Annual audit:** Ensure all content is properly localized

---

## Key Takeaways

### What We Learned

1. **JSON-first is best practice** - All i18n systems recommend this
2. **Projects pattern was correct** - We should have fixed resume to match it
3. **Duplication is the enemy** - Single source of truth per language
4. **Separation of concerns** - Code = structure, JSON = content
5. **Simpler is better** - Removing code reduces complexity

### What Changed

**Before:**
- ❌ Resume/Colophon: English in code + JSON (duplication)
- ✅ Projects: All content in JSON (correct)

**After:**
- ✅ Resume/Colophon: All content in JSON (fixed)
- ✅ Projects: All content in JSON (unchanged)
- ✅ Consistent pattern across entire codebase

### Benefits Achieved

- 📉 **-318 lines of code** (removed duplication)
- 🎯 **Single source of truth** for each language
- 📚 **Clear best practices** documented
- 🔧 **Easier maintenance** going forward
- 🌍 **Better i18n foundation** for future languages

---

## Conclusion

This plan fixes the string duplication issue identified in GitHub Issue #17 by following **industry-standard i18n best practices**: all translatable content in JSON files, structure in TypeScript, clear separation of concerns.

The solution is simple: **remove static English exports** from resume.ts and colophon.ts, keeping only the functions that use `t()` to fetch content from JSON files. This eliminates duplication while maintaining the correct JSON-first pattern already used by projects.

**Next Steps:**
1. ✅ Review this plan
2. ✅ Get stakeholder approval
3. ✅ Create feature branch
4. ✅ Implement Phase 1 (fix duplication)
5. ✅ Test thoroughly
6. ✅ Complete Phase 3 (documentation)
7. ✅ Submit PR for review
8. ✅ Deploy to production

---

**Plan Status:** ✅ Complete - Ready for Implementation
**Related Issue:** [GitHub Issue #17](https://github.com/butanoie/schan-portfolio/issues/17)
**Estimated Effort:** 2-4 hours
**Risk Level:** Low
**Impact:** High (eliminates duplication, follows best practices)
