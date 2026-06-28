import React from 'react';
import { Box, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { getDomainConfig } from '../../config/domainConfig';
import MobileDrawer from './MobileDrawer';

// Primary nav. Work/About land in a later phase with their pages; until then
// these point only at routes that exist so nothing dead-links.
const navLinks = [
  { name: 'Experience', href: '/experience' },
  { name: 'Writing', href: '/blog' },
  { name: 'Playground', href: '/playground' },
  { name: 'Contact', href: '/contact' },
];

const kbdSx = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  lineHeight: 1.4,
  background: 'var(--color-surface-2)',
  border: '1px solid var(--color-border)',
  borderRadius: '4px',
  px: '5px',
  py: '1px',
  color: 'var(--color-text-secondary)',
} as const;

interface HeaderProps {
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ themeMode, setThemeMode }) => {
  const { branding: brand } = getDomainConfig();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isActiveLink = (href: string) =>
    !!matchPath({ path: href, end: href === '/' }, location.pathname);

  const toggleTheme = () => setThemeMode(themeMode === 'light' ? 'dark' : 'light');

  return (
    <Box
      component="header"
      role="banner"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        px: 'clamp(16px, 5vw, 40px)',
        pt: '12px',
        pb: '12px',
        pointerEvents: 'none',
      }}
    >
      {/* Floating pill */}
      <Box
        sx={{
          pointerEvents: 'auto',
          width: 'min(1240px, 100%)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 1,
          minHeight: 52,
          px: { xs: 1.5, md: 2 },
          py: 0.75,
          background: 'color-mix(in oklch, var(--color-surface) 92%, transparent)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        {/* Brand */}
        <Box
          component={Link}
          to="/"
          aria-label={`${brand.name} — home`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.1,
            pl: 0.5,
            textDecoration: 'none',
            color: 'inherit',
            '&:focus-visible': {
              outline: '2px solid var(--color-accent-hex)',
              outlineOffset: '2px',
              borderRadius: 'var(--radius-sm)',
            },
          }}
        >
          <Box
            component="span"
            aria-hidden="true"
            sx={{ color: 'var(--color-accent-hex)', fontSize: '1.15rem', lineHeight: 1 }}
          >
            ◉
          </Box>
          <Box
            component="span"
            sx={{
              fontFamily: 'Geist, sans-serif',
              fontWeight: 600,
              fontSize: '1.05rem',
              letterSpacing: '-0.01em',
              color: 'var(--color-text)',
              whiteSpace: 'nowrap',
            }}
          >
            {brand.name}
          </Box>
        </Box>

        {/* Center: nav (desktop) */}
        {!isMobile && (
          <Box
            component="nav"
            aria-label="Primary"
            sx={{ display: 'flex', gap: 0.25, justifyContent: 'center' }}
          >
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Box
                  key={link.name}
                  component={Link}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    position: 'relative',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: active ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    px: 1.5,
                    py: 1,
                    borderRadius: 'var(--radius-pill)',
                    transition: 'color 0.2s ease, background 0.2s ease',
                    '&:hover': { color: 'var(--color-text)', background: 'var(--color-surface-2)' },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '12px',
                      right: '12px',
                      bottom: '4px',
                      height: '2px',
                      background: 'var(--color-accent-hex)',
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.25s var(--easing-standard)',
                    },
                  }}
                >
                  {link.name}
                </Box>
              );
            })}
          </Box>
        )}

        {/* Right: ⌘K + theme + mobile menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Ask my work — coming soon">
            <Box
              component="button"
              type="button"
              aria-label="Ask my work (command menu, coming soon)"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-pill)',
                px: 1.25,
                py: 0.5,
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, color 0.2s ease',
                '&:hover': { borderColor: '#3a3a40', color: 'var(--color-text)' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                ask my work
              </Box>
              <Box component="span" sx={{ display: 'inline-flex', gap: '3px' }}>
                <Box component="kbd" sx={kbdSx}>
                  ⌘
                </Box>
                <Box component="kbd" sx={kbdSx}>
                  K
                </Box>
              </Box>
            </Box>
          </Tooltip>

          <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              onClick={toggleTheme}
              aria-label="Toggle color scheme"
              size="small"
              sx={{
                color: 'var(--color-text-secondary)',
                '&:hover': { color: 'var(--color-accent-hex)' },
              }}
            >
              {themeMode === 'light' ? (
                <Brightness4Icon fontSize="small" />
              ) : (
                <Brightness7Icon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {isMobile && (
            <IconButton
              aria-label="Open menu"
              aria-controls="mobile-drawer"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              size="small"
              sx={{ color: 'var(--color-text)' }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {isMobile && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          navLinks={navLinks}
          brand={brand}
          isActiveLink={isActiveLink}
        />
      )}
    </Box>
  );
};

export default Header;
