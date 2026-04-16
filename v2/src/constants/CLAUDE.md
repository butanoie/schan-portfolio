# src/constants

## Color Palette Changes

**CRITICAL: When modifying any color in `BRAND_COLORS` or `NAV_COLORS` (in `src/constants/colors.ts`), check ALL related states** — hover, active, disabled — across the full constant file. Colors are cross-referenced (e.g., `BRAND_COLORS.sage` is the default background, `NAV_COLORS.inactiveHover` is its hover state). Changing one without the other eliminates visual hover feedback.
