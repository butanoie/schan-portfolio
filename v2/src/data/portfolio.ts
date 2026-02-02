/**
 * Projects page data - introduction and header content for the projects portfolio.
 *
 * This data is used by the home/projects page to display:
 * - Portfolio creator name
 * - Logo/mascot image
 * - Introductory paragraphs about the projects and experience
 */

import type { ProjectsPageData } from '../types/porfolio';

/**
 * Complete projects page content.
 * Content based on V1 portfolio intro and updated for V2.
 */
export const portfolioData: ProjectsPageData = {
  pageTitle: "Sing Chan's Body of Work",
  pageDescription:
    "On this page you will find select projects that represent my knowledge and experience in the realms of web application development, design, usability and accessibility.",

  pageDeck: {
    imageUrl: "/images/pork_cuts@2x.png",
    imageAlt: "Sing Chan's Body of Work",
    headingId: "portfolio-heading",
    heading: "Sing Chan",
    deck: [
      "On this page you will find select projects that represent my knowledge and experience in the realms of web application development, design, usability and accessibility. I have over 25 years experience in software development where I work with customers, stakeholders, information architects, interaction designers, developers, and quality assurance to create usable and visually engaging solutions.",
      "I was involved in these projects either as the lead User Experience Developer responsible for implementing custom UI functionality, controls and branding, or as the User Experience Architect, responsible for determining development approaches and assisting other team members with their tasks.",
    ],
  },
};
