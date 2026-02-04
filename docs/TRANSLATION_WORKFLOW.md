# Translation Workflow Guide

Quick reference for translating new strings and adding them to the i18n system.

## Quick Start

### 1. Identify Strings to Translate

List all English strings that need localization:
```
String: "Download Resume"
Context: Button in header
```

### 2. Use Claude with DeepL to Translate

Ask Claude to translate strings using the DeepL MCP:

```
Please translate these strings to French:
- "Download Resume" (button)
- "Something went wrong" (error message)
- "Load more projects" (button)
```

Claude will use DeepL to produce:
```
- "Download Resume" → "Télécharger le CV"
- "Something went wrong" → "Une erreur s'est produite"
- "Load more projects" → "Charger plus de projets"
```

### 3. Add to i18n.ts

Claude will provide formatted TypeScript that's ready to paste:

```typescript
// Add to TranslationKey type:
| 'buttons.downloadResume'
| 'errors.somethingWentWrong'
| 'buttons.loadMore'

// Add to EN translations:
'buttons.downloadResume': 'Download Resume',
'errors.somethingWentWrong': 'Something went wrong',
'buttons.loadMore': 'Load more projects',

// Add to FR translations:
'buttons.downloadResume': 'Télécharger le CV',
'errors.somethingWentWrong': 'Une erreur s\'est produite',
'buttons.loadMore': 'Charger plus de projets',
```

### 4. Use in Component

```typescript
import { useI18n } from '@/src/hooks/useI18n';

export function MyComponent() {
  const { t } = useI18n();
  return <button>{t('buttons.downloadResume')}</button>;
}
```

## Batch Translation Example

When adding multiple strings, provide them all at once to Claude:

```
Please translate these strings to French and provide formatted i18n.ts entries:

1. "View Profile" (button)
2. "Edit Settings" (button label)
3. "No results found" (empty state message)
4. "Processing..." (loading state)
5. "Account created successfully" (success message)
```

Claude will:
1. Translate all strings using DeepL
2. Suggest appropriate translation keys
3. Generate formatted TypeScript entries
4. Show the complete output ready to paste

## Key Naming Convention

Translation keys follow this pattern:

```
category.subcategory.name
```

### Common Categories

| Category | Use Cases | Examples |
|----------|-----------|----------|
| `common` | Generic UI | home, portfolio, resume |
| `nav` | Navigation | home, portfolio, social |
| `buttons` | Button labels | loadMore, close, submit |
| `forms` | Form fields & labels | email, password, required |
| `pages` | Page titles/subtitles | title, subtitle |
| `footer` | Footer content | copyright, madeWith |
| `errors` | Error messages | notFound, tryAgain |
| `settings` | Preferences/settings | theme, language |
| `resume` | Resume sections | workExperience, skills |

## Translate Multiple Strings at Once

Provide Claude with a batch of strings:

```
I need to translate these strings to French for the portfolio site.
Please provide formatted i18n.ts entries:

BUTTONS:
- "View Project"
- "Share"
- "Download"

MESSAGES:
- "Project not found"
- "Failed to load projects"
- "No projects available"

SETTINGS:
- "Dark Mode"
- "Accessibility"
```

Claude will generate:

```typescript
// TranslationKey additions:
| 'buttons.viewProject'
| 'buttons.share'
| 'buttons.download'
| 'messages.projectNotFound'
| 'messages.failedToLoad'
| 'messages.noProjects'
| 'settings.darkMode'
| 'settings.accessibility'

// EN translations:
'buttons.viewProject': 'View Project',
'buttons.share': 'Share',
'buttons.download': 'Download',
'messages.projectNotFound': 'Project not found',
'messages.failedToLoad': 'Failed to load projects',
'messages.noProjects': 'No projects available',
'settings.darkMode': 'Dark Mode',
'settings.accessibility': 'Accessibility',

// FR translations:
'buttons.viewProject': 'Voir le projet',
'buttons.share': 'Partager',
'buttons.download': 'Télécharger',
'messages.projectNotFound': 'Projet non trouvé',
'messages.failedToLoad': 'Échec du chargement des projets',
'messages.noProjects': 'Aucun projet disponible',
'settings.darkMode': 'Mode sombre',
'settings.accessibility': 'Accessibilité',
```

## Steps to Add Translations

### Step 1: Gather Strings
Collect all English strings with their context and location in the app.

### Step 2: Request Translation
Ask Claude to translate the batch of strings and provide formatted output.

### Step 3: Add Type Definition
Copy the new keys to the `TranslationKey` type in `v2/src/lib/i18n.ts`:

```typescript
export type TranslationKey =
  // ... existing keys
  | 'newcategory.string1'
  | 'newcategory.string2';
```

### Step 4: Add English Translations
Add entries to the `en` object in the translations dictionary:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // ... existing
    'newcategory.string1': 'English text here',
    'newcategory.string2': 'Another English text',
  },
  // ...
};
```

### Step 5: Add French Translations
Add entries to the `fr` object:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  // ...
  fr: {
    // ... existing
    'newcategory.string1': 'Texte français ici',
    'newcategory.string2': 'Un autre texte français',
  },
};
```

### Step 6: Use in Components
Update components to use the new translation keys:

```typescript
const { t } = useI18n();
return <div>{t('newcategory.string1')}</div>;
```

### Step 7: Test
- Test component in English
- Switch to French and verify text displays correctly
- Check layout doesn't break with French text (usually longer)

## Common Translation Patterns

### Short Labels
```
"Save" → "Enregistrer"
"Cancel" → "Annuler"
"Delete" → "Supprimer"
```

### Button Text
```
"Load More" → "Charger plus"
"View All" → "Voir tout"
"Download PDF" → "Télécharger en PDF"
```

### Error Messages
```
"Something went wrong" → "Une erreur s'est produite"
"Please try again" → "Veuillez réessayer"
"Not found" → "Non trouvé"
```

### Page Titles
```
"My Portfolio" → "Mon Portfolio"
"About Me" → "À propos"
"Contact" → "Contact"
```

## Tips for Accurate Translations

1. **Provide context** - Mention what the string is used for
2. **Keep it short** - Shorter strings are easier to translate accurately
3. **Use formal language** - Professional tone for professional sites
4. **Test layout** - French is typically 20-30% longer than English
5. **Review translations** - Check that translated text makes sense in context
6. **Check terminology** - Ensure technical terms are consistent

## Batch Format for Claude

When requesting multiple translations, use this format:

```
Translate these strings to French. Provide formatted i18n.ts entries:

CATEGORY: buttons
- "Click Here"
- "Learn More"
- "Get Started"

CATEGORY: messages
- "Welcome back!"
- "Processing your request"
- "All done!"

CATEGORY: errors
- "Invalid email"
- "Password too short"
- "File upload failed"
```

This format helps Claude:
- Group related strings
- Suggest appropriate key names
- Generate organized output
- Ensure consistent categorization

## Verification Checklist

After adding translations:

- [ ] All keys added to `TranslationKey` type
- [ ] All English entries in `en` translations
- [ ] All French entries in `fr` translations
- [ ] Component uses `useI18n()` hook
- [ ] No hardcoded strings in component
- [ ] TypeScript compilation passes
- [ ] Tests pass
- [ ] Visual layout looks good in both languages
- [ ] No console errors or warnings

## File References

- **Main i18n file**: `v2/src/lib/i18n.ts`
- **Detailed guide**: `docs/LOCALIZATION.md`
- **Code standards**: `.claude/CLAUDE.md`
- **Helper script**: `scripts/translate-strings.ts`

## Quick Commands

```bash
# Type check (catches missing translations)
npm run type-check

# Run tests (verifies i18n works)
npm test

# Lint (checks code quality)
npm run lint
```

## Need Help?

Refer to:
- `docs/LOCALIZATION.md` - Complete localization guide
- `v2/src/lib/i18n.ts` - Translation dictionary examples
- `v2/src/hooks/useI18n.ts` - Hook implementation reference
