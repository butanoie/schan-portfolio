/**
 * Validation script for projects data.
 * Run with: tsx src/data/validateProjects.ts (or via npm script)
 */

import { PROJECTS } from './projects';
import { validateProjects } from '../types';

/**
 * Validates all project data and reports any issues.
 *
 * @throws {Error} If validation fails
 */
function main() {
  console.log('🔍 Validating projects data...\n');

  try {
    // Type validation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateProjects(PROJECTS as any);
    console.log(`✅ Type validation passed for ${PROJECTS.length} projects\n`);

    // Check for duplicate IDs
    const ids = PROJECTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      throw new Error('Duplicate project IDs found');
    }
    console.log('✅ No duplicate project IDs\n');

    // Check for empty arrays
    for (const project of PROJECTS) {
      if (project.images.length === 0) {
        throw new Error(`Project "${project.id}" has no images`);
      }
    }
    console.log('✅ All projects have at least one image\n');

    // Summary statistics
    console.log('📊 Summary Statistics:');
    console.log(`   Total Projects: ${PROJECTS.length}`);
    console.log(`   Projects with Videos: ${PROJECTS.filter((p) => p.videos.length > 0).length}`);
    console.log(`   Projects with altGrid: ${PROJECTS.filter((p) => p.altGrid).length}`);
    console.log(`   Total Images: ${PROJECTS.reduce((sum, p) => sum + p.images.length, 0)}`);
    console.log(`   Total Tags: ${PROJECTS.reduce((sum, p) => sum + p.tags.length, 0)}`);

    console.log('\n✅ All validations passed!');
  } catch (error) {
    console.error('\n❌ Validation failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
