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
import type { TranslationFunction } from '../hooks/useI18n';
import type { Locale } from '../lib/i18n-constants';
import { BRAND_COLORS } from '../constants';
import { getLocalizedImageUrl } from '../utils/imageLocalization';

/**
 * Builds localized colophon data by retrieving translated strings from i18n.
 *
 * This function should be called within a component using the useI18n hook
 * to provide translated content for all colophon sections. It also loads the
 * correct localized image based on the current language.
 *
 * @param t - i18n translation function from useI18n()
 * @param locale - Current locale to select correct language-specific images
 * @returns Localized colophon data with translated strings and localized images
 *
 * @example
 * const { t, locale } = useI18n();
 * const localizedData = getLocalizedColophonData(t, locale);
 */
export function getLocalizedColophonData(
  t: TranslationFunction,
  locale: Locale
): ColophonData {
  return {
    pageTitle: t('colophon.pageTitle', { ns: 'pages' }),
    pageDescription: t('colophon.pageDescription', { ns: 'pages' }),

    pageDeck: {
      imageUrl: getLocalizedImageUrl('choice_cuts@2x', locale),
      imageAlt: t('colophon.pageDeck.imageAlt', { ns: 'pages' }),
      headingId: 'colophon-heading',
      heading: t('colophon.pageDeck.heading', { ns: 'pages' }),
      paragraphs: [
        t('colophon.pageDeck.paragraphs.0', { ns: 'pages' }),
        t('colophon.pageDeck.paragraphs.1', { ns: 'pages' }),
      ],
    },

    technologies: {
      heading: t('colophon.technologies.heading', { ns: 'pages' }),
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
              name: 'i18next',
              description: t('colophon.technologies.categories.1.items.0.description', { ns: 'pages' }),
              url: 'https://www.i18next.com/',
            },
            {
              name: 'JSDoc',
              description: t('colophon.technologies.categories.1.items.1.description', { ns: 'pages' }),
              url: 'https://jsdoc.app/',
            },
            {
              name: 'Prettier',
              description: t('colophon.technologies.categories.1.items.2.description', { ns: 'pages' }),
              url: 'https://prettier.io/',
            },
            {
              name: 'ESLint',
              description: t('colophon.technologies.categories.1.items.3.description', { ns: 'pages' }),
              url: 'https://eslint.org/',
            },
            {
              name: 'Husky',
              description: t('colophon.technologies.categories.1.items.4.description', { ns: 'pages' }),
              url: 'https://typicode.github.io/husky/',
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
              name: 'Context7',
              description: t('colophon.technologies.categories.2.items.1.description', { ns: 'pages' }),
              url: 'https://context7.io/',
            },
            {
              name: 'GitHub MCP',
              description: t('colophon.technologies.categories.2.items.2.description', { ns: 'pages' }),
              url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
            },
            {
              name: 'Filesystem MCP',
              description: t('colophon.technologies.categories.2.items.3.description', { ns: 'pages' }),
              url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
            },
            {
              name: 'Sequential Thinking MCP',
              description: t('colophon.technologies.categories.2.items.4.description', { ns: 'pages' }),
              url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking',
            },
            {
              name: 'DeepL MCP',
              description: t('colophon.technologies.categories.2.items.5.description', { ns: 'pages' }),
              url: 'https://www.deepl.com/',
            },
          ],
        },
        {
          label: t('colophon.technologies.categories.3.label', { ns: 'pages' }),
          items: [
            {
              name: 'Material UI (MUI)',
              description: t('colophon.technologies.categories.3.items.0.description', { ns: 'pages' }),
              url: 'https://mui.com/',
            },
            {
              name: 'Emotion',
              description: t('colophon.technologies.categories.3.items.1.description', { ns: 'pages' }),
              url: 'https://emotion.sh/',
            },
          ],
        },
        {
          label: t('colophon.technologies.categories.4.label', { ns: 'pages' }),
          items: [
            {
              name: 'Vitest',
              description: t('colophon.technologies.categories.4.items.0.description', { ns: 'pages' }),
              url: 'https://vitest.dev/',
            },
            {
              name: 'React Testing Library',
              description: t('colophon.technologies.categories.4.items.1.description', { ns: 'pages' }),
              url: 'https://testing-library.com/react',
            },
            {
              name: 'axe-core',
              description: t('colophon.technologies.categories.4.items.2.description', { ns: 'pages' }),
              url: 'https://www.deque.com/axe/core/',
            },
            {
              name: 'vitest-axe',
              description: t('colophon.technologies.categories.4.items.3.description', { ns: 'pages' }),
              url: 'https://github.com/nickcolley/vitest-axe',
            },
          ],
        },
        {
          label: t('colophon.technologies.categories.5.label', { ns: 'pages' }),
          items: [
            {
              name: 'npm',
              description: t('colophon.technologies.categories.5.items.0.description', { ns: 'pages' }),
              url: 'https://www.npmjs.com/',
            },
            {
              name: 'GitHub Actions',
              description: t('colophon.technologies.categories.5.items.1.description', { ns: 'pages' }),
              url: 'https://github.com/features/actions',
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
