"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/src/hooks/useI18n";
import { getNavLinks, isActivePath, getNavButtonSx } from "../../utils/navigation";

/**
 * Renders the primary navigation buttons used in both Header and Footer.
 *
 * Displays Portfolio, Resume, and Colophon buttons with active page indication.
 * Buttons use consistent styling via getNavButtonSx, with the active page
 * highlighted in a different color.
 *
 * @returns Navigation buttons for the primary site links
 *
 * @example
 * ```tsx
 * <Box component="nav" aria-label="Main navigation">
 *   <NavButtons />
 * </Box>
 * ```
 */
export function NavButtons(): React.ReactNode {
  const pathname = usePathname();
  const { t } = useI18n();
  const navLinks = getNavLinks();

  return (
    <>
      {navLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Button
            key={link.href}
            component={Link}
            href={link.href}
            variant="contained"
            startIcon={link.icon}
            size="medium"
            aria-current={active ? "page" : undefined}
            sx={getNavButtonSx(active)}
          >
            {t(link.labelKey)}
          </Button>
        );
      })}
    </>
  );
}
