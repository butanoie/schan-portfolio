'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { BRAND_COLORS } from '../../constants';
import { FONT_FAMILY_HEADING } from '@/src/lib/fontConstants';
import { usePalette } from '@/src/hooks/usePalette';
import { useI18n } from '@/src/hooks/useI18n';
import dynamic from 'next/dynamic';
import { SettingsButton } from '../settings/SettingsButton';
import { NavButtons } from './NavButtons';

/**
 * Lazily-loaded mobile hamburger menu component.
 *
 * Uses `next/dynamic` with `ssr: false` because the hamburger menu is only
 * rendered on mobile viewports and is interaction-triggered. This defers
 * the MUI Drawer, icons, and the entire SettingsList sub-tree from the
 * initial bundle.
 *
 * The loading placeholder renders a disabled MenuIcon so that the hamburger
 * button area is visible immediately on mobile, preventing a flash of missing
 * content while the chunk downloads.
 *
 * @returns The dynamically-loaded HamburgerMenu component
 */
const HamburgerMenu = dynamic(
  /**
   * Loads the HamburgerMenu module.
   *
   * @returns The HamburgerMenu module
   */
  () => import('./HamburgerMenu'),
  {
    ssr: false,
    /**
     * Renders a disabled menu icon placeholder while the chunk loads.
     * Matches the same sizing (44×44 min tap target) as the real hamburger button.
     *
     * @returns A placeholder IconButton with a MenuIcon
     */
    loading: () => (
      <IconButton
        size="medium"
        disabled
        aria-hidden
        sx={{
          color: BRAND_COLORS.maroon,
          minWidth: 44,
          minHeight: 44,
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>
    ),
  }
);

/**
 * Header component with site branding, social links, and main navigation.
 *
 * Features:
 * - Site name in Oswald font
 * - LinkedIn and GitHub icon links next to the name
 * - Main navigation buttons (Portfolio, Résumé, Colophon) with active page indication
 * - Icons change color on hover for visual feedback
 * - Navigation buttons styled consistently with the Footer component
 *
 * @returns An app bar with site branding, social icons, and accessible navigation menu
 */
export default function Header() {
  const { palette, isHighContrast } = usePalette();
  const { t } = useI18n();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  /** Shared styling for social icon buttons (LinkedIn, GitHub) */
  const socialIconSx = {
    color: palette.text.primary,
    minWidth: 44,
    minHeight: 44,
    '&:hover': {
      color: isHighContrast ? '#FFFF00' : BRAND_COLORS.maroon,
    },
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            my: 3,
            px: { xs: 3, lg: 6 },
            alignItems: { xs: 'center', md: 'center' },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              flexGrow: { xs: 0, md: 1 },
              display: 'flex',
              alignItems: 'bottom',
              gap: 1,
            }}
          >
            <Typography
              component="div"
              sx={{
                fontFamily: FONT_FAMILY_HEADING,
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {t('header.siteTitle')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'baseline' }}>
              <IconButton
                href="https://www.linkedin.com/in/sing-chan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('nav.social.linkedin')}
                size="medium"
                sx={socialIconSx}
              >
                <LinkedInIcon fontSize="medium" />
              </IconButton>
              <IconButton
                href="https://github.com/butanoie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('nav.social.github')}
                size="medium"
                sx={socialIconSx}
              >
                <GitHubIcon fontSize="medium" />
              </IconButton>
            </Box>
          </Box>
          <Box
            component="nav"
            aria-label={t('nav.mainNavigation')}
            sx={{
              display: 'flex',
              gap: 1,
              alignSelf: { xs: 'auto', md: 'flex-end' },
            }}
          >
            {/* Show hamburger on mobile, full nav + settings on desktop */}
            {isMobile ? (
              <HamburgerMenu />
            ) : (
              <>
                <NavButtons />
                <SettingsButton size="medium" />
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
