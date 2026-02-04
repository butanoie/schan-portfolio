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
  ProjectsPageData,
} from './porfolio';


export type {
  PageDeckData,
} from './pageDeck';

export type {
  ThemeMode,
  ColorScheme,
  ThemePalette,
  ThemeConfig,
} from './theme';

export {
  isProject,
  isProjectImage,
  isProjectVideo,
  validateProjects,
} from './typeGuards';
