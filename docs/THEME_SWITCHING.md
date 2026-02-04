# Theme Switching Implementation Guide

## Overview

This document describes the complete theme switching system implemented for the Sing Chan Portfolio. The system supports three themes:
- **Light**: Default theme with sage green and maroon palette
- **Dark**: Inverted colors for reduced eye strain in low-light
- **High Contrast**: Black and white for maximum accessibility (WCAG AAA)

## Architecture

### Components

```
Theme System Components:
├── ThemeContext (src/contexts/ThemeContext.tsx)
│   └── Manages global theme state
├── ThemeProvider (src/components/ThemeProvider.tsx)
│   └── Applies MUI theme based on current mode
├── ThemeToggle (src/components/theme/ThemeToggle.tsx)
│   └── UI button to switch themes
├── Hooks
│   ├── useTheme() (src/hooks/useTheme.ts)
│   │   └── Access and manage theme
│   └── useColorMode() (src/hooks/useColorMode.ts)
│       └── Detect system preference
├── Theme Definitions (src/lib/themes.ts)
│   ├── Light theme
│   ├── Dark theme
│   └── High Contrast theme
└── Types (src/types/theme.ts)
    └── Theme mode and palette types
```

## Usage Guide

### Basic Usage

The theme system is integrated into the root layout and automatically available to all components:

```tsx
import { useTheme } from "@/src/hooks/useTheme";

export function MyComponent() {
  const { theme, setTheme, getNextTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>
        Switch to Dark
      </button>
      <button onClick={() => setTheme(getNextTheme())}>
        Cycle Theme
      </button>
    </div>
  );
}
```

### Using ThemeToggle Component

The ThemeToggle component is already integrated into the Header:

```tsx
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";

export function MyHeader() {
  return (
    <header>
      <h1>My Site</h1>
      <ThemeToggle
        size="medium"
        onChange={(newTheme) => console.log("Theme changed to:", newTheme)}
      />
    </header>
  );
}
```

### Accessing System Preference

```tsx
import { useColorMode } from "@/src/hooks/useColorMode";

export function MyComponent() {
  const systemMode = useColorMode();
  return <p>Your OS prefers: {systemMode} mode</p>;
}
```

## Theme Files

### src/lib/themes.ts

Contains all three theme definitions with:
- Color palettes
- MUI component overrides
- Typography settings
- Focus and accessibility styles

Key functions:
- `getThemeByMode(mode)` - Get MUI theme by mode
- `getPaletteByMode(mode)` - Get color palette by mode
- `createThemeFromPalette(palette)` - Create theme from palette

### src/types/theme.ts

Type definitions:
- `ThemeMode` - 'light' | 'dark' | 'highContrast'
- `ColorScheme` - 'light' | 'dark'
- `ThemePalette` - Color configuration
- `ThemeConfig` - Complete theme configuration

## Features

### Persistence

Theme preference is automatically saved to localStorage:
```
localStorage.setItem('portfolio-theme-mode', 'dark')
```

### System Preference Detection

The system detects OS-level dark mode preference and uses it if no saved preference exists:
```
window.matchMedia('(prefers-color-scheme: dark)')
```

### Hydration Safety

SSR-safe initialization prevents flash of unstyled content:
- ThemeContext uses lazy initializers
- isMounted flag indicates when safe to render
- Initial theme applied during effect setup

### Meta Tags

The theme color is updated in the browser meta tag:
```html
<meta name="theme-color" content="#8BA888" />
```

### Accessibility

All themes meet WCAG 2.2 AA contrast requirements:
- Light theme: 4.5:1 contrast ratio
- Dark theme: 4.5:1 contrast ratio
- High Contrast: 7:1+ (WCAG AAA)

## Color Palettes

### Light Theme
- Background: #FFFFFF
- Primary: #8BA888 (Sage Green)
- Secondary: #8B1538 (Maroon)
- Text Primary: #1A1A1A

### Dark Theme
- Background: #121212
- Primary: #A8D5A8 (Light Sage)
- Secondary: #E85775 (Light Maroon)
- Text Primary: #FFFFFF

### High Contrast Theme
- Background: #000000 (Pure Black)
- Primary: #FFFFFF (Pure White)
- Secondary: #FFFFFF
- Text Primary: #FFFFFF

## Testing

Comprehensive test suite includes:

### Test Files
- `src/__tests__/hooks/useTheme.test.ts` - useTheme hook tests
- `src/__tests__/hooks/useColorMode.test.ts` - useColorMode hook tests
- `src/__tests__/components/theme/ThemeToggle.test.tsx` - ThemeToggle component tests
- `src/__tests__/contexts/ThemeContext.test.tsx` - ThemeContext provider tests

### Coverage
- Hook functionality (state management, persistence)
- Component rendering and accessibility
- System preference detection
- Theme cycling and switching
- localStorage integration
- SSR safety

Run tests:
```bash
npm test
```

## Integration Points

### Root Layout (app/layout.tsx)
```tsx
<ThemeContextProvider>
  <ThemeProvider>
    <MainLayout>{children}</MainLayout>
  </ThemeProvider>
</ThemeContextProvider>
```

### Header Component (src/components/common/Header.tsx)
ThemeToggle is integrated into the social icons section.

### MUI Components
All MUI components automatically adapt to the current theme:
- Button focus indicators
- Link colors
- Card shadows
- Text colors
- Background colors

## Styling Components for Themes

### Using theme in sx prop
```tsx
import { useTheme } from "@mui/material";

export function MyComponent() {
  const muiTheme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: muiTheme.palette.background.default,
        color: muiTheme.palette.text.primary,
      }}
    >
      Content
    </Box>
  );
}
```

### Using theme from context
```tsx
import { useThemeContext } from "@/src/contexts/ThemeContext";

export function MyComponent() {
  const { mode } = useThemeContext();

  return (
    <div>
      {mode === 'dark' && <DarkModeStyles />}
      {mode === 'light' && <LightModeStyles />}
    </div>
  );
}
```

## Best Practices

1. **Always use the theme system** - Don't hardcode colors
2. **Prefer useTheme() for functionality** - Simpler API than useThemeContext()
3. **Use MUI components** - They integrate with the theme automatically
4. **Respect prefers-reduced-motion** - Animations should be conditional
5. **Test with all three themes** - Ensure readability in each mode

## Browser Support

- Theme preference detection: All modern browsers
- localStorage: IE 8+ (not supported in private mode)
- CSS transitions: All modern browsers
- media queries: All modern browsers

## Troubleshooting

### Theme not persisting
Check that localStorage is enabled and not in private mode.

### Flash of unstyled content (FOUC)
Ensure ThemeContextProvider wraps the entire app before ThemeProvider.

### Hydration mismatch errors
The system uses `isMounted` flag and lazy initializers to prevent this.

### Component colors not updating
Ensure component uses theme from MUI or context, not hardcoded colors.

## Future Enhancements

Potential improvements:
- RTL (Right-to-Left) support
- Additional color themes
- Theme customization UI
- System preference syncing
- Animation preferences integration

## References

- [WCAG 2.2 Color Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [MUI theming](https://mui.com/material-ui/customization/theming/)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [System colors](https://www.w3.org/TR/css-color-4/#css-system-colors)

---

**Implementation Date:** 2026-02-03
**Version:** 1.0
**Status:** ✅ Complete and tested
