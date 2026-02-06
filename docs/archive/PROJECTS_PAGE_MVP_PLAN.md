# Projects Page - MVP Implementation Plan

**Created:** 2026-01-31
**Status:** Planning
**Related Documents:**
- [PHASE3_DETAILED_PLAN.md](./PHASE3_DETAILED_PLAN.md) - Full Phase 3 plan
- [TASK_3.1_IMPLEMENTATION_PLAN.md](./TASK_3.1_IMPLEMENTATION_PLAN.md) - Original comprehensive plan
- [MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md) - Overall modernization strategy

---

## Overview

This document outlines a **simplified MVP** approach to implementing the projects page. The previous comprehensive implementation attempt was unsatisfactory, so we're starting with the basics and building incrementally.

### MVP Scope

**What We're Building:**
- Single projects page that displays ALL 18 projects inline
- Each project shown with full details (title, tags, description, images, videos)
- Each project uses the appropriate layout variation (based on video presence, viewport size, altGrid flag)
- All projects visible on one scrollable page

**What We're NOT Building (Yet):**
- ❌ Separate project detail pages
- ❌ Tag filtering
- ❌ Keyword search
- ❌ Dynamic loading / pagination
- ❌ Image lightbox modal
- ❌ "Load more" functionality with Buta navigation
- ❌ URL state management for filters

**Build Strategy:**
Display all projects inline on a single page, each with its complete content. Start simple, add features incrementally with user guidance.

---

## Layout Strategy

### Projects Page Layout

**Single Page Display:**
- Show all 18 projects on one page, stacked vertically
- Each project displays inline with full details (not cards)
- Each project uses one of 5 layout variations
- Projects separated by spacing/dividers

**Project Spacing:**
- Vertical gap between projects: 64px (desktop), 48px (mobile)
- Optional: Horizontal divider line between projects
- Each project is a self-contained section

### Individual Project Layouts

Based on [TASK_3.1_IMPLEMENTATION_PLAN.md section 3.1.4](./TASK_3.1_IMPLEMENTATION_PLAN.md#314-project-detail-modalpage) and screenshots in `docs/screenshots/project-layout/`, we have 5 layout variations:

Each project on the page uses one of these 5 layout variations:

#### Wide Layouts (Tablet+ `md` and above)

**1. Wide + Video** (`wide-video.png`)
- **When:** Project has video content, desktop viewport
- **Structure:**
  - Project title (full width)
  - Left 1/3: Tags + Description
  - Right 2/3: Video player + 4-column thumbnail grid
- **Screenshot:** `docs/screenshots/project-layout/wide-video.png`

**2. Wide + Regular** (`wide-regular.png`)
- **When:** No video, default layout, desktop viewport
- **Structure:**
  - Project title (full width)
  - Left 2/3: Description with tags floating to the right
  - Right 1/3: 2-column thumbnail grid
- **Screenshot:** `docs/screenshots/project-layout/wide-regular.png`

**3. Wide + Alternate** (`wide-alternate.png`)
- **When:** No video, project has `altGrid: true` flag, desktop viewport
- **Structure:**
  - Project title (full width)
  - Left 1/3: Tags + Description
  - Right 2/3: 4-column thumbnail grid
- **Screenshot:** `docs/screenshots/project-layout/wide-alternate.png`

#### Narrow Layouts (Mobile `xs` and `sm`)

**4. Narrow** (`narrow.png`)
- **When:** Mobile viewport, no video
- **Structure:** Stacked vertically
  1. Project title
  2. Tags
  3. Description
  4. 4-column thumbnail grid (smaller thumbnails)
- **Screenshot:** `docs/screenshots/project-layout/narrow.png`

**5. Narrow + Video** (`narrow-video.png`)
- **When:** Mobile viewport, has video
- **Structure:** Stacked vertically
  1. Project title
  2. Tags
  3. Description
  4. Video player
  5. 4-column thumbnail grid (smaller thumbnails)
- **Screenshot:** `docs/screenshots/project-layout/narrow-video.png`

#### Layout Selection Logic

```typescript
/**
 * Determines which layout variant to use for a project detail page.
 *
 * @param project - The project to display
 * @param isMobile - Whether the viewport is mobile-sized (xs or sm breakpoint)
 * @returns The layout variant identifier
 */
function getLayoutVariant(project: Project, isMobile: boolean): LayoutVariant {
  const hasVideo = project.videos && project.videos.length > 0;

  if (isMobile) {
    return hasVideo ? 'narrow-video' : 'narrow';
  }

  // Desktop/tablet
  if (hasVideo) {
    return 'wide-video';
  }

  // No video - check altGrid flag
  return project.altGrid ? 'wide-alternate' : 'wide-regular';
}

type LayoutVariant =
  | 'wide-video'
  | 'wide-regular'
  | 'wide-alternate'
  | 'narrow'
  | 'narrow-video';
```

---

## Components Breakdown

### Minimal Component Set

We'll build only the essential components needed for the MVP:

#### Project Display Components

**ProjectHeader** (`/v2/src/components/project/ProjectHeader.tsx`)
```typescript
/**
 * Displays project title, date, and tags.
 */
interface ProjectHeaderProps {
  title: string;
  circa: string;
  tags: string[];
  layout?: 'inline' | 'stacked';  // How to arrange tags relative to title
  sx?: SxProps<Theme>;
}
```

**ProjectDescription** (`/v2/src/components/project/ProjectDescription.tsx`)
```typescript
/**
 * Renders HTML project description with sanitization.
 */
interface ProjectDescriptionProps {
  html: string;
  sx?: SxProps<Theme>;
}
```

**Features:**
- Sanitizes HTML with `isomorphic-dompurify` (already installed)
- Renders with `dangerouslySetInnerHTML` after sanitization
- Allows: `<p>`, `<a>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`, `<br>`

**ProjectGallery** (`/v2/src/components/gallery/ProjectGallery.tsx`)

**Note:** This component already exists from Phase 2. We'll use it as-is for the MVP.

**Existing implementation:**
- `v2/src/components/ProjectGallery.tsx`
- Displays grid of images using the `ProjectImage` component
- For MVP: Just display thumbnails, no lightbox click handling

**VideoEmbed** (`/v2/src/components/project/VideoEmbed.tsx`)
```typescript
/**
 * Embeds Vimeo or YouTube videos with responsive aspect ratio.
 */
interface VideoEmbedProps {
  video: ProjectVideo;
  sx?: SxProps<Theme>;
}
```

**Supported sources (from Phase 2 data):**
- Vimeo: `player.vimeo.com/video/{id}`
- YouTube: `youtube.com/embed/{id}`

**Features:**
- Responsive iframe with 16:9 aspect ratio
- `title` attribute for accessibility

**ProjectDetail** (`/v2/src/components/project/ProjectDetail.tsx`)
```typescript
/**
 * Main project component that displays a complete project inline.
 * Composes all sub-components and implements the responsive layout variations.
 */
interface ProjectDetailProps {
  project: Project;
}
```

**Features:**
- Detects viewport size (mobile vs desktop)
- Selects appropriate layout variant based on video, viewport, altGrid flag
- Composes: ProjectHeader, ProjectDescription, VideoEmbed (if video exists), ProjectGallery
- Implements layout-specific Grid/Box structures
- Displays as a complete, self-contained section

**ProjectsList** (`/v2/src/components/portfolio/ProjectsList.tsx`)
```typescript
/**
 * Container component that renders all projects inline on the page.
 */
interface ProjectsListProps {
  projects: Project[];
}
```

**Features:**
- Maps all projects to ProjectDetail components
- Adds vertical spacing/dividers between projects
- Semantic HTML: `<section>` for each project
- Maintains proper heading hierarchy (h2 for project titles)

---

## Implementation Phases

### Phase 1: Project Display Components (Priority 1)

**Files to Create:**
1. `/v2/src/components/project/ProjectHeader.tsx` - Title, tags, date
2. `/v2/src/components/project/ProjectDescription.tsx` - HTML description
3. `/v2/src/components/project/VideoEmbed.tsx` - Video player
4. `/v2/src/components/project/ProjectDetail.tsx` - Individual project with layouts

**ProjectDetail Layout Implementation:**

The `ProjectDetail` component will implement all 5 layout variations:

```typescript
// /v2/src/components/project/ProjectDetail.tsx
'use client';

import { Project } from '@/types';
import { useMediaQuery, useTheme, Box, Divider } from '@mui/material';
import { ProjectHeader } from './ProjectHeader';
import { ProjectDescription } from './ProjectDescription';
import { VideoEmbed } from './VideoEmbed';
import { ProjectGallery } from '@/components/ProjectGallery';

/**
 * Individual project component with responsive layout variations.
 * Displays a complete project inline with all details.
 */
export function ProjectDetail({ project }: { project: Project }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const hasVideo = project.videos && project.videos.length > 0;
  const layoutVariant = getLayoutVariant(project, isMobile);

  // Render different layouts based on variant
  return (
    <Box component="section" sx={{ mb: 8 }}>
      {/* Project title always full width */}
      <ProjectHeader
        title={project.title}
        circa={project.circa}
        tags={project.tags}
        layout={layoutVariant.startsWith('wide') ? 'inline' : 'stacked'}
      />

      {/* Layout-specific content */}
      {layoutVariant === 'wide-video' && <WideVideoLayout project={project} />}
      {layoutVariant === 'wide-regular' && <WideRegularLayout project={project} />}
      {layoutVariant === 'wide-alternate' && <WideAlternateLayout project={project} />}
      {layoutVariant === 'narrow' && <NarrowLayout project={project} />}
      {layoutVariant === 'narrow-video' && <NarrowVideoLayout project={project} />}

      {/* Divider between projects */}
      <Divider sx={{ mt: 6 }} />
    </Box>
  );
}

function getLayoutVariant(project: Project, isMobile: boolean) {
  const hasVideo = project.videos && project.videos.length > 0;

  if (isMobile) {
    return hasVideo ? 'narrow-video' : 'narrow';
  }

  // Desktop/tablet
  if (hasVideo) {
    return 'wide-video';
  }

  // No video - check altGrid flag
  return project.altGrid ? 'wide-alternate' : 'wide-regular';
}

// Individual layout components
function WideVideoLayout({ project }: { project: Project }) { ... }
function WideRegularLayout({ project }: { project: Project }) { ... }
function WideAlternateLayout({ project }: { project: Project }) { ... }
function NarrowLayout({ project }: { project: Project }) { ... }
function NarrowVideoLayout({ project }: { project: Project }) { ... }
```

**Testing:**
- Unit tests for all sub-components (ProjectHeader, ProjectDescription, VideoEmbed)
- Unit tests for each layout variant in ProjectDetail
- Manual testing: Visual comparison against screenshots

### Phase 2: Projects Page (Priority 2)

**Files to Create:**
1. `/v2/src/components/portfolio/ProjectsList.tsx` - Container for all projects
2. `/v2/app/page.tsx` - Projects page implementation

**Projects Page Structure:**
```typescript
// /v2/app/page.tsx
import { getProjects } from '@/lib/projectDataServer';
import { ProjectsList } from '@/components/portfolio/ProjectsList';
import { Container, Typography } from '@mui/material';

/**
 * Projects page displaying all projects inline.
 */
export default async function ProjectsPage() {
  // Fetch all projects (no pagination, no filtering)
  const { items } = await getProjects({ pageSize: 100 });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" sx={{ mb: 6 }}>
        Projects
      </Typography>
      <ProjectsList projects={items} />
    </Container>
  );
}
```

**ProjectsList Component:**
```typescript
// /v2/src/components/portfolio/ProjectsList.tsx
'use client';

import { Project } from '@/types';
import { Box } from '@mui/material';
import { ProjectDetail } from '@/components/project/ProjectDetail';

/**
 * Renders all projects inline on the page.
 */
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

**Testing:**
- Unit test for ProjectsList (rendering all projects)
- Integration test: Verify all 18 projects display correctly
- Manual testing: Scroll through entire page, check layouts

### Phase 3: Testing & Polish (Priority 3)

**Testing Files to Create:**
1. `/v2/src/__tests__/components/portfolio/ProjectsList.test.tsx`
2. `/v2/src/__tests__/components/project/ProjectHeader.test.tsx`
3. `/v2/src/__tests__/components/project/ProjectDescription.test.tsx`
4. `/v2/src/__tests__/components/project/VideoEmbed.test.tsx`
5. `/v2/src/__tests__/components/project/ProjectDetail.test.tsx`

**Quality Checks:**
- TypeScript: `npm run type-check` - 0 errors
- ESLint: `npm run lint` - 0 errors
- Tests: `npm test` - all passing
- Coverage: Target 80%+ for new components

**Manual Testing Checklist:**
- [ ] All 18 projects display on the projects page
- [ ] Correct layout variant applied to each project based on:
  - Mobile vs desktop
  - Video presence
  - `altGrid` flag
- [ ] Images load correctly for all projects
- [ ] Videos embed correctly (Vimeo and YouTube)
- [ ] Responsive design works at all breakpoints
- [ ] Proper spacing between projects
- [ ] Page scrolls smoothly through all projects
- [ ] Heading hierarchy is correct (h1 for page, h2 for project titles)

---

## File Structure

```
/v2/
├── app/
│   └── page.tsx                              # NEW - Projects page (all projects inline)
│
├── src/
│   ├── components/
│   │   ├── portfolio/                        # NEW directory
│   │   │   └── ProjectsList.tsx              # NEW - Container for all projects
│   │   │
│   │   ├── project/                          # NEW directory
│   │   │   ├── ProjectDetail.tsx             # NEW - Individual project display
│   │   │   ├── ProjectHeader.tsx             # NEW - Title, tags, date
│   │   │   ├── ProjectDescription.tsx        # NEW - HTML description
│   │   │   └── VideoEmbed.tsx                # NEW - Video player
│   │   │
│   │   ├── ProjectImage.tsx                  # EXISTS (from Phase 2)
│   │   └── ProjectGallery.tsx                # EXISTS (from Phase 2, use as-is)
│   │
│   └── __tests__/
│       └── components/
│           ├── portfolio/                    # NEW directory
│           │   └── ProjectsList.test.tsx     # NEW
│           │
│           └── project/                      # NEW directory
│               ├── ProjectHeader.test.tsx    # NEW
│               ├── ProjectDescription.test.tsx # NEW
│               ├── VideoEmbed.test.tsx       # NEW
│               └── ProjectDetail.test.tsx    # NEW
```

**New Files Summary:**
- **Components:** 5 new component files
- **Pages:** 1 new page file
- **Tests:** 5 new test files
- **Total:** 11 new files

---

## Visual Design Specifications

### Individual Project Display

| Element | Style |
|---------|-------|
| Page title | Oswald font, maroon (#8B1538), 2rem (mobile) / 2.5rem (desktop) |
| Date badge | Chip with maroon background, white text, rounded corners |
| Tags | Chip components, sage green (#8BA888) background, dark text |
| Description | Open Sans, dark gray (#333), 1rem, HTML content |
| Thumbnails | Rounded corners (4px), subtle shadow on hover |
| Video | Responsive 16:9 aspect ratio, centered |

### Thumbnail Grid Specifications

| Layout Variant | Columns | Gap | Thumbnail Size |
|----------------|---------|-----|----------------|
| Wide + Video | 4 | 12px | ~150px |
| Wide + Regular | 2 | 16px | ~180px |
| Wide + Alternate | 4 | 12px | ~150px |
| Narrow (all) | 4 | 8px | ~80px |

**Color References:**
All colors must be imported from `/v2/src/constants/colors.ts`:
- Maroon: `colors.maroon` (#8B1538)
- Sage: `colors.sage` (#8BA888)
- Duck Egg: `colors.duckEgg` (various shades)
- Graphite: `colors.graphite` (#333333)

---

## Accessibility Requirements

### WCAG 2.2 Level AA Compliance

**All Components Must:**
- Use semantic HTML (`<article>`, `<section>`, `<nav>`, etc.)
- Provide ARIA labels where needed
- Ensure keyboard accessibility (Tab, Enter, Space)
- Maintain focus indicators (visible outline)
- Meet color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Provide alt text for all images
- Support screen readers (NVDA, JAWS, VoiceOver)

**Specific Requirements:**

**ProjectsList:**
- [ ] Each project wrapped in `<section>` element
- [ ] Maintains logical document structure
- [ ] Proper spacing for visual separation

**ProjectDetail:**
- [ ] Each project is a `<section>` with semantic markup
- [ ] Maintains logical reading order when stacked

**ProjectHeader:**
- [ ] Title is `<h1>` (only one per page)
- [ ] Tags are focusable if interactive (not in MVP)
- [ ] Proper heading hierarchy maintained

**ProjectDescription:**
- [ ] Sanitized HTML doesn't break accessibility
- [ ] Links have descriptive text or `aria-label`
- [ ] Lists use proper `<ul>`/`<ol>` markup

**VideoEmbed:**
- [ ] iframe has `title` attribute describing content
- [ ] Keyboard can focus and activate video controls
- [ ] Respect `prefers-reduced-motion` (no autoplay)

**ProjectGallery:**
- [ ] Images have alt text from captions
- [ ] Grid maintains logical reading order

---

## Dependencies

### Existing Dependencies (No New Installs Needed)

All required dependencies are already installed from Phase 1 and Phase 2:

✅ `next` - App Router, Image, Link components
✅ `react` - UI library
✅ `@mui/material` - UI components (Card, Chip, Grid, Box, Container, etc.)
✅ `@mui/icons-material` - Icons (if needed)
✅ `isomorphic-dompurify` - HTML sanitization for ProjectDescription
✅ `vitest` - Testing framework
✅ `@testing-library/react` - Component testing
✅ `@testing-library/jest-dom` - DOM assertions

**No new dependencies required for MVP.**

---

## Success Criteria

### Functional Requirements

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Projects page loads | All 18 projects display inline |
| Projects render | Title, tags, description, images, videos all visible |
| Correct layout applied | Each project uses correct layout variant based on viewport, video, altGrid |
| Layout matches screenshots | Visual comparison confirms layout structure |
| Images display | All project images load correctly |
| Videos embed | Vimeo/YouTube videos play when present |
| Responsive design | Works on mobile (320px+), tablet, desktop |
| Scrolling works | Smooth scroll through all projects on one page |
| Spacing correct | Proper vertical spacing between projects |

### Quality Requirements

| Metric | Target | Verification |
|--------|--------|--------------|
| TypeScript errors | 0 | `npm run type-check` |
| ESLint errors | 0 | `npm run lint` |
| ESLint warnings | 0 | `npm run lint` |
| Test coverage | ≥80% | `npm run test:coverage` |
| All tests passing | 100% | `npm test` |
| Lighthouse Accessibility | ≥95 | Chrome DevTools |
| WCAG 2.2 AA violations | 0 | axe DevTools |

### Performance Requirements

| Metric | Target |
|--------|--------|
| First Contentful Paint | <2s |
| Largest Contentful Paint | <3s |
| Time to Interactive | <4s |
| Cumulative Layout Shift | <0.1 |

---

## Future Enhancements (Post-MVP)

After the MVP is working, we can incrementally add features:

**Enhancement 1: Interactive Features**
- Tag filtering (select tags to filter projects)
- Keyword search (search by title/description)
- URL state management (shareable filter URLs)

**Enhancement 2: Navigation & UX**
- "Load More" pagination with Buta navigation (show 6 at a time instead of all 18)
- Smooth scroll to top button
- Project anchor links (jump to specific project)

**Enhancement 3: Image Viewing**
- Image lightbox modal (full-screen gallery viewer)
- Keyboard navigation in lightbox (arrow keys, Esc)
- Touch gestures on mobile (swipe)

**Enhancement 4: Performance**
- Lazy loading projects below the fold (intersection observer)
- Fade-in animations on scroll
- Virtual scrolling for very long lists

**Enhancement 5: Individual Project Pages**
- Create separate `/projects/[id]` routes
- Allow direct linking to specific projects
- Add "Related Projects" section
- SEO optimization with per-project metadata

---

## Next Steps

1. **Review this plan** - Get approval on MVP scope and approach
2. **Create task list** - Break down into individual tasks with TodoWrite
3. **Phase 1: Project Components** - Build ProjectHeader, ProjectDescription, VideoEmbed, ProjectDetail
4. **Phase 2: Projects Page** - Build ProjectsList and main page
5. **Phase 3: Testing** - Write unit tests and verify quality
6. **Demo and iterate** - Show working MVP, get feedback, plan next features

---

## References

- **Screenshots:** `docs/screenshots/project-layout/` - Visual reference for layouts
- **Full Plan:** [TASK_3.1_IMPLEMENTATION_PLAN.md](./TASK_3.1_IMPLEMENTATION_PLAN.md) - Comprehensive feature set
- **Phase 3 Plan:** [PHASE3_DETAILED_PLAN.md](./PHASE3_DETAILED_PLAN.md) - Section 3.1.4 for layout details
- **Phase 2 Data Layer:** Working `getProjects()`, `getProjectById()`, types, etc.
- **Existing Components:** `ProjectImage`, `ProjectGallery` ready to use
- **Color Constants:** `/v2/src/constants/colors.ts` - Never hardcode colors

---

**Document Version:** 1.0
**Created:** 2026-01-31
**Status:** Ready for review and implementation
