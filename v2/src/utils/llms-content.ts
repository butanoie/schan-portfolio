/**
 * LLMs.txt Content Builders
 *
 * Pure functions that assemble the markdown content for `/llms.txt` and `/llms-full.txt`
 * endpoints. Both follow the llms.txt specification (https://llmstxt.org/).
 *
 * Content is sourced from centralized SEO constants to stay in sync with site metadata.
 * Project descriptions, writing samples, and resume data are included inline since
 * they are English-only static content that does not pass through the i18n layer.
 *
 * @module utils/llms-content
 * @see {@link https://llmstxt.org/} for the llms.txt specification
 */

import {
  SITE_URL,
  AUTHOR,
  SOCIAL_LINKS,
  SITE_METADATA,
  PAGE_METADATA,
} from '../constants/seo';

/**
 * Builds the shared header lines used by both llms.txt variants.
 *
 * Includes the H1 title, blockquote summary, intro paragraph, and pages list.
 *
 * @returns Array of markdown lines for the header section
 *
 * @example
 * const lines = buildHeaderLines();
 * // lines[0] === "# Sing Chan's Portfolio"
 */
function buildHeaderLines(): string[] {
  return [
    `# ${SITE_METADATA.title}`,
    '',
    `> ${SITE_METADATA.description}`,
    '',
    `${AUTHOR.tagline}. ${AUTHOR.name} is a ${AUTHOR.jobTitle} with 25+ years of experience spanning enterprise SaaS, front-end architecture, and cross-functional product delivery.`,
    '',
    '## Pages',
    '',
    `- [Portfolio](${SITE_URL}/): ${PAGE_METADATA.home.description}`,
    `- [Resume](${SITE_URL}/resume): ${PAGE_METADATA.resume.description}`,
    `- [Writing Samples](${SITE_URL}/samples): ${PAGE_METADATA.samples.description}`,
    `- [Colophon](${SITE_URL}/colophon): ${PAGE_METADATA.colophon.description}`,
    '',
  ];
}

/**
 * Builds the shared contact lines used by both llms.txt variants.
 *
 * Includes GitHub, LinkedIn, and resume PDF links.
 *
 * @returns Array of markdown lines for the contact section
 *
 * @example
 * const lines = buildContactLines();
 * // lines[0] === '## Contact'
 */
function buildContactLines(): string[] {
  return [
    '## Contact',
    '',
    `- GitHub: ${SOCIAL_LINKS.github}`,
    `- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
    `- Resume PDF: ${SITE_URL}/Sing_Chan_Resume.pdf`,
    '',
  ];
}

/**
 * Builds the concise `/llms.txt` document.
 *
 * Follows the llms.txt spec format:
 * - H1 heading with site name
 * - Blockquote summary
 * - Brief description paragraph
 * - H2 "Pages" section with linked page list
 * - H2 "Contact" section with social links
 *
 * @returns Markdown string for the concise llms.txt endpoint
 *
 * @example
 * const content = buildLlmsTxt();
 * // # Sing Chan's Portfolio
 * //
 * // > Portfolio of Sing Chan - Technical Product Leader & User Experience Architect
 * // ...
 */
export function buildLlmsTxt(): string {
  const lines: string[] = [...buildHeaderLines(), ...buildContactLines()];

  return lines.join('\n');
}

/**
 * Builds the expanded `/llms-full.txt` document.
 *
 * Includes everything from `buildLlmsTxt()` plus detailed content for each page:
 * - Professional summary from the resume
 * - All 18 portfolio projects with descriptions and technology tags
 * - Writing samples organized by section with artifact descriptions
 * - Links to downloadable documents
 *
 * @returns Markdown string for the expanded llms-full.txt endpoint
 *
 * @example
 * const content = buildLlmsFullTxt();
 * // # Sing Chan's Portfolio
 * //
 * // > Portfolio of Sing Chan - Technical Product Leader & User Experience Architect
 * // ...
 * // ## Portfolio Projects
 * // ...
 */
export function buildLlmsFullTxt(): string {
  const lines: string[] = [
    ...buildHeaderLines(),
    '## Professional Summary',
    '',
    'Technical product and engineering leader with 25+ years of experience spanning enterprise SaaS, front-end architecture, and cross-functional product delivery. Built teams, UX practices, and engineering standards from the ground up at multiple organizations. Mentored developers from co-op through senior roles while staying hands-on in React, TypeScript, and .NET/C#. Led 0-to-1 product development in FedRAMP-certified and SOC-2 compliant environments, from customer discovery and interaction design through cloud infrastructure optimization. Daily AI-first development practitioner. Extensive client portfolio including government, Fortune 500 companies, and organizations in highly regulated industries.',
    '',
    '## Portfolio Projects',
    '',
    ...buildProjectLines(),
    '## Writing Samples',
    '',
    `Available at [${SITE_URL}/samples](${SITE_URL}/samples).`,
    '',
    ...buildSamplesLines(),
    ...buildContactLines(),
  ];

  return lines.join('\n');
}

/**
 * Builds the markdown lines for all portfolio projects.
 *
 * Each project includes its title, date range, description paragraphs,
 * and technology tags. HTML tags are stripped from descriptions.
 *
 * @returns Array of markdown lines for the projects section
 *
 * @example
 * const lines = buildProjectLines();
 * // lines[0] === '### Collabware - Collabspace Export Downloader (Winter 2025)'
 */
function buildProjectLines(): string[] {
  const projects = [
    {
      title: 'Collabware - Collabspace Export Downloader',
      circa: 'Winter 2025',
      desc: 'Built single-handedly in under a month with Claude Code, a .NET 9 / MAUI 9 desktop application for securely downloading and managing Collabspace exports. Ships with WCAG 2.2 Level AA compliance, keyboard navigation, screen reader support, four-language localization, and auto-update management.',
      tags: [
        '.NET 9',
        '.NET MAUI',
        'C#',
        'Reqnroll',
        'xUnit',
        'Selenium',
        'Gherkin',
        'Claude Code',
      ],
    },
    {
      title: 'Collabware - Collabspace',
      circa: 'Fall 2017 - Present',
      desc: 'FedRAMP-certified cloud-based records management automation solution. As UX Architect and Product Manager, defined front-end frameworks and development patterns, owned the product backlog and feature roadmap. Features no-code visual workflow system, multi-stage disposition review, and support for electronic and physical records.',
      tags: [
        '.NET 8',
        'C#',
        'React.js',
        'Fluent UI',
        'JointJS+',
        'Kubernetes',
        'SQL Server',
        'CosmosDB',
        'Azure Cloud Services',
      ],
    },
    {
      title: 'Collabware - Collabmail',
      circa: 'Summer 2016 - Present',
      desc: 'Microsoft Outlook add-in integrating SharePoint directly into Outlook with drag-and-drop filing, metadata management, and compliance features. Led interaction design within the tight visual constraints of an Exchange add-in panel.',
      tags: [
        'Outlook',
        'SharePoint Server',
        'SharePoint Online',
        'ASP.Net',
        'C#',
        'WPF',
        'XSLT',
      ],
    },
    {
      title: 'Collabware - Content Lifecycle Management (CLM)',
      circa: 'Summer 2011 - Present',
      desc: 'DoD 5015.2 certified solution integrating with SharePoint Server for automated classification, retention, and disposition of content. Features visual lifecycle workflows, case management, and no-code drag-and-drop configuration.',
      tags: [
        'SharePoint Server',
        'SQL Server',
        'ASP.Net',
        'C#',
        'Dojo Toolkit',
        'JointJS+',
        'XSLT',
      ],
    },
    {
      title: 'Vancity - Insite',
      circa: 'Fall 2010',
      desc: "Employee portal for Canada's largest credit union. Finalist for the 2011 Microsoft Partner Network IMPACT Awards (Portals and Collaboration) and honourable mention from the Intranet Innovation Awards.",
      tags: ['SharePoint 2010', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    },
    {
      title: 'Servus Credit Union - cafe',
      circa: 'Spring 2010',
      desc: 'Employee crowdsourcing solution fostering open dialogue and collaboration between employees and executive leadership. Winner of the 2010 Microsoft Partner Network IMPACT Awards (Portals and Collaboration).',
      tags: ['SharePoint 2010', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    },
    {
      title: 'Devon Energy - Strata',
      circa: 'Summer/Fall 2009',
      desc: 'Employee portal migration to SharePoint 2007 with cross-timezone blended team development and developer training across Vancouver, Oklahoma City, Houston, and Calgary.',
      tags: ['SharePoint 2007', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    },
    {
      title: 'Other SharePoint 2007 and 2010 Projects',
      circa: '2006 - 2012',
      desc: 'Dozens of SharePoint projects spanning intranets, public-facing websites, portals, and business applications as lead UX developer or UX architect.',
      tags: [
        'SharePoint 2010',
        'SharePoint 2007',
        'ASP.Net',
        'C#',
        'jQuery',
        'XSLT',
      ],
    },
    {
      title: 'Habanero Consulting Group - External Website',
      circa: 'Winter 2008',
      desc: "Showcase for Habanero's experience on SiteFinity, featuring modals to spotlight related information without losing context.",
      tags: ['SiteFinity', 'ASP.Net', 'C#', 'jQuery'],
    },
    {
      title: 'SE Cornerstone - Financial Reporting System',
      circa: 'Fall 2008',
      desc: 'Streamlined financial reporting solution replacing complex Dynamics forms with multi-step wizards. Finalist for the 2009 Microsoft Partner Network IMPACT Awards (Finance/ERP).',
      tags: ['Dynamics ERP', 'ASP.Net', 'C#', 'Telerik RadControls'],
    },
    {
      title: 'Microsoft - Contoso Riders',
      circa: 'Spring 2008',
      desc: 'Windows Live Quick Application demonstrating Windows Live services integration. Presented at Microsoft EnergizeIT conference.',
      tags: [
        'Windows Live Services',
        'Silverlight',
        'Bing Maps',
        'ASP.Net',
        'C#',
      ],
    },
    {
      title: 'Boston Pizza - Franchisee Dashboard',
      circa: 'Winter 2006',
      desc: 'Interactive lobby display for viewing franchise location data across North America, using 10-foot UI design principles with Nintendo Wii-mote control.',
      tags: [
        'Adobe Flex',
        'ActionScript 3.0',
        'Nintendo Wii-mote',
        '10 Foot UI Design',
      ],
    },
    {
      title: 'Grey Holiday Puppet',
      circa: 'Winter 2005',
      desc: 'Viral holiday greeting featured on del.icio.us and MetaFilter, reaching visitors from France, Sweden, and Russia. Winner of the 2005 Lotus Award for Best Self Promotion.',
      tags: ['Adobe Flash', 'ActionScript 2.0'],
    },
    {
      title: 'Quadrant Homes - External Website',
      circa: 'Fall 2005',
      desc: "Website for Washington state's largest home builder, featuring interactive Flash-based home planning tools. Resulted in increased interest list sign-ups and sales.",
      tags: ['PHP', 'PostgreSQL', 'Adobe Flash', 'ActionScript 2.0'],
    },
    {
      title: 'Thatch Cay',
      circa: 'Spring 2004',
      desc: 'Flash-based website for one of the last undeveloped, privately-held U.S. Virgin Islands.',
      tags: ['Adobe Flash', 'ActionScript 2.0'],
    },
    {
      title: 'Granville Island - External Website',
      circa: 'Summer 2002',
      desc: "Website for one of Vancouver's world-renowned destinations, built on Grey Vancouver's grASP CMS with HTML and Flash interfaces including interactive elements, videos, and 360-degree panoramas.",
      tags: ['grASP CMS', 'ASP Classic', 'SQL Server', 'XSLT', 'Adobe Flash'],
    },
    {
      title: 'Rick Smith - Portfolio Site',
      circa: 'Spring 2002',
      desc: 'Artist portfolio site using a lightweight custom CMS, experimenting with HTML and JavaScript effects and transitions.',
      tags: ['PHP', 'DynObjects'],
    },
    {
      title: 'Grey Advertising - grASP CMS',
      circa: '2001 - 2006',
      desc: 'Co-developed a modular and extensible content management system enabling Grey Advertising Vancouver to quickly produce and deploy dynamic web solutions.',
      tags: [
        'ASP Classic',
        'SQL Server',
        'Server JScript',
        'XSLT',
        'Adobe Flash',
      ],
    },
  ];

  const lines: string[] = [];

  for (const project of projects) {
    lines.push(`### ${project.title} (${project.circa})`);
    lines.push('');
    lines.push(project.desc);
    lines.push('');
    lines.push(`Technologies: ${project.tags.join(', ')}`);
    lines.push('');
  }

  return lines;
}

/**
 * Represents a writing sample artifact with an optional download link.
 */
interface SampleItem {
  /** Artifact display title */
  title: string;
  /** Artifact description */
  desc: string;
  /** Download path relative to site root (undefined when download is unavailable) */
  href?: string;
}

/**
 * Builds the markdown lines for the writing samples section.
 *
 * Organized by section (Vision, Design, Technology, Operations, Impact)
 * with artifact titles, descriptions, and download links. Items without
 * a download link are rendered as plain text rather than markdown links.
 *
 * @returns Array of markdown lines for the writing samples section
 *
 * @example
 * const lines = buildSamplesLines();
 * // lines[0] === '### Defining the Vision'
 */
function buildSamplesLines(): string[] {
  const sections: { heading: string; items: SampleItem[] }[] = [
    {
      heading: 'Defining the Vision',
      items: [
        {
          title: 'Product Roadmap - Phase 3',
          desc: 'SAFe-formatted roadmap with epics, features, and product backlog items for the core pages development phase.',
          href: '/documents/PHASE_3_PRODUCT_ROADMAP.md',
        },
        {
          title: 'Product Roadmap - Phase 4',
          desc: 'SAFe-formatted roadmap covering enhanced features: theming, i18n, animations, accessibility, and SEO.',
          href: '/documents/PHASE_4_PRODUCT_ROADMAP.md',
        },
        {
          title: 'Product Requirements Document - Project Gallery & Lightbox',
          desc: "Detailed PRD for the portfolio's project gallery layout and image lightbox interaction patterns.",
          href: '/documents/Product_Requirements_Document.pdf',
        },
      ],
    },
    {
      heading: 'Designing the Experience',
      items: [
        {
          title:
            'Interaction Design Specification - Project Gallery & Lightbox',
          desc: 'Comprehensive IDS documenting interaction patterns, state transitions, and responsive behavior.',
          href: '/documents/Interaction_Design_Specification.pdf',
        },
        {
          title: 'Usability Test Plan & Findings',
          desc: 'Task-based usability test plan and findings covering test scenarios, participant tasks, success metrics, and actionable findings.',
          href: '/documents/Usability_Test_Plan_and_Findings.pdf',
        },
        {
          title: 'WCAG 2.2 Compliance Guide',
          desc: "Detailed guide mapping WCAG 2.2 Level AA success criteria to the portfolio's implementation approach.",
          href: '/documents/WCAG_Compliance_Guide.pdf',
        },
      ],
    },
    {
      heading: 'Evaluating the Technology',
      items: [
        {
          title: 'Architecture Decision Record - i18n Library Selection',
          desc: 'ADR evaluating internationalization approaches for the Next.js migration, documenting the rationale for selecting i18next.',
          href: '/documents/Architecture_Decision_Record.pdf',
        },
        {
          title: 'Front-End Framework Evaluation',
          desc: 'Structured comparison of front-end frameworks considered for the portfolio modernization, with scoring criteria and final recommendation.',
          href: '/documents/Front_End_Framework_Evaluation.pdf',
        },
      ],
    },
    {
      heading: 'Operationalizing the Practice',
      items: [
        {
          title: 'QA Automation Strategy',
          desc: 'BDD-driven QA strategy with CI/CD integration, covering test pyramid structure, tooling selection, and coverage targets.',
          href: '/documents/QA_Automation_Strategy.pdf',
        },
        {
          title: 'Product Knowledge Onboarding Guide',
          desc: '14-module onboarding curriculum for new team members covering feature areas and domain knowledge.',
          href: '/documents/Product_Knowledge_Onboarding.pdf',
        },
        {
          title: 'Changelog & Release Notes Strategy',
          desc: 'Multi-file changelog philosophy documenting naming conventions, versioning format, and release note distillation process.',
          href: '/documents/Changelog_Strategy.pdf',
        },
        {
          title: 'Gherkin Test Cases - Phase 3',
          desc: 'BDD-style acceptance criteria for core pages in Given/When/Then format.',
          href: '/documents/PHASE_3_GHERKIN_TEST_CASES.md',
        },
        {
          title: 'Gherkin Test Cases - Phase 4',
          desc: 'BDD-style acceptance criteria for enhanced features including theming, i18n, and accessibility.',
          href: '/documents/PHASE_4_GHERKIN_TEST_CASES.md',
        },
      ],
    },
    {
      heading: 'Measuring the Impact',
      items: [
        {
          title: 'Cost Savings Report',
          desc: 'Azure cloud infrastructure cost optimization audit identifying 40% reduction in annualized hosting costs ($360K CAD).',
          href: '/documents/Azure_Cost_Savings_Report.pdf',
        },
        {
          title: 'Additional Cost Savings Roadmap',
          desc: 'Strategic presentation outlining further infrastructure cost optimization opportunities. Contact Sing to request a presentation of the full roadmap.',
        },
        {
          title: 'Elasticsearch Node & Disk Scale-Down Runbook',
          desc: 'Step-by-step operational runbook for safely scaling down Elasticsearch cluster nodes with rollback procedures.',
          href: '/documents/ELASTICSEARCH_REDUCTION_RUNBOOK.md',
        },
        {
          title: 'Defender for Storage Reduction Runbook',
          desc: 'PowerShell-based operational runbook for bulk-disabling Microsoft Defender for Storage on Azure accounts.',
          href: '/documents/DEFENDER_REDUCTION_RUNBOOK.md',
        },
      ],
    },
  ];

  const lines: string[] = [];

  for (const section of sections) {
    lines.push(`### ${section.heading}`);
    lines.push('');
    for (const item of section.items) {
      lines.push(
        item.href
          ? `- [${item.title}](${SITE_URL}${item.href}): ${item.desc}`
          : `- ${item.title}: ${item.desc}`
      );
    }
    lines.push('');
  }

  return lines;
}
