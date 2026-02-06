# Portfolio Modernization - Project Context

**Version:** 1.2
**Last Updated:** 2026-02-05
**Current Phase:** Phase 4 - Enhanced Features (Task 4.2 - i18n Complete)
**Current Branch:** `sc/i18n`

---

## Executive Summary

This is a portfolio modernization project migrating **portfolio.singchan.com** from a 2013-era technology stack (Gumby Framework, jQuery, PHP) to a modern React-based application using Next.js 15, TypeScript, and Material UI v7.

**Project Status:** Phase 4 of 7 (Task 4.2 complete, moving to Task 4.3)
- ✅ Phase 1: Foundation & Setup (Complete)
- ✅ Phase 2: Data Migration (Complete)
- ✅ Phase 3: Core Pages Development (Complete)
  - ✅ Task 3.1: Projects/Homepage Page
  - ✅ Task 3.2: Resume Page
  - ✅ Task 3.3: Colophon/About Page
  - ✅ Task 3.4: Shared Components
- 🔄 Phase 4: Enhanced Features (In Progress)
  - ✅ Task 4.1: Theme Switching (Complete - PR #8)
  - ✅ Task 4.2: Internationalization (i18n) (Complete)
  - ⬜ Task 4.3: Animations & Transitions (Next)
  - ⬜ Task 4.4: WCAG 2.2 Level AA Compliance
  - ⬜ Task 4.5: SEO Optimization

---

## Technology Stack

### Current V2 Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15.1.4 (App Router), React 19 |
| **Language** | TypeScript 5+ (strict mode) |
| **UI Library** | Material UI v7.3.7, Emotion (CSS-in-JS) |
| **Theming** | MUI theme with Light, Dark, and High Contrast modes |
| **Internationalization** | i18next with React hooks integration |
| **Testing** | Vitest 4.0.18, React Testing Library, @axe-core/react |
| **Linting** | ESLint 9, eslint-plugin-jsx-a11y, Prettier 3.8 |
| **Dev Tools** | Husky 9 (git hooks), lint-staged |
| **Runtime** | Node.js v25.4.0, npm v11.7.0 |

### Legacy V1 Stack (Being Replaced)

- Gumby Framework 2.0 (2013 responsive framework)
- jQuery 1.9.1
- PHP backend with JSON API
- Static HTML pages

---

## Project Architecture

### Directory Structure

```
portfolio.singchan.com/
├── v1/                         # Legacy site (reference)
├── v2/                         # New Next.js application
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Homepage (projects listing)
│   │   ├── resume/page.tsx     # Resume page ✅
│   │   ├── colophon/page.tsx   # Colophon/About page ✅
│   │   └── projects/[id]/page.tsx  # Dynamic project detail
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── data/               # Static data (projects, resume, colophon)
│   │   ├── lib/                # Utilities and data fetching
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript definitions
│   │   └── __tests__/          # Vitest tests
│   └── public/
│       └── images/
│           ├── gallery/        # 239 project images
│           └── buta/           # Buta mascot images
├── docs/                       # Project documentation
├── changelog/                  # Detailed changelog entries
└── .claude/                    # Claude Code configuration
    ├── CLAUDE.md               # Coding standards & guidelines
    └── PROJECT_CONTEXT.md      # This file
```

### Key Configuration Files

- `v2/tsconfig.json` - TypeScript strict mode enabled
- `v2/next.config.ts` - Next.js with image optimization
- `v2/vitest.config.ts` - Test framework with 80% coverage threshold
- `v2/eslint.config.mjs` - ESLint 9 with accessibility rules
- `.husky/pre-commit` - Runs linting and formatting before commits

---

## Critical Requirements

### 1. Documentation Standards (MANDATORY)

**ALL code must include comprehensive JSDoc/TSDoc documentation before commit.**

Required documentation:
- **Functions/Methods:** Purpose, parameters, return values, side effects, examples
- **React Components:** Purpose, props, context/hooks, state management
- **Interfaces/Types:** Purpose, property descriptions
- **Complex Logic:** Inline comments explaining "why" not "what"

See `.claude/CLAUDE.md` for complete documentation standards.

### 2. Accessibility (WCAG 2.2 Level AA)

**Non-negotiable requirement:** All pages must meet WCAG 2.2 Level AA standards.

Key requirements:
- ✅ Color contrast ≥4.5:1 (normal text), ≥3:1 (large text)
- ✅ 100% keyboard navigable
- ✅ Screen reader compatible (NVDA, JAWS, VoiceOver)
- ✅ Touch targets ≥44px × 44px
- ✅ `prefers-reduced-motion` support (disable animations)
- ✅ Proper ARIA labels and semantic HTML
- ✅ Focus management and visible focus indicators

Testing tools:
- ESLint plugin: `eslint-plugin-jsx-a11y`
- Runtime: `@axe-core/react`
- Manual: Screen readers, keyboard navigation

### 3. Testing Requirements

All new functionality must have tests:
- **Coverage target:** ≥80% for all code, 100% for utilities
- **Test framework:** Vitest + React Testing Library
- **Test types:** Unit tests, integration tests, accessibility tests
- **Quality gates:** 0 TypeScript errors, 0 ESLint errors, all tests pass

### 4. Changelog Requirements

**All significant changes must be documented in `changelog/` directory.**

When to create a changelog:
- Phase completions
- Infrastructure changes
- Feature additions
- Breaking changes
- Configuration updates

Filename format: `YYYY-MM-DDTHHMMSS_descriptive-name.md`

---

## Current Work: Task 4.1 - Theme System Implementation

### Status
🔄 **In Progress** - Complete theme system with settings UI (PR #8 open)

### What's Being Built

**Core Theme Infrastructure:**
- Three complete theme modes: Light, Dark, High Contrast (WCAG AAA compliant)
- Centralized color palette management (`v2/src/constants/colors.ts`)
- Theme creation with MUI integration (`v2/src/lib/themes.ts`)
- Theme context for state management (`v2/src/contexts/ThemeContext.tsx`)
- Custom hooks: `useTheme()` (state management), `useColorMode()` (system detection)
- System preference detection (`prefers-color-scheme` media query)
- LocalStorage persistence for user preference
- SSR-safe implementation with hydration handling

**User-Facing Settings UI:**
- SettingsButton component (gear icon in header)
- Theme switcher popover with toggle buttons
- Full keyboard accessibility (Tab, Arrow keys, Enter/Space, Escape)
- ARIA labels and expanded state attributes
- Respects `prefers-reduced-motion` for animations
- Popover positioning and focus management

### Implementation Status

✅ **Completed:**
- Core theme system (light, dark, high contrast modes)
- Settings UI components (SettingsButton, ThemeSwitcher)
- Theme context and hooks
- 41 new tests (25 SettingsButton + 16 ThemeSwitcher)
- All 833 tests passing
- Type-safe implementation with TypeScript
- Comprehensive JSDoc documentation
- WCAG compliance verification (AA on all, AAA on high contrast)
- Changelog created

🔄 **In Progress:**
- PR #8 open for review and merge
- Documentation updates (this file, PHASE4_DETAILED_PLAN.md)

See `docs/PHASE4_DETAILED_PLAN.md` for complete specifications and task details.

---

## Phase Completion Status

### ✅ Phase 1: Foundation & Setup (Complete: 2026-01-25)

- Next.js 15 + TypeScript project initialized
- Material UI v7 configured with custom theme
- Development tools: ESLint, Prettier, Husky
- Basic layout components (Header, Footer, MainLayout)
- Accessibility linting configured

### ✅ Phase 2: Data Migration (Complete: 2026-01-27)

- 18 projects migrated from PHP to TypeScript
- 239 images migrated to `/public/images/gallery/`
- Data fetching layer: `getProjects()`, `getProjectById()`, `getAllTags()`, etc.
- TypeScript types: `Project`, `ProjectImage`, `ProjectVideo`
- 87 tests with 88.13% coverage
- Testing infrastructure: Vitest + React Testing Library

### ✅ Phase 3: Core Pages Development (Complete: 2026-02-03)

**Completed:**
- ✅ Task 3.1: Projects/Homepage Page
  - Homepage with responsive grid, filtering, search
  - Project detail pages with 5 layout variants
  - Image gallery with lightbox (keyboard + touch)
  - Buta "Load More" navigation component
  - PR: [#4](https://github.com/butanoie/schan-portfolio/pull/4)

- ✅ Task 3.2: Resume Page (2026-01-29)
  - 5 components, 71 tests, 100% pass rate
  - Print-friendly CSS, contact obfuscation (ROT13/ROT5)
  - PR: [#5](https://github.com/butanoie/schan-portfolio/pull/5)

- ✅ Task 3.3: Colophon/About Page (2026-01-27)
  - 4 components, 54 tests, 100% pass rate
  - Design philosophy, technologies, Buta story
  - PR: [#3](https://github.com/butanoie/schan-portfolio/pull/3)

- ✅ Task 3.4: Shared Components
  - Accessible lightbox, loading skeletons, thought bubbles
  - Gallery components, common UI elements
  - PR: [#6](https://github.com/butanoie/schan-portfolio/pull/6)

### 🔄 Phase 4: Enhanced Features (In Progress)

**Current Task:**
- 🔄 Task 4.1: Theme Switching (2026-02-03)
  - Three complete theme modes (Light, Dark, High Contrast)
  - Settings UI with accessible popover
  - Full keyboard and screen reader support
  - WCAG AAA compliance on high contrast mode
  - PR: [#8](https://github.com/butanoie/schan-portfolio/pull/8) - Open for review

**Upcoming:**
- ⬜ Task 4.2: Internationalization (i18n)
- ⬜ Task 4.3: Animations & Transitions
- ⬜ Task 4.4: WCAG 2.2 Level AA Compliance
- ⬜ Task 4.5: SEO Optimization

---

## Available Data & Assets

### Project Data (18 Projects)

Location: `v2/src/data/projects.ts`

Data structure:
```typescript
interface Project {
  id: string;
  title: string;
  desc: string;              // HTML description
  circa: string;
  tags: string[];
  images: ProjectImage[];
  videos: ProjectVideo[];
  altGrid: boolean;
}
```

Data utilities (100% test coverage):
- `getProjects(options)` - Paginated, filterable, searchable
- `getProjectById(id)` - Single project lookup
- `getAllTags()` - Unique tag list
- `getTagCounts()` - Tag frequency counts
- `getRelatedProjects(projectId, limit)` - Related by tags

### Image Assets (239 Images)

Location: `v2/public/images/gallery/`

- 18 project folders
- Includes @2x retina variants
- Organized by project ID
- Next.js Image optimization configured

### Buta Mascot

Character: Buta (pig in business suit) - Portfolio mascot

Images:
- `v2/public/images/buta/buta-waving.png`
- `v2/public/images/buta/buta-bubble.png`
- Additional Buta images in public/images/buta/

Usage:
- Footer character
- "Load more" navigation with thought bubble
- Colophon "Buta Story" section

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Sakura** | #FFE4E1 | Light backgrounds, pastel accent |
| **Duck Egg** | #C7DFC5 | Pastel green accent |
| **Sky Blue** | #87CEEB | Primary accent |
| **Graphite** | #2C2C2C | Dark text |
| **Sage** | #8BA888 | Tags, footer background |
| **Maroon** | #8B1538 | Links, headings |

Defined in: `v2/src/constants/colors.ts`

### Typography

| Font | Usage |
|------|-------|
| **Open Sans** | Body text, UI elements |
| **Oswald** | Headings (h1-h3) |
| **Gochi Hand** | Buta's thought bubble |

### Responsive Breakpoints

Material UI defaults (used consistently):

| Breakpoint | Min Width | Devices |
|------------|-----------|---------|
| `xs` | 0px | Mobile portrait |
| `sm` | 600px | Mobile landscape |
| `md` | 900px | Tablets |
| `lg` | 1200px | Laptops, desktops |
| `xl` | 1536px | Large desktops |

---

## Development Workflow

### Quality Checks (Must Pass)

```bash
# TypeScript type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test

# Test coverage
npm run test:coverage

# All checks (pre-commit hook runs these)
npm run lint && npm run type-check && npm test
```

### Git Workflow

1. Work on feature branch (e.g., `sc/projects-page`)
2. Pre-commit hook runs automatically:
   - ESLint with auto-fix
   - Prettier formatting
   - Type checking
3. Create PR to `main` branch
4. All quality checks must pass
5. Code review for:
   - Documentation compliance
   - Accessibility requirements
   - Test coverage ≥80%

### Commit Standards

- Clear, descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable
- **NEVER commit secrets** (use `.env.local`)

Example commit:
```bash
git commit -m "$(cat <<'EOF'
Add ProjectCard component with responsive design

- Implements hover effects with prefers-reduced-motion support
- Uses Next.js Image for optimized thumbnails
- Full JSDoc documentation and accessibility attributes
- 15 unit tests, 100% coverage

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Key Documents

### Planning & Strategy

| Document | Purpose |
|----------|---------|
| `docs/MODERNIZATION_PLAN.md` | Overall 7-phase roadmap |
| `docs/PHASE3_DETAILED_PLAN.md` | Current phase specifications |
| `.claude/CLAUDE.md` | Coding standards & documentation requirements |
| `changelog/2026-01-27T154623_phase2-data-migration-complete.md` | Latest phase completion |

### Development Guides

| Document | Purpose |
|----------|---------|
| `v2/README.md` | Development environment setup |
| `docs/TESTING_SETUP.md` | Testing infrastructure guide |
| `v2/src/__tests__/README.md` | Testing patterns and examples |

---

## Common Tasks

### Start Development Server

```bash
cd v2
npm run dev
# Open http://localhost:3000
```

### Run Tests

```bash
cd v2
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage report
npm run test:ui             # Visual test UI
```

### Create Changelog Entry

```bash
# Generate timestamp
date '+%Y-%m-%dT%H%M%S'

# Create file: changelog/YYYY-MM-DDTHHMMSS_description.md
# Use existing entries as templates
```

### Accessibility Testing

```bash
# Automated (runs with ESLint)
npm run lint

# Manual testing checklist:
# 1. Keyboard navigation (Tab, Enter, Escape, Arrow keys)
# 2. Screen reader (NVDA on Windows, VoiceOver on macOS)
# 3. Color contrast (browser DevTools)
# 4. Focus visible on all interactive elements
# 5. prefers-reduced-motion (OS setting)
```

---

## Dependencies & Tools

### Core Dependencies

```json
{
  "next": "15.1.4",
  "react": "19.0.0",
  "typescript": "5.x",
  "@mui/material": "7.3.7",
  "@mui/icons-material": "7.3.7",
  "@emotion/react": "11.14.0",
  "@emotion/styled": "11.14.0"
}
```

### Development Dependencies

```json
{
  "vitest": "4.0.18",
  "@testing-library/react": "16.3.2",
  "@testing-library/jest-dom": "6.9.1",
  "@testing-library/user-event": "14.6.1",
  "@axe-core/react": "4.11.0",
  "eslint": "9.x",
  "prettier": "3.8.x",
  "husky": "9.x"
}
```

### Upcoming Dependencies (Task 3.1)

```json
{
  "dompurify": "^3.x",           // HTML sanitization
  "isomorphic-dompurify": "^2.x" // SSR-compatible version
}
```

---

## Success Metrics

### Technical Metrics (Current Phase)

- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors, 0 warnings
- ✅ Test coverage: 88.13% (target: ≥80%)
- ✅ All tests passing: 87/87
- 🎯 Lighthouse Accessibility: Target 100
- 🎯 WCAG 2.2 AA: 0 violations

### Phase 3 Completion Criteria

- [ ] All 3 main pages functional (Homepage pending)
- [ ] Accessible image lightbox with keyboard + touch navigation
- [ ] Project filtering and search working
- [ ] Responsive layouts tested on mobile/tablet/desktop
- [ ] ≥80% test coverage maintained
- [ ] 0 ESLint accessibility violations
- [ ] All documentation complete per CLAUDE.md standards

---

## Points of Contact

**Project Owner:** Sing Chan
**Development Partner:** Claude Code (Anthropic CLI)
**Repository:** GitHub (private)

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Project data | `v2/src/data/projects.ts` |
| Data utilities | `v2/src/lib/projectData.ts` |
| TypeScript types | `v2/src/types/project.ts` |
| Custom theme | `v2/src/lib/theme.ts` |
| Color constants | `v2/src/constants/colors.ts` |
| Tests | `v2/src/__tests__/` |
| Documentation | `docs/` |
| Changelogs | `changelog/` |

### NPM Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint errors
npm run type-check    # TypeScript validation
npm run format        # Format with Prettier
npm test              # Run tests
npm run test:coverage # Coverage report
```

### Important Reminders

1. **Documentation is mandatory** - See `.claude/CLAUDE.md`
2. **Accessibility is non-negotiable** - WCAG 2.2 Level AA required
3. **All animations must respect `prefers-reduced-motion`**
4. **Touch targets must be ≥44px × 44px**
5. **Test coverage must stay ≥80%**
6. **Never commit secrets** - Use `.env.local`
7. **Create changelog for significant changes**

---

**Last Updated:** 2026-01-29
**Current Focus:** Task 3.1 - Projects Page Implementation
**Next Milestone:** Complete Phase 3 (Projects + Shared Components)
