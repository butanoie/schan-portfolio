/**
 * Writing Samples page data — section definitions and artifact mappings.
 *
 * Defines the five content sections and their associated document artifacts.
 * Each artifact specifies its translation keys and download format.
 *
 * All user-facing strings are localized via i18n from en/samples.json and fr/samples.json.
 * Use getLocalizedSamplesData(t, locale) to retrieve translated content.
 *
 * @module data/samples
 */

import type { ArtifactSection } from '../types/samples';
import type { PageDeckData } from '../types';
import type { TranslationFunction } from '../hooks/useI18n';
import type { Locale } from '../lib/i18n-constants';
import { getLocalizedImageUrl } from '../utils/imageLocalization';

/**
 * Defines the five artifact sections with their document items.
 *
 * Section order follows the narrative throughline:
 * Vision → Design → Technology → Operations → Impact
 *
 * Each item's `format` determines the download button
 * rendered on the artifact card.
 *
 * @returns Array of artifact section definitions with translation keys
 */
function getArtifactSections(): ArtifactSection[] {
  return [
    {
      headingKey: 'samples.sections.productStrategy.heading',
      introKey: 'samples.sections.productStrategy.intro',
      items: [
        {
          titleKey: 'samples.artifacts.productRoadmapPhase3.title',
          descriptionKey: 'samples.artifacts.productRoadmapPhase3.description',
          format: { label: 'Markdown', href: '/documents/PHASE_3_PRODUCT_ROADMAP.md' },
        },
        {
          titleKey: 'samples.artifacts.productRoadmapPhase4.title',
          descriptionKey: 'samples.artifacts.productRoadmapPhase4.description',
          format: { label: 'Markdown', href: '/documents/PHASE_4_PRODUCT_ROADMAP.md' },
        },
        {
          titleKey: 'samples.artifacts.prdLightbox.title',
          descriptionKey: 'samples.artifacts.prdLightbox.description',
          format: { label: 'PDF', href: '/documents/PRD_Project_Grid_and_Lightbox.pdf' },
        },
      ],
    },
    {
      headingKey: 'samples.sections.uxDesign.heading',
      introKey: 'samples.sections.uxDesign.intro',
      items: [
        {
          titleKey: 'samples.artifacts.idsLightbox.title',
          descriptionKey: 'samples.artifacts.idsLightbox.description',
          format: { label: 'PDF', href: '/documents/IDS_Project_Grid_and_Lightbox.pdf' },
        },
        {
          titleKey: 'samples.artifacts.wcagGuide.title',
          descriptionKey: 'samples.artifacts.wcagGuide.description',
          format: { label: 'PDF', href: '/documents/WCAG_2_2_Compliance_Guide.pdf' },
        },
        {
          titleKey: 'samples.artifacts.accessibilityStatement.title',
          descriptionKey: 'samples.artifacts.accessibilityStatement.description',
          format: { label: 'PDF', href: '/documents/Accessibility_Statement.pdf' },
        },
      ],
    },
    {
      headingKey: 'samples.sections.technical.heading',
      introKey: 'samples.sections.technical.intro',
      items: [
        {
          titleKey: 'samples.artifacts.adrI18n.title',
          descriptionKey: 'samples.artifacts.adrI18n.description',
          format: { label: 'PDF', href: '/documents/ADR_i18n_Library_Selection.pdf' },
        },
        {
          titleKey: 'samples.artifacts.frameworkEval.title',
          descriptionKey: 'samples.artifacts.frameworkEval.description',
          format: { label: 'PDF', href: '/documents/Front_End_Framework_Evaluation.pdf' },
        },
      ],
    },
    {
      headingKey: 'samples.sections.processOps.heading',
      introKey: 'samples.sections.processOps.intro',
      items: [
        {
          titleKey: 'samples.artifacts.qaStrategy.title',
          descriptionKey: 'samples.artifacts.qaStrategy.description',
          format: { label: 'PDF', href: '/documents/QA_Automation_Strategy.pdf' },
        },
        {
          titleKey: 'samples.artifacts.onboardingGuide.title',
          descriptionKey: 'samples.artifacts.onboardingGuide.description',
          format: { label: 'PDF', href: '/documents/Product_Knowledge_Onboarding_Guide.pdf' },
        },
        {
          titleKey: 'samples.artifacts.changelogStrategy.title',
          descriptionKey: 'samples.artifacts.changelogStrategy.description',
          format: { label: 'PDF', href: '/documents/Changelog_and_Release_Notes_Strategy.pdf' },
        },
        {
          titleKey: 'samples.artifacts.gherkinPhase3.title',
          descriptionKey: 'samples.artifacts.gherkinPhase3.description',
          format: { label: 'Markdown', href: '/documents/Gherkin_Test_Cases_Phase_3.md' },
        },
        {
          titleKey: 'samples.artifacts.gherkinPhase4.title',
          descriptionKey: 'samples.artifacts.gherkinPhase4.description',
          format: { label: 'Markdown', href: '/documents/Gherkin_Test_Cases_Phase_4.md' },
        },
      ],
    },
    {
      headingKey: 'samples.sections.costSavings.heading',
      introKey: 'samples.sections.costSavings.intro',
      items: [
        {
          titleKey: 'samples.artifacts.costCuttingAudit.title',
          descriptionKey: 'samples.artifacts.costCuttingAudit.description',
          format: { label: 'PDF', href: '/documents/Cost_Cutting_Audit.pdf' },
        },
        {
          titleKey: 'samples.artifacts.costSavingsRoadmap.title',
          descriptionKey: 'samples.artifacts.costSavingsRoadmap.description',
          format: { label: 'PDF', href: '/documents/Additional_Cost_Savings_Roadmap.pdf' },
        },
        {
          titleKey: 'samples.artifacts.elasticsearchRunbook.title',
          descriptionKey: 'samples.artifacts.elasticsearchRunbook.description',
          format: { label: 'Markdown', href: '/documents/Elasticsearch_Scale_Down_Runbook.md' },
        },
      ],
    },
  ];
}

/**
 * Data shape returned by getLocalizedSamplesData.
 */
export interface SamplesData {
  /** Page deck content for the hero section */
  pageDeck: PageDeckData;
  /** Artifact sections with resolved translation strings */
  sections: {
    /** Section heading */
    heading: string;
    /** Section introduction paragraph */
    intro: string;
    /** Artifact items with resolved titles and descriptions */
    items: {
      /** Artifact display title */
      title: string;
      /** Artifact description */
      description: string;
      /** Download format */
      format: { label: string; href: string };
    }[];
  }[];
}

/**
 * Builds localized Writing Samples page data by resolving translation keys.
 *
 * Translates all section headings, intros, artifact titles, and descriptions
 * using the provided translation function. Also resolves the localized hero
 * image URL based on the current locale.
 *
 * @param t - i18n translation function from useI18n()
 * @param locale - Current locale for selecting the correct hero image
 * @returns Fully localized samples page data ready for rendering
 *
 * @example
 * const { t, locale } = useI18n();
 * const data = getLocalizedSamplesData(t, locale);
 */
export function getLocalizedSamplesData(
  t: TranslationFunction,
  locale: Locale
): SamplesData {
  const artifactSections = getArtifactSections();

  return {
    pageDeck: {
      imageUrl: getLocalizedImageUrl('tasty_morsels@2x', locale),
      imageAlt: t('samples.pageDeck.imageAlt', { ns: 'pages' }),
      headingId: 'samples-heading',
      heading: t('samples.pageDeck.heading', { ns: 'pages' }),
      paragraphs: [
        t('samples.pageDeck.paragraphs.0', { ns: 'pages' }),
        t('samples.pageDeck.paragraphs.1', { ns: 'pages' }),
      ],
    },
    sections: artifactSections.map((section) => ({
      heading: t(section.headingKey, { ns: 'pages' }),
      intro: t(section.introKey, { ns: 'pages' }),
      items: section.items.map((item) => ({
        title: t(item.titleKey, { ns: 'pages' }),
        description: t(item.descriptionKey, { ns: 'pages' }),
        format: item.format,
      })),
    })),
  };
}
