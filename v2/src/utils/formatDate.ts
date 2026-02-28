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

