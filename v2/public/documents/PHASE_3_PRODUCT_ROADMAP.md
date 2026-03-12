# Phase 3: Core Pages Development — Product Roadmap

**Created:** 2026-03-03
**Author:** Sing Chan (with Claude)
**Phase Duration:** 3-4 weeks (2026-01-27 to 2026-02-02)
**Status:** Completed
**Format:** SAFe (Epics, Features, PBIs)
**Companion:** [Phase 3 Gherkin Test Cases](PHASE_3_GHERKIN_TEST_CASES.md)

---

## Epic 3.1: Homepage / Portfolio Page

**Business Value:** Display all 18 portfolio projects on a single responsive page so visitors can browse work samples, watch embedded video demos, and understand the breadth of technical and design experience.

**Lean Business Case:** The homepage is the primary landing surface for recruiters, hiring managers, and collaborators. A well-structured project listing with media support directly converts visits into engagement.

**Success Metrics:** All 18 projects render correctly, 5 layout variants applied based on viewport and content, 80%+ test coverage, zero WCAG 2.2 AA violations.

---

### Feature 3.1.1: Project Grid Layout

Display projects in a responsive grid that adapts across breakpoints.

#### PBI 3.1.1.1: Responsive Project Grid Component

> **Test Cases:** [PBI 3.1.1.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3111-responsive-project-grid-component)

**Description:** Create `ProjectGrid.tsx` using MUI Grid v2. Responsive columns: 3 on desktop (lg), 2 on tablet (md), 1 on mobile (sm). Gap spacing 24px.

```tsx
interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  onProjectClick: (id: string) => void;
}
```

**Acceptance Criteria:**

- Grid renders all projects passed via props
- Column count adjusts at `sm`, `md`, `lg` breakpoints
- 24px consistent gap between grid items
- Passes axe accessibility audit with zero violations
- JSDoc documentation on component and all props
- Unit tests cover rendering, responsive behavior, and empty state

#### PBI 3.1.1.2: Project Card Component

> **Test Cases:** [PBI 3.1.1.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3112-project-card-component)

**Description:** Create `ProjectCard.tsx` displaying thumbnail, title, technology tags, and circa date. Hover applies subtle scale (1.02) and shadow elevation.

```tsx
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  priority?: boolean;
}
```

**Acceptance Criteria:**

- Card displays thumbnail via `ProjectImage`, title, tags, and circa date
- Hover applies `transform: scale(1.02)` and elevation shadow
- Hover animation disabled when `prefers-reduced-motion: reduce`
- Card is keyboard focusable and activatable via Enter/Space
- Minimum touch target 44x44px
- JSDoc on component and all props
- Unit tests for rendering, click handler, keyboard activation

---

### Feature 3.1.2: Project Detail Display

Show full project content inline with layout variants based on viewport, video presence, and the `altGrid` flag.

#### PBI 3.1.2.1: Layout Variant Logic

> **Test Cases:** [PBI 3.1.2.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3121-layout-variant-logic)

**Description:** Implement layout selection returning one of 5 variants.

```tsx
type LayoutVariant =
  | 'wide-video'
  | 'wide-regular'
  | 'wide-alternate'
  | 'narrow'
  | 'narrow-video';

function getLayoutVariant(project: Project, isMobile: boolean): LayoutVariant {
  if (isMobile) return project.videos.length > 0 ? 'narrow-video' : 'narrow';
  if (project.videos.length > 0) return 'wide-video';
  return project.altGrid ? 'wide-alternate' : 'wide-regular';
}
```

**Acceptance Criteria:**

- Correct variant returned for all combinations of video/viewport/altGrid
- All 18 projects map to a valid variant
- Unit tests cover all 5 paths plus edge cases

#### PBI 3.1.2.2: ProjectHeader Component

> **Test Cases:** [PBI 3.1.2.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3122-projectheader-component)

**Description:** Create `ProjectHeader.tsx` rendering title (h2), technology tags as chips, and circa date.

```tsx
interface ProjectHeaderProps {
  title: string;
  tags: string[];
  circa: string;
}
```

**Acceptance Criteria:**

- Title renders as `<h2>` (page uses h1, projects use h2)
- Tags render as styled chips
- Circa date is visually muted
- JSDoc documentation, unit tests

#### PBI 3.1.2.3: ProjectDescription Component

> **Test Cases:** [PBI 3.1.2.3 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3123-projectdescription-component)

**Description:** Create `ProjectDescription.tsx` that safely renders HTML content using DOMPurify sanitization.

```tsx
interface ProjectDescriptionProps {
  html: string;
}
```

**Acceptance Criteria:**

- HTML sanitized before rendering via `dangerouslySetInnerHTML`
- Script tags and event handlers stripped
- Renders `<strong>`, `<p>`, `<a>` correctly
- Unit tests verify sanitization and rendering

#### PBI 3.1.2.4: VideoEmbed Component

> **Test Cases:** [PBI 3.1.2.4 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3124-videoembed-component)

**Description:** Create `VideoEmbed.tsx` supporting Vimeo, YouTube, and self-hosted video with responsive 16:9 aspect ratio.

```tsx
interface VideoEmbedProps {
  video: ProjectVideo;
}
```

**Acceptance Criteria:**

- Detects provider from URL and renders appropriate embed
- Responsive container maintains 16:9 aspect ratio
- Iframe has `title` attribute for accessibility
- `loading="lazy"` on iframes
- Unit tests for each provider type

#### PBI 3.1.2.5: ProjectDetail Component

> **Test Cases:** [PBI 3.1.2.5 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3125-projectdetail-component)

**Description:** Create `ProjectDetail.tsx` assembling header, description, video, and gallery into the correct layout variant.

**Acceptance Criteria:**

- Renders correct layout variant from `getLayoutVariant()` output
- All 5 variants visually match screenshots in `docs/screenshots/project-layout/`
- Responsive transitions between wide/narrow at `md` breakpoint
- Unit tests for each layout variant

---

### Feature 3.1.3: Projects List Container

#### PBI 3.1.3.1: ProjectsList Component

> **Test Cases:** [PBI 3.1.3.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3131-projectslist-component)

**Description:** Create `ProjectsList.tsx` rendering all projects inline with vertical spacing (64px desktop, 48px mobile).

```tsx
export function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <Box>
      {projects.map((project) => (
        <ProjectDetail key={project.id} project={project} />
      ))}
    </Box>
  );
}
```

**Acceptance Criteria:**

- All 18 projects render on a single scrollable page
- Vertical gap: 64px desktop, 48px mobile
- Each project uses correct layout variant
- Unit test verifies all projects render

#### PBI 3.1.3.2: Homepage Page Route

> **Test Cases:** [PBI 3.1.3.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3132-homepage-page-route)

**Description:** Create `v2/app/page.tsx` as server component fetching all projects.

```tsx
export default async function ProjectsPage() {
  const { items } = await getProjects({ pageSize: 100 });
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1">Projects</Typography>
      <ProjectsList projects={items} />
    </Container>
  );
}
```

**Acceptance Criteria:**

- Fetches all 18 projects server-side
- `<h1>` for page title, `<h2>` for project titles
- Container uses `maxWidth="lg"`
- No client-side JavaScript errors on load

---

### Feature 3.1.4: Load More Navigation

#### PBI 3.1.4.1: ButaNavigation Component

> **Test Cases:** [PBI 3.1.4.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3141-butanavigation-component)

**Description:** Buta mascot navigation with three states: loading, load-more, end. Thought bubble in Gochi Hand font.

```tsx
type ButaNavigationState = 'loading' | 'load-more' | 'end';

interface ButaNavigationProps {
  state: ButaNavigationState;
  currentCount: number;
  totalCount: number;
  onLoadMore: () => void;
}
```

**Acceptance Criteria:**

- Three visual states render correctly
- Thought bubble: Gochi Hand font, #F5F5F5 background, subtle border, connecting circles
- `role="status"` and `aria-live="polite"` for screen reader announcements
- "Load more" link has `aria-label` with project count context
- Keyboard accessible (Enter/Space)
- Unit tests for all states and accessibility attributes

---

## Epic 3.2: Resume Page

**Business Value:** Present professional background in a structured, scannable format that works as both a web page and printable document.

**Success Metrics:** 5 components, 8 TypeScript interfaces, 71+ unit tests, responsive two-column layout, print stylesheet.

---

### Feature 3.2.1: Resume Content Components

#### PBI 3.2.1.1: ResumeHeader Component

> **Test Cases:** [PBI 3.2.1.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3211-resumeheader-component)

**Description:** Create `ResumeHeader.tsx` with name (Oswald, responsive 1.75rem-2.5rem), tagline (Open Sans), and contact links with ROT13/ROT5 obfuscation.

```tsx
interface ResumeHeaderProps {
  name: string;
  tagline: string;
  contactLinks?: ContactLink[];
}
```

**Acceptance Criteria:**

- Name renders in Oswald at responsive sizes
- Contact info obfuscated (ROT13 email, ROT5 phone), deobfuscates on interaction
- JSDoc documentation, unit tests

#### PBI 3.2.1.2: WorkExperience Component

> **Test Cases:** [PBI 3.2.1.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3212-workexperience-component)

**Description:** Create `WorkExperience.tsx` rendering jobs with grouped roles under each company.

```tsx
interface WorkExperienceProps {
  jobs: Job[];
}
```

**Acceptance Criteria:**

- Company name prominent, multiple roles grouped as timeline
- Dates muted, right-aligned on desktop, below title on mobile
- Key contributions render as list items
- Unit tests for single-job and multi-role rendering

#### PBI 3.2.1.3: CoreCompetencies Component

> **Test Cases:** [PBI 3.2.1.3 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3213-corecompetencies-component)

**Description:** Create `CoreCompetencies.tsx` displaying skills as chips grouped by category.

```tsx
interface CoreCompetenciesProps {
  categories: SkillCategory[];
}
```

**Acceptance Criteria:**

- Skills as chip components grouped by category label
- Non-interactive display-only chips
- Unit tests for rendering and empty category

#### PBI 3.2.1.4: ClientList Component

> **Test Cases:** [PBI 3.2.1.4 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3214-clientlist-component)

**Description:** Create `ClientList.tsx` as responsive grid (4/3/2 columns by breakpoint).

**Acceptance Criteria:**

- 50+ client names in responsive grid
- Column count adjusts at breakpoints
- Unit tests

#### PBI 3.2.1.5: ConferenceSpeaker Component

> **Test Cases:** [PBI 3.2.1.5 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3215-conferencespeaker-component)

**Description:** Create `ConferenceSpeaker.tsx` for speaking history.

**Acceptance Criteria:**

- Displays conference, year, and topic for 6 events
- Unit tests

---

### Feature 3.2.2: Resume Page Layout

#### PBI 3.2.2.1: Resume Page Route

> **Test Cases:** [PBI 3.2.2.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3221-resume-page-route)

**Description:** Create `v2/app/resume/page.tsx` with responsive layout. Desktop: two-column (70%/30%). Mobile: single column with reordered sections (skills shown early).

**Acceptance Criteria:**

- Two-column at `md`+ (70/30 split)
- Mobile reorders: Header, Core Competencies, Work Experience, Everyday Tools, Clients, Conferences
- Proper heading hierarchy
- Data from `v2/src/data/resume.ts`, types from `v2/src/types/resume.ts`
- Unit tests for layout at different breakpoints

#### PBI 3.2.2.2: Print Stylesheet

> **Test Cases:** [PBI 3.2.2.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3222-print-stylesheet)

**Description:** Create `v2/app/resume/print.css` with `@media print` rules.

**Acceptance Criteria:**

- Nav, footer, non-essential UI hidden
- Single-column layout optimized for A4/Letter
- Page break control prevents mid-section splits
- PDF download button links to static PDF
- Manual test: clean browser print preview

---

### Feature 3.2.3: Resume Data Layer

#### PBI 3.2.3.1: Resume Types and Data

> **Test Cases:** [PBI 3.2.3.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3231-resume-types-and-data)

**Description:** Create 8 TypeScript interfaces in `v2/src/types/resume.ts` and resume content in `v2/src/data/resume.ts`.

Key interfaces: `ResumeData`, `Job`, `Role`, `SkillCategory`, `ContactLink`, `SpeakingEvent`.

**Acceptance Criteria:**

- 8 interfaces fully document resume structure
- Data matches v1 source content
- `getLocalizedResumeData(t)` supports i18n prep
- Zero TypeScript errors, JSDoc on all exports

---

## Epic 3.3: Colophon / About Page

**Business Value:** Share the story behind the portfolio, technologies used, and design philosophy to give visitors insight into process and personality.

**Success Metrics:** 4 components, 10 TypeScript interfaces, 54+ unit tests, zero WCAG violations.

---

### Feature 3.3.1: Colophon Content Components

#### PBI 3.3.1.1: AboutSection Component

> **Test Cases:** [PBI 3.3.1.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3311-aboutsection-component)

**Description:** Create `AboutSection.tsx` with bio, role, and responsibilities. HTML sanitized with isomorphic DOMPurify for SSR.

```tsx
interface AboutSectionProps {
  name: string;
  currentRole: string;
  company: string;
  bio: string;
  responsibilities?: string[];
}
```

**Acceptance Criteria:**

- Bio renders with name, role, company displayed prominently
- HTML sanitized with isomorphic-dompurify
- JSDoc, unit tests

#### PBI 3.3.1.2: TechnologiesShowcase Component

> **Test Cases:** [PBI 3.3.1.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3312-technologiesshowcase-component)

**Description:** Create `TechnologiesShowcase.tsx` with V2 stack in categorized grid and V1 technologies in accordion.

Categories: Framework & Runtime, UI & Styling, Development Tools, Testing.

**Acceptance Criteria:**

- V2 technologies in categorized grid, V1 in collapsible accordion
- Technology names link to URLs where provided
- Accordion keyboard accessible (Enter/Space)
- Unit tests for expanded/collapsed states

#### PBI 3.3.1.3: DesignPhilosophy Component

> **Test Cases:** [PBI 3.3.1.3 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3313-designphilosophy-component)

**Description:** Create `DesignPhilosophy.tsx` with color swatches (Sakura, Duck Egg, Sky Blue, Graphite, Sage, Maroon) and typography samples (Open Sans, Oswald, Gochi Hand).

**Acceptance Criteria:**

- Swatches render with hex codes and descriptions
- Typography samples in actual fonts
- Text labels on swatches maintain 3:1 contrast
- Constants from `v2/src/constants/colors.ts`
- Unit tests

#### PBI 3.3.1.4: ButaStory Component

> **Test Cases:** [PBI 3.3.1.4 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3314-butastory-component)

**Description:** Create `ButaStory.tsx` with mascot origin story and images from `v2/public/images/buta/`.

**Acceptance Criteria:**

- Story in paragraphs, images with meaningful alt text
- Thought bubble styling in Gochi Hand font
- Unit tests

---

### Feature 3.3.2: Colophon Page Assembly

#### PBI 3.3.2.1: Colophon Page Route and Data

> **Test Cases:** [PBI 3.3.2.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3321-colophon-page-route-and-data)

**Description:** Create `v2/app/colophon/page.tsx`, `v2/src/data/colophon.ts`, and `v2/src/types/colophon.ts` (10 interfaces).

**Acceptance Criteria:**

- All four sections render (About, Technologies, Design, Buta)
- 10 TypeScript interfaces, responsive mobile-first layout
- Buta images migrated to `v2/public/images/buta/`
- Zero TypeScript/ESLint errors, unit tests

---

## Epic 3.4: Shared Components

**Business Value:** Reusable, accessible UI components ensuring consistent patterns across pages and centralizing accessibility compliance.

**Success Metrics:** All components have JSDoc, 80%+ coverage, WCAG 2.2 AA, keyboard and screen reader support.

---

### Feature 3.4.1: Image Lightbox

#### PBI 3.4.1.1: Lightbox Component

> **Test Cases:** [PBI 3.4.1.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3411-lightbox-component)

**Description:** Full-screen modal image viewer with keyboard nav, touch/swipe, focus trap, and captions.

```tsx
interface LightboxProps {
  images: ProjectImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}
```

**Acceptance Criteria:**

- `role="dialog"`, `aria-modal="true"`
- Arrow keys and buttons for prev/next navigation
- Escape and close button to dismiss, both with `aria-label`
- Focus trapped within modal, returns to trigger on close
- Touch/swipe gestures for mobile navigation
- Captions via `aria-describedby`, image counter ("3 of 12")
- Button touch targets: 44x44px minimum
- Unit tests for keyboard nav, focus trap, open/close, swipe
- axe-core accessibility tests

---

### Feature 3.4.2: Loading States

#### PBI 3.4.2.1: LoadingSkeleton Component

> **Test Cases:** [PBI 3.4.2.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3421-loadingskeleton-component)

**Description:** Skeleton screens with shimmer animation. `aria-busy="true"` while loading.

**Acceptance Criteria:**

- Shapes match content layout (rectangle, circle, text lines)
- Shimmer disabled when `prefers-reduced-motion: reduce` (static gray)
- `aria-busy="true"` on loading containers
- Smooth transition to real content
- Unit tests

#### PBI 3.4.2.2: LoadingSpinner Component

> **Test Cases:** [PBI 3.4.2.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3422-loadingspinner-component)

**Description:** Inline spinner with configurable size and `aria-label`.

**Acceptance Criteria:**

- Configurable size, `aria-label` for screen readers
- Animation respects `prefers-reduced-motion`
- Unit tests

---

### Feature 3.4.3: Common UI Components

#### PBI 3.4.3.1: TagChip Component

> **Test Cases:** [PBI 3.4.3.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3431-tagchip-component)

**Description:** Reusable tag for project cards, filters, and skills.

```tsx
interface TagChipProps {
  label: string;
  onClick?: () => void;
  selected?: boolean;
  count?: number;
  size?: 'small' | 'medium';
}
```

**Acceptance Criteria:**

- Display-only mode (no onClick) and interactive mode
- Selected state with visual differentiation
- 44x44px touch target when interactive
- Unit tests for both modes

#### PBI 3.4.3.2: ThoughtBubble Component

> **Test Cases:** [PBI 3.4.3.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3432-thoughtbubble-component)

**Description:** Reusable thought bubble (Gochi Hand font, #F5F5F5 background, connecting circles) for ButaNavigation and Footer.

**Acceptance Criteria:**

- Renders content in styled bubble with connecting circles
- Reusable across components
- Unit tests

#### PBI 3.4.3.3: ErrorBoundary Component

> **Test Cases:** [PBI 3.4.3.3 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3433-errorboundary-component)

**Description:** Class component catching render errors with user-friendly fallback and retry.

**Acceptance Criteria:**

- Catches errors in child tree, displays fallback with retry
- Logs errors for debugging
- Unit tests

---

### Feature 3.4.4: Enhanced Navigation

#### PBI 3.4.4.1: Header Mobile Menu

> **Test Cases:** [PBI 3.4.4.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3441-header-mobile-menu)

**Description:** Enhance `Header.tsx` with MUI Drawer hamburger menu.

**Acceptance Criteria:**

- Hamburger button: 44px touch target
- Drawer slides from right, full-height nav, large touch targets
- Close button with `aria-label`, Escape key support
- Focus trapped when open, `aria-expanded` on trigger
- Unit tests for open/close, keyboard, focus management

#### PBI 3.4.4.2: Footer Enhancement

> **Test Cases:** [PBI 3.4.4.2 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3442-footer-enhancement)

**Description:** Enhance `Footer.tsx` with ThoughtBubble, Buta character, and improved accessibility.

**Acceptance Criteria:**

- ThoughtBubble renders, Buta with meaningful alt text
- Responsive positioning, proper heading hierarchy
- Descriptive navigation link text
- Unit tests

---

### Feature 3.4.5: Touch Gesture Support

#### PBI 3.4.5.1: useSwipe Hook

> **Test Cases:** [PBI 3.4.5.1 Test Scenarios](PHASE_3_GHERKIN_TEST_CASES.md#pbi-3451-useswipe-hook)

**Description:** Custom hook for touch swipe detection used by Lightbox.

**Acceptance Criteria:**

- Detects left/right swipe with configurable threshold
- Returns direction and distance
- Prevents default scroll during horizontal swipe
- Unit tests for all directions

---

## Cross-Cutting: Quality Standards

All PBIs must meet:

- JSDoc on all exported components, functions, interfaces, types
- TypeScript strict mode: zero errors
- ESLint: zero errors including jsx-a11y rules
- Unit test coverage: 80%+ for new code
- WCAG 2.2 Level AA on all interactive elements
- Animations respect `prefers-reduced-motion`
- Touch targets: 44x44px minimum on interactive elements

### Definition of Done

- Code reviewed and merged to feature branch
- All unit tests passing
- TypeScript type-check and ESLint pass with zero errors
- Manual accessibility check (keyboard nav, screen reader)
- Component renders correctly at all breakpoints

---

## Phase 3 Actuals

| Metric             | Target | Actual   |
| ------------------ | ------ | -------- |
| Components Created | ~15    | 13+      |
| Unit Tests         | 100+   | 125+     |
| Test Coverage      | 80%+   | 85%+     |
| TypeScript Errors  | 0      | 0        |
| ESLint Violations  | 0      | 0        |
| WCAG Compliance    | 2.2 AA | Achieved |
