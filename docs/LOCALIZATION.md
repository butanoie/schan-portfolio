# Localization (i18n) Guide

This guide explains how to implement localization for all user-facing strings in the application.

## Overview

The application supports multiple languages with automatic translation using the DeepL MCP tool. All user-facing text must be localized through the centralized translation system.

### Supported Languages
- **English** (`en`) - Primary/fallback language
- **French** (`fr`) - Currently supported

### Current Translation Coverage
- ✅ Common UI strings (Home, Portfolio, Resume, etc.)
- ✅ Navigation labels
- ✅ Button text (Load More, Close, Download, etc.)
- ✅ Page titles and subtitles
- ✅ Footer content
- ✅ Settings labels (Theme, Language)
- ✅ Error messages
- ✅ Resume section headers

## Translation System Architecture

### Files Structure

```
v2/src/
├── lib/
│   └── i18n.ts                    # Translation dictionary & utilities
├── contexts/
│   └── LocaleContext.tsx          # Locale state context
├── components/
│   ├── i18n/
│   │   └── LocaleProvider.tsx     # Provides locale context to app
│   └── settings/
│       ├── LanguageSwitcher.tsx   # UI for language selection
│       └── SettingsButton.tsx     # Settings popover
└── hooks/
    ├── useI18n.ts                 # Hook for accessing translations
    └── useLocale.ts               # Hook for getting/setting current locale
```

### Translation Dictionary (v2/src/lib/i18n.ts)

The translation dictionary is a TypeScript object organized by language:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  en: {
    'common.home': 'Home',
    'common.portfolio': 'Portfolio',
    'settings.language': 'Language',
    // ... more translations
  },
  fr: {
    'common.home': 'Accueil',
    'common.portfolio': 'Portfolio',
    'settings.language': 'Langue',
    // ... more translations
  },
};
```

Translation keys follow a hierarchical naming convention:
- `category.subcategory.key`
- Examples: `buttons.loadMore`, `pages.home.title`, `settings.language`

## Step-by-Step: Adding a New Localized String

### 1. Define the Translation Key

Add your new key to the `TranslationKey` type in `v2/src/lib/i18n.ts`:

```typescript
export type TranslationKey =
  // ... existing keys
  | 'feature.newString'
  | 'feature.anotherString';
```

### 2. Add English Translation

Add the English text to the `en` translations object:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // ... existing translations
    'feature.newString': 'This is the English text',
    'feature.anotherString': 'Another English string',
  },
  // ... rest of translations
};
```

### 3. Translate Using DeepL MCP

Use the DeepL translation tool to translate your English strings:

```bash
# Translate single string to French
# Source: "This is the English text"
# Target Language: French (fr)
# Result: "C'est le texte en anglais"
```

Then add the translated text to the `fr` translations object:

```typescript
const translations: Record<Locale, Record<string, string>> = {
  // ... en translations
  fr: {
    // ... existing translations
    'feature.newString': 'C\'est le texte en anglais',
    'feature.anotherString': 'Une autre chaîne en anglais',
  },
};
```

### 4. Use in Component

Import and use the `useI18n()` hook in your component:

```typescript
import { useI18n } from '@/src/hooks/useI18n';

export function MyComponent() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('feature.newString')}</h1>
      <p>{t('feature.anotherString')}</p>
    </div>
  );
}
```

### 5. Test in Both Languages

Test your component in both English and French:
1. The language is set via the Settings button (gear icon) in the header
2. Your selection persists across page reloads
3. Verify text renders correctly and doesn't break layout

## Using Translations in Components

### Basic Usage

```typescript
import { useI18n } from '@/src/hooks/useI18n';

export function Button() {
  const { t } = useI18n();
  return <button>{t('buttons.clickMe')}</button>;
}
```

### With Variables/Interpolation

Some translations support variable substitution using `{variableName}` syntax:

```typescript
// In i18n.ts
'footer.copyright': '© {year} Sing Chan'

// In component
const { t } = useI18n();
const copyright = t('footer.copyright', { year: 2026 });
// Result: "© 2026 Sing Chan" or "© 2026 Sing Chan" (localized format)
```

### Getting Current Locale

Use the `useLocale()` hook to get the current language or change it:

```typescript
import { useLocale } from '@/src/hooks/useLocale';

export function LocaleInfo() {
  const { locale, setLocale } = useLocale();

  return (
    <div>
      <p>Current language: {locale}</p>
      <button onClick={() => setLocale('fr')}>Switch to French</button>
    </div>
  );
}
```

## Locale Persistence

The application automatically:
- **Detects** the user's browser language preference on first visit
- **Saves** the selected language to localStorage
- **Restores** the previous choice on subsequent visits
- **Falls back** to English if detection fails

## Advanced Features

### Date Formatting

Format dates according to the current locale:

```typescript
const { formatDate } = useI18n();
const date = formatDate(new Date('2026-02-03'));
// English: "February 3, 2026"
// French: "3 février 2026"
```

### Number Formatting

Format numbers with proper locale-specific separators:

```typescript
const { formatNumber } = useI18n();
const num = formatNumber(1234.56);
// English: "1,234.56"
// French: "1 234,56"
```

### Currency Formatting

Format currency according to locale:

```typescript
const { formatCurrency } = useI18n();
const price = formatCurrency(99.99, 'USD');
// English: "$99.99"
// French: "99,99 $"
```

## Translation Quality Checklist

When adding new translations, verify:

- [ ] English translation is clear and grammatically correct
- [ ] Translation keys follow naming convention (`category.key`)
- [ ] DeepL translation captures the meaning (not literal)
- [ ] Translated text isn't too long (may break layouts)
- [ ] Context-specific terms are translated correctly
- [ ] No hardcoded strings remain in the component
- [ ] Tests pass with both languages
- [ ] UI renders properly in both languages

## Translation Workflow with DeepL

### Single String Translation

```
Input (EN): "Load more projects"
Target: French (fr)
Output (FR): "Charger plus de projets"
```

### Multiple Strings

Translate multiple strings in sequence:

```
1. "Dark theme" → "Thème sombre"
2. "High contrast" → "Contraste élevé"
3. "Language" → "Langue"
```

### Tips for Better Translations

- **Provide context**: Tell DeepL what the string is for
  - ❌ "Settings" (ambiguous)
  - ✅ "Settings (header for user preferences menu)"

- **Keep it simple**: Shorter strings are translated more accurately
  - ❌ "Click this button to load additional project entries"
  - ✅ "Load more projects"

- **Verify technical terms**: Ensure tech terms are properly translated
  - Resume → Curriculum vitae (French formal term)
  - Portfolio → Portfolio (same in French)
  - Colophon → Colophon (same in French)

## Common Patterns

### Buttons

```typescript
// i18n.ts
'buttons.loadMore': 'Load more projects',
'buttons.close': 'Close',
'buttons.submit': 'Submit',

// Component
const { t } = useI18n();
<button>{t('buttons.loadMore')}</button>
```

### Form Labels

```typescript
// i18n.ts
'forms.email': 'Email address',
'forms.password': 'Password',

// Component
const { t } = useI18n();
<label>{t('forms.email')}</label>
<input type="email" />
```

### Error Messages

```typescript
// i18n.ts
'errors.somethingWentWrong': 'Something went wrong',
'errors.tryAgain': 'Please try again',

// Component
const { t } = useI18n();
{error && <div>{t('errors.somethingWentWrong')}</div>}
```

### Page Titles

```typescript
// i18n.ts
'pages.home.title': 'Portfolio',
'pages.resume.title': 'Résumé',

// Component
const { t } = useI18n();
<h1>{t('pages.home.title')}</h1>
```

## Testing with Multiple Languages

### Manual Testing

1. Run the development server: `npm run dev`
2. Click the Settings button (gear icon) in the header
3. Select "Français" from the language switcher
4. Verify all UI text updates to French
5. Check that layout doesn't break with longer French text
6. Reload the page and confirm French is restored

### Unit Testing

When testing components that use `useI18n()`:

```typescript
import { LocaleProvider } from '@/src/components/i18n/LocaleProvider';

function renderWithI18n(component: ReactNode, locale: Locale = 'en') {
  return render(
    <LocaleProvider initialLocale={locale}>
      {component}
    </LocaleProvider>
  );
}

it('should display localized text', () => {
  const { t } = renderWithI18n(<MyComponent />);
  // Test assertions...
});
```

## Adding a New Language

To add a new supported language (e.g., Spanish):

1. **Update LOCALES array** in `v2/src/lib/i18n.ts`:
   ```typescript
   export const LOCALES = ['en', 'fr', 'es'] as const;
   ```

2. **Add translation keys** for new locale:
   ```typescript
   const translations: Record<Locale, Record<string, string>> = {
     // ... existing translations
     es: {
       'common.home': 'Inicio',
       'common.portfolio': 'Portafolio',
       // ... all other keys translated
     },
   };
   ```

3. **Update LanguageSwitcher component** to include new language option

4. **Use DeepL** to translate all existing English strings to the new language

5. **Test thoroughly** in the new language before merging

## Troubleshooting

### Missing Translation Key

If a translation key isn't found:
- The key itself will be displayed (e.g., "buttons.unknownKey")
- This helps identify missing translations during development
- Check TypeScript errors for invalid key names

### Layout Breaking with Translations

Some languages (like German, French) produce longer text:
- Test translations in both short and long variants
- Use flexible widths instead of fixed pixel widths
- Avoid hardcoding character limits

### Persistence Not Working

If language selection isn't saved:
- Check browser localStorage (DevTools → Application → Storage)
- Clear localStorage and try again
- Verify `LocaleProvider` is wrapping your app
- Check for localStorage permission issues (private browsing)

## Resources

- **DeepL Translator**: Professional AI translation with context awareness
- **ISO 639-1 Language Codes**: `en`, `fr`, `es`, `de`, etc.
- **React i18n Best Practices**: Keep translations in separate objects, use hooks, test with multiple locales

## Related Files

- `v2/src/lib/i18n.ts` - Translation dictionary and utility functions
- `v2/src/contexts/LocaleContext.tsx` - Locale context definition
- `v2/src/components/i18n/LocaleProvider.tsx` - Locale provider component
- `v2/src/hooks/useI18n.ts` - Hook for accessing translations
- `v2/src/hooks/useLocale.ts` - Hook for getting/setting locale
- `v2/src/components/settings/LanguageSwitcher.tsx` - Language selection UI
- `v2/src/__tests__/hooks/useI18n.test.tsx` - Translation tests
- `v2/src/__tests__/lib/i18n.test.ts` - i18n utility tests
