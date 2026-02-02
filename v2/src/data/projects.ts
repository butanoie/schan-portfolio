import { Project } from '../types';

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
    desc:
      '<p>The Collabspace Export Downloader is a desktop application that enables users to securely download and manage Collabspace exports across multiple regions.</p>' +
      '<p>Users can pause, resume, or cancel downloads with state persistence across restarts, while progress tracking displays real-time status. Deep linking through magnet link protocols allows users to initiate downloads directly from external sources like email or Teams.</p>' +
      '<p>Built on .NET 9 and MAUI 9, the downloader emphasizes accessibility with WCAG 2.2 Level AA compliance, including keyboard navigation and screen reader support. It offers four-language localization and integrated auto-update management.</p>' +
      '<p>The timeline for this project was extremely short and the application was planned, developed, and tested by myself leveraging Claude Code within the span of a month.</p>',
    circa: 'Winter 2025',
    tags: ['.NET 9', '.NET MAUI', 'C#', 'Reqnroll', 'xUnit', 'Selenium', 'Gherkin', 'Claude Code'],
    images: [
      {
        url: '/images/gallery/csDownload/download-light.png',
        tnUrl: '/images/gallery/csDownload/download-light_tn.png',
        caption: 'Export Downloader - Download Progress (Light Mode)',
      },
      {
        url: '/images/gallery/csDownload/download-dark.png',
        tnUrl: '/images/gallery/csDownload/download-dark_tn.png',
        caption: 'Export Downloader - Download Progress (Dark Mode)',
      },
      {
        url: '/images/gallery/csDownload/autoupdate.png',
        tnUrl: '/images/gallery/csDownload/autoupdate_tn.png',
        caption: 'Export Downloader - Auto-Update Dialog',
      },
      {
        url: '/images/gallery/csDownload/settings.png',
        tnUrl: '/images/gallery/csDownload/settings_tn.png',
        caption: 'Export Downloader - Settings',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 2: Collabspace
  {
    id: 'collabspace',
    title: 'Collabware - Collabspace',
    desc:
      '<p>Collabspace is a FedRAMP certified cloud-based records management automation solution that automates compliance activities to meet legislative and regulatory requirements.</p>' +
      '<p>The platform uses a no-code visual workflow system for designing retention and lifecycle policies, supporting both time and event-based retention with metadata-driven calculations.</p>' +
      '<p>It handles both electronic content (email, structured and unstructured data) and physical records with inventory control, circulation tracking, container management, and barcode capabilities.</p>' +
      '<p>Collabspace supports multi-stage disposition review processes to authorize record destruction, with event-based triggers for retention and disposition.</p>',
    circa: 'Fall 2017 - Present',
    tags: ['.NET 8', 'C#', 'React.js', 'Fluent UI', 'JointJS+', 'Kubernetes', 'SQL Server', 'CosmosDB', 'Azure Cloud Services'],
    images: [
      {
        url: '/images/gallery/collabspace/analytics.jpg',
        tnUrl: '/images/gallery/collabspace/analytics_tn.png',
        caption: 'Collabspace - Analytics',
      },
      {
        url: '/images/gallery/collabspace/email-preview.jpg',
        tnUrl: '/images/gallery/collabspace/email-preview_tn.png',
        caption: 'Collabspace - Email Previews with Thread Navigation',
      },
      {
        url: '/images/gallery/collabspace/workflow-designer.jpg',
        tnUrl: '/images/gallery/collabspace/workflow-designer_tn.png',
        caption: 'Collabspace - Visual Workflow Designer',
      },
      {
        url: '/images/gallery/collabspace/document-preview.jpg',
        tnUrl: '/images/gallery/collabspace/document-preview_tn.png',
        caption: 'Collabspace - Document Preview with OCR',
      },
      {
        url: '/images/gallery/collabspace/aggregate-designer.png',
        tnUrl: '/images/gallery/collabspace/aggregate-designer_tn.png',
        caption: 'Collabspace - Aggregate Schema Designer',
      },
      {
        url: '/images/gallery/collabspace/search-designer.jpg',
        tnUrl: '/images/gallery/collabspace/search-designer_tn.png',
        caption: 'Collabspace - Advanced Search Builder',
      },
      {
        url: '/images/gallery/collabspace/fileplan.jpg',
        tnUrl: '/images/gallery/collabspace/fileplan_tn.png',
        caption: 'Collabspace - File Plan and Compliance Policy',
      },
      {
        url: '/images/gallery/collabspace/physicallibrary.jpg',
        tnUrl: '/images/gallery/collabspace/physicallibrary_tn.png',
        caption: 'Collabspace - Physical Records Library',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 3: Collabmail
  {
    id: 'collabmail',
    title: 'Collabware - Collabmail',
    desc:
      '<p>Collabmail is a Microsoft Outlook add-in that integrates SharePoint directly into Outlook, providing drag-and-drop functionality for filing emails and attachments to SharePoint without switching applications. It supports SharePoint Server and SharePoint Online, allowing users to access libraries, view content, folders and metadata from their inbox.</p>' +
      '<p>Users can drag and drop emails, attachments, or both to SharePoint in bulk, and can also add SharePoint content to emails as attachments or links. Collabmail ensures compliance by prompting users to provide required metadata when filing content, a feature unavailable in standard Outlook, with bulk editing capabilities to reduce repetitive data entry.</p>' +
      '<p>Additional features include SharePoint file search from Outlook, automatic email metadata capture, and a favorites list for quick library access.</p>',
    circa: 'Summer 2016 - Present',
    tags: ['Outlook', 'SharePoint Server', 'SharePoint Online', 'ASP.Net', 'C#', 'WPF', 'XSLT'],
    images: [
      {
        url: '/images/gallery/collabmail/attachment-add.png',
        tnUrl: '/images/gallery/collabmail/attachment-add_tn.png',
        caption: 'Collabmail - Add Attachments or Shared Links from SharePoint',
      },
      {
        url: '/images/gallery/collabmail/drag-and-drop.png',
        tnUrl: '/images/gallery/collabmail/drag-and-drop_tn.png',
        caption: 'Collabmail - Drag-and-drop Documents from Windows into SharePoint',
      },
      {
        url: '/images/gallery/collabmail/edit-metadata2.png',
        tnUrl: '/images/gallery/collabmail/edit-metadata2_tn.png',
        caption: 'Collabmail - Update SharePoint content metadata right within Outlook',
      },
      {
        url: '/images/gallery/collabmail/search.png',
        tnUrl: '/images/gallery/collabmail/search_tn.png',
        caption: 'Collabmail - Navigate and Search for Sharepoint content within Outlook',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 4: Collabware CLM
  {
    id: 'collabwareCLM',
    title: 'Collabware - Content Lifecycle Management (CLM)',
    desc:
      '<p>Collabware CLM is a DoD 5015.2 certified solution that integrates natively with SharePoint Server, providing automated classification, retention, and disposition of content with centrally configured rules enforced globally across SharePoint.</p>' +
      '<p>The solution includes an Aggregates system for case management, visual lifecycle workflows for complex content behaviors, and a global content query system for advanced metadata searches with grid view sorting and filtering. It features an automatically managed bulk disposition review system with pre-defined or dynamic reviewer rules.</p>' +
      '<p>CLM manages physical, email, and electronic records with integrated case management, workflows, and search capabilities to ensure regulatory and legal compliance. The solution uses a no-code drag-and-drop experience requiring no new infrastructure while remaining transparent to users.</p>',
    circa: 'Summer 2011 - Present',
    tags: ['SharePoint Server', 'SQL Server', 'ASP.Net', 'C#', 'Dojo Toolkit', 'JointJS+', 'ASP.Net AJAX', 'XSLT'],
    images: [
      {
        url: '/images/gallery/clm/library.jpg',
        tnUrl: '/images/gallery/clm/library_tn.jpg',
        caption: 'CLM - Physical Records Library',
      },
      {
        url: '/images/gallery/clm/fileplan.jpg',
        tnUrl: '/images/gallery/clm/fileplan_tn.jpg',
        caption: 'CLM - Record Categories Management',
      },
      {
        url: '/images/gallery/clm/approvals.jpg',
        tnUrl: '/images/gallery/clm/approvals_tn.jpg',
        caption: 'CLM - Disposition Approval List',
      },
      {
        url: '/images/gallery/clm/i18n.jpg',
        tnUrl: '/images/gallery/clm/i18n_tn.jpg',
        caption: 'CLM - Multilingual Text Input',
      },
      {
        url: '/images/gallery/clm/details.jpg',
        tnUrl: '/images/gallery/clm/details_tn.jpg',
        caption: 'CLM - Lifecycle Details Dialog',
      },
      {
        url: '/images/gallery/clm/storyboard.jpg',
        tnUrl: '/images/gallery/clm/storyboard_tn.jpg',
        caption: 'CLM - Storyboarding',
      },
      {
        url: '/images/gallery/clm/sketch.jpg',
        tnUrl: '/images/gallery/clm/sketch_tn.jpg',
        caption: 'CLM - Sketches for Mobile UI',
      },
      {
        url: '/images/gallery/clm/userstory1.jpg',
        tnUrl: '/images/gallery/clm/userstory1_tn.jpg',
        caption: 'CLM - User Stories',
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
    title: 'Vancity - Insite',
    desc:
      '<p>Insite is the employee portal for Vancity, Canada\'s largest credit union. The portal is designed to engage employees, improve their business acumen and provide easy access to information on products and services to help them better serve members.</p>' +
      '<p>Content is aggregated and surfaced by topic, giving employees that have direct contact with members quick access to the information they need most frequently. This information is provided in the same friendly, accessible and conversational tone that staff use during their member interactions.</p>' +
      '<p>Insite was a finalist for the 2011 Microsoft Partner Network IMPACT Awards Portals and Collaboration category. Insite also received an honourable mention from the Intranet Innovation Awards for its Search Find-o-meter.</p>',
    circa: 'Fall 2010',
    tags: ['SharePoint 2010', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    images: [
      {
        url: '/images/gallery/vcInsite/home.jpg',
        tnUrl: '/images/gallery/vcInsite/home_tn.jpg',
        caption: 'Insite - Home Page',
      },
      {
        url: '/images/gallery/vcInsite/rates.jpg',
        tnUrl: '/images/gallery/vcInsite/rates_tn.jpg',
        caption: 'Insite - Serving Members Mock-up',
      },
      {
        url: '/images/gallery/vcInsite/search.jpg',
        tnUrl: '/images/gallery/vcInsite/search_tn.jpg',
        caption: 'Insite - Search Results',
      },
      {
        url: '/images/gallery/vcInsite/mysite.jpg',
        tnUrl: '/images/gallery/vcInsite/mysite_tn.jpg',
        caption: 'Insite - Employee Profile',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 6: Servus Credit Union Cafe
  {
    id: 'servusCafe',
    title: 'Servus Credit Union - cafe',
    desc:
      '<p><em>cafe</em> is a crowdsourcing solution designed to empower employees to engage in open dialogue aimed at improving the organization and establishing a sense of community across Servus. Employees are given the opportunity to anonymously pose questions of interest and others can rate and respond to these questions.</p>' +
      '<p><em>cafe</em> also allows the executive team to respond to the top ideas and move appropriate items into a separate notes area. The executive leadership team can communicate on the status of each noted idea and employees can continue to comment on these items, fostering increased collaboration between the executive leadership team and the organization\'s employees.</p>' +
      '<p>Habanero Consulting Group was awarded Portals and Collaboration Solution of the Year at the 2010 Microsoft Partner Network IMPACT Awards for the work on <em>cafe</em>.</p>',
    circa: 'Spring 2010',
    tags: ['SharePoint 2010', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    images: [
      {
        url: '/images/gallery/servusCafe/posts.jpg',
        tnUrl: '/images/gallery/servusCafe/posts_tn.jpg',
        caption: 'cafe - Posts Page Mock-up',
      },
      {
        url: '/images/gallery/servusCafe/create.jpg',
        tnUrl: '/images/gallery/servusCafe/create_tn.jpg',
        caption: 'cafe - New Post Dialog Mock-up',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 7: Devon Energy Strata
  {
    id: 'devon',
    title: 'Devon Energy - Strata',
    desc:
      '<p>In the summer of 2009, Devon Energy updated their employee portal from flat HTML files and a collection of different web applications to a unified SharePoint 2007 platform. One of the project goals was for Habanero to ramp up Devon\'s internal development team on SharePoint development so that they would be able to further develop the portal on their own after the initial launch.</p>' +
      '<p>Over the course of six months the blended team worked across three different time zones. Habanero developers in Vancouver were paired with Devon developers, who were located in Oklahoma City, Houston and Calgary. I personally worked with two Devon developers and trained them on topics such as SharePoint development best practices, branding SharePoint, jQuery and advanced HTML/CSS techniques.</p>',
    circa: 'Summer/Fall 2009',
    tags: ['SharePoint 2007', 'ASP.Net', 'C#', 'jQuery', 'XSLT'],
    images: [
      {
        url: '/images/gallery/devon/home.jpg',
        tnUrl: '/images/gallery/devon/home_tn.jpg',
        caption: 'Strata - Home Page Mock-up',
      },
      {
        url: '/images/gallery/devon/tools.jpg',
        tnUrl: '/images/gallery/devon/tools_tn.jpg',
        caption: 'Strata - Tools and Reports Mock-up',
      },
      {
        url: '/images/gallery/devon/teamsite.jpg',
        tnUrl: '/images/gallery/devon/teamsite_tn.jpg',
        caption: 'Strata - Collaboration Team Site Mock-up',
      },
      {
        url: '/images/gallery/devon/profile.jpg',
        tnUrl: '/images/gallery/devon/profile_tn.jpg',
        caption: 'Strata - User Profile Mock-up',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 8: Other SharePoint Projects
  {
    id: 'spMisc',
    title: 'Other SharePoint 2007 and 2010 Projects',
    desc: '<p>These are screen shots and/or mock-ups for additional SharePoint 2007 and 2010 projects that I was involved with.</p>',
    circa: '2006 - 2012',
    tags: ['SharePoint 2010', 'SharePoint 2007', 'ASP.Net', 'C#', 'jQuery', 'ASP.Net AJAX', 'Telerik RadControls', 'XSLT'],
    images: [
      {
        url: '/images/gallery/spMisc/collabware.jpg',
        tnUrl: '/images/gallery/spMisc/collabware_tn.jpg',
        caption: 'Collabware - External Website - Summer 2010',
      },
      {
        url: '/images/gallery/spMisc/fortisbc.jpg',
        tnUrl: '/images/gallery/spMisc/fortisbc_tn.jpg',
        caption: 'FortisBC - External Website - Winter 2010',
      },
      {
        url: '/images/gallery/spMisc/bchydro.jpg',
        tnUrl: '/images/gallery/spMisc/bchydro_tn.jpg',
        caption: 'BC Hydro - Energy Managers Extranet - Winter 2009',
      },
      {
        url: '/images/gallery/spMisc/capp.jpg',
        tnUrl: '/images/gallery/spMisc/capp_tn.jpg',
        caption: 'Canadian Association of Petroleum Producers - External Website - Summer 2008',
      },
      {
        url: '/images/gallery/spMisc/calgary.jpg',
        tnUrl: '/images/gallery/spMisc/calgary_tn.jpg',
        caption: 'City of Calgary - Employee Portal - Spring 2008',
      },
      {
        url: '/images/gallery/spMisc/goldcorp.jpg',
        tnUrl: '/images/gallery/spMisc/goldcorp_tn.jpg',
        caption: 'GoldCorp - Company Intranet - Fall 2007',
      },
      {
        url: '/images/gallery/spMisc/pdnet.jpg',
        tnUrl: '/images/gallery/spMisc/pdnet_tn.jpg',
        caption: 'Certified General Accountants of Canada - PDNet - Fall 2007',
      },
    ],
    videos: [],
    altGrid: true,
  },

  // Project 9: Habanero External Website
  {
    id: 'habExternal',
    title: 'Habanero Consulting Group - External Website',
    desc:
      '<p>The Habanero external website was a showcase for Habanero\'s experience and knowledge on SiteFinity customization.</p>' +
      '<p>An interesting user interface concept was the use of modals to spotlight and navigate related information based on author-defined scope without the user losing their original context.</p>',
    circa: 'Winter 2008',
    tags: ['SiteFinity', 'ASP.Net', 'C#', 'jQuery'],
    images: [
      {
        url: '/images/gallery/habExternal/home.jpg',
        tnUrl: '/images/gallery/habExternal/home_tn.jpg',
        caption: 'HabaneroConsulting.com - Home Page',
      },
      {
        url: '/images/gallery/habExternal/projects.jpg',
        tnUrl: '/images/gallery/habExternal/projects_tn.jpg',
        caption: 'HabaneroConsulting.com - Projects Gallery',
      },
      {
        url: '/images/gallery/habExternal/project.jpg',
        tnUrl: '/images/gallery/habExternal/project_tn.jpg',
        caption: 'HabaneroConsulting.com - Project Modal',
      },
      {
        url: '/images/gallery/habExternal/profile.jpg',
        tnUrl: '/images/gallery/habExternal/profile_tn.jpg',
        caption: 'HabaneroConsulting.com - Employee Profile Modal',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 10: SE Cornerstone Financial Reporting
  {
    id: 'cornerstone',
    title: 'SE Cornerstone Public School Division - Financial Reporting System',
    desc:
      '<p>Habanero developed a streamlined and easy-to-use financial reporting solution for the SE Cornerstone Public School District. A custom web interface with multi-step wizards replaced the complex Dynamics single page input forms for the most often used actions.</p>' +
      '<p>The solution was a finalist for the <a target="_blank" href="https://mspartner.microsoft.com/en/ca/Pages/impact-award-finalists-2009.aspx">2009 Microsoft Partner Network IMPACT Awards</a>\' Finance (ERP) category.</p>',
    circa: 'Fall 2008',
    tags: ['Dynamics ERP', 'ASP.Net', 'C#', 'ASP.Net AJAX', 'Telerik RadControls'],
    images: [
      {
        url: '/images/gallery/cornerstone/home.jpg',
        tnUrl: '/images/gallery/cornerstone/home_tn.jpg',
        caption: 'Budget System - Home Page',
      },
      {
        url: '/images/gallery/cornerstone/step1.jpg',
        tnUrl: '/images/gallery/cornerstone/step1_tn.jpg',
        caption: 'Budget System - New Purchase Order, Step 1',
      },
      {
        url: '/images/gallery/cornerstone/step2.jpg',
        tnUrl: '/images/gallery/cornerstone/step2_tn.jpg',
        caption: 'Budget System - New Purchase Order, Step 2',
      },
      {
        url: '/images/gallery/cornerstone/deposit.jpg',
        tnUrl: '/images/gallery/cornerstone/deposit_tn.jpg',
        caption: 'Budget System - Deposit',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 11: Microsoft Contoso Riders
  {
    id: 'contosoriders',
    title: 'Microsoft - Contoso Riders Quick App',
    desc:
      '<p>Microsoft approached Habanero to create a membership application that provided a fresh user experience and demonstrated the use of Windows Live services for the development community as part of the <a target="_blank" href="http://wlquickapps.codeplex.com/wikipage?title=Contoso%20Riders&referringTitle=Home&ProjectName=wlquickapps">Windows Live Quick Applications</a> project on CodePlex.</p>' +
      '<p>The result was Contoso Riders, which leveraged the following Windows Live services:</p>' +
      '<div class="row"><div class="six columns"><ul class="disc"><li>Windows Live ID Web Authentication</li><li>Windows Live Presence</li><li>Windows Live Messenger IM Control</li><li>Windows Live Spaces</li></ul></div><div class="six columns"><ul class="disc"><li>Silverlight Streaming</li><li>Bing Maps</li><li>Virtual Earth</li></ul></div></div>' +
      '<p>I was also asked to present Contoso Riders at Microsoft\'s EnergizeIT conference.</p>',
    circa: 'Spring 2008',
    tags: ['Windows Live Services', 'Silverlight', 'Bing Maps', 'ASP.Net', 'C#', 'ASP.Net AJAX'],
    images: [
      {
        url: '/images/gallery/contosoriders/home.jpg',
        tnUrl: '/images/gallery/contosoriders/home_tn.jpg',
        caption: 'Contoso Riders - Home Page Mock-up',
      },
      {
        url: '/images/gallery/contosoriders/expo.jpg',
        tnUrl: '/images/gallery/contosoriders/expo_tn.jpg',
        caption: 'Contoso Riders - Events Page Mock-up',
      },
      {
        url: '/images/gallery/contosoriders/energizeit.jpg',
        tnUrl: '/images/gallery/contosoriders/energizeit_tn.jpg',
        caption: 'Contoso Riders - Speaking at EnergizeIT',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 12: Boston Pizza Franchisee Dashboard
  {
    id: 'bpDashboard',
    title: 'Boston Pizza - Franchisee Dashboard',
    desc:
      '<p>The Franchisee Dashboard was an interactive display situated in the lobby of Boston Pizza\'s Richmond headquarters. Visitors could interact with the display and could view information for any of the Boston Pizza or Boston\'s Gourmet Pizza locations throughout North America.</p>' +
      '<p>The Dashboard is an example a projected that was not targeted at desktop browsers and used 10 foot and game user interface design principles. The original Franchisee Dashboard was controlled using a Nintendo Wii-mote, with subsequent versions using a gyroscopic mouse. Eventually a browser-based port was also developed that was accessible through Boston Pizza\'s intranet.</p>',
    circa: 'Winter 2006',
    tags: ['Adobe Flex', 'ActionScript 3.0', 'Nintendo Wii-mote', '10 Foot UI Design'],
    images: [
      {
        url: '/images/gallery/bpDashboard/home.jpg',
        tnUrl: '/images/gallery/bpDashboard/home_tn.jpg',
        caption: 'Franchisee Dashboard - Home Screen',
      },
      {
        url: '/images/gallery/bpDashboard/map.jpg',
        tnUrl: '/images/gallery/bpDashboard/map_tn.jpg',
        caption: 'Franchisee Dashboard - Map View',
      },
      {
        url: '/images/gallery/bpDashboard/list.jpg',
        tnUrl: '/images/gallery/bpDashboard/list_tn.jpg',
        caption: 'Franchisee Dashboard - List View',
      },
      {
        url: '/images/gallery/bpDashboard/store.jpg',
        tnUrl: '/images/gallery/bpDashboard/store_tn.jpg',
        caption: 'Franchisee Dashboard - Store Information',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 13: Grey Holiday Puppet
  {
    id: 'holidayPuppet',
    title: 'Grey Holiday Puppet',
    desc:
      '<p>The Grey Holiday Puppet was a holiday greeting to Grey clients and friends. What began as a last minute project with extremely limited resources, time and budget turned into a viral hit which was featured on del.icio.us and MetaFilter and garnering visitors from as far off as France, Sweden and Russia.' +
      '<p>The Holiday Puppet won numerous creative and design accolades including the 2005 Lotus Award for Best Self Promotion.</p>' +
      '<p class="needs-flash">You can <a target="_blank" href="http://holidaypuppet.singchan.com" title="View the Grey Holiday Puppet site.">view the project here</a>. Just a note, the link to the PDF is broken, but you can <a target="_blank" href="http://holidaypuppet.singchan.com/greyholidaypuppet.pdf">download the puppet here</a>. Enjoy!</p>',
    circa: 'Winter 2005',
    tags: ['Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/holidaypuppet/hockey.jpg',
        tnUrl: '/images/gallery/holidaypuppet/hockey_tn.jpg',
        caption: 'Grey Holiday Puppet - Keep the Biscuits Out!',
      },
      {
        url: '/images/gallery/holidaypuppet/graduate.jpg',
        tnUrl: '/images/gallery/holidaypuppet/graduate_tn.jpg',
        caption: 'Grey Holiday Puppet - Hello, Mrs. Robinson.',
      },
      {
        url: '/images/gallery/holidaypuppet/fingers.jpg',
        tnUrl: '/images/gallery/holidaypuppet/fingers_tn.jpg',
        caption: 'Grey Holiday Puppet - Fat Fingers',
      },
      {
        url: '/images/gallery/holidaypuppet/puppet.jpg',
        tnUrl: '/images/gallery/holidaypuppet/puppet_tn.jpg',
        caption: 'Grey Holiday Puppet - The Nutcracker Cut-out',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 14: Quadrant Homes
  {
    id: 'quadrant',
    title: 'Quadrant Homes - External Website',
    desc:
      '<p>Quadrant Homes, the largest home builder in Washington state, had a simple assignment: make QuadrantHomes.com the best homebuilder web site in the United States. The redesign included interactive Flash-based tools allowing new prospects and purchasers to plan their new home.</p>' +
      '<p>The site has been met with praise from Quadrant employees, customers and realtor partners alike, resulting in increased interest list sign-ups, intent to purchase and sales numbers.</p>',
    circa: 'Fall 2005',
    tags: ['PHP', 'PostgreSQL', 'Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/quadrant/home.jpg',
        tnUrl: '/images/gallery/quadrant/home_tn.jpg',
        caption: 'Quadrant Homes - Home Page Mock-up',
      },
      {
        url: '/images/gallery/quadrant/build1.jpg',
        tnUrl: '/images/gallery/quadrant/build1_tn.jpg',
        caption: 'Quadrant Homes - Build Your Home App',
      },
      {
        url: '/images/gallery/quadrant/build2.jpg',
        tnUrl: '/images/gallery/quadrant/build1_tn.jpg',
        caption: 'Quadrant Homes - Build Your Home App',
      },
      {
        url: '/images/gallery/quadrant/community.jpg',
        tnUrl: '/images/gallery/quadrant/community_tn.jpg',
        caption: 'Quadrant Homes - Community Page',
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
    title: 'Thatch Cay',
    desc:
      '<p>Only half a mile off the northeastern coastline of St. Thomas, Thatch Cay is one of the last undeveloped, privately-held U.S. Virgin Islands.</p>' +
      '<p>I was originally contracted by <em>dsire</em> and Loca Lola Design Team to consult and assist in the development of this Flash-based website. When the original Flash developer left the project on short notice, I was able to take over development and successfully complete the site on schedule and meet all of the project goals.</p>' +
      '<p class="needs-flash">You can <a target="_blank" href="http://thatchcay.singchan.com" title="View the Thatch Cay flash site.">view the project here.</a></p>',
    circa: 'Spring 2004',
    tags: ['Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/thatchcay/history.jpg',
        tnUrl: '/images/gallery/thatchcay/history_tn.jpg',
        caption: 'Thatch Cay - History',
      },
      {
        url: '/images/gallery/thatchcay/vision.jpg',
        tnUrl: '/images/gallery/thatchcay/vision_tn.jpg',
        caption: 'Thatch Cay - Vision',
      },
      {
        url: '/images/gallery/thatchcay/possibilities.jpg',
        tnUrl: '/images/gallery/thatchcay/possibilities_tn.jpg',
        caption: 'Thatch Cay - Possibilities',
      },
      {
        url: '/images/gallery/thatchcay/location.jpg',
        tnUrl: '/images/gallery/thatchcay/location_tn.jpg',
        caption: 'Thatch Cay - Location',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 16: Granville Island
  {
    id: 'gi',
    title: 'Granville Island - External Website',
    desc:
      '<p>Granville Island is one of Vancouver\'s world renowned destination experiences.</p>' +
      '<p>GranvilleIsland.com was developed on top of Grey Vancouver\'s grASP CMS and included both HTML and, for-the-time, high-bandwidth Flash interfaces. The Flash web site included many discoverable interactive elements, videos and 360&#176; panoramas.</p>' +
      '<p class="needs-flash">You can <a target="_blank" href="http://gi.singchan.com" title="View the Granville Island Flash asssets.">view some of the Flash elements here</a>. Please note the CMS is not implemented in this environment and the navigation and descriptive content will not be populated.</p>',
    circa: 'Summer 2002',
    tags: ['grASP CMS', 'ASP Classic', 'SQL Server', 'XSLT', 'Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/gi/home.jpg',
        tnUrl: '/images/gallery/gi/home_tn.jpg',
        caption: 'Granville Island - HTML Home Page',
      },
      {
        url: '/images/gallery/gi/flash.jpg',
        tnUrl: '/images/gallery/gi/flash_tn.jpg',
        caption: 'Granville Island - Flash Home Page',
      },
      {
        url: '/images/gallery/gi/dining.jpg',
        tnUrl: '/images/gallery/gi/dining_tn.jpg',
        caption: 'Granville Island - Eat and Drink',
      },
      {
        url: '/images/gallery/gi/kids.jpg',
        tnUrl: '/images/gallery/gi/kids_tn.jpg',
        caption: 'Granville Island - A Place for Kids',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 17: Rick Smith Portfolio
  {
    id: 'ricksmith',
    title: 'Rick Smith - Portfolio Site',
    desc:
      '<p>Rick Smith\'s portfolio site is an example of a website for artists and photographers using a lightweight CMS which I developed. At the time, there were no inexpensive ASP and ASP.Net hosting solutions, so I developed the solution with PHP.</p>' +
      '<p>Due to the smaller-scale of these portfolio sites, I was able to experiment with effects and transitions using HTML and JavaScript instead of Flash.</p>' +
      '<p>Surpised that the DOM effects still work over a decade later, I\'ve decided to put it back up <a target="_blank" href="http://ricksmith.singchan.com" title="View Rick Smith\'s portfolio site.">for your viewing pleasure here</a>.</p>',
    circa: 'Spring 2002',
    tags: ['PHP', 'DynObjects'],
    images: [
      {
        url: '/images/gallery/ricksmith/home.jpg',
        tnUrl: '/images/gallery/ricksmith/home_tn.jpg',
        caption: 'Rick Smith - Home Page',
      },
      {
        url: '/images/gallery/ricksmith/about.jpg',
        tnUrl: '/images/gallery/ricksmith/about_tn.jpg',
        caption: 'Rick Smith - About',
      },
      {
        url: '/images/gallery/ricksmith/work.jpg',
        tnUrl: '/images/gallery/ricksmith/work_tn.jpg',
        caption: 'Rick Smith - Working My Way Back',
      },
      {
        url: '/images/gallery/ricksmith/shaftebury.jpg',
        tnUrl: '/images/gallery/ricksmith/shaftebury_tn.jpg',
        caption: 'Rick Smith - Shaftebury Beer Web Site',
      },
    ],
    videos: [],
    altGrid: false,
  },

  // Project 18: grASP CMS (oldest)
  {
    id: 'grasp',
    title: 'Grey Advertising - grASP Content Management System',
    desc: '<p>I co-developed grASP, a modular and extensible content management system allowing Grey Advertising Vancouver to quickly produce and deploy engaging and dynamic web solutions.</p>',
    circa: '2001 - 2006',
    tags: ['ASP Classic', 'SQL Server', 'Server JScript', 'XSLT', 'Adobe Flash', 'ActionScript 2.0'],
    images: [
      {
        url: '/images/gallery/grASP/ldb.jpg',
        tnUrl: '/images/gallery/grASP/ldb_tn.jpg',
        caption: 'BC Liquor Distribution Branch - 2000 to 2006',
      },
      {
        url: '/images/gallery/grASP/sisu.jpg',
        tnUrl: '/images/gallery/grASP/sisu_tn.jpg',
        caption: 'SISU Vitamins and Supplements - Spring 2004',
      },
      {
        url: '/images/gallery/grASP/inhaus.jpg',
        tnUrl: '/images/gallery/grASP/inhaus_tn.jpg',
        caption: 'Inhaus Flooring - Summer 2003',
      },
      {
        url: '/images/gallery/grASP/ledcor.jpg',
        tnUrl: '/images/gallery/grASP/ledcor_tn.jpg',
        caption: 'Ledcor Group of Companies - Spring 2003',
      },
      {
        url: '/images/gallery/grASP/adt.jpg',
        tnUrl: '/images/gallery/grASP/adt_tn.jpg',
        caption: 'ADT Security Canada - Winter 2002',
      },
      {
        url: '/images/gallery/gi/dining.jpg',
        tnUrl: '/images/gallery/gi/dining_tn.jpg',
        caption: 'Granville Island - Summer 2002',
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
