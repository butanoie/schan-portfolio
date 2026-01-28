import { Project, ProjectImage, ProjectVideo } from './project';

/**
 * Type guard to validate if an object is a valid ProjectImage.
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid ProjectImage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProjectImage(obj: any): obj is ProjectImage {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.url === 'string' &&
    typeof obj.tnUrl === 'string' &&
    typeof obj.caption === 'string' &&
    (obj.tnUrl2x === undefined || typeof obj.tnUrl2x === 'string')
  );
}

/**
 * Type guard to validate if an object is a valid ProjectVideo.
 *
 * @param obj - Object to validate
 * @returns True if obj is a valid ProjectVideo
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isProjectVideo(obj: any): obj is ProjectVideo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj.type === 'vimeo' || obj.type === 'youtube') &&
    typeof obj.id === 'string' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number'
  );
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
    typeof obj.desc === 'string' &&
    typeof obj.circa === 'string' &&
    typeof obj.altGrid === 'boolean';

  if (!hasValidPrimitives) {
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
