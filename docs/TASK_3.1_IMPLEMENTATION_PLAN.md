# Task 3.1: Homepage (Portfolio) Implementation Plan

**Created:** 2026-01-29
**Status:** In Progress (Phase 1-4 Complete)
**Last Updated:** 2026-01-30
**Related:** [PHASE3_DETAILED_PLAN.md](./PHASE3_DETAILED_PLAN.md)

---

## Overview

Build the homepage portfolio feature with filterable/searchable project grid, pagination, and project detail pages. This implements 15 components across ~36 new files with 80%+ test coverage.

## Strategy

**Architecture:** Hybrid Server/Client Components
- Homepage: Server component for initial SSR → Client component for interactivity
- Project pages: Static generation (all 18 pre-rendered at build)
- State: URL params for filters/search (shareable URLs)
- Data: Use existing `useProjects()` hook and data layer from Phase 2

**Key Patterns to Follow:**
- All components: `"use client"` directive + comprehensive JSDoc
- Styling: MUI `sx` props with responsive breakpoints (xs, md, lg)
- Colors: Import from `/v2/src/constants/colors.ts` (never hardcode)
- Accessibility: Semantic HTML, ARIA labels, keyboard support
- Images: Next.js Image with priority prop for above-fold
- Testing: 80%+ coverage, query by role (accessibility-first)

## Implementation Phases

### Phase 1: Foundation Hooks (3 files) ✅ COMPLETED

**Completed:** 2026-01-25 | **Commit:** 6bb96b2 | **Files:** 3 components + 3 tests

Build reusable custom hooks first as they're dependencies for components.

**1.1 useDebounce Hook** (`/v2/src/hooks/useDebounce.ts`)
- Debounce value changes with configurable delay (default 300ms)
- Used by SearchBar to avoid excessive re-renders
- Pattern: useState + useEffect with cleanup timer
- Test: immediate changes, delayed updates, cleanup on unmount

**1.2 useInView Hook** (`/v2/src/hooks/useInView.ts`)
- Intersection Observer wrapper for lazy loading
- Returns: [ref, isInView, hasBeenInView]
- Used for: ProjectCard fade-in, VideoEmbed lazy loading
- Test: visibility detection, threshold handling, cleanup

**1.3 useReducedMotion Hook** (`/v2/src/hooks/useReducedMotion.ts`)
- Detect `prefers-reduced-motion` media query
- Returns boolean, listens for changes
- Disable animations when true (WCAG requirement)
- Test: media query detection, SSR safety, listener cleanup

### Phase 2: Display Components (2 files) ✅ COMPLETED

**Completed:** 2026-01-29 | **Commit:** 9e02572 | **Files:** 2 components + 2 tests

**2.1 ProjectCard** (`/v2/src/components/portfolio/ProjectCard.tsx`)

```typescript
interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  onClick?: (projectId: string) => void;
  sx?: SxProps<Theme>;
}
```

**Visual:**
- Wrap in Next.js Link to `/projects/[id]`
- Thumbnail: First image using existing ProjectImage component
- Title: 2-line truncate, Oswald font
- Circa badge: Chip with date
- Tags: Show first 3 + "+N more" text
- Hover: scale 1.02, elevation 1→4 (150ms transition)

**Lazy Loading:**
- Use `useInView({ threshold: 0.1, triggerOnce: true })`
- Fade-in: opacity 0→1 over 200ms
- Respect `useReducedMotion()` (instant if preferred)

**Accessibility:**
- Semantic: `<article>` element
- Focus: visible ring on keyboard focus
- Label: `aria-label` with full project title
- Keyboard: Enter/Space activates

**2.2 ProjectGrid** (`/v2/src/components/portfolio/ProjectGrid.tsx`)

```typescript
interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  onProjectClick: (projectId: string) => void;
  sx?: SxProps<Theme>;
}
```

**Layout:**
- CSS Grid (not MUI Grid v2): `display: 'grid'`
- Columns: xs=1, md=2, lg=3
- Gap: 24px (3 spacing units)
- `role="list"` container, `role="listitem"` on cards

**States:**
- Loading: Show 6 skeleton cards, `aria-busy="true"`
- Empty: "No projects found" message with clear filters suggestion
- Loaded: Map projects to ProjectCard components

### Phase 3: Filtering & Search (2 files) ✅ COMPLETED

**Completed:** 2026-01-30 | **Commit:** 643821e | **Files:** 2 components + 2 tests

**3.1 ProjectFilters** (`/v2/src/components/portfolio/ProjectFilters.tsx`)

```typescript
interface ProjectFiltersProps {
  tags: Map<string, number>;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sx?: SxProps<Theme>;
}
```

**Visual:**
- Each tag: MUI Chip with count badge
- Selected: filled maroon background
- Unselected: outlined style
- "Clear all" button when selections exist

**Responsive:**
- Mobile: Collapsible panel or horizontal scroll
- Desktop: Wrapped multi-row

**Accessibility:**
- Each chip: `role="checkbox"` with `aria-checked`
- Group: `role="group"` with `aria-label="Filter by technology"`
- Keyboard: Arrow keys navigate, Space toggles

**3.2 SearchBar** (`/v2/src/components/portfolio/SearchBar.tsx`)

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount?: number;
  placeholder?: string;
  sx?: SxProps<Theme>;
}
```

**Features:**
- MUI TextField with search icon
- Clear button (X) when value exists
- Results count: "Showing N of M projects"
- Debouncing via useDebounce hook (300ms)

**Accessibility:**
- Label: `aria-label="Search projects"`
- Live region: `aria-live="polite"` for results count updates
- `aria-describedby` pointing to results text
- Type: `search` for semantic HTML

### Phase 4: Pagination (1 file) ✅ COMPLETED

**Completed:** 2026-01-30 | **Commit:** TBD | **Files:** 1 component + 1 test

**4.1 ButaNavigation** (`/v2/src/components/portfolio/ButaNavigation.tsx`)

```typescript
interface ButaNavigationProps {
  state: 'loading' | 'load-more' | 'end';
  currentCount: number;
  totalCount: number;
  onLoadMore: () => void;
  sx?: SxProps<Theme>;
}
```

**Visual:**
- Buta image: `/images/buta/buta-waving.png` (bottom-right)
- Thought bubble: Oval shape with connecting circles
- Font: "Gochi Hand" (already in theme)
- Text varies by state:
  - loading: "Fetching more projects..."
  - load-more: "Want to see more?" + link + "X / Y projects"
  - end: "That's all, folks!"

**Responsive:**
```typescript
// Buta image
width: { xs: 180, md: 300 }
height: { xs: 125, md: 209 }

// Thought bubble
fontSize: { xs: '1rem', md: '1.125rem' }
padding: { xs: '15px 16px', md: '25px 20px' }
```

**Accessibility:**
- Thought bubble: `role="status"` with `aria-live="polite"`
- Link: 44px minimum touch target
- Counter: `aria-label="Showing X of Y projects"`

### Phase 5: Project Detail Components (5 files)

**5.1 ProjectHeader** (`/v2/src/components/project/ProjectHeader.tsx`)

```typescript
interface ProjectHeaderProps {
  title: string;
  circa: string;
  tags: string[];
  layout?: 'inline' | 'stacked' | 'floating';
  sx?: SxProps<Theme>;
}
```

- Title: Typography h1, maroon color, may contain HTML (sanitized)
- Circa: Badge/Chip with date
- Tags: Horizontal wrap, use color constants
- Layout variants for different page layouts

**5.2 ProjectDescription** (`/v2/src/components/project/ProjectDescription.tsx`)

```typescript
interface ProjectDescriptionProps {
  html: string;
  sx?: SxProps<Theme>;
}
```

- Sanitize with `isomorphic-dompurify` (already installed)
- Allow: p, a, strong, em, ul, ol, li, br
- Render with `dangerouslySetInnerHTML` after sanitization
- Style links: maroon color, underline on hover

**5.3 VideoEmbed** (`/v2/src/components/project/VideoEmbed.tsx`)

```typescript
interface VideoEmbedProps {
  video: ProjectVideo;
  lazy?: boolean;
  sx?: SxProps<Theme>;
}
```

- Support: Vimeo (`player.vimeo.com/video/{id}`)
- Support: YouTube (`youtube.com/embed/{id}`)
- Lazy load: useInView to defer iframe until visible
- Aspect ratio: CSS `aspect-ratio` or padding-bottom technique
- Accessibility: `title` attribute, respect `prefers-reduced-motion`

**5.4 RelatedProjects** (`/v2/src/components/project/RelatedProjects.tsx`)

```typescript
interface RelatedProjectsProps {
  projectId: string;
  limit?: number;
  sx?: SxProps<Theme>;
}
```

- Fetch: `getRelatedProjects(projectId, limit)` from data layer
- Default limit: 3 projects
- Layout: 3-column grid on desktop, horizontal scroll on mobile
- Use ProjectCard component (compact variant)

**5.5 ProjectDetail** (`/v2/src/components/project/ProjectDetail.tsx`)

```typescript
interface ProjectDetailProps {
  project: Project;
  layoutHint?: 'wide-video' | 'wide-regular' | 'wide-alternate' | 'narrow' | 'narrow-video';
  sx?: SxProps<Theme>;
}
```

**Layout Selection Logic:**
```typescript
function selectLayout(project: Project, isMobile: boolean, hint?: string) {
  if (hint) return hint;
  if (project.videos.length > 0 && isMobile) return 'narrow-video';
  if (project.videos.length > 0) return 'wide-video';
  if (project.altGrid) return 'wide-alternate';
  if (isMobile) return 'narrow';
  return 'wide-regular';
}
```

**Composition:**
- ProjectHeader
- VideoEmbed (if videos exist)
- ProjectDescription
- ProjectGallery (existing component)
- RelatedProjects

### Phase 6: Page Integration (2 files)

**6.1 Homepage** (`/v2/app/page.tsx`)

**Strategy:** Server Component wraps Client Component

```typescript
// Server Component (initial SSR)
export default async function HomePage() {
  const initialData = await fetchProjects({ page: 1, pageSize: 6 });
  const allTags = await fetchAllTags();
  const tagCounts = getTagCounts();

  return <PortfolioPageClient
    initialData={initialData}
    allTags={allTags}
    tagCounts={tagCounts}
  />;
}
```

**Client Component** (separate file or same with 'use client'):

```typescript
'use client';
function PortfolioPageClient({ initialData, allTags, tagCounts }) {
  // URL state management
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse from URL
  const [selectedTags, setSelectedTags] = useState(
    searchParams.get('tags')?.split(',') || []
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [page, setPage] = useState(
    Number(searchParams.get('page')) || 1
  );

  // Client-side data fetching
  const { data, loading, setOptions } = useProjects({
    page,
    pageSize: 6,
    tags: selectedTags,
    search: searchQuery
  });

  // Sync state to URL (without scroll)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTags.length) params.set('tags', selectedTags.join(','));
    if (searchQuery) params.set('search', searchQuery);
    if (page > 1) params.set('page', String(page));

    router.push(`/?${params.toString()}`, { scroll: false });
  }, [selectedTags, searchQuery, page]);

  // Buta state
  const butaState = loading ? 'loading'
    : data.end >= data.total - 1 ? 'end'
    : 'load-more';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        resultsCount={data?.total}
      />

      <ProjectFilters
        tags={tagCounts}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      <ProjectGrid
        projects={data?.items || []}
        loading={loading}
        onProjectClick={(id) => router.push(`/projects/${id}`)}
      />

      <ButaNavigation
        state={butaState}
        currentCount={data?.end + 1 || 0}
        totalCount={data?.total || 0}
        onLoadMore={() => setPage(prev => prev + 1)}
      />
    </Container>
  );
}
```

**6.2 Project Detail Page** (`/v2/app/projects/[id]/page.tsx`)

```typescript
// Static generation for all 18 projects
export async function generateStaticParams() {
  const projects = await fetchProjects({ pageSize: 100 });
  return projects.items.map((project) => ({
    id: project.id,
  }));
}

// SEO metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await fetchProjectById(params.id);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} - Sing Chan Portfolio`,
    description: project.desc.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      images: [project.images[0]?.url],
    },
  };
}

// Page component
export default async function ProjectPage({ params }) {
  const project = await fetchProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProjectDetail project={project} />
    </Container>
  );
}
```

### Phase 7: Testing (13+ test files)

**Test Structure:** Mirror source in `/v2/src/__tests__/`

**Hooks Tests:**
- `hooks/useDebounce.test.ts`
- `hooks/useInView.test.ts`
- `hooks/useReducedMotion.test.ts`

**Portfolio Component Tests:**
- `components/portfolio/ProjectCard.test.tsx`
- `components/portfolio/ProjectGrid.test.tsx`
- `components/portfolio/ProjectFilters.test.tsx`
- `components/portfolio/SearchBar.test.tsx`
- `components/portfolio/ButaNavigation.test.tsx`

**Project Component Tests:**
- `components/project/ProjectHeader.test.tsx`
- `components/project/ProjectDescription.test.tsx`
- `components/project/VideoEmbed.test.tsx`
- `components/project/RelatedProjects.test.tsx`
- `components/project/ProjectDetail.test.tsx`

**Integration Tests:**
- `app/page.test.tsx` - Full homepage user flows

**Testing Patterns:**
```typescript
// Mock Next.js modules
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Query by role (accessibility-first)
expect(screen.getByRole('article')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();

// User interactions
const user = userEvent.setup();
await user.click(element);
await user.keyboard('{Enter}');

// Edge cases
// - Empty arrays (0 projects)
// - Single items (1 project)
// - Many items (50+ projects)
// - Special characters in titles/tags
```

**Coverage Target:** 80%+ overall
- Hooks: 90%+
- Components: 85%+
- Pages: 70%+

---

## Critical Files

**Priority 1 (Build First):**
1. `/v2/src/hooks/useDebounce.ts` - SearchBar dependency
2. `/v2/src/hooks/useInView.ts` - ProjectCard lazy loading
3. `/v2/src/hooks/useReducedMotion.ts` - Accessibility requirement
4. `/v2/src/components/portfolio/ProjectCard.tsx` - Building block
5. `/v2/src/components/portfolio/ProjectGrid.tsx` - Layout foundation

**Priority 2 (Interactive Features):**
6. `/v2/src/components/portfolio/SearchBar.tsx`
7. `/v2/src/components/portfolio/ProjectFilters.tsx`
8. `/v2/src/components/portfolio/ButaNavigation.tsx`
9. `/v2/app/page.tsx` - Homepage integration

**Priority 3 (Project Details):**
10. `/v2/src/components/project/ProjectHeader.tsx`
11. `/v2/src/components/project/ProjectDescription.tsx`
12. `/v2/src/components/project/VideoEmbed.tsx`
13. `/v2/src/components/project/RelatedProjects.tsx`
14. `/v2/src/components/project/ProjectDetail.tsx`
15. `/v2/app/projects/[id]/page.tsx`

---

## Dependencies

**Already Installed (No New Dependencies Needed):**
- `isomorphic-dompurify` - HTML sanitization ✅
- `next` - App router, Image, Link ✅
- `@mui/material` - UI components ✅
- `@mui/icons-material` - Icons ✅
- Vitest + React Testing Library ✅

---

## File Structure

```
/v2/
├── app/
│   ├── page.tsx                          # NEW - Homepage
│   └── projects/[id]/page.tsx            # NEW - Project detail
│
├── src/
│   ├── components/
│   │   ├── portfolio/                    # NEW directory
│   │   │   ├── ProjectCard.tsx           # NEW
│   │   │   ├── ProjectGrid.tsx           # NEW
│   │   │   ├── ProjectFilters.tsx        # NEW
│   │   │   ├── SearchBar.tsx             # NEW
│   │   │   ├── ButaNavigation.tsx        # NEW
│   │   │   └── index.ts                  # NEW - barrel export
│   │   │
│   │   └── project/                      # NEW directory
│   │       ├── ProjectDetail.tsx         # NEW
│   │       ├── ProjectHeader.tsx         # NEW
│   │       ├── ProjectDescription.tsx    # NEW
│   │       ├── VideoEmbed.tsx            # NEW
│   │       ├── RelatedProjects.tsx       # NEW
│   │       └── index.ts                  # NEW - barrel export
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts                # NEW
│   │   ├── useInView.ts                  # NEW
│   │   └── useReducedMotion.ts           # NEW
│   │
│   └── __tests__/
│       ├── hooks/
│       │   ├── useDebounce.test.ts       # NEW
│       │   ├── useInView.test.ts         # NEW
│       │   └── useReducedMotion.test.ts  # NEW
│       │
│       ├── components/
│       │   ├── portfolio/                # NEW directory (5 test files)
│       │   └── project/                  # NEW directory (5 test files)
│       │
│       └── app/
│           └── page.test.tsx             # NEW - Integration test
```

**New Files:** 23 components/hooks + 13 tests = 36 files total

---

## Verification Strategy

**After Each Phase:**
1. TypeScript: `npm run type-check` - no errors
2. ESLint: `npm run lint` - no warnings
3. Tests: `npm test` - all passing
4. Coverage: `npm run test:coverage` - check progress toward 80%

**Final Verification:**
1. **Functionality:**
   - Homepage displays all 18 projects
   - Filter by tags works (AND logic)
   - Search finds matching projects
   - Pagination loads more projects
   - Navigation to project detail works
   - All 18 project pages load
   - Related projects display correctly
   - Video embeds work (Vimeo/YouTube)

2. **Performance:**
   - Lighthouse Performance: 90+
   - First Contentful Paint: < 1.5s
   - Lazy loading reduces initial bundle

3. **Accessibility:**
   - Lighthouse Accessibility: 95+
   - Keyboard navigation: Tab through all elements
   - Screen reader: VoiceOver/NVDA announces correctly
   - Focus indicators visible
   - Color contrast: 4.5:1 minimum
   - Touch targets: 44x44px minimum
   - Reduced motion: Animations disabled when preferred

4. **Testing:**
   - Coverage: 80%+ overall
   - All components unit tested
   - Integration tests pass
   - Edge cases covered

5. **Code Quality:**
   - JSDoc documentation on all functions/components
   - No hardcoded colors (uses constants)
   - No TypeScript `any` types
   - Follows existing component patterns

**Manual Testing Checklist:**
- [ ] Test on mobile device (not just DevTools)
- [ ] Test all breakpoints (320px, 768px, 1024px, 1440px)
- [ ] Test keyboard navigation (Tab, Enter, Space, Arrows, Esc)
- [ ] Test screen reader (VoiceOver on Mac or NVDA on Windows)
- [ ] Test with reduced motion enabled in OS
- [ ] Test filter combinations (multiple tags + search)
- [ ] Test empty states (no results)
- [ ] Test all 18 project detail pages

---

## Success Criteria

✅ All 23 components implemented with JSDoc
✅ 80%+ test coverage achieved
✅ Homepage displays filterable/searchable project grid
✅ Project detail pages statically generated
✅ WCAG 2.2 Level AA compliance (Lighthouse 95+)
✅ No TypeScript errors, ESLint warnings
✅ Mobile-responsive design works on real devices
✅ URL state management enables shareable filter URLs
✅ Buta navigation provides character-driven UX
