import { Project } from '../types';

/**
 * Base portfolio project database.
 *
 * Contains the structural data for projects including IDs, tags, image URLs, and layout information.
 * Translatable strings (title, description, circa, and captions) are loaded from locale JSON files
 * via the localization layer (data/localization.ts) and merged with this base data at runtime.
 *
 * This design allows:
 * - Single source of truth for project structure and assets (images, videos)
 * - Translations managed in locale JSON files (en, fr)
 * - Automatic locale switching without code changes
 * - Easy maintenance of translations independent of code
 *
 * Projects are ordered from most recent to oldest.
 * This data was migrated from v1/get_projects/index.php on 2026-01-27.
 *
 * Total projects: 18
 * Date range: 2001 - Present
 *
 * @see {@link data/localization.ts} for functions that merge translations with this base data
 * @see {@link src/locales/en/projects.json} for English translations
 * @see {@link src/locales/fr/projects.json} for French translations
 */
export const PROJECTS: readonly Project[] = [
  // Project 1: Collabspace Downloader (most recent)
  {
    id: 'collabspaceDownloader',
    title: '',
    desc: '',
    circa: '',
    tags: ['.NET 9', '.NET MAUI', 'C#', 'Reqnroll', 'xUnit', 'Selenium', 'Gherkin', 'Claude Code'],
    images: [
      {
        url: '/images/gallery/csDownload/download-light.png',
        tnUrl: '/images/gallery/csDownload/download-light_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/csDownload/download-dark.png',
        tnUrl: '/images/gallery/csDownload/download-dark_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/csDownload/autoupdate.png',
        tnUrl: '/images/gallery/csDownload/autoupdate_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/csDownload/settings.png',
        tnUrl: '/images/gallery/csDownload/settings_tn.png',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 2: Collabspace
  {
    id: 'collabspace',
    title: '',
    desc: '',
    circa: '',
    tags: ['.NET 8', 'C#', 'React.js', 'Fluent UI', 'JointJS+', 'Kubernetes', 'SQL Server', 'CosmosDB', 'Azure Cloud Services'],
    images: [
      {
        url: '/images/gallery/collabspace/analytics.jpg',
        tnUrl: '/images/gallery/collabspace/analytics_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/email-preview.jpg',
        tnUrl: '/images/gallery/collabspace/email-preview_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/workflow-designer.jpg',
        tnUrl: '/images/gallery/collabspace/workflow-designer_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/document-preview.jpg',
        tnUrl: '/images/gallery/collabspace/document-preview_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/aggregate-designer.png',
        tnUrl: '/images/gallery/collabspace/aggregate-designer_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/search-designer.jpg',
        tnUrl: '/images/gallery/collabspace/search-designer_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/fileplan.jpg',
        tnUrl: '/images/gallery/collabspace/fileplan_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabspace/physicallibrary.jpg',
        tnUrl: '/images/gallery/collabspace/physicallibrary_tn.png',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 3: Collabmail
  {
    id: 'collabmail',
    title: '',
    desc: '',
    circa: '',
    tags: ['Outlook', 'SharePoint Server', 'SharePoint Online', 'ASP.Net', 'C#', 'WPF', 'XSLT'],
    images: [
      {
        url: '/images/gallery/collabmail/attachment-add.png',
        tnUrl: '/images/gallery/collabmail/attachment-add_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabmail/drag-and-drop.png',
        tnUrl: '/images/gallery/collabmail/drag-and-drop_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabmail/edit-metadata2.png',
        tnUrl: '/images/gallery/collabmail/edit-metadata2_tn.png',
        caption: '',
      },
      {
        url: '/images/gallery/collabmail/search.png',
        tnUrl: '/images/gallery/collabmail/search_tn.png',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 4: Collabware CLM
  {
    id: 'collabwareCLM',
    title: '',
    desc: '',
    circa: '',
    tags: ['SharePoint Server', 'SQL Server', 'ASP.Net', 'C#', 'Dojo Toolkit', 'JointJS+', 'ASP.Net AJAX', 'XSLT'],
    images: [
      {
        url: '/images/gallery/clm/library.jpg',
        tnUrl: '/images/gallery/clm/library_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/fileplan.jpg',
        tnUrl: '/images/gallery/clm/fileplan_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/approvals.jpg',
        tnUrl: '/images/gallery/clm/approvals_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/i18n.jpg',
        tnUrl: '/images/gallery/clm/i18n_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/details.jpg',
        tnUrl: '/images/gallery/clm/details_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/storyboard.jpg',
        tnUrl: '/images/gallery/clm/storyboard_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/sketch.jpg',
        tnUrl: '/images/gallery/clm/sketch_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/clm/userstory1.jpg',
        tnUrl: '/images/gallery/clm/userstory1_tn.jpg',
        caption: '',
      },
    ],
    videos: [
      {
        type: 'vimeo',
        id: '64146993',
        width: 640,
        height: 480,
      },
    ],
    altGrid: true,
  },

  // Project 5: Vancity Insite
  {
    id: 'vcInsite',
    title: '',
    desc: '',
    circa: '',
    tags: ['SharePoint 2010', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    images: [
      {
        url: '/images/gallery/vcInsite/home.jpg',
        tnUrl: '/images/gallery/vcInsite/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/vcInsite/rates.jpg',
        tnUrl: '/images/gallery/vcInsite/rates_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/vcInsite/search.jpg',
        tnUrl: '/images/gallery/vcInsite/search_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/vcInsite/mysite.jpg',
        tnUrl: '/images/gallery/vcInsite/mysite_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 6: Servus Credit Union Cafe
  {
    id: 'servusCafe',
    title: '',
    desc: '',
    circa: '',
    tags: ['SharePoint 2010', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    images: [
      {
        url: '/images/gallery/servusCafe/posts.jpg',
        tnUrl: '/images/gallery/servusCafe/posts_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/servusCafe/create.jpg',
        tnUrl: '/images/gallery/servusCafe/create_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 7: Devon Energy Strata
  {
    id: 'devon',
    title: '',
    desc: '',
    circa: '',
    tags: ['SharePoint 2007', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    images: [
      {
        url: '/images/gallery/devon/home.jpg',
        tnUrl: '/images/gallery/devon/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/devon/tools.jpg',
        tnUrl: '/images/gallery/devon/tools_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/devon/teamsite.jpg',
        tnUrl: '/images/gallery/devon/teamsite_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/devon/profile.jpg',
        tnUrl: '/images/gallery/devon/profile_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 8: Other SharePoint Projects
  {
    id: 'spMisc',
    title: '',
    desc: '',
    circa: '',
    tags: ['SharePoint 2010', 'SharePoint 2007', 'ASP.Net', 'C#', 'jQuery', 'ASP.Net AJAX', 'Telerik RadControls', 'XSLT'],
    images: [
      {
        url: '/images/gallery/spMisc/collabware.jpg',
        tnUrl: '/images/gallery/spMisc/collabware_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/spMisc/fortisbc.jpg',
        tnUrl: '/images/gallery/spMisc/fortisbc_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/spMisc/bchydro.jpg',
        tnUrl: '/images/gallery/spMisc/bchydro_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/spMisc/capp.jpg',
        tnUrl: '/images/gallery/spMisc/capp_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/spMisc/calgary.jpg',
        tnUrl: '/images/gallery/spMisc/calgary_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/spMisc/goldcorp.jpg',
        tnUrl: '/images/gallery/spMisc/goldcorp_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/spMisc/pdnet.jpg',
        tnUrl: '/images/gallery/spMisc/pdnet_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: true,
  },

  // Project 9: Habanero External Website
  {
    id: 'habExternal',
    title: '',
    desc: '',
    circa: '',
    tags: ['SiteFinity', 'ASP.Net', 'C#', 'jQuery'],
    images: [
      {
        url: '/images/gallery/habExternal/home.jpg',
        tnUrl: '/images/gallery/habExternal/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/habExternal/projects.jpg',
        tnUrl: '/images/gallery/habExternal/projects_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/habExternal/project.jpg',
        tnUrl: '/images/gallery/habExternal/project_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/habExternal/profile.jpg',
        tnUrl: '/images/gallery/habExternal/profile_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 10: SE Cornerstone Financial Reporting
  {
    id: 'cornerstone',
    title: '',
    desc: '',
    circa: '',
    tags: ['Dynamics ERP', 'ASP.Net', 'C#', 'ASP.Net AJAX', 'Telerik RadControls'],
    images: [
      {
        url: '/images/gallery/cornerstone/home.jpg',
        tnUrl: '/images/gallery/cornerstone/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/cornerstone/step1.jpg',
        tnUrl: '/images/gallery/cornerstone/step1_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/cornerstone/step2.jpg',
        tnUrl: '/images/gallery/cornerstone/step2_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/cornerstone/deposit.jpg',
        tnUrl: '/images/gallery/cornerstone/deposit_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 11: Microsoft Contoso Riders
  {
    id: 'contosoriders',
    title: '',
    desc: '',
    circa: '',
    tags: ['Windows Live Services', 'Silverlight', 'Bing Maps', 'ASP.Net', 'C#', 'ASP.Net AJAX'],
    images: [
      {
        url: '/images/gallery/contosoriders/home.jpg',
        tnUrl: '/images/gallery/contosoriders/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/contosoriders/expo.jpg',
        tnUrl: '/images/gallery/contosoriders/expo_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/contosoriders/energizeit.jpg',
        tnUrl: '/images/gallery/contosoriders/energizeit_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 12: Boston Pizza Franchisee Dashboard
  {
    id: 'bpDashboard',
    title: '',
    desc: '',
    circa: '',
    tags: ['Adobe Flex', 'ActionScript 3.0', 'Nintendo Wii-mote', '10 Foot UI Design'],
    images: [
      {
        url: '/images/gallery/bpDashboard/home.jpg',
        tnUrl: '/images/gallery/bpDashboard/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/bpDashboard/map.jpg',
        tnUrl: '/images/gallery/bpDashboard/map_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/bpDashboard/list.jpg',
        tnUrl: '/images/gallery/bpDashboard/list_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/bpDashboard/store.jpg',
        tnUrl: '/images/gallery/bpDashboard/store_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 13: Grey Holiday Puppet
  {
    id: 'holidayPuppet',
    title: '',
    desc: '',
    circa: '',
    tags: ['Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/holidaypuppet/hockey.jpg',
        tnUrl: '/images/gallery/holidaypuppet/hockey_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/holidaypuppet/graduate.jpg',
        tnUrl: '/images/gallery/holidaypuppet/graduate_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/holidaypuppet/fingers.jpg',
        tnUrl: '/images/gallery/holidaypuppet/fingers_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/holidaypuppet/puppet.jpg',
        tnUrl: '/images/gallery/holidaypuppet/puppet_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 14: Quadrant Homes
  {
    id: 'quadrant',
    title: '',
    desc: '',
    circa: '',
    tags: ['PHP', 'PostgreSQL', 'Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/quadrant/home.jpg',
        tnUrl: '/images/gallery/quadrant/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/quadrant/build1.jpg',
        tnUrl: '/images/gallery/quadrant/build1_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/quadrant/build2.jpg',
        tnUrl: '/images/gallery/quadrant/build1_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/quadrant/community.jpg',
        tnUrl: '/images/gallery/quadrant/community_tn.jpg',
        caption: '',
      },
    ],
    videos: [
      {
        type: 'vimeo',
        id: '64123615',
        width: 640,
        height: 360,
      },
    ],
    altGrid: true,
  },

  // Project 15: Thatch Cay
  {
    id: 'thatchcay',
    title: '',
    desc: '',
    circa: '',
    tags: ['Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/thatchcay/history.jpg',
        tnUrl: '/images/gallery/thatchcay/history_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/thatchcay/vision.jpg',
        tnUrl: '/images/gallery/thatchcay/vision_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/thatchcay/possibilities.jpg',
        tnUrl: '/images/gallery/thatchcay/possibilities_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/thatchcay/location.jpg',
        tnUrl: '/images/gallery/thatchcay/location_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 16: Granville Island
  {
    id: 'gi',
    title: '',
    desc: '',
    circa: '',
    tags: ['grASP CMS', 'ASP Classic', 'SQL Server', 'XSLT', 'Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/gi/home.jpg',
        tnUrl: '/images/gallery/gi/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/gi/flash.jpg',
        tnUrl: '/images/gallery/gi/flash_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/gi/dining.jpg',
        tnUrl: '/images/gallery/gi/dining_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/gi/kids.jpg',
        tnUrl: '/images/gallery/gi/kids_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 17: Rick Smith Portfolio
  {
    id: 'ricksmith',
    title: '',
    desc: '',
    circa: '',
    tags: ['PHP', 'DynObjects'],
    images: [
      {
        url: '/images/gallery/ricksmith/home.jpg',
        tnUrl: '/images/gallery/ricksmith/home_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/ricksmith/about.jpg',
        tnUrl: '/images/gallery/ricksmith/about_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/ricksmith/work.jpg',
        tnUrl: '/images/gallery/ricksmith/work_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/ricksmith/shaftebury.jpg',
        tnUrl: '/images/gallery/ricksmith/shaftebury_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 18: grASP CMS (oldest)
  {
    id: 'grasp',
    title: '',
    desc: '',
    circa: '',
    tags: ['ASP Classic', 'SQL Server', 'Server JScript', 'XSLT', 'Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/grASP/ldb.jpg',
        tnUrl: '/images/gallery/grASP/ldb_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/grASP/sisu.jpg',
        tnUrl: '/images/gallery/grASP/sisu_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/grASP/inhaus.jpg',
        tnUrl: '/images/gallery/grASP/inhaus_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/grASP/ledcor.jpg',
        tnUrl: '/images/gallery/grASP/ledcor_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/grASP/adt.jpg',
        tnUrl: '/images/gallery/grASP/adt_tn.jpg',
        caption: '',
      },
      {
        url: '/images/gallery/gi/dining.jpg',
        tnUrl: '/images/gallery/gi/dining_tn.jpg',
        caption: '',
      },
    ],
    videos: [],
    altGrid: true,
  },
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
 * Get a single project by ID.
 *
 * @param id - Project identifier
 * @returns Project object or undefined if not found
 *
 * @example
 * const project = getProjectById('collabspace');
 */
export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
