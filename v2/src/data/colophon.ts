/**
 * Colophon page data - information about the site creator, technologies, and design.
 *
 * This data is used by the /colophon page to display:
 * - About section with bio and current role
 * - Technologies used in V1 and V2 of the portfolio
 * - Design philosophy including color palette and typography
 * - The story of Buta, the portfolio mascot
 */

import type { ColophonData } from '../types/colophon';

/**
 * Complete colophon page content.
 * Content migrated from V1 colophon.html and updated for V2.
 */
export const colophonData: ColophonData = {
  pageTitle: "Colophon | Sing Chan's Portfolio",
  pageDescription:
    "About Sing Chan, the technologies behind this portfolio site, design philosophy, and the story of Buta the mascot.",

  about: {
    name: 'Sing Chan',
    currentRole: 'VP of Product',
    company: 'Collabware Systems',
    bio: 'A creative technologist with 25+ years of experience bridging design and development.',
    deck: [
      'Sing Chan is currently the VP of Product at Collabware Systems.',
      "Sing is responsible for working with customers and stakeholders to determine the product and feature roadmaps for Collabware's Collabspace solution and manages the Product and Quality Assurance teams.",
      "He is also responsible for the interaction design, user experience, and front-end development frameworks for Collabware's software offerings.",
    ],
    responsibilities: [
      'Working with customers and stakeholders to determine product and feature roadmaps for Collabware\'s Collabspace solution',
      'Managing the Product and Quality Assurance teams',
      'Responsible for interaction design, user experience, and front-end development frameworks for Collabware\'s software offerings',
    ],
    links: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/singchan/',
        icon: 'linkedin',
      },
      {
        label: 'GitHub',
        url: 'https://github.com/singchan',
        icon: 'github',
      },
    ],
  },

  technologies: {
    intro:
      'This portfolio site has been rebuilt from the ground up. Here\'s what powers the current version:',

    v2Categories: [
      {
        label: 'Framework & Runtime',
        technologies: [
          {
            name: 'Next.js 16',
            description:
              'React framework with App Router for server-side rendering, static generation, and optimized performance.',
            url: 'https://nextjs.org/',
          },
          {
            name: 'React 19',
            description:
              'UI library for building component-based interfaces with hooks and concurrent features.',
            url: 'https://react.dev/',
          },
          {
            name: 'TypeScript',
            description:
              'Static type checking for improved developer experience and code reliability.',
            url: 'https://www.typescriptlang.org/',
          },
        ],
      },
      {
        label: 'UI & Styling',
        technologies: [
          {
            name: 'Material UI (MUI)',
            description:
              'Comprehensive React component library implementing Material Design with customizable theming.',
            url: 'https://mui.com/',
          },
          {
            name: 'Emotion',
            description:
              'CSS-in-JS library for styled components and dynamic styling.',
            url: 'https://emotion.sh/',
          },
        ],
      },
      {
        label: 'Development Tools',
        technologies: [
          {
            name: 'Claude Code',
            description:
              'AI-powered coding assistant for pair programming, code review, and documentation.',
            url: 'https://claude.ai/',
          },
          {
            name: 'ESLint',
            description:
              'JavaScript/TypeScript linter for code quality and consistency.',
            url: 'https://eslint.org/',
          },
          {
            name: 'Prettier',
            description: 'Opinionated code formatter for consistent style.',
            url: 'https://prettier.io/',
          },
        ],
      },
      {
        label: 'Testing',
        technologies: [
          {
            name: 'Vitest',
            description:
              'Fast, Vite-native unit test framework with excellent TypeScript support.',
            url: 'https://vitest.dev/',
          },
          {
            name: 'React Testing Library',
            description:
              'Testing utilities focused on user behavior rather than implementation details.',
            url: 'https://testing-library.com/react',
          },
        ],
      },
    ],

    v1Technologies: [
      {
        name: 'Gumby Framework',
        description:
          'Responsive grid layout, Entypo icon set, and base UI element styles.',
        url: 'http://gumbyframework.com',
      },
      {
        name: 'jQuery',
        description:
          'Asynchronously loading portfolio projects, DOM manipulation, and UI effects.',
        url: 'https://jquery.com/',
      },
      {
        name: 'PHP',
        description: 'Simple web service to serve up the portfolio projects.',
        url: 'https://www.php.net/',
      },
      {
        name: 'Swipebox',
        description: 'jQuery plugin for the project image lightboxes.',
        url: 'https://github.com/brutaldesign/swipebox',
      },
      {
        name: 'SWFObject',
        description:
          'Determined whether to show links to Adobe Flash projects.',
        url: 'https://github.com/swfobject/swfobject',
      },
      {
        name: 'Sass & Compass',
        description:
          'Custom CSS written in SCSS syntax and compiled with Compass.',
        url: 'https://sass-lang.com/',
      },
    ],
  },

  designPhilosophy: {
    intro:
      'The initial design was inspired by classic pork cuts diagrams. I wanted the site to feel like a menu at a butcher shop but eventually moved to a modern feel through the use of flat colours and sans-serif fonts.',

    colors: [
      {
        name: 'Sakura',
        hex: '#FFF0F5',
        description: 'Cherry blossom pink - used as the page background',
      },
      {
        name: 'Duck Egg',
        hex: '#C8E6C9',
        description: 'Pastel green - used for secondary elements and tags',
      },
      {
        name: 'Sky Blue',
        hex: '#E0EDF8',
        description: 'Primary accent color for interactive elements',
      },
      {
        name: 'Graphite',
        hex: '#2C2C2C',
        description: 'Dark charcoal for primary text',
      },
      {
        name: 'Sage',
        hex: '#8BA888',
        description: 'Muted green for the footer background',
      },
      {
        name: 'Maroon',
        hex: '#8B1538',
        description: 'Deep red for headings and call-to-action elements',
      },
    ],

    colorDescription:
      'The colour palette is comprised of some of my favourite pastels—sakura (cherry blossom), duck egg, and sky blue — graphite and maroon are included as background colours for instances of white text.',

    typographyIntro:
      'For typography, I use Open Source web fonts available through Google Fonts:',

    typography: [
      {
        name: 'Open Sans',
        usage: 'Body text and UI elements',
        sample: 'The quick brown fox jumps over the lazy dog.',
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        url: 'https://fonts.google.com/specimen/Open+Sans',
      },
      {
        name: 'Oswald',
        usage: "Headings - clean with weight, feels like a butcher's block",
        sample: 'CHOICE CUTS',
        fontFamily: '"Oswald", sans-serif',
        fontWeight: 700,
        url: 'https://fonts.google.com/specimen/Oswald',
      },
      {
        name: 'Gochi Hand',
        usage: "Buta's thought bubble - the Comic Sans of this portfolio!",
        sample: 'Oink oink!',
        fontFamily: '"Gochi Hand", cursive',
        fontWeight: 400,
        url: 'https://fonts.google.com/specimen/Gochi+Hand',
      },
    ],
  },

  butaStory: {
    paragraphs: [
      'The well-dressed Buta (pig in Japanese) caricature found in the footer was created for me by <a href="http://christineibbitson.blogs.com/" target="_blank" rel="noopener noreferrer">Christine Ibbitson</a>. Buta is a shameless rip-off of Yoshi Boo, or Boo-chan, a now retired mascot for <a href="https://www.yoshinoya.com" target="_blank" rel="noopener noreferrer">Yoshinoya</a>, a famous chain of fast food restaurants in Japan (and other parts of the world).',
      'In early 2004, Yoshinoya introduced a pork-centric menu due to the rising cost of beef in Japan when U.S. beef imports were banned in December 2003 after a case of bovine spongiform encephalopathy was reported in the United States. I take it the marketing folk at Yoshinoya decided the best way to promote their new pork-based menu was to create a new mascot.',
      'When I went to Japan in March 2005, Yoshinoya was celebrating the 1-year anniversary of the introduction of their pork menu. Boo-chan was all over their in-store merchandising and there was a funny TV commercial of him dressed in a tuxedo giving a press conference. Boo-chan was an easy choice to become my new avatar.',
    ],
    mainImage: '/images/buta/buta@2x.png',
    mainImageAlt: 'Buta, a pig mascot wearing a business suit',
    versusImage: '/images/buta/boo-vs-bu@2x.png',
    versusImageAlt: 'Boo vs Bu - comparing the original Yoshinoya mascot with Buta',
  },
};

/**
 * Get the complete colophon data.
 *
 * @returns The full colophon page content
 */
export function getColophonData(): ColophonData {
  return colophonData;
}
