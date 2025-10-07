import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Box, Typography, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, matchPath } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { getDomainConfig } from '../../config/domainConfig';
import Socials from './Socials';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MobileDrawer from './MobileDrawer';
import './Header.css';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Playground', href: '/playground' },
];

interface HeaderProps {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

const Header: React.FC<HeaderProps> = ({ themeMode, setThemeMode }) => {
  const { branding: brand } = getDomainConfig();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const theme = useTheme();

  const isActiveLink = useCallback(
    (href: string) => !!matchPath({ path: href, end: href === '/' }, location.pathname),
    [location.pathname]
  );

  // Memoize the debounced resize handler
  const handleResize = debounce(() => {
    setIsMobile(window.innerWidth <= 768);
  }, 200);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };
  const handleThemeToggle = useCallback(
    () => setThemeMode(themeMode === 'light' ? 'dark' : 'light'),
    [themeMode, setThemeMode]
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDrawerOpen(false);
    }
  }, []);

  return (
    <header className="header" role="banner" aria-label="Site header" onKeyDown={handleKeyDown}>
      <nav className="header-nav" aria-label="Main navigation">
        {/* Left: Brand */}
        <Link to="/" aria-label={`Go to ${brand.name} home page`} className="header-logo">
          <Avatar
            src={brand.logo}
            alt={brand.alt}
            sx={{
              width: 64,
              height: 64,
              border: '3px solid #8CD2EF', // Consistent loonGray
              boxShadow: '0 4px 24px 0 rgba(140, 210, 239, 0.15)',
              bgcolor: theme.palette.background.paper,
              marginRight: '0.5rem',
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
            <Typography
              variant="h2"
              component="span"
              className="site-title"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: "'Manrope', Arial, sans-serif",
                fontSize: { xs: '1.7rem', md: '2.5rem' },
              }}
            >
              {brand.name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#8CD2EF', // Consistent loonGray
                fontWeight: 700,
                fontSize: { xs: '1.08rem', md: '1.22rem' },
                maxWidth: { xs: '120px', md: '180px' },
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.2,
                textAlign: 'left',
                overflowWrap: 'break-word',
              }}
            >
              {brand.subtitle}
            </Typography>
          </Box>
        </Link>

        {/* Center: Nav links */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            width: 'fit-content',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          {!isMobile && (
            <ul className="header-links">
              {navLinks.map((link) => (
                <li key={link.name} style={{ position: 'relative' }}>
                  <Link
                    to={link.href}
                    className={isActiveLink(link.href) ? 'active' : ''}
                    aria-current={isActiveLink(link.href) ? 'page' : undefined}
                    style={{
                      color: isActiveLink(link.href) ? '#8CD2EF' : '#fff',
                      fontWeight: isActiveLink(link.href) ? 700 : 500,
                      position: 'relative',
                      transition: 'color 0.2s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    {link.name}
                    {isActiveLink(link.href) && (
                      <span
                        className="active-indicator"
                        style={{
                          position: 'absolute',
                          left: 0,
                          bottom: -6,
                          width: '100%',
                          height: '3px',
                          background: 'linear-gradient(90deg, #8CD2EF, #5DADE2)',
                          borderRadius: '2px',
                          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                          boxShadow: '0 2px 8px 0 rgba(140, 210, 239, 0.15)',
                        }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Box>

        {/* Right: Socials + Mobile menu */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 0 : 1.5,
          }}
        >
          {!isMobile && <Socials />}
          {!isMobile && (
            <IconButton
              onClick={handleThemeToggle}
              aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
              sx={{
                color: '#ffffff',
                '&:hover': {
                  color: '#8CD2EF', // Consistent loonGray
                },
              }}
            >
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          )}
          {isMobile && (
            <IconButton
              aria-label="Toggle navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={handleDrawerToggle}
              sx={{
                color: '#8CD2EF', // Consistent loonGray
                '&:hover': {
                  color: '#5DADE2', // Lighter loonGray
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
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
      </nav>
    </header>
  );
};

export default Header;
