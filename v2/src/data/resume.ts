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
        label: "Download Résumé",
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
