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

export type {
  PageDeckData,
} from './pageDeck';

export {
  isProject,
  isProjectImage,
  isProjectVideo,
  validateProjects,
} from './typeGuards';
