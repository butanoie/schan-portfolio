# Phase 4: Enhanced Features - Detailed Implementation Plan

**Document Version:** 1.0
**Created:** 2026-02-02
**Author:** Sing Chan (with Claude Code)
**Status:** ⬜ NOT STARTED (Planned)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Foundation](#prerequisites--foundation)
3. [Implementation Overview](#implementation-overview)
4. [Task 4.1: Theme Switching](#task-41-theme-switching)
5. [Task 4.2: Internationalization (i18n)](#task-42-internationalization-i18n)
6. [Task 4.3: Animations & Transitions](#task-43-animations--transitions)
7. [Task 4.4: WCAG 2.2 Level AA Compliance](#task-44-wcag-22-level-aa-compliance)
8. [Task 4.5: SEO Optimization](#task-45-seo-optimization)
9. [File Structure](#file-structure)
10. [Testing Strategy](#testing-strategy)
11. [Accessibility Compliance](#accessibility-compliance)
12. [Technical Decisions](#technical-decisions)
13. [Dependencies](#dependencies)
14. [Success Criteria](#success-criteria)
15. [Risk Mitigation](#risk-mitigation)
16. [Implementation Order](#implementation-order)

---

## Executive Summary

Phase 4 enhances the functional portfolio site from Phase 3 with modern UX improvements, accessibility excellence, and SEO optimization. This phase focuses on user experience refinement, multi-language support infrastructure, visual polish, and comprehensive accessibility compliance verification.

### Goals

- Implement complete theme switching system (light, dark, high contrast)
- Build internationalization infrastructure for future multi-language support
- Add polished animations respecting accessibility preferences
- Achieve WCAG 2.2 Level AA compliance on all pages
- Implement comprehensive SEO optimization

### Scope

| Feature | Description |
|---------|-------------|
| Themes | Light, Dark, High Contrast B&W + system preference detection |
| i18n | String externalization + locale-aware formatting (dates, numbers) |
| Animations | Transitions, hover effects, scroll animations |
| Accessibility | Full WCAG 2.2 AA audit + remediation + automated testing |
| SEO | Meta tags, structured data, sitemap, robots.txt, canonical URLs |
| Duration | 2-3 weeks estimated |

---

## Prerequisites & Foundation

### Phase 3 Deliverables (Complete ✅)

Phase 3 provides the foundation for Phase 4:

| Deliverable | Status | Details |
|-------------|--------|---------|
| Core Pages | ✅ | Homepage, Resume, Colophon, Project detail pages |
| Components | ✅ | 13+ reusable components with full documentation |
| Styling | ✅ | MUI theme with custom colors and typography |
| Testing | ✅ | 80%+ coverage, Vitest + React Testing Library |
| Accessibility | ✅ | Basic a11y (skip links, ARIA labels, keyboard nav) |

### Existing Infrastructure

| Component | Status | Purpose |
|-----------|--------|---------|
| MUI Theme | ✅ | Centralized theme configuration |
| TypeScript | ✅ | Type-safe codebase |
| Testing Framework | ✅ | Vitest + RTL for component testing |
| ESLint | ✅ | Code quality and accessibility linting |
| Prettier | ✅ | Code formatting |

### Required Setup for Phase 4

- [ ] Install theme switching dependencies (MUI System, emotion)
- [ ] Set up i18n library (next-intl recommended)
- [ ] Configure animation library (optional: Framer Motion)
- [ ] Set up SEO metadata structure

---

## Implementation Overview

### Phase 4 Architecture

```
v2/
├── src/
│   ├── components/
│   │   ├── theme/
│   │   │   ├── ThemeToggle.tsx         # Theme switcher button
│   │   │   ├── ThemeProvider.tsx       # Enhanced with multiple themes
│   │   │   └── ColorModeScript.tsx     # Script for theme detection
│   │   └── [existing components]       # Enhanced with i18n
│   ├── hooks/
│   │   ├── useTheme.ts                 # Theme state management
│   │   ├── useColorMode.ts             # System theme detection
│   │   ├── useLocale.ts                # Locale state management
│   │   ├── useI18n.ts                  # i18n string lookup
│   │   └── [existing hooks]
│   ├── lib/
│   │   ├── themes.ts                   # Theme definitions (light, dark, high-contrast)
│   │   ├── i18n.ts                     # i18n configuration
│   │   └── seo.ts                      # SEO utilities
│   ├── locales/
│   │   └── en/
│   │       ├── common.json             # Common strings
│   │       ├── pages.json              # Page-specific strings
│   │       ├── components.json         # Component strings
│   │       └── meta.json               # SEO metadata
│   ├── styles/
│   │   ├── animations.css              # Global animations
│   │   └── [existing styles]
│   ├── types/
│   │   ├── theme.ts                    # Theme types
│   │   ├── i18n.ts                     # i18n types
│   │   └── [existing types]
│   └── data/
│       └── seoMetadata.ts              # SEO metadata for all pages
├── app/
│   ├── layout.tsx                      # Enhanced with theme provider
│   ├── page.tsx                        # Homepage (enhanced)
│   ├── sitemap.ts                      # Dynamic sitemap
│   ├── robots.ts                       # robots.txt generator
│   └── [existing pages]
├── public/
│   └── locales/                        # Future: Locale-specific assets
└── [existing structure]
```

---

## Task 4.1: Theme Switching

### Overview

Implement a complete theme system supporting light, dark, and high-contrast themes with user preference persistence and system preference detection.

### Requirements

#### 4.1.1 Theme Definitions

**Three Complete Themes Required:**

**Light Theme (Default)**
- Background: White or very light (#FFFFFF or #FAFAFA)
- Text: Dark (#1A1A1A)
- Primary: Sage Green (#8BA888)
- Secondary: Maroon (#8B1538)
- Accents: Sky Blue, Duck Egg
- Borders: Light gray (#EEEEEE)

**Dark Theme**
- Background: Dark (#121212 or #1E1E1E)
- Text: Light (#FFFFFF or #F5F5F5)
- Primary: Light sage (#A8D5A8)
- Secondary: Light maroon (#E85775)
- Accents: Light blue, light green tints
- Borders: Dark gray (#333333)
- Surface colors: Subtle elevation (#1F1F1F → #2A2A2A)

**High Contrast Theme (Black & White)**
- Background: Pure black (#000000)
- Text: Pure white (#FFFFFF)
- Links: White with underline
- Focus indicators: Bright yellow (#FFFF00) or white
- Borders: White (#FFFFFF)
- No gradients, minimal color variations
- Meets WCAG AAA contrast (7:1+)

**Type Definition:**

```typescript
/**
 * Available theme modes for the application.
 *
 * - light: Default theme with sage green and maroon palette
 * - dark: Dark mode with inverted colors for reduced eye strain
 * - highContrast: High contrast black and white for accessibility
 */
type ThemeMode = 'light' | 'dark' | 'highContrast';

/**
 * Theme color palette configuration.
 * Includes all colors used throughout the application.
 */
interface ThemePalette {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  borders: string;
  accents: {
    blue: string;
    green: string;
    red: string;
  };
}

/**
 * Complete theme configuration including colors, typography, and component overrides.
 */
interface ThemeConfig {
  palette: ThemePalette;
  typography: {
    fontFamily: string;
    sizes: Record<string, string>;
  };
  components: {
    MuiButton: any;
    MuiCard: any;
    // ... other MUI component overrides
  };
}
```

**Component:** `v2/src/lib/themes.ts` (350+ lines)

```typescript
/**
 * Light theme configuration.
 * Uses sage green and maroon palette for a natural, professional look.
 */
export const lightTheme: ThemeConfig = {
  palette: {
    mode: 'light',
    primary: '#8BA888',        // Sage green
    secondary: '#8B1538',      // Maroon
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#CCCCCC',
    },
    borders: '#EEEEEE',
    accents: {
      blue: '#87CEEB',
      green: '#C8E6C9',
      red: '#FFCDD2',
    },
  },
  // ... full MUI theme configuration
};

/**
 * Dark theme configuration.
 * Inverted colors for comfortable viewing in low-light environments.
 */
export const darkTheme: ThemeConfig = {
  palette: {
    mode: 'dark',
    primary: '#A8D5A8',        // Light sage
    secondary: '#E85775',      // Light maroon
    background: '#121212',
    surface: '#1F1F1F',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#666666',
    },
    borders: '#333333',
    accents: {
      blue: '#64B5F6',
      green: '#81C784',
      red: '#EF9A9A',
    },
  },
  // ... full MUI theme configuration
};

/**
 * High contrast black and white theme.
 * Meets WCAG AAA contrast requirements (7:1+) for maximum accessibility.
 */
export const highContrastTheme: ThemeConfig = {
  palette: {
    mode: 'highContrast',
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    background: '#000000',
    surface: '#000000',
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      disabled: '#CCCCCC',
    },
    borders: '#FFFFFF',
    accents: {
      blue: '#FFFF00',
      green: '#FFFFFF',
      red: '#FFFFFF',
    },
  },
  // ... simplified MUI theme for high contrast
};
```

---

#### 4.1.2 Theme Provider & Persistence

**Component:** `v2/src/components/theme/ThemeProvider.tsx`

**Features:**

- [ ] Detect system theme preference (`prefers-color-scheme` media query)
- [ ] Load saved user preference from localStorage
- [ ] Apply theme to MUI provider
- [ ] Update document meta tags (theme-color)
- [ ] Persist selection across page reloads
- [ ] Support for SSR (avoid hydration mismatch)
- [ ] Full JSDoc documentation

**Implementation Pattern:**

```typescript
/**
 * Provider component that manages theme state and persists user preference.
 *
 * Features:
 * - Detects system theme preference via prefers-color-scheme
 * - Loads user preference from localStorage
 * - Applies theme to MUI provider
 * - Updates document meta tags
 * - Prevents flash of unstyled content (FOUC) during hydration
 *
 * @param children - React components to wrap
 * @returns Theme provider wrapping children
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Load saved theme or detect system preference
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    setTheme(saved || system);
    setMounted(true);
  }, []);

  // Update document when theme changes
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  if (!mounted) {
    // Return minimal UI to avoid hydration mismatch
    return <>{children}</>;
  }

  const muiTheme = createTheme(
    theme === 'light' ? lightTheme :
    theme === 'dark' ? darkTheme :
    highContrastTheme
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

---

#### 4.1.3 Theme Toggle Component

**Component:** `v2/src/components/theme/ThemeToggle.tsx`

**Features:**

- [ ] Button to cycle through themes (Light → Dark → High Contrast → Light)
- [ ] Show current theme with icon
- [ ] Accessible with aria-label and aria-pressed
- [ ] Smooth transitions between themes
- [ ] Tooltip showing current theme
- [ ] Mobile-friendly touch target (44px minimum)
- [ ] No layout shift when clicked

**Specification:**

```typescript
/**
 * Button component for switching between themes.
 *
 * Cycles through: Light → Dark → High Contrast → Light
 *
 * Accessibility:
 * - aria-label: "Toggle theme (currently: Light)"
 * - aria-pressed: "false" (not a toggle switch, more of a button)
 * - Keyboard accessible: Tab to focus, Enter/Space to activate
 * - Tooltip shows current theme
 *
 * @param size - Icon size (default: medium)
 * @returns Theme toggle button
 */
export function ThemeToggle({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const next: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'highContrast',
      highContrast: 'light',
    };
    setTheme(next[theme]);
  };

  const icons = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
    highContrast: <ContrastIcon />,
  };

  const labels = {
    light: 'Light theme',
    dark: 'Dark theme',
    highContrast: 'High contrast theme',
  };

  return (
    <Tooltip title={`${labels[theme]} (click to change)`}>
      <IconButton
        onClick={toggleTheme}
        aria-label={`Toggle theme (currently: ${labels[theme]})`}
        size={size}
        sx={{
          transition: 'color 150ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        }}
      >
        {icons[theme]}
      </IconButton>
    </Tooltip>
  );
}
```

---

#### 4.1.4 System Preference Detection

**Hook:** `v2/src/hooks/useColorMode.ts`

**Features:**

- [ ] Listen for `prefers-color-scheme` media query changes
- [ ] Update theme when system preference changes
- [ ] Return current system preference

```typescript
/**
 * Hook to detect system color scheme preference.
 *
 * Listens to prefers-color-scheme media query and updates when system preference changes.
 * Useful for respecting user's OS-level dark mode setting if no saved preference exists.
 *
 * @returns System color mode: 'light' or 'dark'
 *
 * @example
 * const systemMode = useColorMode();
 * // Returns 'dark' if user has dark mode enabled in OS
 */
export function useColorMode(): 'light' | 'dark' {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return mode;
}
```

---

#### 4.1.5 Accessibility Considerations

**Color Contrast Verification:**

All themes must meet WCAG 2.2 AA minimum contrast ratios:
- [ ] Normal text: 4.5:1 contrast ratio
- [ ] Large text: 3:1 contrast ratio
- [ ] UI components: 3:1 contrast ratio
- [ ] High Contrast theme: 7:1+ (WCAG AAA)

**Testing Process:**

1. Use WebAIM Contrast Checker tool
2. Verify all text colors against backgrounds
3. Check interactive element colors (buttons, links)
4. Test with axe DevTools automated audit
5. Manual testing with NVDA/JAWS screen readers

**Component Styling Update Pattern:**

```typescript
// Example: Update components to support multiple themes
sx={{
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background,
  borderColor: theme.palette.borders,
  transition: 'all 150ms ease-in-out', // Smooth theme transitions
  '&:hover': {
    backgroundColor: theme.palette.surface,
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}}
```

---

### 4.1 Deliverables Checklist

- [ ] `v2/src/lib/themes.ts` - All three theme definitions (350+ lines)
- [ ] `v2/src/components/theme/ThemeProvider.tsx` - Theme provider with SSR support
- [ ] `v2/src/components/theme/ThemeToggle.tsx` - Theme switcher button
- [ ] `v2/src/hooks/useTheme.ts` - Theme state hook
- [ ] `v2/src/hooks/useColorMode.ts` - System preference detection hook
- [ ] Updated `v2/src/lib/theme.ts` - MUI theme export
- [ ] Enhanced `v2/app/layout.tsx` - Theme provider integration
- [ ] Update all components with theme-aware styling
- [ ] Unit tests for theme switching (80%+ coverage)
- [ ] Visual tests for all three themes
- [ ] Contrast verification (WCAG AA on all, AAA on high-contrast)
- [ ] Documentation: Theme switching guide (v2/README.md update)

---

## Task 4.2: Internationalization (i18n)

### Overview

Set up internationalization infrastructure with string externalization and locale-aware formatting. This task focuses on infrastructure for future multi-language support rather than implementing multiple languages.

### Requirements

#### 4.2.1 i18n Library Setup

**Technology Choice:** `next-intl` (recommended for Next.js)

**Alternative:** `react-i18next` + `i18next`

**Rationale:**
- `next-intl`: Built for Next.js, SSR-friendly, TypeScript support
- `react-i18next`: More flexible, larger ecosystem, but more setup

**Installation:**

```bash
npm install next-intl
npm install -D @types/node  # For TypeScript
```

**Configuration:** `v2/src/lib/i18n.ts`

```typescript
/**
 * i18n configuration and utilities.
 *
 * Centralizes internationalization setup including:
 * - Locale list and defaults
 * - String translation lookup
 * - Locale-aware formatting (dates, numbers, currency)
 * - RTL support foundation
 *
 * Current support: English (en-US)
 * Future: Add additional locales by extending LOCALES array
 */

export const LOCALES = ['en'] as const;
export const DEFAULT_LOCALE = 'en' as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Type-safe translation keys to prevent runtime errors.
 * Enables IDE autocomplete for translation strings.
 */
export type TranslationKey =
  | 'common.home'
  | 'common.resume'
  | 'common.colophon'
  | 'common.about'
  | 'nav.portfolio'
  | 'nav.resume'
  | 'nav.colophon'
  | 'pages.home.title'
  | 'pages.home.subtitle'
  | 'pages.resume.title'
  // ... extend as needed
  ;

/**
 * Translations for all supported locales.
 */
const translations: Record<Locale, Record<string, string>> = {
  en: {
    'common.home': 'Home',
    'common.resume': 'Resume',
    'common.colophon': 'Colophon',
    'common.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.resume': 'Resume',
    'nav.colophon': 'About',
    'pages.home.title': 'Portfolio',
    'pages.home.subtitle': 'A selection of my work',
    // ... complete translations
  },
};

/**
 * Get translated string for a given key and locale.
 *
 * @param key - Translation key (e.g., 'common.home')
 * @param locale - Locale (default: en)
 * @returns Translated string or key if not found
 *
 * @example
 * const text = t('common.home'); // Returns "Home"
 */
export function t(key: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  return translations[locale]?.[key] ?? key;
}

/**
 * Format date according to locale.
 *
 * @param date - Date to format
 * @param locale - Locale (default: en-US)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2026-02-02'), 'en-US');
 * // Returns: "February 2, 2026"
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format number according to locale.
 *
 * @param number - Number to format
 * @param locale - Locale (default: en-US)
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234.56, 'en-US'); // Returns: "1,234.56"
 * formatNumber(1234.56, 'de-DE'); // Returns: "1.234,56"
 */
export function formatNumber(
  number: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format currency according to locale.
 *
 * @param amount - Amount to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param locale - Locale (default: en-US)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, 'USD', 'en-US');
 * // Returns: "$1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
```

---

#### 4.2.2 Translation Files

**Directory Structure:**

```
v2/src/locales/
├── en/
│   ├── common.json          # Common UI strings
│   ├── pages.json           # Page-specific content
│   ├── components.json      # Component strings
│   └── meta.json            # SEO metadata
├── index.ts                 # Locale configuration
└── README.md                # i18n documentation
```

**Example: `v2/src/locales/en/common.json` (50+ entries)**

```json
{
  "app": {
    "name": "Sing Chan's Portfolio",
    "description": "A creative technologist with 25+ years experience"
  },
  "nav": {
    "home": "Home",
    "portfolio": "Portfolio",
    "resume": "Resume",
    "colophon": "About",
    "skipToMain": "Skip to main content"
  },
  "footer": {
    "copyright": "© 2013-2026 Sing Chan. All rights reserved.",
    "madeWith": "Made with Next.js, React, and TypeScript"
  },
  "buttons": {
    "loadMore": "Load more projects",
    "close": "Close",
    "previous": "Previous",
    "next": "Next"
  }
}
```

**Example: `v2/src/locales/en/pages.json`**

```json
{
  "home": {
    "title": "Portfolio",
    "subtitle": "A selection of my work"
  },
  "resume": {
    "title": "Resume",
    "downloadPDF": "Download as PDF"
  },
  "colophon": {
    "title": "About",
    "subtitle": "About this site and Buta"
  },
  "project": {
    "relatedProjects": "Related Projects",
    "viewAllProjects": "View All Projects"
  }
}
```

---

#### 4.2.3 i18n Hook

**Hook:** `v2/src/hooks/useI18n.ts`

```typescript
/**
 * Hook for accessing localized strings and formatting utilities.
 *
 * Provides:
 * - t(): Get translated string
 * - formatDate(): Locale-aware date formatting
 * - formatNumber(): Locale-aware number formatting
 * - formatCurrency(): Currency formatting
 * - locale: Current locale
 *
 * @returns i18n utilities object
 *
 * @example
 * const { t, formatDate } = useI18n();
 * return <h1>{t('pages.home.title')}</h1>;
 */
export function useI18n() {
  const locale = useLocale(); // from next-intl

  return {
    t: (key: string) => t(key, locale),
    formatDate: (date: Date) => formatDate(date, locale),
    formatNumber: (num: number) => formatNumber(num, locale),
    formatCurrency: (amount: number, currency: string) =>
      formatCurrency(amount, currency, locale),
    locale,
  };
}
```

---

#### 4.2.4 Component Integration

**Update Components to Use i18n:**

All user-facing strings must be externalized. Examples:

```typescript
// Before
<Button>Load more projects</Button>

// After
import { useI18n } from '@/hooks/useI18n';

export function ProjectGrid() {
  const { t } = useI18n();

  return <Button>{t('buttons.loadMore')}</Button>;
}
```

**Files Requiring Updates:**

- [ ] Header.tsx - Navigation labels
- [ ] Footer.tsx - Copyright, links
- [ ] ProjectCard.tsx - Alt text, labels
- [ ] ResumeHeader.tsx - Contact labels
- [ ] All other user-facing text

---

#### 4.2.5 Locale-Aware Formatting

**Dates:**

```typescript
// Current circa dates in projects
// Before: "circa 2025"
// After: Formatted with locale awareness
const formattedDate = formatDate(new Date(2025, 0, 1)); // "January 1, 2025"
```

**Numbers:**

```typescript
// Project image count or statistics
const imageCount = formatNumber(239); // "239"
const imageCountDE = formatNumber(239, 'de-DE'); // "239"
```

**Future Currency Support:**

```typescript
// For potential freelance rates or pricing
const rate = formatCurrency(150, 'USD', locale);
```

---

#### 4.2.6 RTL Support Foundation

While not implementing RTL now, structure code to support it:

```typescript
// Document language attribute
<html lang={locale}>
  {locale === 'ar' && <body dir="rtl" />}
  {locale !== 'ar' && <body dir="ltr" />}
</html>

// CSS for RTL (future)
// @supports (--webkit-appearance: none) { /* RTL styles */ }
```

---

### 4.2 Deliverables Checklist

- [ ] `v2/src/lib/i18n.ts` - i18n configuration (250+ lines)
- [ ] `v2/src/hooks/useI18n.ts` - i18n usage hook
- [ ] `v2/src/hooks/useLocale.ts` - Locale state hook
- [ ] `v2/src/locales/en/common.json` - Common strings
- [ ] `v2/src/locales/en/pages.json` - Page content
- [ ] `v2/src/locales/en/components.json` - Component strings
- [ ] `v2/src/locales/en/meta.json` - SEO metadata
- [ ] Updated all components with `useI18n()` hook
- [ ] next-intl configuration (if using)
- [ ] Unit tests for i18n utilities (100% coverage)
- [ ] Documentation: i18n guide (v2/README.md update)
- [ ] Type definitions for translation keys (TypeScript safety)

---

## Task 4.3: Animations & Transitions

### Overview

Add polished animations throughout the site while respecting `prefers-reduced-motion` for accessibility.

### Requirements

#### 4.3.1 Global Animation Styles

**File:** `v2/src/styles/animations.css`

```css
/**
 * Global animation definitions and utilities.
 * All animations respect prefers-reduced-motion preference.
 */

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide-up animation */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Slide-down animation */
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale animation */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Rotate animation */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse animation for loading states */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shimmer animation for skeleton loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Animation utility classes */
.animate-fade-in {
  animation: fadeIn 300ms ease-in;
}

.animate-slide-up {
  animation: slideUp 400ms ease-out;
}

.animate-scale-in {
  animation: scaleIn 300ms ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

#### 4.3.2 Component-Specific Animations

**Hover Effects on Cards:**

```typescript
/**
 * ProjectCard with smooth hover animation.
 */
export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 200ms ease-out',
        boxShadow: 1,
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '&:hover': {
            transform: 'none',
          },
        },
      }}
    >
      {/* Card content */}
    </Card>
  );
}
```

**Button Animations:**

```typescript
sx={{
  transition: 'all 150ms ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.02)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': { transform: 'none' },
    '&:active': { transform: 'none' },
  },
}}
```

**Page Transitions:**

```typescript
/**
 * Fade-in transition for page content.
 * Wraps page content with fade animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <Box
      sx={{
        animation: reducedMotion ? 'none' : 'fadeIn 300ms ease-in',
      }}
    >
      {children}
    </Box>
  );
}
```

---

#### 4.3.3 Scroll Animations

**Scroll Fade-In Hook:**

```typescript
/**
 * Hook to trigger fade-in animation when element enters viewport.
 *
 * @param options - Intersection Observer options
 * @returns Object with ref and isInView boolean
 *
 * @example
 * const { ref, isInView } = useScrollAnimation();
 * return (
 *   <Box ref={ref} sx={{ opacity: isInView ? 1 : 0 }}>
 *     Content
 *   </Box>
 * );
 */
export function useScrollAnimation(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return {
    ref,
    isInView: reducedMotion ? true : isInView, // Show immediately if reduced motion
  };
}
```

**Usage in ProjectGrid:**

```typescript
export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <Grid container spacing={2}>
      {projects.map((project) => (
        <ScrollFadeInCard key={project.id} project={project} />
      ))}
    </Grid>
  );
}

function ScrollFadeInCard({ project }: { project: Project }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 400ms ease-out',
      }}
    >
      <ProjectCard project={project} />
    </Box>
  );
}
```

---

#### 4.3.4 Loading Animations

**Enhanced Loading Skeleton:**

```typescript
/**
 * Skeleton loading component with shimmer animation.
 * Respects prefers-reduced-motion.
 */
export function LoadingSkeleton({ variant = 'card', count = 3 }: LoadingSkeletonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant as any}
          height={200}
          sx={{
            animation: reducedMotion ? 'none' : 'shimmer 2s infinite',
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </Box>
  );
}
```

---

#### 4.3.5 Transition Timing

**Consistent Duration Standards:**

```typescript
// Define reusable transition durations
export const TRANSITION_DURATIONS = {
  INSTANT: '0ms',
  FAST: '150ms',
  STANDARD: '300ms',
  SLOW: '500ms',
} as const;

export const TRANSITION_TIMING = {
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  LINEAR: 'linear',
} as const;

// Usage
sx={{
  transition: `all ${TRANSITION_DURATIONS.STANDARD} ${TRANSITION_TIMING.EASE_OUT}`,
}}
```

---

### 4.3 Deliverables Checklist

- [ ] `v2/src/styles/animations.css` - Global animations
- [ ] `v2/src/hooks/useReducedMotion.ts` - Accessibility hook
- [ ] `v2/src/hooks/useScrollAnimation.ts` - Scroll fade-in hook
- [ ] Update `ProjectCard.tsx` with hover animations
- [ ] Update `ProjectGrid.tsx` with scroll animations
- [ ] Update `Lightbox.tsx` with transitions
- [ ] Update `ThemeToggle.tsx` with smooth transitions
- [ ] Enhance `LoadingSkeleton.tsx` with shimmer
- [ ] Add page transition component
- [ ] Button and link animations
- [ ] Unit tests for animation hooks
- [ ] Manual testing with `prefers-reduced-motion` enabled
- [ ] Visual regression testing for animations

---

## Task 4.4: WCAG 2.2 Level AA Compliance

### Overview

Comprehensive accessibility audit and remediation to achieve WCAG 2.2 Level AA compliance on all pages.

### Requirements

#### 4.4.1 Accessibility Audit Checklist

**Perceivable:**

- [ ] **1.1.1 Non-text Content** (Level A)
  - [ ] All images have descriptive alt text
  - [ ] Decorative images use empty alt="" or role="presentation"
  - [ ] Complex images have long descriptions
  - [ ] Icons in buttons have aria-labels

- [ ] **1.2 Audio & Video** (Level A/AA)
  - [ ] All videos have captions (1.2.2)
  - [ ] All videos have audio descriptions (1.2.3)
  - [ ] Transcripts available for audio-only content

- [ ] **1.3 Adaptable** (Level A/AA)
  - [ ] Proper heading hierarchy (h1 → h2 → h3)
  - [ ] Lists use semantic markup (<ul>, <ol>, <li>)
  - [ ] Form labels properly associated with inputs
  - [ ] Table headers identified correctly
  - [ ] Content remains meaningful in single column

- [ ] **1.4 Distinguishable** (Level A/AA)
  - [ ] **1.4.3 Contrast (Minimum)** (Level AA) - CRITICAL
    - Normal text: 4.5:1 ratio
    - Large text (18pt+ or 14pt+ bold): 3:1 ratio
    - UI components: 3:1 ratio
  - [ ] **1.4.11 Non-text Contrast** (Level AA)
    - Graphical objects: 3:1 ratio
    - UI component states: 3:1 ratio
  - [ ] Color not sole means of conveying information
  - [ ] Text can be resized to 200% without loss
  - [ ] No text in images (except logos, screenshots)

**Operable:**

- [ ] **2.1 Keyboard** (Level A)
  - [ ] All functionality available via keyboard
  - [ ] No keyboard traps
  - [ ] Focus order is logical
  - [ ] Skip links provided for navigation

- [ ] **2.4 Navigation** (Level A/AA)
  - [ ] **2.4.3 Focus Order** (Level A)
    - Focus order follows logical, meaningful sequence
    - No focus jumps unexpectedly
  - [ ] **2.4.7 Focus Visible** (Level AA) - CRITICAL
    - All interactive elements have visible focus indicator
    - Focus indicator has 3:1 contrast ratio
    - Focus indicator not smaller than 1px
  - [ ] Descriptive page titles
  - [ ] Proper heading hierarchy
  - [ ] Link purpose is clear (not "click here")
  - [ ] Multiple navigation methods (menu, search, breadcrumbs)

- [ ] **2.5 Input Modalities** (Level A/AA)
  - [ ] **2.5.8 Target Size (Minimum)** (Level AA) - NEW in WCAG 2.2
    - Buttons and links: 44px × 44px minimum
    - Spacing: 8px minimum between targets
  - [ ] Pointer cancellation supported
  - [ ] No motion-triggered actions
  - [ ] Label in name for voice control

**Understandable:**

- [ ] **3.1 Language** (Level A)
  - [ ] Page language specified (<html lang="en">)
  - [ ] Language changes identified (e.g., foreign phrases)

- [ ] **3.2 Predictable** (Level A/AA)
  - [ ] Navigation consistent across pages
  - [ ] Components behave consistently
  - [ ] No unexpected context changes on focus/input
  - [ ] Buttons and links trigger expected actions

- [ ] **3.3 Input Assistance** (Level A/AA)
  - [ ] Form labels clear and associated
  - [ ] Error messages descriptive and helpful
  - [ ] Error prevention for critical transactions
  - [ ] Input requirements explained

**Robust:**

- [ ] **4.1 Compatible** (Level A/AA)
  - [ ] Valid HTML markup
  - [ ] Proper semantic markup
  - [ ] ARIA attributes used correctly
  - [ ] No duplicate IDs on page
  - [ ] Name, role, value correct for all components

---

#### 4.4.2 Automated Testing

**Tools:**

- [ ] axe DevTools (browser extension)
- [ ] Lighthouse (browser DevTools)
- [ ] @axe-core/react (automated testing)
- [ ] WebAIM Contrast Checker

**CI/CD Integration:**

```bash
# Add to npm scripts
npm run a11y:audit     # Run axe-core audit
npm run lighthouse:ci  # Lighthouse in CI
```

**Test File:** `v2/src/__tests__/accessibility/wcag2.2.test.tsx`

```typescript
/**
 * WCAG 2.2 Level AA compliance tests.
 *
 * Runs automated accessibility checks on all pages and components.
 * Does not replace manual testing, but catches common issues.
 */
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import HomePage from '@/app/page';

expect.extend(toHaveNoViolations);

describe('WCAG 2.2 Level AA Compliance', () => {
  describe('HomePage', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<HomePage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    // Test specific WCAG criteria
    it('should have proper contrast ratios', async () => {
      // Automated check for 1.4.3 and 1.4.11
    });

    it('should have visible focus indicators', async () => {
      // Check 2.4.7
    });

    it('should have sufficient touch targets', async () => {
      // Check 2.5.8
    });
  });
});
```

---

#### 4.4.3 Manual Testing Checklist

**Keyboard Navigation:**

- [ ] Tab through entire page
- [ ] Focus order is logical
- [ ] No keyboard traps
- [ ] Focus visible on all interactive elements
- [ ] Can activate buttons with Enter/Space
- [ ] Can navigate form inputs with Tab
- [ ] Can close modals with Escape

**Screen Reader Testing:**

Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS/iOS):

- [ ] Page title announced
- [ ] Heading hierarchy correct
- [ ] Navigation landmarks identified
- [ ] Form labels announced with inputs
- [ ] Alt text read for images
- [ ] Button purposes clear
- [ ] Status messages announced
- [ ] Links have descriptive text
- [ ] Tables have headers announced

**Color Contrast:**

- [ ] Use WebAIM Contrast Checker or Color Contrast Analyzer
- [ ] Check all text colors against backgrounds
- [ ] Check UI component colors
- [ ] Verify 4.5:1 for normal text
- [ ] Verify 3:1 for large text
- [ ] Verify 3:1 for UI components
- [ ] Verify 7:1 for high contrast theme

**Zoom & Resize:**

- [ ] Page works at 200% zoom
- [ ] No horizontal scrolling at 1280px
- [ ] Text remains readable
- [ ] Touch targets remain accessible

---

#### 4.4.4 Remediations

**Common Issues & Fixes:**

| Issue | Criterion | Fix |
|-------|-----------|-----|
| Missing alt text | 1.1.1 | Add descriptive alt to all images |
| Low contrast text | 1.4.3 | Increase text color contrast to 4.5:1 |
| Non-visible focus | 2.4.7 | Add outline: 2px solid with 3:1 ratio |
| Small touch targets | 2.5.8 | Make buttons/links 44px × 44px minimum |
| No form labels | 3.3.2 | Add <label> or aria-label to inputs |
| Poor heading hierarchy | 1.3.1 | Ensure h1 → h2 → h3 sequence |
| Missing skip link | 2.4.1 | Add skip-to-main-content link |
| Unclear link text | 2.4.4 | Replace "click here" with descriptive text |
| Missing captions | 1.2.2 | Add captions to all videos |

---

#### 4.4.5 Documentation

**File:** `v2/ACCESSIBILITY_STATEMENT.md`

```markdown
# Accessibility Statement

Sing Chan's Portfolio is committed to accessibility for all users.
This site aims to meet WCAG 2.2 Level AA standards.

## Accessibility Features

- [x] Keyboard navigation fully supported
- [x] Screen reader compatible
- [x] Color contrast meets WCAG AA standards
- [x] Sufficient touch targets (44px minimum)
- [x] Responsive design works on all devices
- [x] Reduced motion preferences respected
- [x] All videos have captions
- [x] Multiple navigation methods available

## Accessibility Testing

We regularly test this site using:
- Automated testing (axe-core, Lighthouse)
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation validation
- Color contrast verification

## Known Issues

None currently known. Please report issues to [contact method].

## Feedback

We welcome accessibility feedback. Please contact: [email/form]

## Standards Compliance

This site aims to conform to:
- WCAG 2.2 Level AA
- Section 508 of the Rehabilitation Act
- ADA (Americans with Disabilities Act)
```

---

### 4.4 Deliverables Checklist

- [ ] Complete accessibility audit (all WCAG 2.2 AA criteria)
- [ ] `v2/ACCESSIBILITY_STATEMENT.md` - Public accessibility commitment
- [ ] `v2/src/__tests__/accessibility/wcag2.2.test.tsx` - Automated tests
- [ ] All contrast ratios verified (4.5:1 for text, 3:1 for UI)
- [ ] Focus indicators visible on all interactive elements
- [ ] Touch targets 44px × 44px minimum
- [ ] All images have alt text
- [ ] All videos have captions
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader testing completed
- [ ] Manual testing results documented
- [ ] Remediation of any identified issues
- [ ] Zero WCAG 2.2 AA violations verified

---

## Task 4.5: SEO Optimization

### Overview

Implement comprehensive SEO optimization including meta tags, structured data, sitemap, robots.txt, and canonical URLs.

### Requirements

#### 4.5.1 Meta Tags & Open Graph

**Layout Meta Tags:**

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "Sing Chan's Portfolio",
  description: 'A creative technologist with 25+ years experience. Explore my work in product management, design, and full-stack development.',
  keywords: 'portfolio, web design, development, product management, TypeScript, React',
  authors: [{ name: 'Sing Chan' }],
  openGraph: {
    title: "Sing Chan's Portfolio",
    description: 'A creative technologist with 25+ years experience.',
    type: 'website',
    url: 'https://portfolio.singchan.com',
    siteName: 'Sing Chan Portfolio',
    images: [
      {
        url: 'https://portfolio.singchan.com/og-image.png',
        width: 1200,
        height: 630,
        alt: "Sing Chan's Portfolio",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sing Chan's Portfolio",
    description: 'A creative technologist with 25+ years experience.',
    images: ['https://portfolio.singchan.com/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};
```

**Page-Specific Meta Tags:**

```typescript
/**
 * SEO metadata for all pages.
 * Supports dynamic generation based on content.
 */
export const SEO_METADATA: Record<string, PageSEO> = {
  home: {
    title: "Sing Chan's Portfolio - Product Manager & Full-Stack Developer",
    description: 'Explore portfolio projects from a creative technologist with 25+ years experience in product management, design, and full-stack development.',
    keywords: ['portfolio', 'product management', 'development'],
    canonical: 'https://portfolio.singchan.com',
  },
  resume: {
    title: 'Sing Chan - Resume | Portfolio',
    description: 'Professional resume of Sing Chan. VP Product at Collabware Systems with 25+ years of experience in product management, design, and technology.',
    keywords: ['resume', 'product manager', 'cv'],
    canonical: 'https://portfolio.singchan.com/resume',
  },
  colophon: {
    title: 'About This Site | Sing Chan Portfolio',
    description: 'Learn about this portfolio site, the technologies used, design philosophy, and the story of Buta the mascot.',
    keywords: ['about', 'colophon', 'design philosophy'],
    canonical: 'https://portfolio.singchan.com/colophon',
  },
};
```

---

#### 4.5.2 Structured Data (JSON-LD)

**File:** `v2/src/lib/seo.ts`

```typescript
/**
 * Generate structured data for SEO.
 * Helps search engines understand page content and appearance.
 */

/**
 * Generate Person schema for author/portfolio owner.
 *
 * @returns JSON-LD structured data for Person
 *
 * @example
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonSchema()) }}
 * />
 */
export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sing Chan',
    url: 'https://portfolio.singchan.com',
    image: 'https://portfolio.singchan.com/images/sing-chan.jpg',
    description: 'A creative technologist with 25+ years experience',
    jobTitle: 'VP Product',
    sameAs: [
      'https://linkedin.com/in/singchan',
      'https://github.com/singchan',
    ],
  };
}

/**
 * Generate BreadcrumbList schema for navigation.
 *
 * @param items - Breadcrumb items
 * @returns JSON-LD breadcrumb schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Project schema for portfolio items.
 *
 * @param project - Project data
 * @returns JSON-LD project schema
 */
export function getProjectSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.desc,
    image: project.images[0]?.url,
    datePublished: project.circa,
    keywords: project.tags.join(', '),
    creator: {
      '@type': 'Person',
      name: 'Sing Chan',
    },
  };
}

/**
 * Generate Organization schema.
 *
 * @returns JSON-LD organization schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sing Chan',
    url: 'https://portfolio.singchan.com',
    description: 'A creative technologist with 25+ years experience',
    sameAs: [
      'https://linkedin.com/in/singchan',
      'https://github.com/singchan',
    ],
  };
}
```

**Usage in Components:**

```typescript
/**
 * Insert JSON-LD structured data in page head.
 */
export function PageStructuredData({ schema }: { schema: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}

// In page component
<PageStructuredData schema={getPersonSchema()} />
```

---

#### 4.5.3 Sitemap Generation

**File:** `v2/app/sitemap.ts`

```typescript
/**
 * Dynamic sitemap generation for Next.js.
 * Helps search engines discover and crawl all pages.
 *
 * Automatically generates sitemap.xml with:
 * - All static pages (/, /resume, /colophon)
 * - All dynamic project pages (/projects/[id])
 * - Last modified dates
 * - Change frequencies
 * - Priority values
 */
import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/projectData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portfolio.singchan.com';
  const projects = getProjects();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/colophon`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
```

---

#### 4.5.4 Robots.txt

**File:** `v2/public/robots.txt`

```
# Allow all crawlers
User-agent: *
Allow: /

# Point to sitemap
Sitemap: https://portfolio.singchan.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
```

---

#### 4.5.5 Canonical URLs

**Add to All Pages:**

```typescript
// Use Next.js metadata API
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://portfolio.singchan.com/path',
  },
};
```

---

#### 4.5.6 Performance Considerations for SEO

**Meta Tag Optimization:**

```typescript
// app/projects/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = getProjectById(params.id);

  return {
    title: `${project.title} | Sing Chan Portfolio`,
    description: project.desc.substring(0, 160), // Truncate for meta description
    openGraph: {
      title: project.title,
      description: project.desc.substring(0, 160),
      images: [project.images[0].url],
    },
    alternates: {
      canonical: `https://portfolio.singchan.com/projects/${params.id}`,
    },
  };
}
```

---

### 4.5 Deliverables Checklist

- [ ] `v2/src/lib/seo.ts` - SEO utilities and schema generators
- [ ] Updated `v2/app/layout.tsx` with meta tags
- [ ] Updated all page files with page-specific metadata
- [ ] `v2/app/sitemap.ts` - Dynamic sitemap generation
- [ ] `v2/public/robots.txt` - Robots file
- [ ] Structured data (JSON-LD) on all pages
- [ ] Open Graph tags for social sharing
- [ ] Twitter card tags
- [ ] Canonical URLs on all pages
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] SEO audit with Lighthouse
- [ ] Manual verification of meta tags in browser DevTools

---

## File Structure

### Complete Phase 4 File Structure

```
v2/
├── app/
│   ├── layout.tsx                      # Enhanced with theme provider, meta tags
│   ├── sitemap.ts                      # Dynamic sitemap generation
│   ├── robots.ts                       # robots.txt generator
│   ├── page.tsx                        # Enhanced with i18n
│   ├── resume/
│   │   └── page.tsx                    # Enhanced with i18n
│   ├── colophon/
│   │   └── page.tsx                    # Enhanced with i18n
│   └── projects/
│       └── [id]/
│           └── page.tsx                # Enhanced with i18n, SEO
├── src/
│   ├── components/
│   │   ├── theme/
│   │   │   ├── ThemeToggle.tsx        # Theme switcher
│   │   │   ├── ThemeProvider.tsx      # Enhanced provider
│   │   │   └── ColorModeScript.tsx    # Theme detection
│   │   └── [existing components]      # Enhanced with i18n
│   ├── hooks/
│   │   ├── useTheme.ts                # Theme state
│   │   ├── useColorMode.ts            # System detection
│   │   ├── useLocale.ts               # Locale state
│   │   ├── useI18n.ts                 # i18n usage
│   │   ├── useScrollAnimation.ts       # Scroll fade-in
│   │   ├── useReducedMotion.ts        # Motion preference
│   │   └── [existing hooks]
│   ├── lib/
│   │   ├── themes.ts                  # Theme definitions
│   │   ├── i18n.ts                    # i18n config
│   │   ├── seo.ts                     # SEO utilities
│   │   └── [existing lib files]
│   ├── locales/
│   │   ├── en/
│   │   │   ├── common.json
│   │   │   ├── pages.json
│   │   │   ├── components.json
│   │   │   └── meta.json
│   │   └── index.ts
│   ├── styles/
│   │   ├── animations.css             # Global animations
│   │   └── [existing styles]
│   ├── types/
│   │   ├── theme.ts                   # Theme types
│   │   ├── i18n.ts                    # i18n types
│   │   └── [existing types]
│   └── __tests__/
│       ├── accessibility/
│       │   └── wcag2.2.test.tsx       # WCAG compliance tests
│       ├── hooks/
│       │   ├── useTheme.test.ts
│       │   ├── useI18n.test.ts
│       │   ├── useScrollAnimation.test.ts
│       │   └── [new test files]
│       └── [existing tests]
├── ACCESSIBILITY_STATEMENT.md         # Public accessibility commitment
├── public/
│   └── robots.txt                     # robots.txt file
└── [existing structure]
```

---

## Testing Strategy

### Unit Tests

Each new component/hook requires tests:

| Component | Tests Required |
|-----------|-----------------|
| useTheme | Theme switching, persistence, SSR |
| useI18n | Translation lookup, locale formatting |
| useScrollAnimation | Intersection observer, animation state |
| useReducedMotion | Media query detection, updates |
| ThemeToggle | Cycling, accessibility, tooltip |
| ThemeProvider | Initialization, theme application |

### Accessibility Tests

- [ ] WCAG 2.2 AA compliance (axe-core)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast verification
- [ ] Focus management

### Manual Testing

- [ ] Theme switching on all pages
- [ ] i18n strings display correctly
- [ ] Animations respect reduced motion
- [ ] SEO tags present in HTML
- [ ] Structured data validates
- [ ] Sitemap generated correctly

---

## Accessibility Compliance

### WCAG 2.2 Criteria

All Phase 4 features must maintain WCAG 2.2 Level AA compliance:

- [ ] Theme switching doesn't break accessibility
- [ ] i18n doesn't affect screen readers
- [ ] Animations respect prefers-reduced-motion
- [ ] New components meet contrast requirements
- [ ] Focus management preserved

---

## Technical Decisions

### Theme Implementation

**Decision:** MUI System + Custom Hooks

**Rationale:**
- MUI built-in theming is flexible
- Emotion provides low-level control
- Custom hooks manage state cleanly
- Easy to persist preference

### i18n Library

**Decision:** next-intl

**Rationale:**
- Built for Next.js
- TypeScript support
- SSR-friendly
- Smaller bundle than react-i18next

### Animation Library

**Decision:** CSS + React Hooks (no external library)

**Rationale:**
- Built-in CSS for performance
- React hooks for state management
- No additional dependency
- Easy to respect prefers-reduced-motion

---

## Dependencies

### Required New Dependencies

```json
{
  "dependencies": {
    "next-intl": "^3.x"
  },
  "devDependencies": {
    "@axe-core/react": "^4.x"
  }
}
```

### Optional Dependencies

```json
{
  "framer-motion": "^11.x"  // Optional: advanced animations
}
```

---

## Success Criteria

### Functional Requirements

- [ ] Theme switching works on all pages
- [ ] User preference persists across sessions
- [ ] i18n infrastructure ready for future languages
- [ ] Animations respect accessibility preferences
- [ ] All dates/numbers format correctly by locale
- [ ] SEO meta tags present on all pages
- [ ] Sitemap generates and validates
- [ ] Structured data validates

### Quality Requirements

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Test coverage: ≥80%
- [ ] WCAG 2.2 AA: 0 violations
- [ ] Lighthouse Accessibility: 100
- [ ] axe-core: 0 critical/serious issues

### Performance Requirements

- [ ] Theme switch < 100ms
- [ ] No layout shift on theme change
- [ ] Animations smooth (60fps)
- [ ] Bundle size increase < 50KB

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hydration mismatch (theme) | High | Use ColorModeScript, SSR-safe initialization |
| Performance regression | Medium | Monitor bundle size, profile animations |
| Accessibility breaks | High | Comprehensive testing, automated audits |
| i18n complexity | Medium | Start simple, document well |
| Animation performance | Medium | Use CSS over JS when possible |

---

## Implementation Order

### Week 1: Theme Switching

1. Install MUI System dependencies
2. Create theme definitions (light, dark, high-contrast)
3. Build ThemeProvider component
4. Build ThemeToggle component
5. Build useTheme and useColorMode hooks
6. Test on all pages
7. Verify contrast ratios
8. Write tests

### Week 2: i18n & Animations

1. Set up next-intl library
2. Create locale files
3. Build useI18n hook
4. Update all components with translations
5. Add global animation styles
6. Add scroll animations to cards
7. Update transitions throughout
8. Write animation tests

### Week 3: WCAG & SEO

1. Run comprehensive accessibility audit
2. Document findings and remediations
3. Fix contrast issues
4. Fix focus indicators
5. Fix touch targets
6. Write accessibility tests
7. Create structured data
8. Generate sitemap
9. Add meta tags to all pages
10. Write SEO tests

---

## Appendix: WCAG 2.2 Level AA Quick Reference

### Critical Success Criteria

**Must Implement:**
- [ ] 1.4.3 Contrast (Minimum) - 4.5:1 for normal text
- [ ] 1.4.11 Non-text Contrast - 3:1 for UI components
- [ ] 2.4.7 Focus Visible - Clear focus indicators
- [ ] 2.5.8 Target Size (Minimum) - 44px × 44px buttons
- [ ] 2.1.1 Keyboard - All functionality via keyboard
- [ ] 1.1.1 Non-text Content - Alt text on all images

**Automated Testing** (catches ~30%):
- [ ] axe DevTools browser extension
- [ ] Lighthouse CI
- [ ] @axe-core/react in tests

**Manual Testing** (required for 100%):
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast verification
- [ ] Visual inspection

---

**Document Status:** ⬜ NOT STARTED

**Next Action:** Review and approve plan before beginning implementation

**Estimated Timeline:** 2-3 weeks

---

**Version:** 1.0
**Created:** 2026-02-02
**Author:** Sing Chan (with Claude Code)

