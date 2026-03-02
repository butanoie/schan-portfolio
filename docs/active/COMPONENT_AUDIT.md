# Client/Server Component Boundary Audit

**Date:** 2026-03-01
**Issue:** #64
**Branch:** `sc/bundling`

## Summary

Audited all 48 components in `v2/src/components/` and `v2/app/` for unnecessary `"use client"` directives. Converted 6 components; 34 remain client-side with documented reasons.

### Key Finding

Two client-only React Context hooks prevent most conversions:
- **`usePalette()`** — used by ~35 components for theme-aware colors (wraps `useThemeContext()`)
- **`useI18n()`** — used by ~20 components for translated strings (wraps `useLocale()`)

Converting a component requires prop-drilling these values from the parent. Since the parent pages are themselves client components, imported children still get bundled as client code. The benefit is removing per-component context subscription overhead (micro-optimization), not eliminating client JS from the bundle.

## Conversion Results

| Component | Action | Details |
|---|---|---|
| `ProjectTags.tsx` | **Converted** | Removed `"use client"` — zero hooks, zero events, zero browser APIs |
| `CoreCompetencies.tsx` | **Converted** | Removed `usePalette`; added `cardTextColor` prop |
| `ResumeHeader.tsx` | **Converted** | Removed `usePalette`; added `textPrimaryColor`, `textSecondaryColor` props |
| `Education.tsx` | **Converted** | Removed `usePalette`, `useI18n`; added `cardTextColor`, `sectionHeading` props |
| `ClientList.tsx` | **Converted** | Removed `usePalette`, `useI18n`; added `cardTextColor`, `sectionHeading` props |
| `ConferenceSpeaker.tsx` | **Converted** | Removed `usePalette`, `useI18n`; added `cardTextColor`, `sectionHeading` props |

## Full Component Audit

### v2/src/components/

| File | "use client" | Hooks | Events | Browser APIs | Verdict |
|---|---|---|---|---|---|
| `common/VisuallyHidden.tsx` | No | — | — | — | Already SC |
| `common/ErrorBoundary.tsx` | Yes | `useI18n` | `onClick` | — | Keep client |
| `common/FrenchTranslationAlert.tsx` | Yes | `useLocale`, `useI18n` | — | — | Keep client |
| `common/Footer.tsx` | Yes | `usePathname`, `useProjectLoading`, `useI18n`, `useTheme`, `useMediaQuery` | — | — | Keep client |
| `common/Header.tsx` | Yes | `usePalette`, `useI18n`, `useMediaQuery` | — | — | Keep client |
| `common/HamburgerMenu.tsx` | Yes | `useState`, `usePathname`, `useTheme`, `useI18n`, `useAnimations`, `useMediaQuery` | `onClick` | — | Keep client |
| `common/MainLayout.tsx` | Yes | `useState`, `useCallback`, `usePathname`, `useI18n` | — | — | Keep client |
| `common/NavButtons.tsx` | Yes | `usePathname`, `useI18n` | — | — | Keep client |
| `common/PageDeck.tsx` | Yes | `usePalette` | — | — | Keep client |
| `common/ScrollAnimatedSection.tsx` | Yes | `useScrollAnimation`, `useAnimations` | — | — | Keep client |
| `i18n/LocaleProvider.tsx` | Yes | `useState`, `useEffect`, `useCallback` | — | `localStorage`, `document.cookie`, `window.location` | Keep client |
| `i18n/LocaleProviderErrorFallback.tsx` | Yes | — (class component) | `onClick` | — | Keep client |
| `i18n/LocalizedPortfolioDeck.tsx` | Yes | `useI18n` | — | — | Keep client |
| `project/AsyncProjectsList.tsx` | Yes | `useMemo`, `useEffect`, `useContext`, `usePathname`, `useI18n`, `useProjectLoader` | — | — | Keep client |
| `project/LoadMoreButton.tsx` | Yes | `useAnimations`, `useI18n` | `onClick` | — | Keep client |
| `project/ProjectDescription.tsx` | Yes | `useTheme`, `useMemo` | — | — | Keep client |
| `project/ProjectDetail.tsx` | Yes | `useTheme`, `useMediaQuery`, `usePalette` | — | — | Keep client |
| `project/ProjectGallery.tsx` | Yes | `useLightbox` | `onClick` | — | Keep client |
| `project/ProjectImage.tsx` | Yes | `useState`, `useAnimations`, `useI18n` | `onClick`, `onError` | — | Keep client |
| `project/ProjectLightbox.tsx` | Yes | `useState`×3, `useRef`×3, `useI18n`, `useAnimations`, `useSwipe`, `useEffect`×3, `useCallback`×2 | `onClick`, `onTouchStart`, `onTouchEnd` | `window.addEventListener` | Keep client |
| `project/ProjectSkeleton.tsx` | Yes | `useTheme`, `useMediaQuery`, `useAnimations` | — | — | Keep client |
| `project/ProjectsList.tsx` | Yes | — | — | — | Keep client (renders client children) |
| `project/ProjectTags.tsx` | **No** | — | — | — | **Converted to SC** |
| `project/VideoEmbed.tsx` | Yes | `useI18n`, `useMemo`×2 | — | — | Keep client |
| `colophon/ButaStory.tsx` | Yes | `usePalette`, `useI18n` | — | — | Keep client |
| `colophon/ColophonContent.tsx` | Yes | `useI18n` | — | — | Keep client |
| `colophon/DesignPhilosophy.tsx` | Yes | `usePalette`×2, `useI18n`×2 | — | — | Keep client |
| `colophon/TechnologiesShowcase.tsx` | Yes | `useState`, `useEffect`, `usePalette`×2, `useI18n`×2 | `onChange` | `window.matchMedia` | Keep client |
| `resume/ClientList.tsx` | **No** | — | — | — | **Converted (prop-drilled)** |
| `resume/ConferenceSpeaker.tsx` | **No** | — | — | — | **Converted (prop-drilled)** |
| `resume/CoreCompetencies.tsx` | **No** | — | — | — | **Converted (prop-drilled)** |
| `resume/Education.tsx` | **No** | — | — | — | **Converted (prop-drilled)** |
| `resume/ProfessionalSummary.tsx` | Yes | `usePalette`, `useI18n` | — | — | Keep client |
| `resume/ResumeHeader.tsx` | **No** | — | — | — | **Converted (prop-drilled)** |
| `resume/WorkExperience.tsx` | Yes | `usePalette`, `useI18n` | — | — | Keep client |
| `settings/AnimationsSwitcher.tsx` | Yes | `useAnimations`, `useI18n` | `onChange` | — | Keep client |
| `settings/LanguageSwitcher.tsx` | Yes | `useLocale`, `useI18n` | `onChange` | — | Keep client |
| `settings/SettingsButton.tsx` | Yes | `useState`, `usePalette`, `useI18n`, `useAnimations` | `onClick` | — | Keep client |
| `settings/SettingsList.tsx` | Yes | `useI18n` | — | — | Keep client |
| `settings/ThemeSwitcher.tsx` | Yes | `useTheme`, `useI18n` | `onChange` | — | Keep client |
| `ThemeProvider.tsx` | Yes | `useTheme` | — | — | Keep client |

### v2/app/ (Pages)

| File | "use client" | Hooks | Events | Browser APIs | Verdict |
|---|---|---|---|---|---|
| `layout.tsx` | No | — | — | — | Already SC |
| `page.tsx` | No (async) | — | — | `cookies()` (server API) | Already SC |
| `colophon/page.tsx` | No | — | — | — | Already SC |
| `resume/layout.tsx` | No | — | — | — | Already SC |
| `resume/page.tsx` | Yes | `useI18n`, `usePalette` | — | — | Keep client (boundary page) |

## Final Ratio

- **Server components:** 14 (8 already SC + 6 newly converted)
- **Client components:** 34
- **Total:** 48

## MUI Import Verification

- MUI v5+ supports tree-shaking from barrel imports (`@mui/material`) — no need for deep imports
- All icon imports already use individual paths (e.g., `@mui/icons-material/LinkedIn`)
- Verified via bundle analysis

## Future Optimization Opportunities

See [I18N_BOUNDARY_STRATEGY.md](./I18N_BOUNDARY_STRATEGY.md) for strategies to convert more components in the future.

### Candidates for Future Conversion (with more effort)

| Component | Blockers | Effort |
|---|---|---|
| `ProfessionalSummary.tsx` | `usePalette`, `useI18n` | Medium — needs multiple color props + multiple translated strings |
| `WorkExperience.tsx` | `usePalette`, `useI18n` | High — complex component with many translated strings |
| `PageDeck.tsx` | `usePalette` | Low — single color prop, but parent is complex |
| `ProjectsList.tsx` | Renders client children | None — already thin, no hooks |

### Not Worth Converting

Components with event handlers, `useState`, `useEffect`, `useRef`, browser APIs, or MUI interactive hooks (`useMediaQuery`, `useTheme`) **cannot be server components** and should remain client-side.
