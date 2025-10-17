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
import './Header.css';

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
    <header
      className="site-header"
      role="banner"
      style={{
        background: 'color-mix(in oklch, var(--color-bg) 92%, transparent)',
        backdropFilter: 'saturate(120%) blur(6px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {/* 3-zone layout */}
        <Box
          className="header-inner"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 2,
            height: { xs: 56, md: 64 },
          }}
        >
          {/* Left: Brand */}
          <Link
            to="/"
            aria-label={`Go to ${brand.name} home`}
            className="header-logo"
            style={{ display: 'flex', gap: 12, alignItems: 'center', height: '100%' }}
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
          </Link>

          {/* Center: Nav (no absolute positioning) */}
          {!isMobile && (
            <nav aria-label="Primary" style={{ justifySelf: 'center' }}>
              <ul
                className="header-links"
                style={{
                  display: 'flex',
                  gap: 'clamp(12px,2.4vw,24px)',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                }}
              >
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={isActiveLink(link.href) ? 'active' : ''}
                      aria-current={isActiveLink(link.href) ? 'page' : undefined}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
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
    </header>
  );
};

export default Header;
