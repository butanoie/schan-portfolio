# Artifacts Page — Implementation Plan

**Version:** 1.1
**Created:** 2026-03-04
**Updated:** 2026-03-04
**Status:** Draft — Decisions Resolved

---

## Overview

Add a new **"Writing Samples"** page to the portfolio site that showcases professional documentation artifacts across five sections. The page demonstrates Sing Chan's ability to produce enterprise-grade deliverables — product roadmaps with embedded SAFe artifacts, UX specifications, technical evaluations, operational strategies, and cost optimization analyses.

### Page Name Decision: "Writing Samples"

| Candidate | Pros | Cons |
|-----------|------|------|
| Artifacts | Agile-native, precise | Jargon-heavy for non-PM audiences |
| Samples | Approachable, clear intent | Generic, could be anything |
| **Writing Samples** | Professional, clear purpose, recruiter-friendly | Slightly longer |
| Documentation | Accurate | Reads like a help section |

**Recommendation: "Writing Samples"** — it immediately communicates purpose to hiring managers and recruiters, positions the content as demonstrable skill, and pairs naturally with the portfolio's existing voice ("Body of Work" → "Writing Samples"). The **nav label is "Samples"** for space efficiency; all verbose contexts (page heading, SEO title, meta description, PageDeck) use the full **"Writing Samples"**.

---

## Narrative Throughline

The page tells a single story: **"I don't just build products — I document the thinking behind them."**

Each section escalates from strategic thinking → design rationale → technical rigor → operational discipline → measurable impact. The final section (Measuring the Impact) serves as a proof-of-results anchor, connecting documentation back to business outcomes.

### Section Naming (Revised for Coherence)

The original ARTIFACTS.md categories have been refined into a progression that reads as a natural narrative. SAFe Agile Artifacts have been **merged into Product Strategy** since the epics, features, and PBIs are embedded within the roadmap documents.

| Original Category | Revised Section Heading | Rationale |
|---|---|---|
| Product Strategy & Planning + SAFe Agile Artifacts | **Defining the Vision** | Strategy and SAFe execution artifacts unified — roadmaps contain both |
| UX & Design | **Designing the Experience** | Connects naturally from vision to design |
| Technical Documentation | **Evaluating the Technology** | Focuses on decision-making, not just docs |
| Process & Operations | **Operationalizing the Practice** | Shows scaling from individual to team |
| Cost Savings | **Measuring the Impact** | Closes the loop with business outcomes |

---

## Architecture & File Structure

### New Files to Create

```
v2/
├── app/
│   └── samples/
│       └── page.tsx                    # Server component (metadata + shell)
├── src/
│   ├── components/
│   │   └── samples/
│   │       ├── SamplesContent.tsx      # Client component (main page content)
│   │       └── ArtifactSection.tsx     # Reusable section component
│   ├── locales/
│   │   ├── en/
│   │   │   └── samples.json           # English translations
│   │   └── fr/
│   │       └── samples.json           # French translations
│   └── types/
│       └── samples.ts                 # TypeScript interfaces
└── public/
    ├── images/
    │   ├── tasty_morsels@2x-en.png   # Hero image (English)
    │   └── tasty_morsels@2x-fr.png   # Hero image (French)
    └── documents/                     # Hosted document files
        ├── *.pdf                      # PDF versions for web viewing
        └── *.md                       # Markdown documents
```

### Files to Modify

| File | Change |
|------|--------|
| `v2/src/utils/navigation.ts` | Add Samples nav link |
| `v2/src/lib/i18next-config.ts` | Import and merge `samples.json` |
| `v2/src/constants/seo.ts` | Add `PAGE_METADATA.samples` |
| `v2/src/locales/en/common.json` | Add `nav.samples` key |
| `v2/src/locales/fr/common.json` | Add `nav.samples` key |
| `v2/app/sitemap.ts` | Add `/samples` route |
| `v2/app/robots.ts` | Verify `/samples` is allowed (likely no change needed) |

---

## Implementation Details

### Step 1: Types (`v2/src/types/samples.ts`)

```typescript
/**
 * A downloadable format for a document artifact (e.g., PDF or Markdown).
 */
export interface ArtifactFormat {
  /** File format label displayed in the UI (e.g., "PDF", "MD") */
  label: string;
  /** File path relative to /public/documents/ */
  href: string;
}

/**
 * Represents a single downloadable document artifact.
 * Supports multiple download formats (e.g., PDF + Markdown).
 */
export interface ArtifactItem {
  /** Translation key for the document title */
  titleKey: string;
  /** Translation key for a brief document description */
  descriptionKey: string;
  /** Available download formats (empty array = coming soon) */
  formats: ArtifactFormat[];
  /** Whether the document is available (false = coming soon) */
  available: boolean;
}

/**
 * Represents one section of the Writing Samples page (e.g., "Defining the Vision").
 */
export interface ArtifactSection {
  /** Translation key for the section heading */
  headingKey: string;
  /** Translation key for the section introduction paragraph */
  introKey: string;
  /** List of document artifacts in this section */
  items: ArtifactItem[];
}
```

### Step 2: Navigation Update (`v2/src/utils/navigation.ts`)

Add a fourth nav link using a suitable MUI icon (e.g., `ArticleIcon` or `FolderOpenIcon`):

```typescript
import ArticleIcon from "@mui/icons-material/Article";

// Add to getNavLinks() return array:
{ labelKey: "nav.samples", href: "/samples", icon: createElement(ArticleIcon) },
```

**Placement:** Between "Résumé" and "Colophon" — the page is a portfolio extension, not site meta.

### Step 3: i18n Setup

#### `v2/src/locales/en/common.json` — Add nav key:
```json
"nav": {
  ...existing keys,
  "samples": "Samples"
}
```

#### `v2/src/locales/en/samples.json` — Full page translations:

```json
{
  "samples": {
    "pageTitle": "Writing Samples | Sing Chan's Portfolio",
    "pageDescription": "Professional documentation samples spanning product strategy, agile planning, UX design, technical evaluation, operations, and cost optimization.",
    "pageDeck": {
      "imageAlt": "Writing Samples — professional documentation showcase",
      "heading": "Writing Samples",
      "paragraphs": [
        "These writing samples represent the kinds of artifacts I produce throughout the product lifecycle: from the roadmaps that define where we're going, to the specifications that guide how we get there, to the audits that prove the results.",
        "Each document was created as part of this portfolio's modernization project, demonstrating how I approach real-world product, design, and engineering challenges."
      ]
    },
    "sections": {
      "productStrategy": {
        "heading": "Defining the Vision",
        "intro": "Product strategy begins with a clear understanding of what to build and why. These documents show how I translate business objectives and user needs into SAFe-structured roadmaps — decomposing strategy into epics, features, and product backlog items that give teams a shared direction and stakeholders a transparent view of what's ahead."
      },
      "uxDesign": {
        "heading": "Designing the Experience",
        "intro": "Usable software requires intentional design decisions, documented clearly enough for developers to build and QA to validate. These artifacts cover interaction design specifications, accessibility compliance reports, and usability methodologies — bridging the gap between design intent and implementation."
      },
      "technical": {
        "heading": "Evaluating the Technology",
        "intro": "Sound technical decisions require structured evaluation, not just opinion. These documents demonstrate how I assess frameworks, weigh trade-offs, and record architectural decisions so that teams understand not just what was chosen, but why — and can revisit those decisions as context evolves."
      },
      "processOps": {
        "heading": "Operationalizing the Practice",
        "intro": "Shipping great software consistently requires more than talented individuals — it requires documented processes that scale. These artifacts cover QA automation strategy, team onboarding programs, and release management practices that help organizations move from ad hoc execution to repeatable discipline."
      },
      "costSavings": {
        "heading": "Measuring the Impact",
        "intro": "Documentation isn't just about planning — it's about proving results. This section showcases how structured analysis, operational runbooks, and clear reporting can identify and validate significant cost reductions — turning infrastructure audits into measurable business outcomes worth over $360K CAD in annualized savings."
      }
    },
    "artifacts": {
      "productRoadmapPhase3": {
        "title": "Product Roadmap — Phase 3",
        "description": "SAFe-formatted roadmap with epics, features, and product backlog items for the core pages development phase."
      },
      "productRoadmapPhase4": {
        "title": "Product Roadmap — Phase 4",
        "description": "SAFe-formatted roadmap covering enhanced features: theming, i18n, animations, accessibility, and SEO."
      },
      "prdLightbox": {
        "title": "Product Requirements Document — Project Grid & Lightbox",
        "description": "Detailed PRD for the portfolio's project grid layout and image lightbox interaction patterns."
      },
      "idsLightbox": {
        "title": "Interaction Design Specification — Project Grid & Lightbox",
        "description": "Comprehensive IDS documenting interaction patterns, state transitions, and responsive behavior for the project grid and lightbox components."
      },
      "wcagGuide": {
        "title": "WCAG 2.2 Compliance Guide",
        "description": "Detailed guide mapping WCAG 2.2 Level AA success criteria to the portfolio's implementation approach."
      },
      "accessibilityStatement": {
        "title": "Accessibility Statement",
        "description": "Public-facing accessibility commitment documenting compliance scope, testing methodology, and known limitations."
      },
      "adrI18n": {
        "title": "Architecture Decision Record — i18n Library Selection",
        "description": "ADR evaluating internationalization approaches for the Next.js migration, documenting the rationale for selecting i18next."
      },
      "frameworkEval": {
        "title": "Front-End Framework Evaluation",
        "description": "Structured comparison of front-end frameworks considered for the portfolio modernization, with scoring criteria and final recommendation."
      },
      "qaStrategy": {
        "title": "QA Automation Strategy",
        "description": "BDD-driven QA strategy with CI/CD integration, covering test pyramid structure, tooling selection, and coverage targets."
      },
      "onboardingGuide": {
        "title": "Product Knowledge Onboarding Guide",
        "description": "14-module onboarding curriculum designed for new team members, covering product architecture, workflows, and domain knowledge."
      },
      "changelogStrategy": {
        "title": "Changelog & Release Notes Strategy",
        "description": "Multi-file changelog philosophy documenting naming conventions, versioning format, and release note distillation process."
      },
      "costSavingsRoadmap": {
        "title": "Additional Cost Savings Roadmap",
        "description": "Strategic presentation outlining further infrastructure cost optimization opportunities beyond the initial 40% reduction, with phased implementation plan and projected savings."
      },
      "elasticsearchRunbook": {
        "title": "Elasticsearch Node & Disk Scale-Down Runbook",
        "description": "Step-by-step operational runbook for safely scaling down Elasticsearch cluster nodes and disk allocation, with rollback procedures and monitoring checkpoints."
      },
      "costCuttingAudit": {
        "title": "Cost Cutting Audit",
        "description": "Azure cloud infrastructure cost optimization audit identifying 40% reduction in annualized hosting costs, documenting analysis methodology, findings, and implemented savings of $360K CAD."
      }
    },
    "labels": {
      "comingSoon": "Coming Soon",
      "download": "Download",
      "downloadFormat": "Download {{format}}",
      "viewDocument": "View document: {{title}}",
      "format": "{{format}}",
      "pdfOnly": "PDF only"
    },
    "meta": {
      "title": "Writing Samples | Sing Chan's Portfolio",
      "description": "Professional documentation samples spanning product strategy, agile artifacts, UX design, technical evaluations, and operational processes.",
      "keywords": "writing samples, product documentation, SAFe agile, UX design, technical documentation, product management"
    }
  }
}
```

### Step 4: i18n Config Update (`v2/src/lib/i18next-config.ts`)

```typescript
// Add imports
import enSamples from '../locales/en/samples.json';
import frSamples from '../locales/fr/samples.json';

// Update mergePageTranslations signature and calls
function mergePageTranslations(
  home: Record<string, unknown>,
  resume: Record<string, unknown>,
  colophon: Record<string, unknown>,
  samples: Record<string, unknown>
): Record<string, unknown> {
  return { ...home, ...resume, ...colophon, ...samples };
}

// Update resources
pages: mergePageTranslations(enHome, enResume, enColophon, enSamples),
// ...and French equivalent
```

### Step 5: SEO Constants (`v2/src/constants/seo.ts`)

```typescript
samples: {
  title: "Writing Samples - Sing Chan's Portfolio",
  description:
    "Professional documentation samples: product roadmaps, SAFe artifacts, UX specifications, technical evaluations, and operational strategies.",
  keywords: [
    ...SITE_METADATA.keywords,
    "writing samples",
    "product documentation",
    "SAFe agile",
    "technical writing",
  ],
},
```

### Step 6: Page Component (`v2/app/samples/page.tsx`)

Server component following the colophon pattern:

```typescript
// Server component with static metadata
export const metadata: Metadata = { /* from PAGE_METADATA.samples */ };

export default function SamplesPage() {
  return (
    <Container component="main" role="article" maxWidth="lg">
      <SamplesContent />
    </Container>
  );
}
```

### Step 7: Client Components

#### `SamplesContent.tsx`

Client component that:
- Uses `useI18n()` for translations
- Uses `usePalette()` for theme-aware styling
- Renders `PageDeck` with the "Tasty Morsels" hero image
- Renders five `ArtifactSection` components

#### `ArtifactSection.tsx`

Reusable section component that:
- Renders a section heading (h2) in Oswald font
- Renders an intro paragraph
- Renders a list/grid of artifact cards
- Each card shows: title, description, format badge, download/view link or "Coming Soon" badge
- Uses `ScrollAnimatedSection` for scroll-in animations (respects `prefers-reduced-motion`)

### Step 8: Hero Image — "Tasty Morsels"

A new pork-cuts-style hero image variant called **"Tasty Morsels"** will be created for this page. This continues the butcher-shop metaphor (Body of Work → Choice Cuts → Tasty Morsels) while giving the page its own visual identity.

**Image files to create:**
- `v2/public/images/tasty_morsels@2x-en.png` (English)
- `v2/public/images/tasty_morsels@2x-fr.png` (French)

**Dimensions:** 940×240 (matching existing hero images)

**Implementation:** Use `getLocalizedImageUrl('tasty_morsels@2x', locale)` in the PageDeck data.

**Note:** The image design/creation is a separate creative task. Implementation can proceed with a placeholder using the existing `pork_cuts@2x` image and swap to `tasty_morsels@2x` once the asset is ready.

### Step 9: Document Hosting

Documents are hosted in `v2/public/documents/` and offered in **PDF and Markdown** formats. PDF provides a polished, print-ready reading experience; Markdown demonstrates technical writing fluency and is developer-friendly.

**File structure:**

```
v2/public/documents/
├── PHASE_3_PRODUCT_ROADMAP.pdf
├── PHASE_3_PRODUCT_ROADMAP.md
├── PHASE_4_PRODUCT_ROADMAP.pdf
├── PHASE_4_PRODUCT_ROADMAP.md
├── PRD_Project_Grid_and_Lightbox.pdf
├── PRD_Project_Grid_and_Lightbox.md
├── IDS_Project_Grid_and_Lightbox.pdf
├── IDS_Project_Grid_and_Lightbox.md
├── Additional_Cost_Savings_Roadmap.pdf    # From .pptx source
├── Elasticsearch_Scale_Down_Runbook.pdf
├── Elasticsearch_Scale_Down_Runbook.md
├── Cost_Cutting_Audit.pdf
├── Cost_Cutting_Audit.md
└── ... (remaining documents in both formats)
```

**Format notes:**
- `.docx` source files are converted to both PDF and Markdown
- `.pptx` files (e.g., Additional Cost Savings Roadmap) are offered as PDF only (presentations don't convert well to Markdown)
- Each artifact card displays format badges and separate download links for each available format

Migrate to CDN in Phase 6 if needed.

### Step 10: Section-to-Document Mapping

| Section | Documents | Format | Status |
|---------|-----------|--------|--------|
| **Defining the Vision** | Phase 3 Roadmap (with SAFe epics/features/PBIs) | PDF, MD | ✅ Done |
| | Phase 4 Roadmap (with SAFe epics/features/PBIs) | PDF, MD | ✅ Done |
| | PRD — Project Grid & Lightbox | PDF, MD | ✅ Done |
| **Designing the Experience** | IDS — Project Grid & Lightbox | PDF, MD | ✅ Done |
| | WCAG 2.2 Compliance Guide | PDF, MD | ✅ Done |
| | Accessibility Statement | PDF, MD | ✅ Done |
| **Evaluating the Technology** | ADR — i18n Library Selection | PDF, MD | ✅ Done |
| | Front-End Framework Evaluation | PDF, MD | ✅ Done |
| **Operationalizing the Practice** | QA Automation Strategy | PDF, MD | ✅ Done |
| | Product Knowledge Onboarding Guide | PDF, MD | ✅ Done |
| | Changelog & Release Notes Strategy | PDF, MD | ✅ Done |
| **Measuring the Impact** | Additional Cost Savings Roadmap | PDF only | ○ Todo |
| | Elasticsearch Node & Disk Scale-Down Runbook | PDF, MD | ○ Todo |
| | Cost Cutting Audit | PDF, MD | ○ Todo |

**Note:** SAFe artifacts (epics, features, PBIs) are embedded within the Phase 3 and Phase 4 roadmap documents. The "Defining the Vision" section intro acknowledges that these roadmaps demonstrate both strategic planning and SAFe execution structure. The Additional Cost Savings Roadmap is sourced from a PowerPoint presentation and offered as PDF only.

---

## Artifact Card Design

Each document card displays the title, description, format badges, and download links for each available format.

**Available document with multiple formats (PDF + MD):**

```
┌─────────────────────────────────────────────────────┐
│  📄 Product Roadmap — Phase 3                       │
│                                                     │
│  SAFe-formatted roadmap with epics, features,       │
│  and product backlog items for the core pages        │
│  development phase.                                  │
│                                                     │
│                        [ PDF ↓ ]  [ Markdown ↓ ]    │
└─────────────────────────────────────────────────────┘
```

**Available document with single format (PDF only — e.g., from PowerPoint source):**

```
┌─────────────────────────────────────────────────────┐
│  📄 Additional Cost Savings Roadmap                 │
│                                                     │
│  Strategic presentation outlining further            │
│  infrastructure cost optimization opportunities.     │
│                                                     │
│                                        [ PDF ↓ ]    │
└─────────────────────────────────────────────────────┘
```

**Unavailable document (coming soon):**

```
┌─────────────────────────────────────────────────────┐
│  📄 Elasticsearch Scale-Down Runbook    Coming Soon  │
│                                                     │
│  Step-by-step operational runbook for safely         │
│  scaling down Elasticsearch cluster nodes and        │
│  disk allocation.                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**MUI components:** `Card`, `CardContent`, `CardActions`, `Chip` (for format/status badges), `Button` (for download links — one per format).

---

## Accessibility Requirements

- All document links must have descriptive `aria-label` (e.g., "View document: Product Roadmap Phase 3, PDF format")
- "Coming Soon" badges must use `aria-label` not just visual styling
- Section headings must use proper heading hierarchy (h1 for page title, h2 for sections)
- Cards must be keyboard-navigable
- Download links must indicate they open a new tab (`target="_blank"` with `rel="noopener noreferrer"`)
- Touch targets ≥ 44px × 44px
- Color contrast ≥ 4.5:1 for all text

---

## Testing Plan

| Test Area | Coverage Target |
|-----------|----------------|
| `SamplesContent` rendering | All sections render, translations load |
| `ArtifactSection` component | Heading, intro, items render correctly |
| Artifact cards | Available vs. coming-soon states |
| Navigation | Samples link appears in header, footer, hamburger |
| i18n | English and French translations render |
| Accessibility | axe-core scan, keyboard navigation, aria-labels |
| SEO metadata | Title, description, OG tags present |
| Sitemap | `/samples` route included |

---

## Implementation Order

1. **Types** — `samples.ts` interface definitions (with `ArtifactFormat[]` for multi-format support)
2. **i18n** — Translation files (en + fr) and config update
3. **SEO** — `PAGE_METADATA.samples` constant
4. **Navigation** — Add nav link to `getNavLinks()`
5. **Page route** — `v2/app/samples/page.tsx` server component
6. **Components** — `SamplesContent.tsx` and `ArtifactSection.tsx`
7. **Hero image** — Create "Tasty Morsels" hero variant (en + fr), use `pork_cuts@2x` as placeholder
8. **Document hosting** — Convert and place documents in `/public/documents/` (PDF + MD formats)
9. **Tests** — Unit tests for components, navigation, i18n
10. **French translations** — Translate via DeepL MCP
11. **Sitemap** — Add `/samples` to `sitemap.ts`
12. **Accessibility audit** — axe-core + manual keyboard/screen reader testing

---

## Resolved Decisions

All open questions have been resolved:

| # | Question | Decision |
|---|----------|----------|
| 1 | Hero image | New variant called **"Tasty Morsels"** — continues the butcher-shop metaphor (Body of Work → Choice Cuts → Tasty Morsels) |
| 2 | Document format | **PDF and Markdown** — PDF for polished reading, Markdown for developer-friendly viewing. PowerPoint-sourced docs are PDF only |
| 3 | SAFe section | **Merged into "Defining the Vision"** — SAFe artifacts (epics, features, PBIs) are embedded in the roadmap documents, so a separate section is unnecessary |
| 4 | Cost Savings content | Section appears with **three documents**: Additional Cost Savings Roadmap (PPTX→PDF), Elasticsearch Node & Disk Scale-Down Runbook, and Cost Cutting Audit. Documents not yet complete show as "Coming Soon" cards |
| 5 | Cross-Functional Communication | **Intentionally excluded** as a standalone section — those documents (Stakeholder Deck, RFP Response) will appear in other sections as appropriate |
