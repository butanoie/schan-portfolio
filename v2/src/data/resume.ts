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

import type { ResumeData } from "../types/resume";
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
 * console.log(data.jobs[0].description); // Translated job description
 */
export function getLocalizedResumeData(
  t: TranslationFunction
): ResumeData {
  return {
    pageTitle: t('resume.pageTitle', { ns: 'pages' }),
    pageDescription: t('resume.pageDescription', { ns: 'pages' }),

    header: {
      name: "Sing Chan",
      tagline: t('resume.header.tagline', { ns: 'pages' }),
      contactLinks: [
        {
          label: "linkedin.com/in/sing-chan",
          url: "https://www.linkedin.com/in/sing-chan/",
          icon: "linkedin",
        },
        {
          label: "github.com/butanoie",
          url: "https://github.com/butanoie",
          icon: "github",
        },
        {
          label: "fvat@fvatpuna.pbz",
          url: "znvygb:fvat@fvatpuna.pbz?fhowrpg=Pbagnpg ivn Cbegsbyvb Fvgr",
          icon: "email",
        },
        {
          label: "+6-159-228-7398",
          url: "gry:+6-159-228-7398",
          icon: "phone",
        },
        {
          label: t('resume.header.downloadLabel', { ns: 'pages' }),
          url: "/Sing_Chan_Resume.pdf",
          icon: "download",
        },
      ],
    },

    jobs: [
      {
        company: "Collabware Systems",
        roles: [
          {
            title: t('resume.workExperience.jobs.0.roles.0.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.0.roles.0.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.0.roles.0.endDate', { ns: 'pages' }),
          },
          {
            title: t('resume.workExperience.jobs.0.roles.1.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.0.roles.1.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.0.roles.1.endDate', { ns: 'pages' }),
          },
          {
            title: t('resume.workExperience.jobs.0.roles.2.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.0.roles.2.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.0.roles.2.endDate', { ns: 'pages' }),
          },
        ],
        description: t('resume.workExperience.jobs.0.description', { ns: 'pages' }),
        keyContributions: [
          t('resume.workExperience.jobs.0.contributions.0', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.1', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.2', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.3', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.4', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.5', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.6', { ns: 'pages' }),
          t('resume.workExperience.jobs.0.contributions.7', { ns: 'pages' }),
        ],
      },
      {
        company: "Habanero Consulting Group",
        roles: [
          {
            title: t('resume.workExperience.jobs.1.roles.0.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.1.roles.0.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.1.roles.0.endDate', { ns: 'pages' }),
          },
        ],
        description: t('resume.workExperience.jobs.1.description', { ns: 'pages' }),
      },
      {
        company: "Daniel Choi Design Associates",
        roles: [
          {
            title: t('resume.workExperience.jobs.2.roles.0.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.2.roles.0.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.2.roles.0.endDate', { ns: 'pages' }),
          },
        ],
        description: t('resume.workExperience.jobs.2.description', { ns: 'pages' }),
      },
      {
        company: "Local Lola Design Team (LLDT)",
        roles: [
          {
            title: t('resume.workExperience.jobs.3.roles.0.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.3.roles.0.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.3.roles.0.endDate', { ns: 'pages' }),
          },
        ],
        description: t('resume.workExperience.jobs.3.description', { ns: 'pages' }),
      },
      {
        company: "Grey Advertising Vancouver",
        roles: [
          {
            title: t('resume.workExperience.jobs.4.roles.0.title', { ns: 'pages' }),
            startDate: t('resume.workExperience.jobs.4.roles.0.startDate', { ns: 'pages' }),
            endDate: t('resume.workExperience.jobs.4.roles.0.endDate', { ns: 'pages' }),
          },
        ],
        description: t('resume.workExperience.jobs.4.description', { ns: 'pages' }),
      },
    ],

    skillCategories: [
      {
        label: t('resume.skills.coreCompetencies', { ns: 'pages' }),
        skills: [
          "JavaScript",
          "TypeScript",
          "React.js",
          "Fluent UI",
          ".NET",
          "C#",
          "HTML",
          "CSS",
          "MS SQL Server",
          "CosmosDB",
          "SharePoint",
        ],
      },
      {
        label: t('resume.skills.everydayTools', { ns: 'pages' }),
        skills: [
          "Claude Code",
          "Azure DevOps",
          "Application Insights",
          "Rancher",
          "Graphana",
          "Visual Studio",
          "Visual Studio Code",
          "Kubernetes",
          "Photoshop",
          "Paper",
          "Pencils",
          "Dry-Erase Markers",
        ],
      },
      {
        label: t('resume.skills.onceInAWhile', { ns: 'pages' }),
        skills: ["Illustrator", "Premiere Pro", "Perl", "Req-n-roll"],
      },
    ],

    clients: [
      "ADT Security Canada",
      "Bank of Canada",
      "BC Hydro",
      "BC Liquor Distribution Branch",
      "Boston Pizza",
      "Cameco",
      "Canadian Pacific Railways",
      "CGA Canada",
      "City of Calgary",
      "City of Issaquah",
      "City of Sammamish",
      "Cobb EMC",
      "Devon Energy",
      "District of Squamish",
      "Enbridge",
      "Federal Mediation and Conciliation Service",
      "Federal Retirement Thrift Investment Board",
      "Fortis Energy",
      "Granville Island",
      "Goldcorp",
      "Haventree Bank",
      "Ktunaxa Nation Council",
      "Law Society of Ontario",
      "Ledcor",
      "Microsoft",
      "Miramax Films",
      "Mission Hill Winery",
      "Money Mart",
      "Okanagan Spring Brewery",
      "PMC-Siera",
      "Quadrant Homes",
      "Saskatchewan ITO",
      "Servus Credit Union",
      "Starbucks Coffee",
      "Sulfur Springs Valley Electric Cooperative",
      "Teck Resources",
      "Tsleil-Waututh Nation",
      "US Department of Energy",
      "US Department of Homeland Security",
      "Valeant Pharmaceuticals",
      "Vancity Credit Union",
      "WorkplaceNL",
    ],

    speaking: {
      intro: t('resume.conferenceSpeaker.intro', { ns: 'pages' }),
      events: [
        {
          conference: "ARMA Canada Information Conference",
          year: "2021",
          location: "Virtual",
        },
        {
          conference: "ARMA Houston Spring Conference",
          year: "2021",
          location: "Virtual",
        },
        {
          conference: "SharePoint Saturday",
          year: "2009",
          location: "Vancouver, BC",
        },
        {
          conference: "DevTeach",
          year: "2009",
          location: "Vancouver, BC",
        },
        {
          conference: "TechDays",
          year: "2009",
          location: "Vancouver, BC",
        },
        {
          conference: "EnergizeIT",
          year: "2007",
          location: "Toronto, ON",
        },
      ],
    },
  };
}
