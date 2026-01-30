/**
 * ROT13/ROT5 cipher utilities for obfuscating contact information.
 *
 * Uses ROT13 for letters (rotate 13 positions in alphabet) and ROT5 for digits (rotate 5 positions in 0-9).
 * Special characters (@, ., :, -, +, etc.) are not affected.
 *
 * This cipher is not cryptographically secure but provides basic protection against:
 * - Simple email/phone scrapers that look for literal patterns
 * - Casual text scanning of HTML source
 * - Includes protection for both letters and numbers
 *
 * It does NOT protect against:
 * - Automated ROT13/ROT5 decoders
 * - Determined attackers
 *
 * For more secure contact protection, consider using a contact form instead.
 */

/**
 * Encodes or decodes a string using the ROT13/ROT5 cipher.
 * Applies ROT13 to letters (a-z, A-Z) and ROT5 to digits (0-9).
 * Special characters, spaces, and other characters pass through unchanged.
 *
 * @param str - The string to encode or decode
 * @returns The ROT13/ROT5 encoded/decoded string
 *
 * @example
 * const encodedEmail = rot13('sing@singchan.com'); // 'f­v­a­t­@­f­v­a­t­p­u­n­a­.­p­b­z­'
 * const decodedEmail = rot13(encodedEmail); // 'sing@singchan.com'
 *
 * @example
 * const encodedPhone = rot13('tel:+1-604-773-2843'); // 'g­r­y­:­+­6­-­1­5­9­-­2­2­8­-­7­3­9­8­'
 * const decodedPhone = rot13(encodedPhone); // 'tel:+1-604-773-2843'
 */
export function rot13(str: string): string {
  return str.replace(/[a-zA-Z0-9]/g, (char) => {
    const charCode = char.charCodeAt(0);

    // Handle uppercase letters (ROT13)
    if (charCode >= 65 && charCode <= 90) {
      return String.fromCharCode(65 + (charCode - 65 + 13) % 26);
    }

    // Handle lowercase letters (ROT13)
    if (charCode >= 97 && charCode <= 122) {
      return String.fromCharCode(97 + (charCode - 97 + 13) % 26);
    }

    // Handle digits (ROT5)
    if (charCode >= 48 && charCode <= 57) {
      return String.fromCharCode(48 + (charCode - 48 + 5) % 10);
    }

    return char;
  });
}
