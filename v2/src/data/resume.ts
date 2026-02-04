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

import type { ContactLink, ResumeData } from "../types/resume";

/**
 * Typed contact link constants for the resume header.
 * These are centralized constants for better type safety and maintainability.
 */
const LINKEDIN_LINK: ContactLink = {
  label: "linkedin.com/in/sing-chan",
  url: "https://www.linkedin.com/in/sing-chan/",
  icon: "linkedin",
};

/**
 * GitHub contact link with direct URL to profile.
 */
const GITHUB_LINK: ContactLink = {
  label: "github.com/butanoie",
  url: "https://github.com/butanoie",
  icon: "github",
};

/**
 * Email contact link with obfuscated ROT13/ROT5 encoding.
 * Contact: sing@singchan.com (obfuscated as fvat@fvatpuna.pbz)
 * Decodes to: mailto:sing@singchan.com?subject=Contact via Portfolio Site
 */
const EMAIL_LINK: ContactLink = {
  label: "fvat@fvatpuna.pbz",
  url: "znvygb:fvat@fvatpuna.pbz?fhowrpg=Pbagnpg ivn Cbegsbyvb Fvgr",
  icon: "email",
};

/**
 * Phone contact link with obfuscated ROT13/ROT5 encoding.
 * Contact: +1-604-773-2843 (obfuscated as +6-159-228-7398)
 */
const PHONE_LINK: ContactLink = {
  label: "+6-159-228-7398",
  url: "gry:+6-159-228-7398",
  icon: "phone",
};

/**
 * Download resume PDF link.
 */
const DOWNLOAD_LINK: ContactLink = {
  label: "Download Résumé",
  url: "/Sing_Chan_Resume.pdf",
  icon: "download",
};

/**
 * Complete resume page content.
 * All content extracted from V1 resume.html and structured for V2.
 */
export const resumeData: ResumeData = {
  pageTitle: "Resume | Sing Chan's Portfolio",
  pageDescription:
    "Sing Chan's resume - 25+ years experience in UX, product management, and software development.",

  header: {
    name: "Sing Chan",
    tagline:
      "I develop useful, intuitive, and engaging applications that better people's lives.",
    contactLinks: [
      LINKEDIN_LINK,
      GITHUB_LINK,
      EMAIL_LINK,
      PHONE_LINK,
      DOWNLOAD_LINK,
    ],
  },

  jobs: [
    {
      company: "Collabware Systems",
      roles: [
        {
          title: "VP, Product",
          startDate: "May 2020",
          endDate: "Present",
        },
        {
          title: "Product Manager",
          startDate: "March 2018",
          endDate: "May 2020",
        },
        {
          title: "User Experience Architect",
          startDate: "August 2011",
          endDate: "Present",
        },
      ],
      description:
        "My responsibilities as VP of Product were to drive product execution for Collabware's enterprise collaboration solutions. I led cross-functional UX and QA teams and integrated with cloud operations and engineering to deliver customer-centric features while optimizing operational efficiency.",
      keyContributions: [
        "Requirements gathering with customers and stakeholders, translate business needs into actionable product features and roadmap priorities",
        "Collaborate with engineering teams on product backlog definition and sprint planning",
        "Manage quality assurance team to develop comprehensive test cases and automation frameworks to maintain product quality standards",
        "Partner with cloud operations to monitor system health and ensure platform reliability",
        "Led cost optimization initiative through systematic cloud infrastructure audits, identifying significant opportunities for expense reduction",
        "Responsible for the interaction design, user experience, and front-end development frameworks for Collabware's software offerings",
        "Mentor UX developers, fostering design excellence and cross-functional collaboration",
        "Design and deliver product knowledge onboarding program for new Collabware team members",
      ],
    },
    {
      company: "Habanero Consulting Group",
      roles: [
        {
          title: "User Experience Developer",
          startDate: "May 2006",
          endDate: "July 2011",
        },
      ],
      description:
        "Hired as the first User Experience Developer in the organization to bridge the communication and process issues between design and development teams. Evangelized the value of the UX Developer role within Habanero and introduced front-end development process and patterns to remove pain points in the project lifecycle. On-boarded and mentored new UX Developers when they joined Habanero. Helped grow the number of front-end developers at Habanero to eight and also took on group management and resourcing responsibilities.",
    },
    {
      company: "Daniel Choi Design Associates",
      roles: [
        {
          title: "Lead Developer (Contract)",
          startDate: "2005",
          endDate: "2006",
        },
      ],
      description:
        "Contracted to manage and lead development of interactive projects, from the database layer all the way up to the front-end, including security, testing, deployment and documentation.",
    },
    {
      company: "Local Lola Design Team (LLDT)",
      roles: [
        {
          title: "Flash and User Experience Developer (Contract)",
          startDate: "2003",
          endDate: "2006",
        },
      ],
      description:
        "Contracted to develop Flash applications, client-side scripting and XHTML/CSS markup for LLDT projects. Consulted on interface design and provided programming assistance with development of CustomBlox, LLDT's ASP.Net CMS solution.",
    },
    {
      company: "Grey Advertising Vancouver",
      roles: [
        {
          title: "Interactive Producer/Developer",
          startDate: "July 1999",
          endDate: "May 2006",
        },
      ],
      description:
        "Developed grASP, a modular and extensible in-house CMS used on Grey projects from 2001 to 2006. Also developed and maintained Grey's external and internal web sites and applications. Took on role of Interactive Producer, with additional project management duties such as managing resources and project schedules, interacting and coordinating with outside developers, vendors and clients.",
    },
  ],

  skillCategories: [
    {
      label: "Core Competencies",
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
      label: "Everyday Tools",
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
      label: "Once in a While",
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
    intro: "I have presented sessions at the following conferences:",
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

/**
 * Get the complete resume data.
 *
 * @returns The full resume page content including header, work experience, skills, clients, and speaking history
 *
 * @example
 * const data = getResumeData();
 * console.log(data.header.name); // "Sing Chan"
 * console.log(data.jobs.length); // 5
 */
export function getResumeData(): ResumeData {
  return resumeData;
}

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
  t: (key: string, options?: Record<string, string | number | Record<string, string>>) => string
): ResumeData {
  return {
    pageTitle: "Resume | Sing Chan's Portfolio",
    pageDescription:
      "Sing Chan's resume - 25+ years experience in UX, product management, and software development.",

    header: {
      name: "Sing Chan",
      tagline: t('resume.header.tagline', { ns: 'components' }),
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
          label: t('resume.header.downloadLabel', { ns: 'components' }),
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
            title: "VP, Product",
            startDate: "May 2020",
            endDate: "Present",
          },
          {
            title: "Product Manager",
            startDate: "March 2018",
            endDate: "May 2020",
          },
          {
            title: "User Experience Architect",
            startDate: "August 2011",
            endDate: "Present",
          },
        ],
        description: t('resume.workExperience.collabware.description', { ns: 'components' }),
        keyContributions: [
          t('resume.workExperience.collabware.contributions.0', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.1', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.2', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.3', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.4', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.5', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.6', { ns: 'components' }),
          t('resume.workExperience.collabware.contributions.7', { ns: 'components' }),
        ],
      },
      {
        company: "Habanero Consulting Group",
        roles: [
          {
            title: "User Experience Developer",
            startDate: "May 2006",
            endDate: "July 2011",
          },
        ],
        description: t('resume.workExperience.habanero.description', { ns: 'components' }),
      },
      {
        company: "Daniel Choi Design Associates",
        roles: [
          {
            title: "Lead Developer (Contract)",
            startDate: "2005",
            endDate: "2006",
          },
        ],
        description: t('resume.workExperience.danielChoi.description', { ns: 'components' }),
      },
      {
        company: "Local Lola Design Team (LLDT)",
        roles: [
          {
            title: "Flash and User Experience Developer (Contract)",
            startDate: "2003",
            endDate: "2006",
          },
        ],
        description: t('resume.workExperience.localLola.description', { ns: 'components' }),
      },
      {
        company: "Grey Advertising Vancouver",
        roles: [
          {
            title: "Interactive Producer/Developer",
            startDate: "July 1999",
            endDate: "May 2006",
          },
        ],
        description: t('resume.workExperience.greyAdvertising.description', { ns: 'components' }),
      },
    ],

    skillCategories: [
      {
        label: t('resume.skills.coreCompetencies', { ns: 'components' }),
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
        label: t('resume.skills.everydayTools', { ns: 'components' }),
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
        label: t('resume.skills.onceInAWhile', { ns: 'components' }),
        skills: ["Illustrator", "Premiere Pro", "Perl", "Req-n-roll"],
      },
    ],

    clients: resumeData.clients,

    speaking: {
      intro: t('resume.conferenceSpeaker.intro', { ns: 'components' }),
      events: resumeData.speaking.events,
    },
  };
}
