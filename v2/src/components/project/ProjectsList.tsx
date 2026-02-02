'use client';

import type { Project } from '../../types';
import { Box } from '@mui/material';
import { ProjectDetail } from './ProjectDetail';

/**
 * Props for the ProjectsList component.
 *
 * @interface ProjectsListProps
 * @property {Project[]} projects - Array of project objects to display
 */
interface ProjectsListProps {
  projects: Project[];
}

/**
 * Container component that renders all projects inline on a single page.
 *
 * This component maps over an array of projects and renders each one as a
 * complete ProjectDetail component. It maintains proper semantic HTML structure
 * with section elements for each project and provides proper spacing between
 * projects.
 *
 * **Features:**
 * - Renders all projects in a single scrollable page
 * - Each project is a self-contained section with semantic HTML
 * - Proper spacing between projects for visual separation
 * - Responsive design works across all viewport sizes
 * - Accessibility-first with semantic HTML structure
 * - Maintains consistent layout across all projects
 * - No pagination or filtering (handled separately in parent)
 *
 * **Structure:**
 * ```
 * <Box>
 *   <ProjectDetail project={project1} />
 *   <ProjectDetail project={project2} />
 *   ...
 *   <ProjectDetail project={projectN} />
 * </Box>
 * ```
 *
 * **Note:**
 * The vertical spacing and dividers between projects are handled by the
 * ProjectDetail component itself (mb: 8, Divider at bottom).
 *
 * @param {ProjectsListProps} props - Component props
 * @returns The rendered list of all projects
 *
 * @example
 * <ProjectsList projects={allProjects} />
 *
 * @example
 * // With filtered projects
 * const filteredProjects = projects.filter(p => p.tags.includes('React'));
 * <ProjectsList projects={filteredProjects} />
 */
export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <Box>
      {projects.map((project) => (
        <ProjectDetail key={project.id} project={project} />
      ))}
    </Box>
  );
}
