import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Footer.css';
import Socials from './Socials';

// Quick Links Dropdown Component and navLinks must be outside Footer
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Career', href: '/career' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
];

const FooterQuickLinks: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="Quick Links">
        <IconButton
          aria-label="quick links"
          aria-controls={open ? 'footer-quick-links-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="footer-quick-links-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'footer-quick-links-button' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {navLinks.map((link) => (
          <MenuItem
            key={link.name}
            component="a"
            href={link.href}
            onClick={handleClose}
            sx={{ fontSize: '0.95rem', minWidth: 120 }}
          >
            {link.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

import { FaSun, FaMoon } from 'react-icons/fa';

interface FooterProps {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

import { getDomainConfig } from '../../config/domainConfig';

const Footer: React.FC<FooterProps> = ({ themeMode, setThemeMode }) => {
  const theme = useTheme();
  const { branding: brand } = getDomainConfig();
  const isDark = themeMode === 'dark';
  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label="Site footer"
      style={{ padding: '0 16px' }}
    >
      <Box
        className="footer-content"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          boxSizing: 'border-box',
          padding: { xs: '8px 0', md: '8px 0' },
          gap: { xs: 0.5, md: 0 },
        }}
      >
        {/* Left side - Logo and mission */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            order: { xs: 1, md: 1 },
          }}
        >
          <Avatar
            src={brand.logo}
            alt={brand.alt}
            sx={{
              width: { xs: 20, md: 20 },
              height: { xs: 20, md: 20 },
              border: `1.5px solid ${theme.palette.secondary.main}`,
              boxShadow: theme.shadows[1],
              bgcolor: theme.palette.common.white,
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.8rem', md: '0.85rem' },
              color: theme.palette.secondary.main,
              letterSpacing: '0.04em',
            }}
            aria-label="Mission statement"
          >
            Architect. Build. Elevate.
          </Typography>
        </Box>

        {/* Center - Copyright (desktop only) */}
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: theme.palette.common.white,
            opacity: 0.85,
            display: { xs: 'none', md: 'block' },
            order: { xs: 3, md: 2 },
          }}
        >
          &copy; {new Date().getFullYear()} Ben Hickman. All rights reserved.
        </Typography>

        {/* Right side - Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: '0.25rem', md: '0.5rem' },
            order: { xs: 2, md: 3 },
          }}
        >
          <FooterQuickLinks />
          <Socials />
          <IconButton
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            sx={{
              color: isDark ? theme.palette.secondary.main : theme.palette.primary.main,
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(140,210,239,0.10)',
              border: `1.5px solid ${theme.palette.secondary.main}`,
              width: { xs: 28, md: 28 },
              height: { xs: 28, md: 28 },
              transition: 'background 0.3s, color 0.3s',
            }}
            size="small"
          >
            {isDark ? <FaSun size={16} /> : <FaMoon size={14} />}
          </IconButton>
        </Box>

        {/* Mobile copyright (bottom) */}
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: theme.palette.common.white,
            opacity: 0.75,
            display: { xs: 'block', md: 'none' },
            order: { xs: 3, md: 4 },
            marginTop: '2px',
          }}
        >
          &copy; {new Date().getFullYear()} Ben Hickman
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;
