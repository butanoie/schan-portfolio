/**
 * Colophon page data - information about the site, technologies, and design.
 *
 * This data is used by the /colophon page to display:
 * - About section with page deck intro (image, heading, paragraphs)
 * - Technologies used in V1 and V2 of the portfolio
 * - Design philosophy including color palette and typography
 * - The story of Buta, the portfolio mascot
 *
 * All user-facing strings are localized via i18n from en/colophon.json and fr/colophon.json.
 * Use getLocalizedColophonData(t) to retrieve translated content.
 */

import type { ColophonData } from '../types/colophon';
import type { TranslationOptions } from '../hooks/useI18n';
import { BRAND_COLORS } from '../constants';

/**
 * Complete colophon page content.
 * Content migrated from V1 colophon.html and updated for V2.
 */
export const colophonData: ColophonData = {
  pageTitle: "Colophon | Sing Chan's Portfolio",
  pageDescription:
    "About Sing Chan, the technologies behind this portfolio site, design philosophy, and the story of Buta the mascot.",

  pageDeck: {
    imageUrl: '/images/choice_cuts@2x.png',
    imageAlt: 'Choice Cuts - pork cuts diagram logo',
    headingId: 'colophon-heading',
    heading: 'Colophon',
    paragraphs: [
      'Sing Chan is currently the VP of Product at Collabware Systems.',
      "Sing is responsible for working with customers and stakeholders to determine the product and feature roadmaps for Collabware's Collabspace solution and manages the Product and Quality Assurance teams.",
      "He is also responsible for the interaction design, user experience, and front-end development frameworks for Collabware's software offerings.",
    ],
  },

  technologies: {
    intro:
      'This portfolio site has been rebuilt from the ground up. Here\'s what powers the current version:',

    categories: [
      {
        label: 'Framework & Runtime',
        items: [
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
        items: [
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
        items: [
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
        items: [
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

    v1: {
      heading: 'Original V1 Technologies (Historical)',
      description: 'The original portfolio site was built with these technologies:',
      items: [
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
  },

  designPhilosophy: {
    intro:
      'The initial design was inspired by classic pork cuts diagrams. I wanted the site to feel like a menu at a butcher shop but eventually moved to a modern feel through the use of flat colours and sans-serif fonts.',

    colors: [
      {
        name: 'Sakura',
        hex: BRAND_COLORS.sakura,
        description: 'Cherry blossom pink - more inspirational than actual implementation',
      },
      {
        name: 'Duck Egg',
        hex: BRAND_COLORS.duckEgg,
        description: 'Pastel green - used for secondary elements and tags',
      },
      {
        name: 'Sky Blue',
        hex: BRAND_COLORS.skyBlue,
        description: 'Primary accent color for interactive elements',
      },
      {
        name: 'Graphite',
        hex: BRAND_COLORS.graphite,
        description: 'Dark charcoal for primary text',
      },
      {
        name: 'Sage',
        hex: BRAND_COLORS.sage,
        description: 'Muted green for the footer background',
      },
      {
        name: 'Maroon',
        hex: BRAND_COLORS.maroon,
        description: 'Deep red for headings and call-to-action elements',
      },
    ],

    colorDescription:
      'The colour palette is comprised of some of my favourite pastels—sakura (cherry blossom), duck egg, and sky blue — graphite and maroon are included as background colours for instances of white text.',

    typographyIntro:
      'Open source web fonts available through Google Fonts:',

    typography: [
      {
        name: 'Open Sans',
        usage: 'Body text and UI elements',
        sample: 'The quick brown fox jumps over the lazy dog.',
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        sampleFontSize: '1rem',
        url: 'https://fonts.google.com/specimen/Open+Sans',
      },
      {
        name: 'Oswald',
        usage: "Headings - clean with weight, feels like a butcher's block",
        sample: 'CHOICE CUTS',
        fontFamily: '"Oswald", sans-serif',
        fontWeight: 700,
        sampleFontSize: '1.5rem',
        url: 'https://fonts.google.com/specimen/Oswald',
      },
      {
        name: 'Gochi Hand',
        usage: "Buta's thought bubble - the Comic Sans of this portfolio!",
        sample: 'Oink oink!',
        fontFamily: '"Gochi Hand", cursive',
        fontWeight: 400,
        sampleFontSize: '1.25rem',
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

/**
 * Builds localized colophon data by retrieving translated strings from i18n.
 *
 * This function should be called within a component using the useI18n hook
 * to provide translated content for all colophon sections.
 *
 * @param t - i18n translation function from useI18n()
 * @returns Localized colophon data with translated strings
 *
 * @example
 * const { t } = useI18n();
 * const localizedData = getLocalizedColophonData(t);
 */
export function getLocalizedColophonData(
  t: (key: string, options?: TranslationOptions | Record<string, string | number>) => string
): ColophonData {
  return {
    pageTitle: t('colophon.title', { ns: 'pages' }),
    pageDescription: t('colophon.description', { ns: 'pages' }),

    pageDeck: {
      imageUrl: '/images/choice_cuts@2x.png',
      imageAlt: t('colophon.pageDeck.imageAlt', { ns: 'pages' }),
      headingId: 'colophon-heading',
      heading: t('colophon.pageDeck.heading', { ns: 'pages' }),
      paragraphs: [
        t('colophon.pageDeck.paragraphs.0', { ns: 'pages' }),
        t('colophon.pageDeck.paragraphs.1', { ns: 'pages' }),
        t('colophon.pageDeck.paragraphs.2', { ns: 'pages' }),
      ],
    },

    technologies: {
      intro: t('colophon.technologies.intro', { ns: 'pages' }),

      categories: [
        {
          label: t('colophon.technologies.categories.0.label', { ns: 'pages' }),
          items: [
            {
              name: 'Next.js 16',
              description: t('colophon.technologies.categories.0.items.0.description', { ns: 'pages' }),
              url: 'https://nextjs.org/',
            },
            {
              name: 'React 19',
              description: t('colophon.technologies.categories.0.items.1.description', { ns: 'pages' }),
              url: 'https://react.dev/',
            },
            {
              name: 'TypeScript',
              description: t('colophon.technologies.categories.0.items.2.description', { ns: 'pages' }),
              url: 'https://www.typescriptlang.org/',
            },
          ],
        },
        {
          label: t('colophon.technologies.categories.1.label', { ns: 'pages' }),
          items: [
            {
              name: 'Material UI (MUI)',
              description: t('colophon.technologies.categories.1.items.0.description', { ns: 'pages' }),
              url: 'https://mui.com/',
            },
            {
              name: 'Emotion',
              description: t('colophon.technologies.categories.1.items.1.description', { ns: 'pages' }),
              url: 'https://emotion.sh/',
            },
          ],
        },
        {
          label: t('colophon.technologies.categories.2.label', { ns: 'pages' }),
          items: [
            {
              name: 'Claude Code',
              description: t('colophon.technologies.categories.2.items.0.description', { ns: 'pages' }),
              url: 'https://claude.ai/',
            },
            {
              name: 'ESLint',
              description: t('colophon.technologies.categories.2.items.1.description', { ns: 'pages' }),
              url: 'https://eslint.org/',
            },
            {
              name: 'Prettier',
              description: t('colophon.technologies.categories.2.items.2.description', { ns: 'pages' }),
              url: 'https://prettier.io/',
            },
          ],
        },
        {
          label: t('colophon.technologies.categories.3.label', { ns: 'pages' }),
          items: [
            {
              name: 'Vitest',
              description: t('colophon.technologies.categories.3.items.0.description', { ns: 'pages' }),
              url: 'https://vitest.dev/',
            },
            {
              name: 'React Testing Library',
              description: t('colophon.technologies.categories.3.items.1.description', { ns: 'pages' }),
              url: 'https://testing-library.com/react',
            },
          ],
        },
      ],

      v1: {
        heading: t('colophon.technologies.v1.heading', { ns: 'pages' }),
        description: t('colophon.technologies.v1.description', { ns: 'pages' }),
        items: [
          {
            name: 'Gumby Framework',
            description: t('colophon.technologies.v1.items.0.description', { ns: 'pages' }),
            url: 'http://gumbyframework.com',
          },
          {
            name: 'jQuery',
            description: t('colophon.technologies.v1.items.1.description', { ns: 'pages' }),
            url: 'https://jquery.com/',
          },
          {
            name: 'PHP',
            description: t('colophon.technologies.v1.items.2.description', { ns: 'pages' }),
            url: 'https://www.php.net/',
          },
          {
            name: 'Swipebox',
            description: t('colophon.technologies.v1.items.3.description', { ns: 'pages' }),
            url: 'https://github.com/brutaldesign/swipebox',
          },
          {
            name: 'SWFObject',
            description: t('colophon.technologies.v1.items.4.description', { ns: 'pages' }),
            url: 'https://github.com/swfobject/swfobject',
          },
          {
            name: 'Sass & Compass',
            description: t('colophon.technologies.v1.items.5.description', { ns: 'pages' }),
            url: 'https://sass-lang.com/',
          },
        ],
      },
    },

    designPhilosophy: {
      intro: t('colophon.designPhilosophy.intro', { ns: 'pages' }),

      colors: [
        {
          name: t('colophon.designPhilosophy.colors.0.name', { ns: 'pages' }),
          hex: BRAND_COLORS.sakura,
          description: t('colophon.designPhilosophy.colors.0.description', { ns: 'pages' }),
        },
        {
          name: t('colophon.designPhilosophy.colors.1.name', { ns: 'pages' }),
          hex: BRAND_COLORS.duckEgg,
          description: t('colophon.designPhilosophy.colors.1.description', { ns: 'pages' }),
        },
        {
          name: t('colophon.designPhilosophy.colors.2.name', { ns: 'pages' }),
          hex: BRAND_COLORS.skyBlue,
          description: t('colophon.designPhilosophy.colors.2.description', { ns: 'pages' }),
        },
        {
          name: t('colophon.designPhilosophy.colors.3.name', { ns: 'pages' }),
          hex: BRAND_COLORS.graphite,
          description: t('colophon.designPhilosophy.colors.3.description', { ns: 'pages' }),
        },
        {
          name: t('colophon.designPhilosophy.colors.4.name', { ns: 'pages' }),
          hex: BRAND_COLORS.sage,
          description: t('colophon.designPhilosophy.colors.4.description', { ns: 'pages' }),
        },
        {
          name: t('colophon.designPhilosophy.colors.5.name', { ns: 'pages' }),
          hex: BRAND_COLORS.maroon,
          description: t('colophon.designPhilosophy.colors.5.description', { ns: 'pages' }),
        },
      ],

      colorDescription: t('colophon.designPhilosophy.colorDescription', { ns: 'pages' }),

      typographyIntro: t('colophon.designPhilosophy.typographyIntro', { ns: 'pages' }),

      typography: [
        {
          name: 'Open Sans',
          usage: t('colophon.designPhilosophy.typography.0.usage', { ns: 'pages' }),
          sample: t('colophon.designPhilosophy.typography.0.sample', { ns: 'pages' }),
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 400,
          sampleFontSize: '1rem',
          url: 'https://fonts.google.com/specimen/Open+Sans',
        },
        {
          name: 'Oswald',
          usage: t('colophon.designPhilosophy.typography.1.usage', { ns: 'pages' }),
          sample: t('colophon.designPhilosophy.typography.1.sample', { ns: 'pages' }),
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 700,
          sampleFontSize: '1.5rem',
          url: 'https://fonts.google.com/specimen/Oswald',
        },
        {
          name: 'Gochi Hand',
          usage: t('colophon.designPhilosophy.typography.2.usage', { ns: 'pages' }),
          sample: t('colophon.designPhilosophy.typography.2.sample', { ns: 'pages' }),
          fontFamily: '"Gochi Hand", cursive',
          fontWeight: 400,
          sampleFontSize: '1.25rem',
          url: 'https://fonts.google.com/specimen/Gochi+Hand',
        },
      ],
    },

    butaStory: {
      paragraphs: [
        t('colophon.butaStory.paragraphs.0', { ns: 'pages' }),
        t('colophon.butaStory.paragraphs.1', { ns: 'pages' }),
        t('colophon.butaStory.paragraphs.2', { ns: 'pages' }),
      ],
      mainImage: '/images/buta/buta@2x.png',
      mainImageAlt: t('colophon.butaStory.mainImageAlt', { ns: 'pages' }),
      versusImage: '/images/buta/boo-vs-bu@2x.png',
      versusImageAlt: t('colophon.butaStory.versusImageAlt', { ns: 'pages' }),
    },
  };
}
