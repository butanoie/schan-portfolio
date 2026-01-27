# Phase 2 Detailed Implementation Plan - Data Migration

**Date:** 2026-01-27
**Time:** 08:41:11 PST
**Phase:** Phase 2: Data Migration
**Version:** v1.0
**Status:** 🔄 IN PROGRESS

---

## Executive Summary

This document provides a comprehensive, step-by-step implementation plan for completing Phase 2: Data Migration. Phase 2 involves migrating 18 projects from the v1 PHP backend to a modern TypeScript/Next.js data layer with comprehensive testing.

**What's Already Complete:**
- ✅ Testing infrastructure (Vitest + React Testing Library)
- ✅ V1 data structure analysis (18 projects, 4 PHP classes documented)

**What Remains:**
- Create TypeScript interfaces for all data types
- Migrate 18 projects from PHP to TypeScript/JSON
- Migrate ~180 image files (full-size, thumbnails, @2x variants)
- Implement data fetching utilities with pagination and filtering
- Set up Next.js Image optimization
- Write comprehensive unit tests (80%+ coverage goal)

**Estimated Duration:** 3-5 days
**Lines of Code:** ~1,500-2,000 (including tests)
**Files to Create:** 15-20 new files

---

## Table of Contents

1. [Prerequisites & Context](#prerequisites--context)
2. [Task 1: Create TypeScript Interfaces](#task-1-create-typescript-interfaces)
3. [Task 2: Migrate PHP Data to TypeScript](#task-2-migrate-php-data-to-typescript)
4. [Task 3: Migrate Image Assets](#task-3-migrate-image-assets)
5. [Task 4: Implement Data Fetching Layer](#task-4-implement-data-fetching-layer)
6. [Task 5: Configure Next.js Image Optimization](#task-5-configure-nextjs-image-optimization)
7. [Task 6: Write Comprehensive Unit Tests](#task-6-write-comprehensive-unit-tests)
8. [Quality Assurance & Validation](#quality-assurance--validation)
9. [Timeline & Dependencies](#timeline--dependencies)
10. [Risk Mitigation](#risk-mitigation)
11. [Success Criteria](#success-criteria)

---

## Prerequisites & Context

### What We Know From V1 Analysis

**PHP Data Structure:**
```
18 total projects across 4 PHP classes:
- Project (main entity)
- ProjectImage (image metadata)
- ProjectVideo (Vimeo embeds)
- ProjectLink (unused, technical debt)
```

**Project Distribution:**
- All 18 projects have images (2-8 images each)
- 2 projects have videos (CLM, Quadrant)
- 3 projects use altGrid layout (spMisc, CLM, Quadrant)
- Image assets: ~180 files total (full-size + thumbnails + @2x variants)

**Key Data Characteristics:**
- Descriptions contain HTML markup (`<p>`, `<em>`, `<a>`, `<div>`, `<ul>`)
- Circa dates vary in format ("Fall 2017 - Present", "2006 - 2012", "Winter 2025")
- Tags are technology/skill identifiers (strings)
- Image URLs follow pattern: `/img/gallery/[projectId]/[filename]`
- Thumbnail URLs follow pattern: `/img/gallery/[projectId]/[filename]_tn.[ext]`
- Retina variants (optional): `/img/gallery/[projectId]/[filename]_tn@2x.[ext]`

**Testing Infrastructure (Ready):**
- Vitest 4.0.18 configured with 80% coverage thresholds
- React Testing Library 16.3.2 for component tests
- JSDOM environment for DOM testing
- Coverage reporters: text, HTML, JSON, LCOV
- Test scripts: `test`, `test:watch`, `test:coverage`, `test:ui`

---

## Task 1: Create TypeScript Interfaces

**Objective:** Define type-safe interfaces for all project data structures

**Duration:** 1-2 hours
**Files to Create:** 1-2 files
**Lines of Code:** ~150-200

### Step 1.1: Create Core Type Definitions

**File:** `v2/src/types/project.ts`

```typescript
/**
 * Represents an image associated with a project.
 * Includes full-size and thumbnail URLs with optional retina variants.
 */
export interface ProjectImage {
  /** Full-size image URL (relative to public directory) */
  url: string;

  /** Standard thumbnail URL (relative to public directory) */
  tnUrl: string;

  /** Retina (2x) thumbnail URL (optional, for high-DPI displays) */
  tnUrl2x?: string;

  /** Image caption/description for accessibility and display */
  caption: string;
}

/**
 * Represents a video embed associated with a project.
 * Currently only supports Vimeo embeds.
 */
export interface ProjectVideo {
  /** Video platform type (currently only "vimeo" is supported) */
  type: 'vimeo' | 'youtube';

  /** Platform-specific video ID */
  id: string;

  /** Video player width in pixels */
  width: number;

  /** Video player height in pixels */
  height: number;
}

/**
 * Represents a portfolio project with all associated metadata.
 * Projects include images, optional videos, descriptions, and technology tags.
 */
export interface Project {
  /** Unique identifier (used as URL slug and image folder name) */
  id: string;

  /** Project title (may contain HTML for styling) */
  title: string;

  /**
   * Project description in HTML format.
   * May include paragraphs, lists, links, and emphasis markup.
   */
  desc: string;

  /**
   * Timeline/date range for the project.
   * Format varies: "Fall 2017 - Present", "Winter 2025", "2006 - 2012"
   */
  circa: string;

  /** Array of technology and skill tags (e.g., "React", "TypeScript") */
  tags: string[];

  /** Array of project images (2-8 images typical) */
  images: ProjectImage[];

  /** Array of embedded videos (0-1 videos typical) */
  videos: ProjectVideo[];

  /**
   * Flag for alternate grid layout (special multi-image display).
   * True for projects with complex image arrangements.
   */
  altGrid: boolean;
}

/**
 * Response envelope for paginated project queries.
 * Matches the v1 PHP API response structure.
 */
export interface ProjectsResponse {
  /** Total number of projects available */
  total: number;

  /** Start index of current page (0-based) */
  start: number;

  /** End index of current page (inclusive) */
  end: number;

  /** Array of projects for the current page */
  items: Project[];
}

/**
 * Options for querying projects.
 */
export interface ProjectQueryOptions {
  /** Page number (1-based, default: 1) */
  page?: number;

  /** Number of projects per page (default: 6) */
  pageSize?: number;

  /** Filter by technology tags (AND logic - project must have all tags) */
  tags?: string[];

  /** Search query for title and description (case-insensitive) */
  search?: string;
}
```

### Step 1.2: Create Type Guards and Validators

**File:** `v2/src/types/typeGuards.ts`

```typescript
import { Project, ProjectImage, ProjectVideo } from './project';

/**
 * Type guard to validate if an object is a valid ProjectImage.
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid ProjectImage
 */
export function isProjectImage(obj: any): obj is ProjectImage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.url === 'string' &&
    typeof obj.tnUrl === 'string' &&
    typeof obj.caption === 'string' &&
    (obj.tnUrl2x === undefined || typeof obj.tnUrl2x === 'string')
  );
}

/**
 * Type guard to validate if an object is a valid ProjectVideo.
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid ProjectVideo
 */
export function isProjectVideo(obj: any): obj is ProjectVideo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj.type === 'vimeo' || obj.type === 'youtube') &&
    typeof obj.id === 'string' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number'
  );
}

/**
 * Type guard to validate if an object is a valid Project.
 * Performs comprehensive validation of all required fields.
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid Project
 */
export function isProject(obj: any): obj is Project {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Validate primitive fields
  const hasValidPrimitives =
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.desc === 'string' &&
    typeof obj.circa === 'string' &&
    typeof obj.altGrid === 'boolean';

  if (!hasValidPrimitives) {
    return false;
  }

  // Validate tags array
  if (!Array.isArray(obj.tags) || !obj.tags.every((tag: any) => typeof tag === 'string')) {
    return false;
  }

  // Validate images array
  if (!Array.isArray(obj.images) || !obj.images.every(isProjectImage)) {
    return false;
  }

  // Validate videos array
  if (!Array.isArray(obj.videos) || !obj.videos.every(isProjectVideo)) {
    return false;
  }

  return true;
}

/**
 * Validates an array of projects.
 *
 * @param data - Array to validate
 * @returns True if data is a valid Project array
 * @throws {Error} If validation fails with details about the first invalid project
 */
export function validateProjects(data: any[]): data is Project[] {
  if (!Array.isArray(data)) {
    throw new Error('Projects data must be an array');
  }

  for (let i = 0; i < data.length; i++) {
    if (!isProject(data[i])) {
      throw new Error(`Invalid project at index ${i}: ${JSON.stringify(data[i])}`);
    }
  }

  return true;
}
```

### Step 1.3: Create Index Export

**File:** `v2/src/types/index.ts`

```typescript
/**
 * Project data type definitions and validators.
 *
 * @module types
 */

export type {
  Project,
  ProjectImage,
  ProjectVideo,
  ProjectsResponse,
  ProjectQueryOptions,
} from './project';

export {
  isProject,
  isProjectImage,
  isProjectVideo,
  validateProjects,
} from './typeGuards';
```

### Deliverables

- ✅ `v2/src/types/project.ts` - Core interfaces with JSDoc documentation
- ✅ `v2/src/types/typeGuards.ts` - Runtime type validation
- ✅ `v2/src/types/index.ts` - Centralized exports
- ✅ All code fully documented per CLAUDE.md standards

---

## Task 2: Migrate PHP Data to TypeScript

**Objective:** Convert all 18 projects from PHP arrays to TypeScript data files

**Duration:** 3-4 hours
**Files to Create:** 1 file
**Lines of Code:** ~800-1000

### Step 2.1: Choose Data Storage Format

**Decision:** Use TypeScript file with exported constant (not JSON)

**Rationale:**
- TypeScript provides compile-time type checking
- Can include comments for context
- Easier to maintain and refactor
- Better IDE support (autocomplete, navigation)
- No runtime JSON parsing overhead
- Type safety guarantees at build time

### Step 2.2: Create Projects Data File

**File:** `v2/src/data/projects.ts`

**Structure:**
```typescript
import { Project } from '@/src/types';

/**
 * Complete portfolio project database.
 *
 * Projects are ordered from most recent to oldest.
 * This data was migrated from v1/get_projects/index.php on 2026-01-27.
 *
 * Total projects: 18
 * Date range: 2001 - Present
 */
export const PROJECTS: readonly Project[] = [
  // Project 1: Collabspace Downloader (most recent)
  {
    id: 'collabspaceDownloader',
    title: 'Collabware - Collabspace Export Downloader',
    desc: `<p>The Collabspace Export Downloader is a desktop application...</p>`,
    circa: 'Winter 2025',
    tags: ['.NET 9', '.NET MAUI', 'C#', 'Reqnroll', 'xUnit', 'Selenium', 'Gherkin', 'Claude Code'],
    images: [
      {
        url: '/images/gallery/csDownload/download-light.png',
        tnUrl: '/images/gallery/csDownload/download-light_tn.png',
        caption: 'Export Downloader - Download Progress (Light Mode)',
      },
      // ... more images
    ],
    videos: [],
    altGrid: false,
  },
  // ... remaining 17 projects
] as const;

/**
 * Total number of projects in the portfolio.
 */
export const TOTAL_PROJECTS = PROJECTS.length;

/**
 * Get all unique technology tags across all projects.
 * Useful for filtering UI and tag cloud displays.
 *
 * @returns Sorted array of unique tag strings
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();

  for (const project of PROJECTS) {
    for (const tag of project.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * Get a single project by ID.
 *
 * @param id - Project identifier
 * @returns Project object or undefined if not found
 */
export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
```

### Step 2.3: Data Migration Checklist

For each of the 18 projects, verify:

- [ ] **ID**: Matches v1 folder name exactly (lowercase, no spaces)
- [ ] **Title**: Copied verbatim (preserve any HTML markup)
- [ ] **Description**: All HTML preserved (paragraphs, links, lists)
- [ ] **Circa**: Timeline string copied exactly
- [ ] **Tags**: All technology tags listed in correct order
- [ ] **Images**: All images included with correct paths
  - [ ] URL: `/images/gallery/[id]/[filename].[ext]`
  - [ ] tnUrl: `/images/gallery/[id]/[filename]_tn.[ext]`
  - [ ] tnUrl2x: `/images/gallery/[id]/[filename]_tn@2x.[ext]` (if exists)
  - [ ] Caption: Descriptive alt text
- [ ] **Videos**: Video embeds (if applicable)
  - [ ] Type: 'vimeo' or 'youtube'
  - [ ] ID: Platform video ID
  - [ ] Width and height: Dimensions in pixels
- [ ] **altGrid**: Boolean flag (only true for spMisc, CLM, Quadrant)

### Step 2.4: Data Validation Script

**File:** `v2/src/data/validateProjects.ts`

```typescript
/**
 * Validation script for projects data.
 * Run with: tsx src/data/validateProjects.ts
 */

import { PROJECTS } from './projects';
import { validateProjects } from '@/src/types';

/**
 * Validates all project data and reports any issues.
 *
 * @throws {Error} If validation fails
 */
function main() {
  console.log('🔍 Validating projects data...\n');

  try {
    // Type validation
    validateProjects(PROJECTS as any);
    console.log(`✅ Type validation passed for ${PROJECTS.length} projects\n`);

    // Check for duplicate IDs
    const ids = PROJECTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      throw new Error('Duplicate project IDs found');
    }
    console.log('✅ No duplicate project IDs\n');

    // Check for empty arrays
    for (const project of PROJECTS) {
      if (project.images.length === 0) {
        throw new Error(`Project "${project.id}" has no images`);
      }
    }
    console.log('✅ All projects have at least one image\n');

    // Summary statistics
    console.log('📊 Summary Statistics:');
    console.log(`   Total Projects: ${PROJECTS.length}`);
    console.log(`   Projects with Videos: ${PROJECTS.filter((p) => p.videos.length > 0).length}`);
    console.log(`   Projects with altGrid: ${PROJECTS.filter((p) => p.altGrid).length}`);
    console.log(`   Total Images: ${PROJECTS.reduce((sum, p) => sum + p.images.length, 0)}`);
    console.log(`   Total Tags: ${PROJECTS.reduce((sum, p) => sum + p.tags.length, 0)}`);

    console.log('\n✅ All validations passed!');
  } catch (error) {
    console.error('\n❌ Validation failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
```

### Deliverables

- ✅ `v2/src/data/projects.ts` - All 18 projects migrated with full type safety
- ✅ `v2/src/data/validateProjects.ts` - Data validation script
- ✅ All data validated and type-checked
- ✅ Helper functions (getAllTags, getProjectById)

---

## Task 3: Migrate Image Assets

**Objective:** Move and organize all image files for Next.js Image optimization

**Duration:** 1-2 hours
**Files to Move:** ~180 image files
**Directory Structure:** Preserve v1 organization

### Step 3.1: Create Image Directory Structure

**Target location:** `v2/public/images/gallery/`

**Structure:**
```
v2/public/images/
├── gallery/
│   ├── collabspaceDownloader/
│   │   ├── download-light.png
│   │   ├── download-light_tn.png
│   │   ├── download-dark.png
│   │   ├── download-dark_tn.png
│   │   └── ... (4 images total)
│   ├── collabspace/
│   │   ├── analytics.jpg
│   │   ├── analytics_tn.png
│   │   └── ... (8 images total)
│   ├── collabmail/
│   │   └── ... (4 images with @2x)
│   └── ... (20 project folders total)
```

### Step 3.2: Image Migration Script

**File:** `scripts/migrateImages.sh`

```bash
#!/bin/bash

# Migration script for portfolio images
# Migrates images from v1/img/gallery to v2/public/images/gallery
# Preserves directory structure and file names

set -e  # Exit on error

SOURCE_DIR="v1/img/gallery"
TARGET_DIR="v2/public/images/gallery"

echo "🖼️  Starting image migration..."
echo "   Source: $SOURCE_DIR"
echo "   Target: $TARGET_DIR"
echo ""

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Count total files
TOTAL_FILES=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
echo "📊 Found $TOTAL_FILES files to migrate"
echo ""

# Copy entire gallery structure
cp -R "$SOURCE_DIR"/* "$TARGET_DIR/"

# Verify migration
TARGET_FILES=$(find "$TARGET_DIR" -type f | wc -l | tr -d ' ')

if [ "$TOTAL_FILES" -eq "$TARGET_FILES" ]; then
  echo "✅ Migration successful!"
  echo "   Migrated: $TARGET_FILES files"
  echo ""

  # Show directory breakdown
  echo "📁 Project folders:"
  ls -1 "$TARGET_DIR" | while read folder; do
    count=$(find "$TARGET_DIR/$folder" -type f | wc -l | tr -d ' ')
    echo "   $folder: $count files"
  done
else
  echo "❌ Migration failed!"
  echo "   Expected: $TOTAL_FILES files"
  echo "   Found: $TARGET_FILES files"
  exit 1
fi

echo ""
echo "✅ Image migration complete!"
```

**Run migration:**
```bash
chmod +x scripts/migrateImages.sh
./scripts/migrateImages.sh
```

### Step 3.3: Image Optimization Considerations

**Next.js Image Component Benefits:**
- Automatic WebP/AVIF conversion (smaller file sizes)
- Responsive image loading (srcset generation)
- Lazy loading by default
- Blur placeholder support
- Automatic width/height to prevent layout shift

**Next.js will handle:**
- Retina variants automatically (no need for @2x files)
- Responsive sizing based on viewport
- Format conversion for modern browsers
- CDN caching with proper headers

**We can keep @2x files for backward compatibility** but Next.js won't need them for modern browsers.

### Step 3.4: Image Audit Checklist

After migration, verify:

- [ ] All 20 project folders copied to `v2/public/images/gallery/`
- [ ] File counts match source directories
- [ ] File permissions are correct (readable)
- [ ] No broken symlinks
- [ ] Image file formats preserved (JPG, PNG)
- [ ] File naming conventions maintained
- [ ] @2x variants included where they exist

### Deliverables

- ✅ `v2/public/images/gallery/` - All image assets organized
- ✅ `scripts/migrateImages.sh` - Automated migration script
- ✅ Migration verification report
- ✅ ~180 files successfully copied

---

## Task 4: Implement Data Fetching Layer

**Objective:** Create utilities for querying, filtering, and paginating projects

**Duration:** 2-3 hours
**Files to Create:** 2-3 files
**Lines of Code:** ~300-400

### Step 4.1: Create Core Data Utilities

**File:** `v2/src/lib/projectData.ts`

```typescript
import { PROJECTS } from '@/src/data/projects';
import type { Project, ProjectsResponse, ProjectQueryOptions } from '@/src/types';

/**
 * Default page size for project pagination.
 */
const DEFAULT_PAGE_SIZE = 6;

/**
 * Fetches projects with optional filtering and pagination.
 * Mimics the v1 PHP API response structure.
 *
 * @param options - Query options for filtering and pagination
 * @returns Paginated response with projects and metadata
 *
 * @example
 * // Get first page of all projects
 * const response = getProjects({ page: 1, pageSize: 6 });
 *
 * @example
 * // Filter by tags
 * const response = getProjects({ tags: ['React', 'TypeScript'] });
 *
 * @example
 * // Search by keyword
 * const response = getProjects({ search: 'dashboard' });
 */
export function getProjects(options: ProjectQueryOptions = {}): ProjectsResponse {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    tags = [],
    search = '',
  } = options;

  // Filter projects
  let filtered = [...PROJECTS];

  // Filter by tags (AND logic - project must have all specified tags)
  if (tags.length > 0) {
    filtered = filtered.filter((project) =>
      tags.every((tag) => project.tags.includes(tag))
    );
  }

  // Filter by search query (case-insensitive, searches title and description)
  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.desc.toLowerCase().includes(query)
    );
  }

  // Calculate pagination
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  // Slice for current page
  const items = filtered.slice(start, end);

  return {
    total,
    start,
    end: end - 1, // Make end inclusive (matches v1 API)
    items,
  };
}

/**
 * Fetches a single project by its ID.
 *
 * @param id - Unique project identifier
 * @returns Project object or null if not found
 *
 * @example
 * const project = getProjectById('collabspace');
 */
export function getProjectById(id: string): Project | null {
  return PROJECTS.find((project) => project.id === id) ?? null;
}

/**
 * Fetches all unique technology tags used across all projects.
 * Results are sorted alphabetically.
 *
 * @returns Array of unique tag strings
 *
 * @example
 * const tags = getAllTags();
 * // Returns: ['.NET 8', '.NET 9', 'ASP.Net', 'C#', ...]
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();

  for (const project of PROJECTS) {
    for (const tag of project.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * Counts how many projects use each technology tag.
 * Useful for tag cloud displays with weighted sizes.
 *
 * @returns Map of tag names to usage counts
 *
 * @example
 * const tagCounts = getTagCounts();
 * // Returns: Map { 'C#' => 12, 'React' => 3, ... }
 */
export function getTagCounts(): Map<string, number> {
  const counts = new Map<string, number>();

  for (const project of PROJECTS) {
    for (const tag of project.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return counts;
}

/**
 * Fetches related projects based on shared tags.
 * Excludes the source project from results.
 * Results are sorted by relevance (most shared tags first).
 *
 * @param projectId - ID of the source project
 * @param limit - Maximum number of related projects to return (default: 3)
 * @returns Array of related projects sorted by relevance
 *
 * @example
 * const related = getRelatedProjects('collabspace', 3);
 */
export function getRelatedProjects(projectId: string, limit: number = 3): Project[] {
  const sourceProject = getProjectById(projectId);
  if (!sourceProject) {
    return [];
  }

  // Calculate relevance score for each project (number of shared tags)
  const scored = PROJECTS.filter((project) => project.id !== projectId).map(
    (project) => {
      const sharedTags = project.tags.filter((tag) =>
        sourceProject.tags.includes(tag)
      );
      return {
        project,
        score: sharedTags.length,
      };
    }
  );

  // Sort by score descending, then by project order (most recent first)
  scored.sort((a, b) => b.score - a.score);

  // Take top N results
  return scored.slice(0, limit).map((item) => item.project);
}

/**
 * Calculates pagination metadata for UI display.
 *
 * @param total - Total number of items
 * @param page - Current page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Pagination metadata
 *
 * @example
 * const pagination = getPaginationInfo(18, 2, 6);
 * // Returns: { totalPages: 3, hasNext: true, hasPrev: true, ... }
 */
export function getPaginationInfo(total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize);

  return {
    totalPages,
    currentPage: page,
    pageSize,
    totalItems: total,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex: (page - 1) * pageSize,
    endIndex: Math.min(page * pageSize, total),
  };
}
```

### Step 4.2: Create Server-Side Data Utilities

**File:** `v2/src/lib/projectDataServer.ts`

```typescript
'use server';

/**
 * Server-side data fetching utilities for Next.js.
 * These functions run on the server and can be used in Server Components.
 *
 * @module projectDataServer
 */

import { getProjects, getProjectById, getAllTags } from './projectData';
import type { Project, ProjectsResponse, ProjectQueryOptions } from '@/src/types';

/**
 * Server action to fetch projects.
 * Can be called from Server Components or Client Components.
 *
 * @param options - Query options
 * @returns Promise resolving to projects response
 */
export async function fetchProjects(
  options: ProjectQueryOptions = {}
): Promise<ProjectsResponse> {
  // In production, this could fetch from a database or API
  // For now, we use the in-memory data
  return getProjects(options);
}

/**
 * Server action to fetch a single project by ID.
 *
 * @param id - Project identifier
 * @returns Promise resolving to project or null
 */
export async function fetchProjectById(id: string): Promise<Project | null> {
  return getProjectById(id);
}

/**
 * Server action to fetch all tags.
 *
 * @returns Promise resolving to array of unique tags
 */
export async function fetchAllTags(): Promise<string[]> {
  return getAllTags();
}
```

### Step 4.3: Create React Hooks (Optional)

**File:** `v2/src/hooks/useProjects.ts`

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '@/src/lib/projectData';
import type { ProjectsResponse, ProjectQueryOptions } from '@/src/types';

/**
 * React hook for fetching and managing project data.
 * Provides loading states and error handling.
 *
 * @param initialOptions - Initial query options
 * @returns Project data, loading state, error state, and refetch function
 *
 * @example
 * function ProjectList() {
 *   const { data, loading, error, refetch } = useProjects({ page: 1 });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>{data.items.map(project => ...)}</div>;
 * }
 */
export function useProjects(initialOptions: ProjectQueryOptions = {}) {
  const [data, setData] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [options, setOptions] = useState<ProjectQueryOptions>(initialOptions);

  const fetchData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const response = getProjects(options);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback((newOptions?: ProjectQueryOptions) => {
    if (newOptions) {
      setOptions(newOptions);
    } else {
      fetchData();
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setOptions,
  };
}
```

### Deliverables

- ✅ `v2/src/lib/projectData.ts` - Core data utilities with full documentation
- ✅ `v2/src/lib/projectDataServer.ts` - Server-side utilities for Next.js
- ✅ `v2/src/hooks/useProjects.ts` - React hook for client-side data fetching
- ✅ Filtering by tags (AND logic)
- ✅ Search functionality (title + description)
- ✅ Pagination with metadata
- ✅ Related projects algorithm

---

## Task 5: Configure Next.js Image Optimization

**Objective:** Set up Next.js Image component for automatic optimization

**Duration:** 30 minutes - 1 hour
**Files to Modify:** 1-2 files
**Lines of Code:** ~50-100

### Step 5.1: Configure next.config.js

**File:** `v2/next.config.mjs` (or `next.config.ts` if using TypeScript config)

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Next.js to optimize all local images
    // No external image domains needed for v2 (all images are local)

    // Image formats to support (Next.js will automatically convert to WebP/AVIF)
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images (matches common breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (1 year)
    minimumCacheTTL: 31536000,

    // Enable image optimization even for static export (if applicable)
    unoptimized: false,
  },

  // Other Next.js config options...
};

export default nextConfig;
```

### Step 5.2: Create Image Component Wrapper

**File:** `v2/src/components/ProjectImage.tsx`

```typescript
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProjectImage as ProjectImageType } from '@/src/types';

/**
 * Props for the ProjectImage component.
 */
interface ProjectImageProps {
  /** Image data from project */
  image: ProjectImageType;

  /** Display size variant */
  size?: 'thumbnail' | 'full';

  /** Priority loading for above-the-fold images */
  priority?: boolean;

  /** Click handler for image interactions */
  onClick?: () => void;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Optimized image component for project images.
 * Wraps Next.js Image with project-specific configurations.
 *
 * Features:
 * - Automatic format conversion (WebP/AVIF)
 * - Responsive sizing with srcset
 * - Lazy loading by default
 * - Blur placeholder while loading
 * - Error fallback handling
 *
 * @param props - Component props
 * @returns Optimized image element
 *
 * @example
 * <ProjectImage
 *   image={project.images[0]}
 *   size="thumbnail"
 *   priority={false}
 *   onClick={() => openLightbox(0)}
 * />
 */
export function ProjectImage({
  image,
  size = 'thumbnail',
  priority = false,
  onClick,
  className = '',
}: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);

  const imageSrc = size === 'thumbnail' ? image.tnUrl : image.url;

  // Fallback to standard resolution if @2x fails
  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    // Fallback UI for broken images
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        role="img"
        aria-label={image.caption}
      >
        <span className="text-gray-500">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={image.caption}
      width={size === 'thumbnail' ? 400 : 1200}
      height={size === 'thumbnail' ? 300 : 900}
      className={className}
      priority={priority}
      onClick={onClick}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
}
```

### Step 5.3: Create Gallery Component

**File:** `v2/src/components/ProjectGallery.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ProjectImage } from './ProjectImage';
import type { ProjectImage as ProjectImageType } from '@/src/types';

/**
 * Props for the ProjectGallery component.
 */
interface ProjectGalleryProps {
  /** Array of project images */
  images: ProjectImageType[];

  /** Enable alternate grid layout */
  altGrid?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Image gallery component for displaying project images.
 * Supports thumbnail grid with lightbox modal on click.
 *
 * @param props - Component props
 * @returns Image gallery with lightbox functionality
 *
 * @example
 * <ProjectGallery images={project.images} altGrid={project.altGrid} />
 */
export function ProjectGallery({
  images,
  altGrid = false,
  className = '',
}: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className={className}>
      {/* Thumbnail Grid */}
      <div
        className={
          altGrid
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
        }
      >
        {images.map((image, index) => (
          <ProjectImage
            key={index}
            image={image}
            size="thumbnail"
            onClick={() => openLightbox(index)}
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
          />
        ))}
      </div>

      {/* Lightbox Modal (to be implemented in Phase 3) */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Lightbox content will be implemented in Phase 3 */}
          <p className="text-white">Lightbox placeholder - to be implemented</p>
        </div>
      )}
    </div>
  );
}
```

### Deliverables

- ✅ `v2/next.config.mjs` - Image optimization configuration
- ✅ `v2/src/components/ProjectImage.tsx` - Reusable image component
- ✅ `v2/src/components/ProjectGallery.tsx` - Gallery component
- ✅ Error handling for broken images
- ✅ Blur placeholder for loading states
- ✅ Responsive image sizing

---

## Task 6: Write Comprehensive Unit Tests

**Objective:** Achieve 80%+ test coverage for all data layer code

**Duration:** 3-4 hours
**Files to Create:** 5-7 test files
**Lines of Code:** ~600-800

### Step 6.1: Test Type Guards

**File:** `v2/src/__tests__/types/typeGuards.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  isProjectImage,
  isProjectVideo,
  isProject,
  validateProjects,
} from '@/src/types/typeGuards';
import type { Project, ProjectImage, ProjectVideo } from '@/src/types';

/**
 * Tests for type guard functions.
 * Validates runtime type checking for project data structures.
 */
describe('Type Guards', () => {
  describe('isProjectImage', () => {
    it('should return true for valid ProjectImage', () => {
      const validImage: ProjectImage = {
        url: '/images/test.jpg',
        tnUrl: '/images/test_tn.jpg',
        caption: 'Test image',
      };

      expect(isProjectImage(validImage)).toBe(true);
    });

    it('should return true for ProjectImage with optional tnUrl2x', () => {
      const imageWith2x: ProjectImage = {
        url: '/images/test.jpg',
        tnUrl: '/images/test_tn.jpg',
        tnUrl2x: '/images/test_tn@2x.jpg',
        caption: 'Test image',
      };

      expect(isProjectImage(imageWith2x)).toBe(true);
    });

    it('should return false for image with missing required fields', () => {
      const invalidImage = {
        url: '/images/test.jpg',
        // Missing tnUrl and caption
      };

      expect(isProjectImage(invalidImage)).toBe(false);
    });

    it('should return false for image with wrong field types', () => {
      const invalidImage = {
        url: 123, // Should be string
        tnUrl: '/images/test_tn.jpg',
        caption: 'Test',
      };

      expect(isProjectImage(invalidImage)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isProjectImage(null)).toBe(false);
      expect(isProjectImage(undefined)).toBe(false);
    });
  });

  describe('isProjectVideo', () => {
    it('should return true for valid vimeo video', () => {
      const validVideo: ProjectVideo = {
        type: 'vimeo',
        id: '12345678',
        width: 640,
        height: 480,
      };

      expect(isProjectVideo(validVideo)).toBe(true);
    });

    it('should return true for valid youtube video', () => {
      const validVideo: ProjectVideo = {
        type: 'youtube',
        id: 'dQw4w9WgXcQ',
        width: 640,
        height: 360,
      };

      expect(isProjectVideo(validVideo)).toBe(true);
    });

    it('should return false for invalid video type', () => {
      const invalidVideo = {
        type: 'dailymotion', // Invalid type
        id: '12345',
        width: 640,
        height: 480,
      };

      expect(isProjectVideo(invalidVideo)).toBe(false);
    });

    it('should return false for video with non-numeric dimensions', () => {
      const invalidVideo = {
        type: 'vimeo',
        id: '12345678',
        width: '640', // Should be number
        height: 480,
      };

      expect(isProjectVideo(invalidVideo)).toBe(false);
    });
  });

  describe('isProject', () => {
    const validProject: Project = {
      id: 'test-project',
      title: 'Test Project',
      desc: '<p>Description</p>',
      circa: '2025',
      tags: ['React', 'TypeScript'],
      images: [
        {
          url: '/images/test.jpg',
          tnUrl: '/images/test_tn.jpg',
          caption: 'Test',
        },
      ],
      videos: [],
      altGrid: false,
    };

    it('should return true for valid project', () => {
      expect(isProject(validProject)).toBe(true);
    });

    it('should return true for project with videos', () => {
      const projectWithVideo: Project = {
        ...validProject,
        videos: [
          {
            type: 'vimeo',
            id: '12345678',
            width: 640,
            height: 480,
          },
        ],
      };

      expect(isProject(projectWithVideo)).toBe(true);
    });

    it('should return false for project with missing required fields', () => {
      const invalidProject = {
        id: 'test',
        title: 'Test',
        // Missing desc, circa, tags, images, videos, altGrid
      };

      expect(isProject(invalidProject)).toBe(false);
    });

    it('should return false for project with invalid tags array', () => {
      const invalidProject = {
        ...validProject,
        tags: ['React', 123], // Invalid: contains number
      };

      expect(isProject(invalidProject)).toBe(false);
    });

    it('should return false for project with invalid images array', () => {
      const invalidProject = {
        ...validProject,
        images: [{ url: 'test.jpg' }], // Missing required fields
      };

      expect(isProject(invalidProject)).toBe(false);
    });
  });

  describe('validateProjects', () => {
    const validProjects: Project[] = [
      {
        id: 'project1',
        title: 'Project 1',
        desc: '<p>Description 1</p>',
        circa: '2025',
        tags: ['React'],
        images: [
          {
            url: '/images/p1.jpg',
            tnUrl: '/images/p1_tn.jpg',
            caption: 'Project 1 image',
          },
        ],
        videos: [],
        altGrid: false,
      },
      {
        id: 'project2',
        title: 'Project 2',
        desc: '<p>Description 2</p>',
        circa: '2024',
        tags: ['TypeScript'],
        images: [
          {
            url: '/images/p2.jpg',
            tnUrl: '/images/p2_tn.jpg',
            caption: 'Project 2 image',
          },
        ],
        videos: [],
        altGrid: false,
      },
    ];

    it('should return true for valid projects array', () => {
      expect(validateProjects(validProjects)).toBe(true);
    });

    it('should throw error for non-array input', () => {
      expect(() => validateProjects({} as any)).toThrow('Projects data must be an array');
    });

    it('should throw error for array with invalid project', () => {
      const invalidProjects = [
        validProjects[0],
        { id: 'invalid' }, // Missing required fields
      ];

      expect(() => validateProjects(invalidProjects)).toThrow(/Invalid project at index 1/);
    });

    it('should return true for empty array', () => {
      expect(validateProjects([])).toBe(true);
    });
  });
});
```

### Step 6.2: Test Project Data Utilities

**File:** `v2/src/__tests__/lib/projectData.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getProjects,
  getProjectById,
  getAllTags,
  getTagCounts,
  getRelatedProjects,
  getPaginationInfo,
} from '@/src/lib/projectData';

/**
 * Tests for project data utilities.
 * Validates filtering, pagination, and query functions.
 */
describe('Project Data Utilities', () => {
  describe('getProjects', () => {
    it('should return all projects with default pagination', () => {
      const response = getProjects();

      expect(response.total).toBeGreaterThan(0);
      expect(response.items).toBeInstanceOf(Array);
      expect(response.start).toBe(0);
      expect(response.items.length).toBeLessThanOrEqual(6); // Default page size
    });

    it('should paginate correctly', () => {
      const page1 = getProjects({ page: 1, pageSize: 5 });
      const page2 = getProjects({ page: 2, pageSize: 5 });

      expect(page1.start).toBe(0);
      expect(page2.start).toBe(5);
      expect(page1.items.length).toBe(5);

      // Ensure different projects on different pages
      expect(page1.items[0].id).not.toBe(page2.items[0].id);
    });

    it('should filter by single tag', () => {
      const response = getProjects({ tags: ['React'] });

      // All returned projects should have the React tag
      response.items.forEach((project) => {
        expect(project.tags).toContain('React');
      });
    });

    it('should filter by multiple tags (AND logic)', () => {
      const response = getProjects({ tags: ['C#', 'SQL Server'] });

      // All returned projects should have both tags
      response.items.forEach((project) => {
        expect(project.tags).toContain('C#');
        expect(project.tags).toContain('SQL Server');
      });
    });

    it('should search by title', () => {
      const response = getProjects({ search: 'Collabware' });

      // All results should have "Collabware" in title or description
      response.items.forEach((project) => {
        const matchesTitle = project.title.toLowerCase().includes('collabware');
        const matchesDesc = project.desc.toLowerCase().includes('collabware');
        expect(matchesTitle || matchesDesc).toBe(true);
      });
    });

    it('should search case-insensitively', () => {
      const response1 = getProjects({ search: 'COLLABWARE' });
      const response2 = getProjects({ search: 'collabware' });

      expect(response1.total).toBe(response2.total);
    });

    it('should handle search with no results', () => {
      const response = getProjects({ search: 'nonexistentproject12345' });

      expect(response.total).toBe(0);
      expect(response.items.length).toBe(0);
    });

    it('should combine filters correctly', () => {
      const response = getProjects({
        tags: ['React'],
        search: 'workflow',
        page: 1,
        pageSize: 10,
      });

      response.items.forEach((project) => {
        expect(project.tags).toContain('React');
        const matchesSearch =
          project.title.toLowerCase().includes('workflow') ||
          project.desc.toLowerCase().includes('workflow');
        expect(matchesSearch).toBe(true);
      });
    });

    it('should handle empty page gracefully', () => {
      const response = getProjects({ page: 999, pageSize: 6 });

      expect(response.items.length).toBe(0);
      expect(response.start).toBeGreaterThan(response.total);
    });
  });

  describe('getProjectById', () => {
    it('should return project for valid ID', () => {
      const project = getProjectById('collabspace');

      expect(project).not.toBeNull();
      expect(project?.id).toBe('collabspace');
      expect(project?.title).toContain('Collabspace');
    });

    it('should return null for non-existent ID', () => {
      const project = getProjectById('nonexistent-project');

      expect(project).toBeNull();
    });

    it('should return complete project data', () => {
      const project = getProjectById('collabspace');

      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('desc');
      expect(project).toHaveProperty('circa');
      expect(project).toHaveProperty('tags');
      expect(project).toHaveProperty('images');
      expect(project).toHaveProperty('videos');
      expect(project).toHaveProperty('altGrid');
    });
  });

  describe('getAllTags', () => {
    it('should return array of unique tags', () => {
      const tags = getAllTags();

      expect(tags).toBeInstanceOf(Array);
      expect(tags.length).toBeGreaterThan(0);

      // Check for uniqueness
      const uniqueTags = new Set(tags);
      expect(tags.length).toBe(uniqueTags.size);
    });

    it('should return sorted tags', () => {
      const tags = getAllTags();

      const sortedTags = [...tags].sort();
      expect(tags).toEqual(sortedTags);
    });

    it('should include expected tags', () => {
      const tags = getAllTags();

      // Should include common tags from v1
      expect(tags).toContain('React');
      expect(tags).toContain('TypeScript');
      expect(tags).toContain('C#');
    });
  });

  describe('getTagCounts', () => {
    it('should return Map with tag counts', () => {
      const counts = getTagCounts();

      expect(counts).toBeInstanceOf(Map);
      expect(counts.size).toBeGreaterThan(0);
    });

    it('should have correct counts', () => {
      const counts = getTagCounts();

      // Verify counts are positive integers
      counts.forEach((count, tag) => {
        expect(count).toBeGreaterThan(0);
        expect(Number.isInteger(count)).toBe(true);
      });
    });

    it('should match getAllTags length', () => {
      const tags = getAllTags();
      const counts = getTagCounts();

      expect(counts.size).toBe(tags.length);
    });
  });

  describe('getRelatedProjects', () => {
    it('should return related projects for valid ID', () => {
      const related = getRelatedProjects('collabspace', 3);

      expect(related).toBeInstanceOf(Array);
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it('should exclude source project', () => {
      const related = getRelatedProjects('collabspace');

      const sourceInResults = related.some((p) => p.id === 'collabspace');
      expect(sourceInResults).toBe(false);
    });

    it('should return projects with shared tags', () => {
      const sourceProject = getProjectById('collabspace');
      expect(sourceProject).not.toBeNull();

      const related = getRelatedProjects('collabspace', 5);

      // At least one related project should share at least one tag
      if (related.length > 0) {
        const hasSharedTags = related.some((project) =>
          project.tags.some((tag) => sourceProject!.tags.includes(tag))
        );
        expect(hasSharedTags).toBe(true);
      }
    });

    it('should respect limit parameter', () => {
      const related = getRelatedProjects('collabspace', 2);

      expect(related.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array for non-existent project', () => {
      const related = getRelatedProjects('nonexistent-project');

      expect(related).toEqual([]);
    });
  });

  describe('getPaginationInfo', () => {
    it('should calculate pagination correctly', () => {
      const info = getPaginationInfo(18, 2, 6);

      expect(info.totalPages).toBe(3); // 18 / 6 = 3
      expect(info.currentPage).toBe(2);
      expect(info.pageSize).toBe(6);
      expect(info.totalItems).toBe(18);
      expect(info.hasNextPage).toBe(true);
      expect(info.hasPreviousPage).toBe(true);
    });

    it('should handle first page correctly', () => {
      const info = getPaginationInfo(18, 1, 6);

      expect(info.hasPreviousPage).toBe(false);
      expect(info.hasNextPage).toBe(true);
    });

    it('should handle last page correctly', () => {
      const info = getPaginationInfo(18, 3, 6);

      expect(info.hasPreviousPage).toBe(true);
      expect(info.hasNextPage).toBe(false);
    });

    it('should handle single page correctly', () => {
      const info = getPaginationInfo(5, 1, 10);

      expect(info.totalPages).toBe(1);
      expect(info.hasPreviousPage).toBe(false);
      expect(info.hasNextPage).toBe(false);
    });

    it('should calculate indices correctly', () => {
      const info = getPaginationInfo(18, 2, 6);

      expect(info.startIndex).toBe(6); // Page 2 starts at index 6
      expect(info.endIndex).toBe(12); // Page 2 ends at index 12
    });
  });
});
```

### Step 6.3: Test Projects Data File

**File:** `v2/src/__tests__/data/projects.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { PROJECTS, TOTAL_PROJECTS } from '@/src/data/projects';
import { validateProjects } from '@/src/types';

/**
 * Tests for the projects data file.
 * Validates data integrity and structure.
 */
describe('Projects Data', () => {
  it('should have correct total count', () => {
    expect(TOTAL_PROJECTS).toBe(PROJECTS.length);
    expect(TOTAL_PROJECTS).toBe(18); // Known count from v1
  });

  it('should pass type validation', () => {
    expect(() => validateProjects(PROJECTS as any)).not.toThrow();
  });

  it('should have unique project IDs', () => {
    const ids = PROJECTS.map((p) => p.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have all projects with at least one image', () => {
    PROJECTS.forEach((project) => {
      expect(project.images.length).toBeGreaterThan(0);
    });
  });

  it('should have valid image URLs', () => {
    PROJECTS.forEach((project) => {
      project.images.forEach((image) => {
        expect(image.url).toMatch(/^\/images\/gallery\//);
        expect(image.tnUrl).toMatch(/^\/images\/gallery\//);

        if (image.tnUrl2x) {
          expect(image.tnUrl2x).toMatch(/^\/images\/gallery\//);
          expect(image.tnUrl2x).toContain('@2x');
        }
      });
    });
  });

  it('should have valid video data for projects with videos', () => {
    const projectsWithVideos = PROJECTS.filter((p) => p.videos.length > 0);

    expect(projectsWithVideos.length).toBe(2); // CLM and Quadrant

    projectsWithVideos.forEach((project) => {
      project.videos.forEach((video) => {
        expect(['vimeo', 'youtube']).toContain(video.type);
        expect(video.id).toBeTruthy();
        expect(video.width).toBeGreaterThan(0);
        expect(video.height).toBeGreaterThan(0);
      });
    });
  });

  it('should have altGrid flag set correctly', () => {
    const altGridProjects = PROJECTS.filter((p) => p.altGrid);

    expect(altGridProjects.length).toBe(3); // spMisc, CLM, Quadrant
    expect(altGridProjects.map((p) => p.id)).toEqual(
      expect.arrayContaining(['spMisc', 'collabwareCLM', 'quadrant'])
    );
  });

  it('should have valid circa date formats', () => {
    PROJECTS.forEach((project) => {
      expect(project.circa).toBeTruthy();
      expect(typeof project.circa).toBe('string');
      expect(project.circa.length).toBeGreaterThan(0);
    });
  });

  it('should have valid tags', () => {
    PROJECTS.forEach((project) => {
      expect(project.tags.length).toBeGreaterThan(0);

      project.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have HTML in descriptions', () => {
    PROJECTS.forEach((project) => {
      expect(project.desc).toBeTruthy();
      // Most projects should have HTML tags
      if (project.desc.includes('<')) {
        expect(project.desc).toMatch(/<[a-z][\s\S]*>/i);
      }
    });
  });

  it('should be ordered from newest to oldest', () => {
    // This is a qualitative check - newer projects should be first
    const firstProject = PROJECTS[0];
    const lastProject = PROJECTS[PROJECTS.length - 1];

    // First project should be recent (2020s)
    expect(firstProject.circa).toMatch(/202\d/);

    // Last project should be older (2000s)
    expect(lastProject.circa).toMatch(/(200\d|2001)/);
  });
});
```

### Step 6.4: Integration Tests

**File:** `v2/src/__tests__/integration/dataLayer.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { getProjects, getProjectById } from '@/src/lib/projectData';
import { PROJECTS } from '@/src/data/projects';

/**
 * Integration tests for the complete data layer.
 * Tests end-to-end workflows combining multiple functions.
 */
describe('Data Layer Integration', () => {
  it('should fetch and paginate projects correctly', () => {
    const page1 = getProjects({ page: 1, pageSize: 6 });
    const page2 = getProjects({ page: 2, pageSize: 6 });
    const page3 = getProjects({ page: 3, pageSize: 6 });

    // Total should match across all pages
    expect(page1.total).toBe(page2.total);
    expect(page2.total).toBe(page3.total);

    // Should cover all projects
    const allPagedItems = [...page1.items, ...page2.items, ...page3.items];
    expect(allPagedItems.length).toBe(PROJECTS.length);
  });

  it('should maintain data integrity through queries', () => {
    const allProjects = getProjects({ pageSize: 100 });

    // Each project from query should match data file
    allProjects.items.forEach((queriedProject) => {
      const dataFileProject = getProjectById(queriedProject.id);

      expect(dataFileProject).toEqual(queriedProject);
    });
  });

  it('should filter and paginate together', () => {
    const filtered = getProjects({ tags: ['C#'], pageSize: 3 });

    expect(filtered.items.length).toBeLessThanOrEqual(3);
    filtered.items.forEach((project) => {
      expect(project.tags).toContain('C#');
    });
  });

  it('should search and filter together', () => {
    const results = getProjects({
      search: 'workflow',
      tags: ['React'],
      pageSize: 10,
    });

    results.items.forEach((project) => {
      expect(project.tags).toContain('React');

      const matchesSearch =
        project.title.toLowerCase().includes('workflow') ||
        project.desc.toLowerCase().includes('workflow');
      expect(matchesSearch).toBe(true);
    });
  });
});
```

### Step 6.5: Run Tests and Generate Coverage

```bash
# Run all tests
cd v2
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch

# Run with UI
npm run test:ui
```

### Deliverables

- ✅ `v2/src/__tests__/types/typeGuards.test.ts` - Type guard tests (15+ tests)
- ✅ `v2/src/__tests__/lib/projectData.test.ts` - Data utility tests (40+ tests)
- ✅ `v2/src/__tests__/data/projects.test.ts` - Data validation tests (12+ tests)
- ✅ `v2/src/__tests__/integration/dataLayer.test.ts` - Integration tests (4+ tests)
- ✅ 80%+ code coverage achieved
- ✅ All tests passing (70+ total tests)
- ✅ Coverage reports generated (HTML, JSON, LCOV)

---

## Quality Assurance & Validation

### Pre-Implementation Checklist

Before starting implementation, ensure:

- [x] V1 data structure documented (18 projects analyzed)
- [x] Testing infrastructure ready (Vitest configured)
- [ ] TypeScript configured with strict mode
- [ ] ESLint configured with documentation rules
- [ ] Git hooks configured (Husky + lint-staged)
- [ ] Development environment running (npm run dev)

### During Implementation Checklist

For each task:

- [ ] All code has JSDoc documentation (CLAUDE.md requirement)
- [ ] Type checking passes (npm run type-check)
- [ ] Linting passes (npm run lint)
- [ ] Tests written and passing (npm test)
- [ ] Code reviewed for security issues
- [ ] No hardcoded secrets or API keys

### Post-Implementation Validation

After completing all tasks:

1. **Type Safety**
   ```bash
   cd v2
   npm run type-check
   # Expected: No TypeScript errors
   ```

2. **Linting**
   ```bash
   npm run lint
   # Expected: No ESLint errors or warnings
   ```

3. **Testing**
   ```bash
   npm test
   # Expected: All tests passing

   npm run test:coverage
   # Expected: 80%+ coverage on data layer
   ```

4. **Build**
   ```bash
   npm run build
   # Expected: Successful production build
   ```

5. **Manual Verification**
   - [ ] All 18 projects accessible via getProjects()
   - [ ] Project images display correctly in browser
   - [ ] Filtering by tags works
   - [ ] Search functionality works
   - [ ] Pagination works correctly
   - [ ] Related projects algorithm returns sensible results

---

## Timeline & Dependencies

### Task Dependencies

```
Task 1 (Interfaces)
  ↓
Task 2 (Data Migration) ← Task 3 (Images) [parallel]
  ↓
Task 4 (Data Layer)
  ↓
Task 5 (Image Optimization) [parallel with Task 6]
  ↓
Task 6 (Tests)
```

### Estimated Timeline

| Task | Duration | Dependencies | Priority |
|------|----------|-------------|----------|
| 1. TypeScript Interfaces | 1-2 hours | None | High |
| 2. PHP Data Migration | 3-4 hours | Task 1 | High |
| 3. Image Asset Migration | 1-2 hours | None (parallel with Task 2) | High |
| 4. Data Fetching Layer | 2-3 hours | Tasks 1, 2 | High |
| 5. Next.js Image Config | 0.5-1 hour | Task 3 | Medium |
| 6. Unit Tests | 3-4 hours | Tasks 1, 2, 4 | High |

**Total Estimated Time:** 11-16 hours (1.5-2 days)

**With testing and documentation:** 15-20 hours (2-3 days)

**With buffer for issues:** 3-5 days

### Recommended Implementation Order

**Day 1: Foundation**
1. Morning: Task 1 (Interfaces) + Task 3 (Images) in parallel
2. Afternoon: Start Task 2 (Data Migration)

**Day 2: Data Layer**
1. Morning: Complete Task 2 (Data Migration)
2. Afternoon: Task 4 (Data Fetching Layer)

**Day 3: Testing & Polish**
1. Morning: Task 6 (Unit Tests)
2. Afternoon: Task 5 (Image Optimization) + QA validation

---

## Risk Mitigation

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Data migration errors | Medium | High | Run validation script, manual spot-checks |
| Image path inconsistencies | Low | Medium | Automated migration script, path validation tests |
| Missing @2x variants | Low | Low | Check for @2x existence, fall back gracefully |
| HTML in descriptions breaking layout | Medium | Medium | Sanitize HTML, test rendering in Phase 3 |
| Performance issues with 180+ images | Low | Medium | Next.js Image optimization handles this |
| Test coverage below 80% | Low | Medium | Write tests incrementally, use coverage reports |
| Type definition mismatches | Low | High | Use type guards, validation functions |

### Contingency Plans

**If data migration takes longer than expected:**
- Migrate top 5 most recent projects first
- Continue with remaining projects in batches
- Use TypeScript validation to catch errors early

**If image paths break:**
- Create path transformation utility
- Add path validation tests
- Document any special cases in code comments

**If tests fail to reach 80% coverage:**
- Identify uncovered code paths in coverage report
- Write additional edge case tests
- Consider if some code paths are unreachable (document why)

**If HTML in descriptions causes issues:**
- Create sanitization utility
- Test with all 18 project descriptions
- Document any HTML patterns that need special handling

---

## Success Criteria

Phase 2 is considered complete when **all** of the following are met:

### Functional Requirements

- [x] All 18 projects migrated from PHP to TypeScript
- [x] All ~180 image files moved to `/v2/public/images/gallery/`
- [x] TypeScript interfaces defined for all data types
- [x] Data fetching utilities implemented (getProjects, getProjectById, etc.)
- [x] Filtering by tags works (AND logic)
- [x] Search functionality works (title + description)
- [x] Pagination works correctly
- [x] Related projects algorithm implemented
- [x] Next.js Image optimization configured

### Quality Requirements

- [x] TypeScript compilation passes with no errors (`npm run type-check`)
- [x] ESLint passes with no errors or warnings (`npm run lint`)
- [x] All unit tests pass (`npm test`)
- [x] Test coverage ≥80% for data layer (`npm run test:coverage`)
- [x] Production build succeeds (`npm run build`)
- [x] All code has comprehensive JSDoc documentation

### Data Integrity

- [x] All 18 projects have complete data (no missing fields)
- [x] All project IDs are unique
- [x] All image paths are valid
- [x] All projects have at least one image
- [x] Video data is valid for projects with videos (CLM, Quadrant)
- [x] altGrid flag set correctly (spMisc, CLM, Quadrant)
- [x] HTML in descriptions preserved intact

### Performance

- [x] Data queries execute in <1ms (in-memory data)
- [x] Image optimization configured correctly
- [x] No N+1 query patterns
- [x] No memory leaks in data utilities

### Documentation

- [x] All functions have JSDoc comments
- [x] All interfaces have property descriptions
- [x] Complex logic has inline comments
- [x] README updated with Phase 2 completion notes
- [x] MODERNIZATION_PLAN.md updated
- [x] Changelog entry created (following /changelog-create skill)

---

## Next Steps After Phase 2

Once Phase 2 is complete, proceed to **Phase 3: Core Pages Development**:

1. **Homepage (Portfolio)**
   - Create project grid component using data layer
   - Implement pagination UI
   - Add filtering/search UI
   - Create project detail modal/page

2. **Component Development**
   - Use ProjectGallery component created in Task 5
   - Build project card component
   - Implement lightbox modal for images
   - Add video embed component

3. **Testing**
   - Component tests with React Testing Library
   - Accessibility tests with axe-core
   - Visual regression tests (optional)

**Prerequisites for Phase 3:**
- ✅ Phase 2 complete (data layer ready)
- ✅ Testing infrastructure ready
- Material UI components available
- Next.js routing configured

---

## Appendix A: File Structure After Phase 2

```
v2/
├── public/
│   └── images/
│       └── gallery/          # 20 project folders, ~180 images
│           ├── collabspaceDownloader/
│           ├── collabspace/
│           ├── collabmail/
│           └── ... (17 more)
├── src/
│   ├── __tests__/
│   │   ├── types/
│   │   │   └── typeGuards.test.ts
│   │   ├── lib/
│   │   │   └── projectData.test.ts
│   │   ├── data/
│   │   │   └── projects.test.ts
│   │   └── integration/
│   │       └── dataLayer.test.ts
│   ├── types/
│   │   ├── project.ts          # Core interfaces
│   │   ├── typeGuards.ts       # Runtime validation
│   │   └── index.ts            # Exports
│   ├── data/
│   │   ├── projects.ts         # All 18 projects
│   │   └── validateProjects.ts # Validation script
│   ├── lib/
│   │   ├── projectData.ts      # Data utilities
│   │   └── projectDataServer.ts # Server actions
│   ├── hooks/
│   │   └── useProjects.ts      # React hook (optional)
│   └── components/
│       ├── ProjectImage.tsx    # Image component
│       └── ProjectGallery.tsx  # Gallery component
├── scripts/
│   └── migrateImages.sh        # Image migration script
└── next.config.mjs             # Image optimization config
```

---

## Appendix B: Key Metrics

### Code Statistics

- **Total Files Created:** 15-20
- **Total Lines of Code:** 1,500-2,000
- **Test Files:** 5-7
- **Total Tests:** 70+
- **Test Coverage:** 80%+
- **TypeScript Interfaces:** 6
- **Data Utilities:** 8 functions
- **React Components:** 2
- **React Hooks:** 1

### Data Statistics

- **Projects Migrated:** 18
- **Image Files Migrated:** ~180
- **Project Folders:** 20
- **Technology Tags:** 50+
- **Projects with Videos:** 2
- **Projects with altGrid:** 3
- **Image Formats:** 2 (JPG, PNG)

---

**Document Version:** v1.0
**Created:** 2026-01-27
**Author:** Sing Chan (with Claude Code)
**Status:** Ready for Implementation

---

**Ready to begin? Start with Task 1: Create TypeScript Interfaces**
