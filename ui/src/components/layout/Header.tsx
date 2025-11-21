import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { getDomainConfig } from '../../config/domainConfig';
import MobileDrawer from './MobileDrawer';
import Socials from './Socials';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Playground', href: '/playground' },
];

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
        background: 'color-mix(in oklch, var(--color-bg) 92%, transparent)',
        backdropFilter: 'saturate(120%) blur(6px)',
        WebkitBackdropFilter: 'saturate(120%) blur(6px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {/* 3-zone layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 2,
            height: { xs: 56, md: 64 },
          }}
        >
          {/* Left: Brand */}
          <Box
            component={Link}
            to="/"
            aria-label={`Go to ${brand.name} home`}
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              height: '100%',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'opacity 200ms var(--easing-standard)',
              '&:hover': { opacity: 0.85 },
              '&:focus-visible': {
                outline: '2px solid var(--color-focus)',
                outlineOffset: '2px',
                borderRadius: 'var(--radius-sm)',
              },
            }}
          >
            <Avatar
              src={brand.logo}
              alt={brand.alt}
              sx={{
                width: 40,
                height: 40,
                border: '1px solid var(--color-border)',
                bgcolor: 'transparent',
                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  letterSpacing: '-0.01em',
                  color: 'var(--color-text)',
                  lineHeight: 1.2,
                }}
              >
                {brand.name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'var(--color-text-secondary-hex)',
                  lineHeight: 1.2,
                  fontSize: '0.85rem',
                }}
              >
                {brand.subtitle}
              </Typography>
            </Box>
          </Box>

          {/* Center: Nav (Desktop) */}
          {!isMobile && (
            <Box
              component="nav"
              sx={{
                display: 'flex',
                gap: { md: 2, lg: 3 },
                justifyContent: 'center',
              }}
            >
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Box
                    key={link.name}
                    component={Link}
                    to={link.href}
                    sx={{
                      position: 'relative',
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: active ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      py: 0.5,
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'var(--color-accent-hex)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        bgcolor: 'var(--color-accent-hex)',
                        transform: active ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'bottom left',
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                    }}
                  >
                    {link.name}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Right: Utilities */}
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end">
            {!isMobile && <Socials />}

            {/* Theme toggle always visible */}
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton
                className="icon-btn"
                onClick={toggleTheme}
                aria-label="Toggle color scheme"
              >
                {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>

            {/* Mobile menu */}
            {isMobile && (
              <IconButton
                className="icon-btn"
                aria-label="Open menu"
                aria-controls="mobile-drawer"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Box>
      </Container>

      {/* Drawer holds nav + socials on mobile */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          navLinks={navLinks}
          brand={brand}
          isActiveLink={isActiveLink}
          // You can render socials inside the drawer footer
        />
      )}
    </Box>
  );
};

export default Header;
