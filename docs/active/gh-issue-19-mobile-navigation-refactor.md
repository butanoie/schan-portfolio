# Mobile Navigation Refactoring Plan

## Context

**GitHub Issue:** [#19 - Refactor Navigation Behavior in Mobile Views](https://github.com/butanoie/schan-portfolio/issues/19)

**Problem:** The portfolio navigation currently uses a stacked vertical layout on mobile devices (below 960px), which works but takes up significant screen space. The footer also duplicates the navigation buttons, creating redundancy on small screens.

**Solution:** Implement a hamburger menu for mobile devices (< 600px) that:
- Hides the three main navigation buttons (Portfolio, Résumé, Colophon) behind a drawer menu
- Moves the settings button inside the hamburger menu drawer
- Keeps site title and social links visible in the header
- Removes duplicate navigation buttons from the footer while preserving the Buta mascot
- Uses MUI Drawer component sliding from the right side

**Design Decisions:**
- **Breakpoint:** Below 600px (`sm` breakpoint) - phones only, tablets retain full navigation
- **Menu Style:** MUI Drawer sliding from right
- **Header:** Navigation buttons AND settings button hidden on mobile (moved to hamburger menu)
- **Footer:** Only navigation buttons hidden on mobile (Buta mascot stays visible)

---

## Implementation Plan

### 1. Create HamburgerMenu Component

**File:** `/v2/src/components/common/HamburgerMenu.tsx` (new file)

**Component Structure:**
```typescript
/**
 * Hamburger menu component for mobile navigation.
 *
 * Displays a menu icon button on mobile devices (< 600px) that opens
 * a drawer containing the main navigation links and settings button.
 * The drawer slides in from the right side and closes after navigation
 * or when clicking outside.
 *
 * Features:
 * - Only visible on mobile devices (< 600px)
 * - MUI Drawer component sliding from right
 * - Contains Portfolio, Résumé, and Colophon navigation links
 * - Contains Settings button at the bottom of the menu
 * - Active page indication with maroon background
 * - Respects animations setting from AnimationsContext
 * - Full keyboard navigation and ARIA support
 *
 * @returns A hamburger menu icon button and drawer for mobile navigation
 */
```

**Key Features:**
- State: `const [open, setOpen] = useState(false);`
- Responsive hook: `const isMobile = useMediaQuery(theme.breakpoints.down('sm'));`
- Active detection: Reuse same `isActive()` logic from Header/Footer
- Navigation items: Same array structure as Header (Portfolio, Résumé, Colophon)
- Settings button: Include `SettingsButton` component at bottom of drawer
- Auto-close: Close drawer after clicking a nav link (but NOT after opening settings modal)
- Animations: Check `animationsEnabled` from `useAnimations()` hook

**MUI Components:**
- `IconButton` with `MenuIcon` for hamburger button
- `Drawer` with `anchor="right"` for slide-in menu
- `List`, `ListItem`, `ListItemButton` for navigation items
- `Divider` to separate navigation from settings button
- `SettingsButton` component (imported) for settings access
- `useMediaQuery` and `useTheme` for responsive behavior

**Styling:**
- Active nav: `NAV_COLORS.active` (#8B1538 maroon)
- Inactive nav: `BRAND_COLORS.sage` (#85B09C)
- Text: `NAV_COLORS.text` (white)
- Same hover states as Header/Footer
- Drawer width: 250px

**Accessibility:**
- `aria-label="Open navigation menu"` on hamburger button
- `aria-expanded` state on button
- `role="navigation"` on drawer content
- Keyboard support (Tab, Enter, Escape)
- Focus management (MUI Drawer handles this)

**i18n Keys:**
- `t("nav.menu.hamburger")` - Hamburger button label
- `t("nav.portfolio")`, `t("nav.resume")`, `t("nav.colophon")` - Nav labels (existing)

---

### 2. Update Header Component

**File:** `/v2/src/components/common/Header.tsx`

**Changes:**

1. **Add imports:**
```typescript
import { useMediaQuery } from "@mui/material";
import HamburgerMenu from "./HamburgerMenu";
```

2. **Add responsive detection:**
```typescript
// After line 45 (after palette declaration)
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

3. **Replace navigation section (lines 143-185):**
```typescript
<Box
  component="nav"
  aria-label="Main navigation"
  sx={{
    display: "flex",
    gap: 1,
    alignSelf: { xs: "auto", md: "flex-end" },
  }}
>
  {/* Show hamburger on mobile, full nav + settings on desktop */}
  {isMobile ? (
    <HamburgerMenu />
  ) : (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          component={Link}
          href={item.href}
          variant="contained"
          startIcon={item.icon}
          size="medium"
          aria-current={isActive(item.href) ? "page" : undefined}
          sx={{...existing styles...}}
        >
          {t(item.labelKey)}
        </Button>
      ))}
      <SettingsButton size="medium" />
    </>
  )}
</Box>
```

**Layout Adjustments:**
- Mobile: Only hamburger icon visible (settings moved inside drawer)
- Desktop: Nav buttons + settings button visible (existing behavior)
- No changes needed to site title or social links section

---

### 3. Update Footer Component

**File:** `/v2/src/components/common/Footer.tsx`

**Changes:**

1. **Add import:**
```typescript
import { useMediaQuery } from "@mui/material";
```

2. **Add responsive detection:**
```typescript
// After line 145 (after i18n hook)
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

3. **Wrap navigation section (lines 310-351) with conditional:**
```typescript
{/* Navigation Links - Hidden on mobile */}
{!isMobile && (
  <Box
    component="nav"
    aria-label="Footer navigation"
    sx={{
      display: "flex",
      gap: 1,
      mb: 1,
      flexWrap: "wrap",
    }}
  >
    {navLinks.map((link) => (
      <Button
        key={link.href}
        component={Link}
        href={link.href}
        variant="contained"
        startIcon={link.icon}
        size="medium"
        sx={{...existing styles...}}
      >
        {t(link.labelKey)}
      </Button>
    ))}
  </Box>
)}
```

**No Changes To:**
- Buta mascot (lines 195-225) - stays visible
- Thought bubble (lines 228-281) - stays visible
- Copyright text (lines 354-366) - stays visible
- Footer container styling - stays the same

---

### 4. Add i18n Translation Keys

**File:** `/v2/src/locales/en/common.json`

Add these keys to the `nav` section:
```json
{
  "nav": {
    // ...existing keys...
    "menu": {
      "hamburger": "Open navigation menu",
      "close": "Close navigation menu"
    }
  }
}
```

**File:** `/v2/src/locales/fr/common.json`

Add French translations:
```json
{
  "nav": {
    // ...existing keys...
    "menu": {
      "hamburger": "Ouvrir le menu de navigation",
      "close": "Fermer le menu de navigation"
    }
  }
}
```

---

### 5. Documentation Requirements

**Per CLAUDE.md Standards:**

All new code must include:
- Full JSDoc/TSDoc comments on component
- Props interface documentation
- Parameter descriptions for all functions
- Return type documentation
- Usage examples in component doc
- Inline comments for complex logic

**Example for HamburgerMenu:**
```typescript
/**
 * Hamburger menu component for mobile navigation.
 *
 * Displays a menu icon button on mobile devices (< 600px) that opens
 * a drawer containing the main navigation links and settings button.
 * The drawer slides in from the right side and closes after navigation
 * or when clicking outside.
 *
 * @returns A hamburger menu icon button and drawer for mobile navigation
 *
 * @example
 * ```tsx
 * <HamburgerMenu />
 * ```
 */
export default function HamburgerMenu() {
  // Implementation...
}
```

---

### 6. Verification & Testing

**Manual Testing:**

1. **Responsive Breakpoints:**
   - Desktop (>= 960px): Full navigation visible in header and footer
   - Tablet (600-959px): Full navigation visible in header and footer
   - Mobile (< 600px): Hamburger menu in header, no nav in footer

2. **Hamburger Menu Behavior:**
   - Click hamburger icon → drawer opens from right
   - Click outside drawer → drawer closes
   - Press Escape → drawer closes
   - Click nav link → navigate AND drawer closes
   - Click settings button → opens settings modal, drawer stays open
   - Active page shows maroon background
   - Settings button appears at bottom of drawer (below divider)

3. **Settings Button:**
   - On mobile: appears inside hamburger menu drawer
   - On desktop: appears right of nav buttons in header
   - Settings modal functions the same on both views

4. **Footer:**
   - Mobile: Buta visible, navigation hidden
   - Desktop: Both visible
   - Thought bubble positioning unaffected

5. **Animations Setting:**
   - Disable animations in settings
   - Open hamburger menu → should have no transition
   - Enable animations → should slide smoothly

6. **Accessibility:**
   - Tab through header → reaches hamburger button
   - Enter/Space on hamburger → opens drawer
   - Tab through drawer items → navigates correctly
   - Escape → closes drawer and returns focus
   - Screen reader announces "Open navigation menu"

7. **Theme Switching:**
   - Test with Light, Dark, High Contrast themes
   - Colors should adapt correctly

8. **Language Switching:**
   - Switch to French → hamburger label changes
   - Nav items use French labels

**Quality Checks:**

```bash
# TypeScript type checking
npm run type-check

# ESLint
npm run lint

# Build verification
npm run build
```

**Browser Testing:**
- Chrome DevTools mobile emulation
- Firefox Responsive Design Mode
- Safari iOS Simulator
- Physical devices (iPhone, Android phone)

---

## Critical Files

### Files to Create:
1. `/v2/src/components/common/HamburgerMenu.tsx` - New hamburger menu component with MUI Drawer

### Files to Modify:
2. `/v2/src/components/common/Header.tsx` - Add responsive logic and conditional rendering for hamburger vs. full nav
3. `/v2/src/components/common/Footer.tsx` - Hide navigation buttons on mobile using conditional rendering
4. `/v2/src/locales/en/common.json` - Add hamburger menu i18n keys
5. `/v2/src/locales/fr/common.json` - Add French translations for hamburger menu

---

## Implementation Sequence

1. **Create HamburgerMenu component** with full documentation
2. **Update Header component** to conditionally render hamburger or full nav
3. **Update Footer component** to hide nav on mobile
4. **Add i18n keys** for English and French
5. **Manual testing** across all breakpoints and devices
6. **Accessibility testing** with keyboard and screen reader
7. **Quality checks** (TypeScript, ESLint, build)

---

## Summary

This refactoring improves mobile UX by:
- ✅ Reducing visual clutter on small screens (< 600px)
- ✅ Providing a standard mobile navigation pattern (hamburger menu)
- ✅ Consolidating all navigation and settings into one menu on mobile
- ✅ Eliminating duplicate navigation in footer on mobile
- ✅ Maintaining full accessibility (WCAG 2.2 Level AA)
- ✅ Preserving brand elements (Buta mascot always visible)
- ✅ Supporting all themes and languages
- ✅ Respecting user animation preferences

**Total Files:** 1 new, 4 modified
**Lines of Code:** ~150 new lines for HamburgerMenu component
**Breaking Changes:** None - progressive enhancement for mobile only
