# Phase 4: Enhanced Features — Gherkin Test Cases

**Created:** 2026-03-03
**Author:** Sing Chan (with Claude)
**Source:** PHASE_4_PRODUCT_ROADMAP.md
**Format:** Gherkin (Given/When/Then)
**Coverage:** All PBIs across Epics 4.1–4.5
**Companion:** [Phase 4 Product Roadmap](PHASE_4_PRODUCT_ROADMAP.md)

---

## Epic 4.1: Theme Switching

### Feature 4.1.1: Theme Definitions

#### PBI 4.1.1.1: Theme Configuration File

> **Roadmap:** [PBI 4.1.1.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4111-theme-configuration-file)

```gherkin
Feature: Theme Configuration
  As a portfolio visitor
  I want three distinct visual themes to choose from
  So that I can view the portfolio in a style that suits my preference

  Scenario: Light theme displays warm, readable colors
    Given the active theme is "light"
    When the page renders
    Then the background is white (#FFFFFF)
    And the body text is dark (#1A1A1A)
    And the primary accent color is Sage Green (#8BA888)
    And the secondary accent color is Maroon (#8B1538)
    And Sky Blue and Duck Egg accent colors are visible in UI elements

  Scenario: Dark theme displays comfortable low-light colors
    Given the active theme is "dark"
    When the page renders
    Then the background is dark (#121212)
    And the body text is light (#F5F5F5)
    And the primary accent color is light green (#A8D5A8)
    And the secondary accent color is pink (#E85775)
    And surface elements use elevated dark tones (#1F1F1F to #2A2A2A)

  Scenario: High contrast theme displays maximum-clarity colors
    Given the active theme is "highContrast"
    When the page renders
    Then the background is pure black (#000000)
    And the body text is pure white (#FFFFFF)
    And links are white with underline decoration
    And focus indicators are bright yellow (#FFFF00)
    And no gradients appear anywhere on the page

  Scenario: Light theme text is readable against backgrounds
    Given the active theme is "light"
    When any page renders
    Then all text meets a 4.5:1 contrast ratio against its background
    And all UI components meet a 3:1 contrast ratio against their background

  Scenario: Dark theme text is readable against backgrounds
    Given the active theme is "dark"
    When any page renders
    Then all text meets a 4.5:1 contrast ratio against its background
    And all UI components meet a 3:1 contrast ratio against their background

  Scenario: High contrast theme exceeds AAA contrast ratios
    Given the active theme is "highContrast"
    When any page renders
    Then all text meets a 7:1 contrast ratio against its background

  Scenario: Theme mode only accepts valid values
    When a theme is selected
    Then only "light", "dark", and "highContrast" are valid options

  Scenario: Typography is consistent across themes
    When the visitor switches between any two themes
    Then the font families remain the same
    And the font sizes remain the same
    And only colors change
```

---

### Feature 4.1.2: Theme Provider Infrastructure

#### PBI 4.1.2.1: ThemeProvider Component

> **Roadmap:** [PBI 4.1.2.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4121-themeprovider-component)

```gherkin
Feature: Theme Persistence and Initialization
  As a portfolio visitor
  I want my theme preference remembered across visits
  So that I don't have to reselect my preferred theme every time

  Scenario: Returning visitor sees their previously chosen theme
    Given the visitor previously selected the dark theme
    When the visitor returns to the portfolio
    Then the page loads in dark theme

  Scenario: First-time visitor with dark system preference sees dark theme
    Given the visitor has never selected a theme preference
    And the visitor's operating system is set to dark mode
    When the visitor loads the portfolio
    Then the page renders in dark theme

  Scenario: First-time visitor with no system preference sees light theme
    Given the visitor has never selected a theme preference
    And the visitor's operating system has no color scheme preference
    When the visitor loads the portfolio
    Then the page renders in light theme

  Scenario: Theme selection is saved immediately
    Given the visitor is viewing the portfolio in light theme
    When the visitor switches to high contrast theme
    And then refreshes the page
    Then the page loads in high contrast theme

  Scenario: No flash of wrong theme on page load
    Given the visitor previously selected the dark theme
    When the page loads
    Then no flash of light theme is visible before dark theme appears
    And no layout shift occurs during initialization

  Scenario: Theme change animates smoothly
    Given prefers-reduced-motion is not set to "reduce"
    When the visitor switches themes
    Then colors transition smoothly over 150ms

  Scenario: Theme change is instant for reduced motion preference
    Given prefers-reduced-motion is set to "reduce"
    When the visitor switches themes
    Then colors change instantly with no transition
```

#### PBI 4.1.2.2: useTheme and useColorMode Hooks

> **Roadmap:** [PBI 4.1.2.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4122-usetheme-and-usecolormode-hooks)

```gherkin
Feature: Theme and Color Mode Detection
  As a portfolio visitor
  I want the site to detect and respond to my system color preference
  So that the default theme matches my device settings

  Scenario: Site respects system dark mode on first visit
    Given the visitor's operating system is in dark mode
    And no theme preference is saved
    When the portfolio loads
    Then the site renders in dark theme

  Scenario: Site respects system light mode on first visit
    Given the visitor's operating system is in light mode
    And no theme preference is saved
    When the portfolio loads
    Then the site renders in light theme

  Scenario: Site updates when system preference changes
    Given the visitor is viewing the portfolio
    And no manual theme preference has been set
    When the visitor changes their operating system from light to dark mode
    Then the portfolio switches to dark theme without a page reload

  Scenario: Manual theme selection overrides system preference
    Given the visitor's operating system is in dark mode
    When the visitor manually selects light theme
    Then the site remains in light theme
    And does not switch back to dark when the page is refreshed
```

---

### Feature 4.1.3: Theme Switcher UI

#### PBI 4.1.3.1: Settings Button and Theme Switcher

> **Roadmap:** [PBI 4.1.3.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4131-settings-button-and-theme-switcher)

```gherkin
Feature: Settings Button and Theme Switcher
  As a portfolio visitor
  I want an accessible settings control to switch themes
  So that I can choose between light, dark, and high contrast modes

  Background:
    Given the Settings button is visible in the header

  Scenario: Settings button displays a gear icon
    When the header renders
    Then a gear icon button is visible
    And the button touch target is at least 44x44px

  Scenario: Clicking settings opens theme options
    When the visitor clicks the Settings button
    Then a popover appears with three theme options
    And each option shows an icon and a label: Light, Dark, High Contrast

  Scenario: Current theme is visually indicated
    Given the active theme is "dark"
    When the visitor opens the Settings popover
    Then the Dark option shows an active indicator
    And the Light and High Contrast options show no active indicator

  Scenario: Selecting a theme applies it immediately
    Given the Settings popover is open
    And the active theme is "light"
    When the visitor clicks the Dark option
    Then the entire page switches to dark theme
    And the active indicator moves to the Dark option

  Scenario: Enter key opens the settings popover
    Given the Settings button has keyboard focus
    When the visitor presses Enter
    Then the popover opens

  Scenario: Space key opens the settings popover
    Given the Settings button has keyboard focus
    When the visitor presses Space
    Then the popover opens

  Scenario: Arrow keys navigate between theme options
    Given the Settings popover is open
    When the visitor presses the Down arrow key
    Then focus moves to the next theme option
    When the visitor presses the Up arrow key
    Then focus moves to the previous theme option

  Scenario: Escape key closes the settings popover
    Given the Settings popover is open
    When the visitor presses Escape
    Then the popover closes
    And focus returns to the Settings button

  Scenario: Settings button announces expanded state
    When the popover is closed
    Then the Settings button has aria-expanded="false"
    When the popover is open
    Then the Settings button has aria-expanded="true"

  Scenario: Theme options have listbox role
    When the Settings popover is open
    Then the options container has role="listbox"

  Scenario: Focus stays within the popover while open
    Given the Settings popover is open
    When the visitor presses Tab repeatedly
    Then focus cycles within the popover
    And focus does not reach elements behind the popover

  Scenario: Screen reader announces theme change
    When the visitor selects a new theme from the popover
    Then a screen reader announcement confirms the theme change

  Scenario: Passes axe accessibility audit
    When the Settings button and popover are rendered
    Then an axe-core audit reports zero WCAG 2.2 AA violations
```

---

### Feature 4.1.4: Component Theme Integration

#### PBI 4.1.4.1: Update All Components with Theme-Aware Styling

> **Roadmap:** [PBI 4.1.4.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4141-update-all-components-with-theme-aware-styling)

```gherkin
Feature: Theme-Aware Component Styling
  As a portfolio visitor
  I want the entire site to look consistent in any theme
  So that switching themes gives me a cohesive visual experience

  Scenario: All page elements adapt to light theme
    Given the active theme is "light"
    When the visitor browses any page
    Then all text, backgrounds, borders, and UI elements use light theme colors
    And no elements display hardcoded colors that clash with the theme

  Scenario: All page elements adapt to dark theme
    Given the active theme is "dark"
    When the visitor browses any page
    Then all text, backgrounds, borders, and UI elements use dark theme colors
    And no elements display hardcoded colors that clash with the theme

  Scenario: All page elements adapt to high contrast theme
    Given the active theme is "highContrast"
    When the visitor browses any page
    Then all text, backgrounds, borders, and UI elements use high contrast colors
    And links are white with underlines
    And no elements display hardcoded colors that clash with the theme

  Scenario: No layout shift when switching themes
    Given the visitor is viewing any page
    When the visitor switches from one theme to another
    Then no elements shift position
    And no content reflows or resizes

  Scenario: Theme transitions respect reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the visitor switches themes
    Then all color changes happen instantly with no animation

  Scenario: All theme tests pass
    When the full test suite runs
    Then 833 or more total tests pass
    And at least 41 new theme-specific tests pass
```

---

## Epic 4.2: Internationalization (i18n)

### Feature 4.2.1: i18n Library Setup

#### PBI 4.2.1.1: i18next Configuration

> **Roadmap:** [PBI 4.2.1.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4211-i18next-configuration)

```gherkin
Feature: Internationalization Setup
  As a portfolio visitor
  I want the site to support multiple languages
  So that I can read the portfolio in my preferred language

  Scenario: Site loads with English text by default
    When the visitor loads the portfolio for the first time
    Then all visible text is in English

  Scenario: No missing translation placeholders appear
    When the visitor browses any page in English
    Then no raw translation keys or placeholder text appear

  Scenario: No flash of untranslated content on page load
    When the page loads
    Then translated text appears immediately
    And no English-then-French flash occurs when French is the active locale

  Scenario: Missing French translations fall back to English
    Given the active locale is French
    And a specific piece of text has no French translation
    When the visitor views the page
    Then the English text appears for that item instead of a raw key
```

---

### Feature 4.2.2: Locale Files

#### PBI 4.2.2.1: English Locale Files

> **Roadmap:** [PBI 4.2.2.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4221-english-locale-files)

```gherkin
Feature: English Locale Content
  As a portfolio visitor browsing in English
  I want all page content to display in English
  So that I can read and understand every part of the portfolio

  Scenario: Navigation labels are in English
    Given the active locale is English
    When the visitor views the header and footer
    Then all navigation labels display in English

  Scenario: Homepage content is in English
    Given the active locale is English
    When the visitor views the homepage
    Then all headings, descriptions, and labels are in English

  Scenario: Resume content is in English
    Given the active locale is English
    When the visitor views the resume page
    Then all headings, job titles, descriptions, and labels are in English

  Scenario: Colophon content is in English
    Given the active locale is English
    When the visitor views the colophon page
    Then all section headings and body text are in English

  Scenario: Project titles and descriptions are in English
    Given the active locale is English
    When the visitor views any project
    Then the project title, description, circa date, and image captions are in English

  Scenario: No hardcoded English visible outside locale system
    When the visitor views any page in English
    Then all user-facing text comes from locale files
    And no text is hardcoded in the component markup
```

#### PBI 4.2.2.2: French Locale Files

> **Roadmap:** [PBI 4.2.2.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4222-french-locale-files)

```gherkin
Feature: French Locale Content
  As a French-speaking portfolio visitor
  I want complete French translations
  So that I can read the entire portfolio in French

  Scenario: All English content has a French equivalent
    Given the active locale is French
    When the visitor browses every page
    Then no English fallback text appears anywhere
    And all visible text is in French

  Scenario: Navigation labels are in French
    Given the active locale is French
    When the visitor views the header and footer
    Then all navigation labels display in French

  Scenario: Homepage content is in French
    Given the active locale is French
    When the visitor views the homepage
    Then all headings, descriptions, and labels are in French

  Scenario: Resume content is in French
    Given the active locale is French
    When the visitor views the resume page
    Then all headings, job titles, descriptions, and labels are in French

  Scenario: Project content is in French
    Given the active locale is French
    When the visitor views any project
    Then the project title, description, circa date, and image captions are in French

  Scenario: French translations read naturally
    Given the active locale is French
    When the visitor reads any page
    Then the text reads as natural, professional French
    And no awkward machine-translation phrasing is present
```

---

### Feature 4.2.3: i18n Hooks and Component Integration

#### PBI 4.2.3.1: useI18n and useLocale Hooks

> **Roadmap:** [PBI 4.2.3.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4231-usei18n-and-uselocale-hooks)

```gherkin
Feature: Language Switching Behavior
  As a portfolio visitor
  I want to switch languages and see content update immediately
  So that I can read the portfolio in my preferred language without reloading

  Scenario: Switching from English to French updates all visible text
    Given the visitor is viewing the portfolio in English
    When the visitor switches the language to French
    Then all visible text on the current page updates to French
    And no page reload occurs

  Scenario: Switching from French to English updates all visible text
    Given the visitor is viewing the portfolio in French
    When the visitor switches the language to English
    Then all visible text on the current page updates to English
    And no page reload occurs

  Scenario: Language switch updates all components on the page
    Given the visitor is on the homepage in English
    When the visitor switches to French
    Then the header, project cards, navigation, and footer all display French text
```

#### PBI 4.2.3.2: Update All Components with i18n

> **Roadmap:** [PBI 4.2.3.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4232-update-all-components-with-i18n)

```gherkin
Feature: Component Localization
  As a portfolio visitor
  I want every component to display translated text
  So that the entire site is localized in my chosen language

  Scenario: Header displays translated labels
    Given the active locale is French
    When the header renders
    Then navigation links display French labels

  Scenario: Footer displays translated content
    Given the active locale is French
    When the footer renders
    Then footer text is in French

  Scenario: Project cards display translated content
    Given the active locale is French
    When project cards render on the homepage
    Then project titles and tags display in French

  Scenario: Resume sections display translated content
    Given the active locale is French
    When the resume page renders
    Then section headings and labels display in French

  Scenario: No raw translation keys visible in any locale
    Given the active locale is either English or French
    When the visitor browses any page
    Then no raw dotted key strings like "buttons.loadMore" are visible

  Scenario: Site builds without errors from localized components
    When the full site builds
    Then zero type errors are reported
```

---

### Feature 4.2.4: Locale-Aware Formatting

#### PBI 4.2.4.1: Date, Number, and Currency Formatting

> **Roadmap:** [PBI 4.2.4.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4241-date-number-and-currency-formatting)

```gherkin
Feature: Locale-Aware Date and Number Formatting
  As a portfolio visitor
  I want dates and numbers formatted for my locale
  So that content looks natural in my language

  Scenario: English dates display in North American format
    Given the active locale is English
    When the visitor views a date on any page
    Then the date reads like "January 1, 2025"

  Scenario: French dates display in French format
    Given the active locale is French
    When the visitor views a date on any page
    Then the date reads like "1 janvier 2025"

  Scenario: English numbers use period decimal separator
    Given the active locale is English
    When the visitor views a formatted number
    Then thousands use comma separators and decimals use periods

  Scenario: French numbers use comma decimal separator
    Given the active locale is French
    When the visitor views a formatted number
    Then thousands use space separators and decimals use commas

  Scenario: Formatting is fast with no visible delay
    When the visitor switches locales
    Then dates and numbers reformat instantly with no visible lag
```

---

### Feature 4.2.5: Language Switcher UI

#### PBI 4.2.5.1: LanguageSwitcher Component

> **Roadmap:** [PBI 4.2.5.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4251-languageswitcher-component)

```gherkin
Feature: Language Switcher
  As a portfolio visitor
  I want to switch between English and French from the settings menu
  So that I can read the portfolio in my preferred language

  Background:
    Given the Language Switcher is inside the Settings popover

  Scenario: Language options are visible in the settings popover
    When the visitor opens the Settings popover
    Then English and French language options are visible
    And the active language shows an indicator

  Scenario: Switching to French updates all page content
    Given the active locale is English
    When the visitor selects French from the Language Switcher
    Then all page content updates to French immediately

  Scenario: Language preference persists across visits
    When the visitor selects French
    And then closes and reopens the browser
    Then the portfolio loads in French

  Scenario: HTML language attribute updates
    Given the active locale is English
    When the visitor switches to French
    Then the page's lang attribute updates to "fr"

  Scenario: Arrow keys navigate between language options
    Given the Settings popover is open
    When the visitor presses arrow keys on the language options
    Then focus moves between English and French

  Scenario: Screen reader announces language change
    When the visitor selects a new language
    Then a screen reader announcement confirms the language change

  Scenario: Passes axe accessibility audit
    When the Language Switcher renders inside the popover
    Then an axe-core audit reports zero WCAG 2.2 AA violations
```

---

### Feature 4.2.6: Localization Documentation

#### PBI 4.2.6.1: Translation Workflow Guide

> **Roadmap:** [PBI 4.2.6.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4261-translation-workflow-guide)

```gherkin
Feature: Translation Workflow Documentation
  As a visitor reviewing the portfolio's development practices
  I want to see documented localization patterns
  So that I can evaluate the developer's approach to enterprise i18n

  Scenario: JSON merge pattern is documented with examples
    When the translation workflow guide is reviewed
    Then the JSON merge pattern for projects is explained
    And code examples show how title, description, circa, and captions are merged

  Scenario: Direct i18n pattern is documented with examples
    When the translation workflow guide is reviewed
    Then the direct t() call pattern for pages is explained
    And code examples demonstrate the pattern

  Scenario: Adding new strings is a documented step-by-step process
    When the translation workflow guide is reviewed
    Then a numbered procedure for adding new translatable strings exists

  Scenario: Translation tool integration is documented
    When the translation workflow guide is reviewed
    Then instructions for using DeepL for translation are included
```

---

## Epic 4.3: Animations & Transitions

### Feature 4.3.1: Animation Hooks

#### PBI 4.3.1.1: useReducedMotion Hook

> **Roadmap:** [PBI 4.3.1.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4311-usereducedmotion-hook)

```gherkin
Feature: Reduced Motion Detection
  As a visitor who prefers reduced motion
  I want the site to detect my motion preference
  So that animations are disabled automatically

  Scenario: Visitor with reduced motion preference sees no animations
    Given the visitor's operating system has prefers-reduced-motion set to "reduce"
    When the visitor loads any page
    Then no animations or transitions play
    And all content is immediately visible

  Scenario: Visitor without reduced motion preference sees animations
    Given the visitor's operating system does not prefer reduced motion
    When the visitor loads any page
    Then animations play as designed

  Scenario: Changing system preference updates the site in real time
    Given the visitor is viewing the portfolio
    And the visitor's system does not prefer reduced motion
    When the visitor enables reduced motion in system settings
    Then animations stop immediately without a page reload

  Scenario: First page load has no animation errors
    When the page loads for the first time
    Then no errors occur related to motion detection
    And the page renders without a flash of animations
```

#### PBI 4.3.1.2: useScrollAnimation Hook

> **Roadmap:** [PBI 4.3.1.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4312-usescrollanimation-hook)

```gherkin
Feature: Scroll-Triggered Animations
  As a portfolio visitor
  I want content to animate in as I scroll
  So that the browsing experience feels polished

  Scenario: Content below the fold fades in on scroll
    Given an element is positioned below the visible viewport
    When the visitor scrolls until the element enters the viewport
    Then the element fades into view

  Scenario: Content already in view is immediately visible
    Given an element is within the visible viewport on page load
    When the page renders
    Then the element is visible immediately with no animation delay

  Scenario: Scroll animations are skipped for reduced motion
    Given the visitor prefers reduced motion
    When the page renders
    Then all content is immediately visible regardless of scroll position
    And no fade-in or slide-up animations play

  Scenario: Scrolling past animated content does not cause re-animation
    Given an element has already animated into view
    When the visitor scrolls past it and then scrolls back
    Then the element remains visible without re-animating

  Scenario: No lingering scroll behavior after navigating away
    Given the visitor is on a page with scroll animations
    When the visitor navigates to a different page
    Then no scroll-related behavior persists from the previous page
```

---

### Feature 4.3.2: Global Animation Styles

#### PBI 4.3.2.1: Animations CSS

> **Roadmap:** [PBI 4.3.2.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4321-animations-css)

```gherkin
Feature: Global Animation Styles
  As a portfolio visitor
  I want consistent, smooth animations across the site
  So that the visual experience feels cohesive

  Scenario: Fade-in animation is smooth
    Given prefers-reduced-motion is not set to "reduce"
    When an element uses the fadeIn animation
    Then it transitions from transparent and offset to fully visible and in position

  Scenario: Multiple animation types are available
    When animated elements render across the site
    Then fadeIn, slideUp, shimmer, and scaleIn animations are used where appropriate

  Scenario: All animations stop when reduced motion is preferred
    Given prefers-reduced-motion is set to "reduce"
    When any page renders
    Then all animation durations are effectively zero
    And all transition durations are effectively zero

  Scenario: Animations do not cause layout shift
    When any animation plays on any page
    Then no surrounding elements move or resize
    And Cumulative Layout Shift remains zero
```

---

### Feature 4.3.3: Component Animation Integration

#### PBI 4.3.3.1: ProjectsList Scroll Animations

> **Roadmap:** [PBI 4.3.3.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4331-projectslist-scroll-animations)

```gherkin
Feature: ProjectsList Scroll Animations
  As a portfolio visitor
  I want projects to fade in as I scroll down the page
  So that the browsing experience feels dynamic and engaging

  Scenario: Project cards fade in as visitor scrolls
    Given the projects list is rendered on the homepage
    And a project card is below the visible viewport
    When the visitor scrolls until the card enters the viewport
    Then the card animates in with a fade effect

  Scenario: Scroll animations disabled for reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the homepage renders
    Then all project cards are immediately visible
    And no fade-in animation plays

  Scenario: No layout shift during project animations
    When project cards animate into the viewport
    Then no surrounding content shifts position

  Scenario: Animations run at 60fps
    When project card fade animations play
    Then the animation is smooth with no visible jank
```

#### PBI 4.3.3.2: Lightbox Transitions

> **Roadmap:** [PBI 4.3.3.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4332-lightbox-transitions)

```gherkin
Feature: Lightbox Transitions
  As a portfolio visitor
  I want smooth transitions when opening and browsing the lightbox
  So that the image viewing experience feels fluid

  Scenario: Lightbox fades in when opened
    Given prefers-reduced-motion is not set to "reduce"
    When the visitor opens the lightbox
    Then the overlay and image fade in smoothly

  Scenario: Lightbox fades out when closed
    Given prefers-reduced-motion is not set to "reduce"
    When the visitor closes the lightbox
    Then the overlay and image fade out smoothly

  Scenario: Images slide during navigation
    Given prefers-reduced-motion is not set to "reduce"
    And the lightbox is open with multiple images
    When the visitor navigates to the next or previous image
    Then the images slide with a smooth transition

  Scenario: Lightbox transitions disabled for reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the visitor opens, closes, or navigates the lightbox
    Then content appears and disappears instantly
    And no transition effects play
```

#### PBI 4.3.3.3: Project Image Hover Effects

> **Roadmap:** [PBI 4.3.3.3 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4333-project-image-hover-effects)

```gherkin
Feature: Project Image Hover Effects
  As a portfolio visitor
  I want visual feedback when hovering over project images
  So that interactive thumbnails feel responsive

  Scenario: Thumbnail scales and gains shadow on hover
    Given prefers-reduced-motion is not set to "reduce"
    When the visitor hovers over a project thumbnail
    Then the thumbnail scales up slightly
    And a drop shadow appears

  Scenario: Gallery thumbnail opacity changes on hover
    Given prefers-reduced-motion is not set to "reduce"
    When the visitor hovers over a gallery thumbnail
    Then the thumbnail opacity transitions smoothly

  Scenario: Hover effects disabled for reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the visitor hovers over any project image
    Then no scale, shadow, or opacity transition plays

  Scenario: Animation test coverage meets target
    When the full animation test suite runs
    Then at least 60 new animation-related tests pass
```

---

## Epic 4.4: WCAG 2.2 Level AA Compliance

### Feature 4.4.1: Testing Infrastructure

#### PBI 4.4.1.1: axe-core Test Helpers

> **Roadmap:** [PBI 4.4.1.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4411-axe-core-test-helpers)

```gherkin
Feature: Accessibility Testing Helpers
  As a portfolio visitor who relies on assistive technology
  I want automated accessibility checks to catch issues
  So that the site remains usable for people with disabilities

  Scenario: Every component passes an automated accessibility audit
    When any component is rendered
    Then an axe-core audit reports zero WCAG 2.2 AA violations

  Scenario: Interactive elements are verifiably focusable
    When an interactive element is rendered
    Then it can receive keyboard focus

  Scenario: All interactive elements have accessible names
    When an interactive element is rendered
    Then it has an accessible name that a screen reader can announce

  Scenario: Accessibility rules match WCAG 2.2 AA standard
    When the accessibility audit runs
    Then it checks against WCAG 2.2 Level AA rules
    And it includes color-contrast, region, and landmark rules
```

#### PBI 4.4.1.2: Vitest axe-core Configuration

> **Roadmap:** [PBI 4.4.1.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4412-vitest-axe-core-configuration)

```gherkin
Feature: Accessibility Testing Configuration
  As a portfolio visitor
  I want the test suite to automatically verify accessibility
  So that regressions are caught before reaching production

  Scenario: Accessibility matchers are available in all tests
    When any test file runs
    Then the toHaveNoViolations matcher is available without additional imports

  Scenario: Color contrast is verified automatically
    When an accessibility audit runs
    Then the color-contrast rule is active and evaluating

  Scenario: Page landmarks are verified automatically
    When an accessibility audit runs
    Then region and landmark rules are active and evaluating
```

---

### Feature 4.4.2: WCAG Violation Remediation

#### PBI 4.4.2.1: Touch Target Size Fixes

> **Roadmap:** [PBI 4.4.2.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4421-touch-target-size-fixes)

```gherkin
Feature: Touch Target Size Compliance
  As a mobile visitor
  I want all buttons and links to be easy to tap
  So that I can navigate the portfolio comfortably on a touchscreen

  Scenario: LinkedIn button in the header is easy to tap
    When the header renders
    Then the LinkedIn icon button has a touch target of at least 44x44px

  Scenario: GitHub button in the header is easy to tap
    When the header renders
    Then the GitHub icon button has a touch target of at least 44x44px

  Scenario: Settings button in the header is easy to tap
    When the header renders
    Then the Settings button has a touch target of at least 44x44px

  Scenario: All header buttons verified by measurement
    When all header icon buttons are measured
    Then every button has an interactive area of at least 44x44px per WCAG 2.5.8
```

#### PBI 4.4.2.2: Image Contrast Fix

> **Roadmap:** [PBI 4.4.2.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4422-image-contrast-fix)

```gherkin
Feature: Gallery Thumbnail Contrast
  As a portfolio visitor
  I want gallery thumbnails to be clearly visible
  So that I can distinguish and select them easily

  Scenario: Gallery thumbnails are clearly visible at rest
    When a ProjectGallery renders
    Then each thumbnail has an opacity of 0.85
    And the thumbnail meets 3:1 contrast against its background per WCAG 1.4.11

  Scenario: Thumbnail hover transition is smooth
    Given prefers-reduced-motion is not set to "reduce"
    When the visitor hovers over a gallery thumbnail
    Then the opacity change transitions smoothly

  Scenario: Thumbnail hover is instant for reduced motion
    Given prefers-reduced-motion is set to "reduce"
    When the visitor hovers over a gallery thumbnail
    Then the opacity changes instantly with no transition
```

---

### Feature 4.4.3: Comprehensive Accessibility Tests

#### PBI 4.4.3.1: Component Accessibility Test Suite

> **Roadmap:** [PBI 4.4.3.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4431-component-accessibility-test-suite)

```gherkin
Feature: Component Accessibility Compliance
  As a portfolio visitor using assistive technology
  I want every interactive component to be fully accessible
  So that I can navigate and use the entire site with a keyboard or screen reader

  Scenario: Header passes accessibility audit
    When the Header component renders
    Then an axe-core audit reports zero violations

  Scenario: Header keyboard navigation works in logical order
    When the visitor tabs through the Header
    Then focus moves through all interactive elements in a logical order

  Scenario: Settings button and popover pass accessibility audit
    When the Settings button and popover render
    Then an axe-core audit reports zero violations

  Scenario: Settings popover keyboard interaction is complete
    When the visitor presses Enter on the Settings button
    Then the popover opens
    When the visitor presses Escape
    Then the popover closes and focus returns to the Settings button

  Scenario: Project gallery passes accessibility audit
    When the ProjectGallery component renders
    Then an axe-core audit reports zero violations

  Scenario: Gallery thumbnails are keyboard navigable
    When the visitor tabs through gallery thumbnails
    Then each thumbnail receives visible focus
    When the visitor presses Enter on a focused thumbnail
    Then the lightbox opens

  Scenario: Footer passes accessibility audit
    When the Footer component renders
    Then an axe-core audit reports zero violations

  Scenario: Main layout has correct landmark regions
    When the MainLayout component renders
    Then an axe-core audit reports zero violations
    And landmark regions (main, navigation, contentinfo) are defined

  Scenario: Theme Switcher passes accessibility audit
    When the ThemeSwitcher renders inside the popover
    Then an axe-core audit reports zero violations

  Scenario: Language Switcher passes accessibility audit
    When the LanguageSwitcher renders inside the popover
    Then an axe-core audit reports zero violations

  Scenario: Lightbox passes accessibility audit
    When the Lightbox component opens with an image
    Then an axe-core audit reports zero violations

  Scenario: Focus is trapped inside the lightbox
    Given the Lightbox is open
    When the visitor presses Tab repeatedly
    Then focus cycles within the Lightbox
    And focus does not escape to background content

  Scenario: Focus returns to trigger when lightbox closes
    Given the Lightbox was opened from a gallery thumbnail
    When the Lightbox closes
    Then focus returns to the thumbnail that opened it

  Scenario: All ARIA attributes are valid
    When any interactive component renders
    Then all aria-* attributes conform to the WAI-ARIA specification

  Scenario: Focus indicators are visible on every interactive element
    When the visitor tabs through any page
    Then a visible focus indicator appears on each focused element
    And the indicator meets WCAG 2.4.7

  Scenario: Accessibility test suite meets size target
    When the full accessibility test suite runs
    Then at least 120 test cases execute and pass

  Scenario: Full test suite meets count target
    When the complete test suite runs
    Then 1,117 total tests pass
```

---

### Feature 4.4.4: Accessibility Audit Verification

#### PBI 4.4.4.1: WCAG 2.2 AA Criteria Checklist

> **Roadmap:** [PBI 4.4.4.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4441-wcag-22-aa-criteria-checklist)

```gherkin
Feature: WCAG 2.2 AA Full Audit
  As a portfolio visitor with a disability
  I want every accessibility criterion verified across every page
  So that the site is usable regardless of how I access it

  Scenario: All images have appropriate alt text (1.1.1)
    When the visitor views any page with a screen reader
    Then every image has meaningful alt text or is marked as decorative

  Scenario: All text meets minimum contrast (1.4.3)
    When the visitor views any page in any theme
    Then all text has at least a 4.5:1 contrast ratio against its background

  Scenario: All UI components meet non-text contrast (1.4.11)
    When the visitor views any page
    Then all UI components and graphical objects meet a 3:1 contrast ratio

  Scenario: All functionality is available by keyboard (2.1.1)
    When the visitor navigates any page using only a keyboard
    Then all interactive features are reachable and operable

  Scenario: Focus moves in a logical order (2.4.3)
    When the visitor tabs through any page
    Then focus moves in a predictable, meaningful sequence

  Scenario: Focus indicator is always visible (2.4.7)
    When any element receives keyboard focus
    Then a visible focus indicator is clearly displayed

  Scenario: All touch targets are at least 44x44px (2.5.8)
    When the visitor taps any interactive element on a mobile device
    Then the touch target is at least 44x44px

  Scenario: Page language is declared (3.1.1)
    When any page loads
    Then the html element has a lang attribute matching the active locale

  Scenario: All interactive elements have accessible names and roles (4.1.2)
    When the visitor navigates with a screen reader
    Then each interactive element has an accessible name, correct role, and valid states

  Scenario: Zero violations found across all pages
    When every page is audited with axe-core
    Then zero WCAG 2.2 AA violations are reported

  Scenario: Screen reader experience is complete
    When each page is tested with NVDA and VoiceOver
    Then all content is announced correctly
    And navigation is logical and predictable

  Scenario: Audit results are documented
    When all audit verification is complete
    Then results are recorded in the WCAG compliance documentation
```

---

### Feature 4.4.5: Accessibility Documentation

#### PBI 4.4.5.1: Accessibility Statement

> **Roadmap:** [PBI 4.4.5.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4451-accessibility-statement)

```gherkin
Feature: Accessibility Statement
  As a portfolio visitor who needs accessibility accommodations
  I want a published accessibility statement
  So that I know what standards the site meets and how to report issues

  Scenario: Statement references applicable standards
    When the visitor reads the accessibility statement
    Then it references WCAG 2.2 Level AA
    And it references Section 508
    And it references the ADA

  Scenario: Accessibility features are listed
    When the visitor reads the accessibility statement
    Then it lists the site's accessibility features

  Scenario: Testing methodology is described
    When the visitor reads the accessibility statement
    Then automated and manual testing approaches are described

  Scenario: Known limitations are disclosed
    When the visitor reads the accessibility statement
    Then any known accessibility limitations are listed

  Scenario: Feedback contact is provided
    When the visitor reads the accessibility statement
    Then a contact method for reporting accessibility issues is provided
```

#### PBI 4.4.5.2: WCAG Compliance Guide

> **Roadmap:** [PBI 4.4.5.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4452-wcag-compliance-guide)

```gherkin
Feature: WCAG Compliance Guide
  As a visitor evaluating the portfolio's accessibility rigor
  I want a detailed compliance mapping
  So that I can see how each WCAG criterion is implemented

  Scenario: Every AA criterion maps to an implementation
    When the visitor reads the compliance guide
    Then each WCAG 2.2 AA criterion has a corresponding implementation reference

  Scenario: Code examples demonstrate implementations
    When the visitor reads the compliance guide
    Then code examples show how key criteria are implemented

  Scenario: Compliance verification matrix is included
    When the visitor reads the compliance guide
    Then a matrix maps each criterion to its verification method and pass/fail status
```

#### PBI 4.4.5.3: Testing Checklist and Developer Guide

> **Roadmap:** [PBI 4.4.5.3 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4453-testing-checklist-and-developer-guide)

```gherkin
Feature: Accessibility Testing Checklist and Developer Guide
  As a visitor evaluating the developer's testing practices
  I want documented testing procedures and patterns
  So that I can assess the rigor of accessibility testing

  Scenario: Keyboard testing procedures are documented
    When the visitor reviews the testing checklist
    Then step-by-step keyboard testing procedures are listed

  Scenario: Screen reader testing procedures are documented
    When the visitor reviews the testing checklist
    Then step-by-step screen reader testing procedures are listed

  Scenario: Visual testing procedures are documented
    When the visitor reviews the testing checklist
    Then procedures for contrast, zoom, and layout verification are listed

  Scenario: Animation testing procedures are documented
    When the visitor reviews the testing checklist
    Then procedures for verifying reduced-motion behavior are listed

  Scenario: Browser compatibility matrix is included
    When the visitor reviews the testing checklist
    Then a matrix lists tested browsers and assistive technologies

  Scenario: Reusable test patterns are provided
    When the visitor reviews the developer guide
    Then reusable accessibility test patterns are documented

  Scenario: Test execution instructions are included
    When the visitor reviews the developer guide
    Then commands to run the accessibility test suite are documented

  Scenario: New test authoring guide is included
    When the visitor reviews the developer guide
    Then instructions for writing new accessibility tests are documented
```

---

## Epic 4.5: SEO Optimization

### Feature 4.5.1: SEO Constants and Utilities

#### PBI 4.5.1.1: SEO Constants

> **Roadmap:** [PBI 4.5.1.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4511-seo-constants)

```gherkin
Feature: SEO Constants
  As a portfolio visitor arriving from a search engine
  I want consistent, accurate metadata across the site
  So that search results and social previews match the actual content

  Scenario: Site URL is consistent across all pages
    When the visitor views the page source of any page
    Then the canonical URL uses a consistent site base URL

  Scenario: Author information is present in metadata
    When the visitor views the page source
    Then author metadata identifies Sing Chan

  Scenario: Social links are referenced in metadata
    When the visitor views the page source
    Then LinkedIn and GitHub URLs are referenced in structured data

  Scenario: Site-wide metadata includes title and description
    When the visitor views the page source
    Then a default title and description are present

  Scenario: Each page has distinct metadata
    When the visitor views the page source of different pages
    Then each page has a unique title and description
```

#### PBI 4.5.1.2: SEO Utilities Library

> **Roadmap:** [PBI 4.5.1.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4512-seo-utilities-library)

```gherkin
Feature: Structured Data and SEO Utilities
  As a portfolio visitor arriving from a search engine
  I want valid structured data on the site
  So that search engines display rich results for the portfolio

  Scenario: Person schema identifies the portfolio author
    When the visitor views the page source
    Then a JSON-LD Person schema is present
    And it includes the author's name, URL, and social links

  Scenario: Breadcrumb schema reflects the navigation path
    When the visitor views a page with breadcrumbs
    Then a JSON-LD BreadcrumbList schema is present
    And the items reflect the current navigation path

  Scenario: Project collection schema is present on the homepage
    When the visitor views the homepage page source
    Then a JSON-LD CollectionPage schema is present

  Scenario: Structured data validates without errors
    When any JSON-LD schema is tested with the Google Rich Results Test
    Then no errors or warnings are reported

  Scenario: Project descriptions display cleanly in search results
    When a project description contains HTML markup
    Then the metadata version has HTML tags stripped
    And the description is truncated to 160 characters or fewer
```

---

### Feature 4.5.2: Page Metadata

#### PBI 4.5.2.1: Root Layout Metadata

> **Roadmap:** [PBI 4.5.2.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4521-root-layout-metadata)

```gherkin
Feature: Root Layout Metadata
  As a portfolio visitor sharing the site on social media
  I want correct metadata in the page head
  So that link previews display the right title, description, and image

  Scenario: Default title displays the portfolio name
    When the visitor views the browser tab on the homepage
    Then the tab title is "Sing Chan's Portfolio"

  Scenario: Subpage titles follow a template
    When the visitor views a subpage
    Then the browser tab title follows the pattern "[Page] | Sing Chan"

  Scenario: Open Graph tags are complete
    When the visitor views the page source
    Then og:type is "website"
    And og:url matches the current page URL
    And og:image references an image file

  Scenario: Twitter card metadata is present
    When the visitor views the page source
    Then twitter:card is "summary_large_image"

  Scenario: Canonical URL is set
    When the visitor views the page source
    Then a canonical link element points to the current page URL

  Scenario: Person structured data is in the page head
    When the visitor views the page source
    Then a script element with type="application/ld+json" contains Person data

  Scenario: Theme color meta tags are present
    When the visitor views the page source
    Then theme-color meta tags are present
```

#### PBI 4.5.2.2: Page-Specific Metadata

> **Roadmap:** [PBI 4.5.2.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4522-page-specific-metadata)

```gherkin
Feature: Page-Specific Metadata
  As a portfolio visitor finding pages through search engines
  I want each page to have unique metadata
  So that search results accurately describe each page

  Scenario: Homepage has unique title and description
    When the visitor views the homepage page source
    Then the title is unique to the homepage
    And the description is unique to the homepage
    And the canonical URL points to the homepage

  Scenario: Resume page has unique title and description
    When the visitor views the resume page source
    Then the title is unique to the resume page
    And the description is unique to the resume page
    And the canonical URL points to /resume

  Scenario: Colophon page has unique title and description
    When the visitor views the colophon page source
    Then the title is unique to the colophon page
    And the description is unique to the colophon page
    And the canonical URL points to /colophon

  Scenario: All pages render correctly with metadata
    When the visitor loads each page
    Then every page renders without errors
    And metadata is present in the document head
```

---

### Feature 4.5.3: Crawling Infrastructure

#### PBI 4.5.3.1: Dynamic Sitemap

> **Roadmap:** [PBI 4.5.3.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4531-dynamic-sitemap)

```gherkin
Feature: XML Sitemap
  As a portfolio visitor
  I want all portfolio pages discoverable by search engines
  So that I can find the site through search

  Scenario: Sitemap is accessible
    When a visitor or crawler requests /sitemap.xml
    Then a valid XML document is returned

  Scenario: All portfolio pages are listed
    When the visitor views the sitemap
    Then entries exist for the homepage, resume page, and colophon page

  Scenario: Homepage has the highest priority
    When the visitor views the sitemap
    Then the homepage entry has priority 1

  Scenario: Resume page has high priority
    When the visitor views the sitemap
    Then the resume entry has priority 0.8

  Scenario: Colophon page has moderate priority
    When the visitor views the sitemap
    Then the colophon entry has priority 0.5
```

#### PBI 4.5.3.2: Robots.txt

> **Roadmap:** [PBI 4.5.3.2 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4532-robotstxt)

```gherkin
Feature: Robots.txt
  As a portfolio visitor
  I want search engine crawling permitted
  So that the site appears in search results

  Scenario: Robots.txt is accessible
    When a visitor or crawler requests /robots.txt
    Then a valid response is returned

  Scenario: All crawlers are permitted
    When the visitor views the robots.txt content
    Then it allows all user agents to crawl the site

  Scenario: Sitemap location is referenced
    When the visitor views the robots.txt content
    Then a Sitemap directive points to the sitemap URL
```

---

### Feature 4.5.4: Social Preview Assets

#### PBI 4.5.4.1: OG Image and Humans.txt

> **Roadmap:** [PBI 4.5.4.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4541-og-image-and-humanstxt)

```gherkin
Feature: Social Preview Assets
  As a portfolio visitor sharing a link on social media
  I want an attractive preview image and proper attribution
  So that shared links look professional on any platform

  Scenario: OG image loads successfully
    When a visitor or platform requests /og-image.png
    Then a valid image is returned

  Scenario: OG image is the correct size for social platforms
    When the og-image.png is inspected
    Then its dimensions are 1200x630 pixels

  Scenario: OG image is referenced in page metadata
    When the visitor views the page source
    Then the og:image meta tag references "/og-image.png"

  Scenario: Humans.txt is accessible
    When a visitor requests /humans.txt
    Then a response is returned containing author credits

  Scenario: Facebook link preview displays correctly
    When a visitor shares the site URL on Facebook
    Then a rich preview shows with the image, title, and description

  Scenario: Twitter link preview displays correctly
    When a visitor shares the site URL on Twitter
    Then a summary_large_image card displays

  Scenario: LinkedIn link preview displays correctly
    When a visitor shares the site URL on LinkedIn
    Then a rich preview shows with the image, title, and description
```

---

### Feature 4.5.5: SEO Validation

#### PBI 4.5.5.1: Testing and Verification

> **Roadmap:** [PBI 4.5.5.1 Acceptance Criteria](PHASE_4_PRODUCT_ROADMAP.md#pbi-4551-testing-and-verification)

```gherkin
Feature: SEO Validation
  As a portfolio visitor arriving from a search engine
  I want the site to score perfectly on SEO audits
  So that the portfolio is maximally discoverable

  Scenario: Production build succeeds without errors
    When the site is built for production
    Then the build completes successfully

  Scenario: Sitemap is accessible on production
    When a visitor requests /sitemap.xml on the live site
    Then a valid XML sitemap is returned

  Scenario: Robots.txt is accessible on production
    When a visitor requests /robots.txt on the live site
    Then a valid robots.txt is returned

  Scenario: All meta tags present on every production page
    When the visitor loads any page on the live site
    Then title, description, og:*, twitter:*, and canonical tags are in the head

  Scenario: Person schema passes Google validation
    When the Person JSON-LD is tested with Google Rich Results Test
    Then no errors are reported

  Scenario: Person schema passes schema.org validation
    When the Person JSON-LD is tested with the schema.org validator
    Then no errors are reported

  Scenario: Social previews work on all major platforms
    When the site URL is tested on Facebook, Twitter, and LinkedIn preview tools
    Then all three platforms display correct rich previews

  Scenario: Lighthouse SEO audit is perfect
    When a Lighthouse audit runs against the production site
    Then the SEO score is 100 out of 100

  Scenario: Sitemap accepted by Google Search Console
    When the sitemap URL is submitted to Google Search Console
    Then it is accepted without errors

  Scenario: Sitemap accepted by Bing Webmaster Tools
    When the sitemap URL is submitted to Bing Webmaster Tools
    Then it is accepted without errors
```

---

## Cross-Cutting: Quality Standards

```gherkin
Feature: Cross-Cutting Quality Standards
  As a portfolio visitor
  I want the site to meet enterprise-grade quality standards
  So that every page is accessible, performant, and polished

  Scenario: All text is readable and accessible
    When the visitor views any page
    Then all text meets WCAG 2.2 AA contrast requirements
    And all interactive elements have accessible names and roles

  Scenario: Full keyboard navigation works on every page
    When the visitor navigates any page using only a keyboard
    Then all interactive elements are reachable
    And visible focus indicators appear on each

  Scenario: All animations respect the visitor's motion preference
    Given prefers-reduced-motion is set to "reduce"
    When the visitor loads any page
    Then no animations or transitions play

  Scenario: All touch targets are comfortable to tap
    When the visitor uses a touchscreen device
    Then every interactive element has a target of at least 44x44px

  Scenario: Every page renders correctly in all three themes
    When the visitor switches between light, dark, and high contrast themes
    Then all content renders correctly in each theme
    And no elements use hardcoded colors

  Scenario: Every page renders correctly in English and French
    When the visitor switches between English and French
    Then all text displays correctly in each language
    And no raw translation keys are visible

  Scenario: Site builds and passes all quality checks
    When the site is built for production
    Then zero TypeScript errors are reported
    And zero ESLint violations are reported
    And unit test coverage exceeds 80%

  Scenario: Bundle size stays within budget
    When the production bundle is built
    Then each feature adds less than 50KB to the total bundle size
```
