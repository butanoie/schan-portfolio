/**
 * Resume page data - comprehensive professional history and skills.
 *
 * This data is used by the /resume page to display:
 * - Resume header with name, tagline, and contact links
 * - Work experience with detailed job history
 * - Core competencies and skills organized by category
 * - Client list from 25+ years of professional work
 * - Conference speaking history
 *
 * Content migrated from V1 resume.html and updated for V2.
 */

import type { ResumeData } from '../types/resume';
import type { TranslationFunction } from '../hooks/useI18n';

/**
 * Get localized resume data with translated strings.
 *
 * Accepts a translation function from useI18n() and returns resume data
 * with all user-facing strings translated to the current locale.
 * Non-translatable data (URLs, dates, company names) remain unchanged.
 *
 * @param t - Translation function from useI18n() hook
 * @returns Resume data with all strings localized to the current language
 *
 * @example
 * const { t } = useI18n();
 * const data = getLocalizedResumeData(t);
 * console.log(data.header.tagline); // Translated tagline
 * console.log(data.jobs[0].roles[0].title); // Translated role title
 */
export function getLocalizedResumeData(t: TranslationFunction): ResumeData {
  return {
    pageTitle: t('resume.pageTitle', { ns: 'pages' }),
    pageDescription: t('resume.pageDescription', { ns: 'pages' }),

    header: {
      name: 'Sing Chan',
      tagline: t('resume.header.tagline', { ns: 'pages' }),
      contactLinks: [
        {
          label: 'portfolio.singchan.com',
          url: 'https://portfolio.singchan.com',
          icon: 'link',
        },
        {
          label: t('resume.header.downloadLabel', { ns: 'pages' }),
          url: '/Sing_Chan_Resume.pdf',
          icon: 'download',
        },
        {
          label: 'linkedin.com/in/sing-chan',
          url: 'https://www.linkedin.com/in/sing-chan/',
          icon: 'linkedin',
        },
        {
          label: 'github.com/butanoie',
          url: 'https://github.com/butanoie',
          icon: 'github',
        },
      ],
    },

    jobs: [
      {
        company: 'Collabware Systems',
        roles: [
          {
            title: t('resume.workExperience.jobs.0.roles.0.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.0.roles.0.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.0.roles.0.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.0.roles.0.contributions.0', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.0.contributions.1', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.0.contributions.2', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.0.contributions.3', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.0.contributions.4', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.0.contributions.5', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.0.contributions.6', {
                ns: 'pages',
              }),
            ],
          },
          {
            title: t('resume.workExperience.jobs.0.roles.1.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.0.roles.1.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.0.roles.1.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.0.roles.1.contributions.0', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.1.contributions.1', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.1.contributions.2', {
                ns: 'pages',
              }),
            ],
          },
          {
            title: t('resume.workExperience.jobs.0.roles.2.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.0.roles.2.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.0.roles.2.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.0.roles.2.contributions.0', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.0.roles.2.contributions.1', {
                ns: 'pages',
              }),
            ],
          },
        ],
      },
      {
        company: 'Habanero Consulting Group',
        roles: [
          {
            title: t('resume.workExperience.jobs.1.roles.0.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.1.roles.0.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.1.roles.0.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.1.roles.0.contributions.0', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.1.roles.0.contributions.1', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.1.roles.0.contributions.2', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.1.roles.0.contributions.3', {
                ns: 'pages',
              }),
            ],
          },
        ],
      },
      {
        company: 'Grey Advertising Vancouver',
        roles: [
          {
            title: t('resume.workExperience.jobs.2.roles.0.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.2.roles.0.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.2.roles.0.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.2.roles.0.contributions.0', {
                ns: 'pages',
              }),
            ],
          },
          {
            title: t('resume.workExperience.jobs.2.roles.1.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.2.roles.1.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.2.roles.1.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.2.roles.1.contributions.0', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.2.roles.1.contributions.1', {
                ns: 'pages',
              }),
            ],
          },
        ],
      },
      {
        company: 'Daniel Choi Design Associates',
        roles: [
          {
            title: t('resume.workExperience.jobs.3.roles.0.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.3.roles.0.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.3.roles.0.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.3.roles.0.contributions.0', {
                ns: 'pages',
              }),
            ],
          },
        ],
      },
      {
        company: 'Local Lola Design Team (LLDT)',
        roles: [
          {
            title: t('resume.workExperience.jobs.4.roles.0.title', {
              ns: 'pages',
            }),
            startDate: t('resume.workExperience.jobs.4.roles.0.startDate', {
              ns: 'pages',
            }),
            endDate: t('resume.workExperience.jobs.4.roles.0.endDate', {
              ns: 'pages',
            }),
            contributions: [
              t('resume.workExperience.jobs.4.roles.0.contributions.0', {
                ns: 'pages',
              }),
              t('resume.workExperience.jobs.4.roles.0.contributions.1', {
                ns: 'pages',
              }),
            ],
          },
        ],
      },
    ],

    skillCategories: [
      {
        label: t('resume.skills.coreCompetencies', { ns: 'pages' }),
        skills: [
          'Claude Code',
          'TypeScript',
          'React.js',
          'Fluent UI',
          'Next.js',
          'JointJS+',
          '.NET',
          'C#',
          'JavaScript',
          'HTML',
          'CSS',
          'SASS',
          'MS SQL Server',
          'CosmosDB',
          'SharePoint',
          'Microsoft Graph',
          'Playwright',
          'WCAG 2.2 AA',
          'Vitest',
          'GitHub Actions CI/CD',
          'Gherkin/BDD',
          'Elasticsearch',
        ],
      },
      {
        label: t('resume.skills.everydayTools', { ns: 'pages' }),
        skills: [
          'Visual Studio Code',
          'Visual Studio',
          'Azure DevOps',
          'Application Insights',
          'Jira',
          'Confluence',
          'Rancher',
          'Grafana',
          'Kubernetes',
          'Photoshop',
          'Illustrator',
          'Premiere Pro',
          'Balsamiq',
          'Exchange',
          'Paper',
          'Pencils',
          'Dry-Erase Markers',
        ],
      },
      {
        label: t('resume.skills.productMethodology', { ns: 'pages' }),
        skills: [
          'Product Strategy & Roadmapping',
          'UX/Interaction Design',
          'Agile',
          'Scrum',
          'Kanban',
          'SAFe',
          'Disciplined Agile',
          'Product Management',
          'Product Owner',
          'ScrumMaster',
        ],
      },
    ],

    education: [
      {
        institution: t('resume.education.entries.0.institution', {
          ns: 'pages',
        }),
        program: t('resume.education.entries.0.program', { ns: 'pages' }),
        year: t('resume.education.entries.0.year', { ns: 'pages' }),
      },
      {
        institution: t('resume.education.entries.1.institution', {
          ns: 'pages',
        }),
        program: t('resume.education.entries.1.program', { ns: 'pages' }),
        year: t('resume.education.entries.1.year', { ns: 'pages' }),
      },
      {
        institution: t('resume.education.entries.2.institution', {
          ns: 'pages',
        }),
        program: t('resume.education.entries.2.program', { ns: 'pages' }),
        year: t('resume.education.entries.2.year', { ns: 'pages' }),
      },
      {
        institution: t('resume.education.entries.3.institution', {
          ns: 'pages',
        }),
        program: t('resume.education.entries.3.program', { ns: 'pages' }),
        year: t('resume.education.entries.3.year', { ns: 'pages' }),
      },
    ],

    clients: [
      'ADT Security Canada',
      'Bank of Canada',
      'BC Hydro',
      'BC Liquor Distribution Branch',
      'BC Pavilion Corporation',
      'Boston Pizza',
      'Cameco',
      'Canadian Pacific Railways',
      'CGA Canada',
      'City of Calgary',
      'City of Issaquah',
      'City of Sammamish',
      'Cobb EMC',
      'College of Physicians and Surgeons of Manitoba',
      'College of Physicians and Surgeons of Ontario',
      'Devon Energy',
      'District of Squamish',
      'Enbridge',
      'Federal Mediation and Conciliation Service',
      'Federal Retirement Thrift Investment Board',
      'First Nations Summit',
      'Fortis Energy',
      'Goldcorp',
      'Granville Island',
      'Haventree Bank',
      'International Fund for Agricultural Development',
      'Ktunaxa Nation Council',
      'Law Society of Ontario',
      'Ledcor',
      'Microsoft',
      'Miramax Films',
      'Mission Hill Winery',
      'Money Mart',
      'Okanagan Spring Brewery',
      'PMC-Sierra',
      'Public Health Sudbury & Districts',
      'Quadrant Homes',
      'Regional District of Okanagan-Similkameen',
      'Renaissance Africa Energy',
      'Saskatchewan ITO',
      'Servus Credit Union',
      'Starbucks Coffee',
      'Sulfur Springs Valley Electric Cooperative',
      'Teck Resources',
      'TriWest Healthcare Alliance',
      'Tsleil-Waututh Nation',
      'US Department of Energy',
      'US Department of Homeland Security',
      'Valeant Pharmaceuticals',
      'Vancity Credit Union',
      'WorkplaceNL',
    ],

    speaking: {
      events: [
        {
          conference: 'ARMA Canada Information Conference',
          year: '2021',
          location: 'Virtual',
        },
        {
          conference: 'ARMA Houston Spring Conference',
          year: '2021',
          location: 'Virtual',
        },
        {
          conference: 'SharePoint Saturday',
          year: '2009',
          location: 'Vancouver, BC',
        },
        {
          conference: 'DevTeach',
          year: '2009',
          location: 'Vancouver, BC',
        },
        {
          conference: 'TechDays',
          year: '2009',
          location: 'Vancouver, BC',
        },
        {
          conference: 'EnergizeIT',
          year: '2007',
          location: 'Toronto, ON',
        },
      ],
    },
  };
}
