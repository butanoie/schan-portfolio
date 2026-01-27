/**
 * Formats a date string into a human-readable format.
 *
 * @param dateString - The date string to format (ISO 8601 format recommended)
 * @param options - Intl.DateTimeFormat options for customizing the output
 * @returns A formatted date string
 *
 * @example
 * formatDate('2024-01-15');
 * // Returns "January 15, 2024"
 *
 * @example
 * formatDate('2024-01-15', { year: 'numeric', month: 'short' });
 * // Returns "Jan 2024"
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if formatting fails
  }
}

/**
 * Formats a circa date range (e.g., "Summer 2024", "Fall 2017 - Present").
 *
 * @param circa - The circa string to format
 * @returns The formatted circa string (currently passes through unchanged)
 *
 * @example
 * formatCirca('Summer 2024');
 * // Returns "Summer 2024"
 *
 * @example
 * formatCirca('Fall 2017 - Present');
 * // Returns "Fall 2017 - Present"
 */
export function formatCirca(circa: string): string {
  // Currently just returns the circa string as-is
  // Can be enhanced later to parse and format date ranges
  return circa;
}
