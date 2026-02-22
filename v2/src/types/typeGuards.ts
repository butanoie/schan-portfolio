import { Project, ProjectImage, ProjectVideo } from './project';
import { VIDEO_ID_PATTERNS, STRING_CONSTRAINTS, DIMENSION_CONSTRAINTS } from '../constants/app';

/**
 * Regex pattern for valid Vimeo video IDs.
 * Vimeo IDs are 8-11 digits only.
 *
 * @internal
 */
const VIMEO_ID_PATTERN = VIDEO_ID_PATTERNS.vimeo;

/**
 * Regex pattern for valid YouTube video IDs.
 * YouTube IDs are 11 alphanumeric characters (including hyphens and underscores).
 *
 * @internal
 */
const YOUTUBE_ID_PATTERN = VIDEO_ID_PATTERNS.youtube;

/**
 * Validates that a string is within acceptable length bounds.
 *
 * **Security:** Prevents extremely large strings that could cause performance issues
 * or be used in DoS attacks. Also ensures minimum length to catch empty/null values.
 *
 * @param str - The string to validate
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (default: 10000)
 * @returns True if the string length is within bounds
 * @throws {TypeError} If str is not a string
 *
 * @example
 * isValidString('Hello') // true
 * isValidString('') // false (too short)
 * isValidString('A'.repeat(10001)) // false (too long)
 * isValidString('Valid content', 1, 10000) // true
 */
export function isValidString(
  str: string,
  minLength: number = STRING_CONSTRAINTS.MIN_LENGTH,
  maxLength: number = STRING_CONSTRAINTS.MAX_LENGTH
): boolean {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }

  return str.length >= minLength && str.length <= maxLength;
}

/**
 * Validates that a URL path is safe and doesn't contain path traversal attempts.
 *
 * **Security:** Prevents path traversal attacks (e.g., `../../etc/passwd`)
 * and other malicious URL patterns.
 *
 * @param url - The URL or path to validate
 * @returns True if the URL is safe
 * @throws {TypeError} If url is not a string
 *
 * @example
 * isValidUrlPath('/images/photo.jpg') // true
 * isValidUrlPath('https://example.com/image.jpg') // true
 * isValidUrlPath('../../etc/passwd') // false
 * isValidUrlPath('../../../evil') // false
 * isValidUrlPath('/path;command') // false
 * isValidUrlPath('/path|command') // false
 */
export function isValidUrlPath(url: string): boolean {
  if (typeof url !== 'string') {
    throw new TypeError('URL must be a string');
  }

  // Block command injection attempts first
  if (url.includes(';') || url.includes('|') || url.includes('&') || url.includes('`')) {
    return false;
  }

  // Block HTML/XML injection
  if (url.includes('<') || url.includes('>')) {
    return false;
  }

  // Block path traversal attempts (but allow protocol:// patterns)
  if (url.includes('..')) {
    return false;
  }

  // Block double slashes except for protocol schemes (http://, https://)
  const hasProtocol = url.includes('://');
  if (!hasProtocol && url.includes('//')) {
    return false;
  }

  return true;
}

/**
 * Validates that a dimension (width or height) is within acceptable bounds.
 *
 * **Security:** Prevents unreasonably large dimension values that could cause
 * memory issues or be used in DoS attacks. Also ensures positive values.
 *
 * @param dimension - The numeric dimension to validate
 * @param minDimension - Minimum dimension (default: 1)
 * @param maxDimension - Maximum dimension (default: 10000)
 * @returns True if the dimension is valid
 *
 * @example
 * isValidDimension(800) // true
 * isValidDimension(0) // false (too small)
 * isValidDimension(-100) // false (negative)
 * isValidDimension(10001) // false (too large)
 * isValidDimension(Infinity) // false
 * isValidDimension(NaN) // false
 */
export function isValidDimension(
  dimension: number,
  minDimension: number = DIMENSION_CONSTRAINTS.MIN,
  maxDimension: number = DIMENSION_CONSTRAINTS.MAX
): boolean {
  // Check for finite, valid numbers
  if (!Number.isFinite(dimension)) {
    return false;
  }

  // Check bounds (must be integer)
  return Number.isInteger(dimension) && dimension >= minDimension && dimension <= maxDimension;
}

/**
 * Validates a video ID format for the given video platform.
 *
 * **Security:** This function prevents URL injection by validating that video IDs
 * match the strict format requirements of their respective platforms. This ensures
 * that when IDs are embedded in URLs (e.g., `https://vimeo.com/{id}`), only valid
 * platform IDs can be used.
 *
 * @param id - The video ID to validate
 * @param platform - The video platform ('vimeo' or 'youtube')
 * @returns True if the ID matches the platform's format requirements
 * @throws {TypeError} If id is not a string or platform is invalid
 *
 * @example
 * isValidVideoId('123456789', 'vimeo') // true (8-11 digits)
 * isValidVideoId('dQw4w9WgXcQ', 'youtube') // true (11 chars, alphanumeric + - _)
 * isValidVideoId('invalid!id', 'youtube') // false (contains invalid char)
 * isValidVideoId('123', 'vimeo') // false (too short for Vimeo)
 *
 * **URL Injection Prevention:**
 * - Blocks IDs with special characters that could alter URLs
 * - Prevents semicolon injection (e.g., `; malicious_code`)
 * - Prevents path traversal attempts (e.g., `../../`)
 */
export function isValidVideoId(id: string, platform: 'vimeo' | 'youtube'): boolean {
  if (typeof id !== 'string') {
    throw new TypeError('Video ID must be a string');
  }

  if (platform === 'vimeo') {
    return VIMEO_ID_PATTERN.test(id);
  }

  if (platform === 'youtube') {
    return YOUTUBE_ID_PATTERN.test(id);
  }

  throw new TypeError('Invalid platform. Must be "vimeo" or "youtube"');
}

/**
 * Type guard to validate if an object is a valid ProjectImage.
 *
 * **Security:**
 * - Validates URL paths to prevent path traversal attacks
 * - Validates string lengths to prevent DoS attacks
 * - Ensures caption is not empty
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid ProjectImage
 *
 * @example
 * isProjectImage({
 * url: '/images/photo.jpg',
 * tnUrl: '/images/thumb.jpg',
 * caption: 'A beautiful photo',
 * tnUrl2x: '/images/thumb@2x.jpg'
 * }) // true
 *
 * @example
 * isProjectImage({
 * url: '../../etc/passwd',  // Path traversal attempt
 * tnUrl: '/images/thumb.jpg',
 * caption: 'Malicious'
 * }) // false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProjectImage(obj: any): obj is ProjectImage {
  if (
    typeof obj !== 'object' ||
    obj === null ||
    typeof obj.url !== 'string' ||
    typeof obj.tnUrl !== 'string' ||
    typeof obj.caption !== 'string'
  ) {
    return false;
  }

  // Validate optional tnUrl2x
  if (obj.tnUrl2x !== undefined && typeof obj.tnUrl2x !== 'string') {
    return false;
  }

  // Validate URL paths
  try {
    if (!isValidUrlPath(obj.url) || !isValidUrlPath(obj.tnUrl)) {
      return false;
    }

    if (obj.tnUrl2x && !isValidUrlPath(obj.tnUrl2x)) {
      return false;
    }
  } catch {
    return false;
  }

  // Validate string lengths
  try {
    if (
      !isValidString(obj.caption) ||
      !isValidString(obj.url) ||
      !isValidString(obj.tnUrl)
    ) {
      return false;
    }

    if (obj.tnUrl2x && !isValidString(obj.tnUrl2x)) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * Type guard to validate if an object is a valid ProjectVideo.
 *
 * **Security:**
 * - Validates video type against allowed platforms
 * - Validates video ID format to prevent URL injection
 * - Validates dimensions to prevent DoS attacks
 * - Ensures dimensions are reasonable (1-10000 pixels)
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid ProjectVideo
 *
 * @example
 * isProjectVideo({
 * type: 'youtube',
 * id: 'dQw4w9WgXcQ',
 * width: 560,
 * height: 315
 * }) // true
 *
 * @example
 * isProjectVideo({
 * type: 'youtube',
 * id: 'invalid!id',  // Invalid character
 * width: 560,
 * height: 315
 * }) // false
 *
 * @example
 * isProjectVideo({
 * type: 'youtube',
 * id: 'dQw4w9WgXcQ',
 * width: 999999,     // Dimension too large
 * height: 315
 * }) // false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProjectVideo(obj: any): obj is ProjectVideo {
  if (
    typeof obj !== 'object' ||
    obj === null ||
    (obj.type !== 'vimeo' && obj.type !== 'youtube') ||
    typeof obj.id !== 'string' ||
    typeof obj.width !== 'number' ||
    typeof obj.height !== 'number'
  ) {
    return false;
  }

  // Validate the video ID against platform-specific format requirements
  try {
    if (!isValidVideoId(obj.id, obj.type)) {
      return false;
    }
  } catch {
    return false;
  }

  // Validate dimensions are reasonable
  if (!isValidDimension(obj.width) || !isValidDimension(obj.height)) {
    return false;
  }

  return true;
}

/**
 * Type guard to validate if an object is a valid Project.
 * Performs comprehensive validation of all required fields.
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid Project
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProject(obj: any): obj is Project {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Validate primitive fields
  const hasValidPrimitives =
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.circa === 'string' &&
    typeof obj.altGrid === 'boolean';

  if (!hasValidPrimitives) {
    return false;
  }

  // Validate desc array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!Array.isArray(obj.desc) || !obj.desc.every((item: any) => typeof item === 'string')) {
    return false;
  }

  // Validate tags array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!Array.isArray(obj.tags) || !obj.tags.every((tag: any) => typeof tag === 'string')) {
    return false;
  }

  // Validate images array
  if (!Array.isArray(obj.images) || !obj.images.every(isProjectImage)) {
    return false;
  }

  // Validate videos array
  if (!Array.isArray(obj.videos) || !obj.videos.every(isProjectVideo)) {
    return false;
  }

  return true;
}

/**
 * Validates an array of projects.
 *
 * @param data - Array to validate
 * @returns True if data is a valid Project array
 * @throws {Error} If validation fails with details about the first invalid project
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateProjects(data: any[]): data is Project[] {
  if (!Array.isArray(data)) {
    throw new Error('Projects data must be an array');
  }

  for (let i = 0; i < data.length; i++) {
    if (!isProject(data[i])) {
      throw new Error(`Invalid project at index ${i}: ${JSON.stringify(data[i])}`);
    }
  }

  return true;
}
