'use client';

import { useMemo } from 'react';
import { Divider } from '@mui/material';
import { getLocalizedSamplesData } from '../../data/samples';
import { useI18n } from '../../hooks/useI18n';
import PageDeck from '../common/PageDeck';
import { ScrollAnimatedSection } from '../common/ScrollAnimatedSection';
import ArtifactSection from './ArtifactSection';

/**
 * Client component for the Writing Samples page.
 *
 * Renders the full page content using localized data:
 * - PageDeck hero section with "Tasty Morsels" image and intro paragraphs
 * - Five artifact sections separated by dividers, each with scroll animations
 *
 * Follows the same pattern as ColophonContent: uses useI18n() to get
 * translated content, then delegates rendering to child components.
 *
 * @returns The Writing Samples page content with localized text and scroll animations
 */
export default function SamplesContent() {
  const { t, locale } = useI18n();
  const data = useMemo(() => getLocalizedSamplesData(t, locale), [t, locale]);

  return (
    <>
      <PageDeck content={data.pageDeck} />

      {data.sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />
          <ScrollAnimatedSection>
            <ArtifactSection
              heading={section.heading}
              intro={section.intro}
              items={section.items}
            />
          </ScrollAnimatedSection>
        </div>
      ))}
    </>
  );
}
