/**
 * Utility for loading localized images based on language settings.
 *
 * Some images contain rendered text that needs to be in the correct language.
 * This utility helps construct the correct image URL based on the current locale.
 *
 * @module utils/imageLocalization
 */

import type { Locale } from '@/src/lib/i18n-constants';

/**
 * Gets the correct localized image URL for a base image name.
 *
 * For images with rendered text (like diagrams or infographics), provides
 * language-specific versions. Falls back to a default image if no localized
 * version exists.
 *
 * **Image Name Convention:**
 * - Base image: `image-name.png` (fallback, should not be used)
 * - English version: `image-name-en.png` (used for English locale)
 * - French version: `image-name-fr.png` (used for French locale)
 *
 * @param baseName - The base image name without locale suffix (e.g., 'choice_cuts@2x')
 * @param locale - Current locale (en, fr)
 * @returns Full image URL with correct locale suffix
 *
 * @example
 * const imageUrl = getLocalizedImageUrl('choice_cuts@2x', 'en');
 * // Returns '/images/choice_cuts@2x-en.png'
 *
 * @example
 * const imageUrl = getLocalizedImageUrl('pork_cuts@2x', 'fr');
 * // Returns '/images/pork_cuts@2x-fr.png'
 */
export function getLocalizedImageUrl(baseName: string, locale: Locale): string {
  return `/images/${baseName}-${locale}.png`;
}
