import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Tooltip, useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Footer.css';
import Socials from './Socials';
import { FaSun, FaMoon } from 'react-icons/fa';

// Quick Links Dropdown Component and navLinks must be outside Footer
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Career', href: '/career' },
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
          sx={{
            width: 32,
            height: 32,
            color: 'var(--color-text-secondary-hex)',
            opacity: 0.7,
            border: '1px solid transparent',
            transition:
              'color 0.15s var(--easing-standard), ' +
              'opacity 0.15s var(--easing-standard), ' +
              'border-color 0.15s var(--easing-standard), ' +
              'background 0.15s var(--easing-standard)',
            '&:hover': {
              color: 'var(--color-accent-hex)',
              opacity: 1,
              borderColor: 'var(--color-border)',
              background: 'color-mix(in oklch, var(--color-accent) 8%, transparent)',
            },
          }}
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



interface FooterProps {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

const Footer: React.FC<FooterProps> = ({ themeMode, setThemeMode }) => {
  const theme = useTheme();
  const isDark = themeMode === 'dark';

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <Box className="footer-content">
        {/* Left: Tagline with copper accent dot */}
        <Box className="footer-cell-left" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'var(--color-secondary-hex)',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: '0.75rem', md: '0.8125rem' },
              fontWeight: 600,
              color: theme.palette.text.secondary,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
            aria-label="Mission statement"
          >
            Architect. Build. Elevate.
          </Typography>
        </Box>

        {/* Center: Copyright */}
        <Box className="footer-cell-center">
          <Typography
            sx={{
              fontSize: { xs: '0.7rem', md: '0.8125rem' },
              color: theme.palette.text.secondary,
              opacity: 0.7,
            }}
          >
            © {new Date().getFullYear()} Ben Hickman
          </Typography>
        </Box>

        {/* Right: Icons */}
        <Box
          className="footer-cell-right"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, md: 1 },
          }}
        >
          <FooterQuickLinks />
          <Socials />
          <IconButton
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            sx={{
              width: 32,
              height: 32,
              color: theme.palette.text.secondary,
              opacity: 0.7,
              border: '1px solid transparent',
              transition:
                'color 0.15s var(--easing-standard), ' +
                'opacity 0.15s var(--easing-standard), ' +
                'border-color 0.15s var(--easing-standard), ' +
                'background 0.15s var(--easing-standard)',
              '&:hover': {
                color: 'var(--color-accent-hex)',
                opacity: 1,
                borderColor: 'var(--color-border)',
                background: 'color-mix(in oklch, var(--color-accent) 8%, transparent)',
              },
            }}
          >
            {isDark ? <FaSun size={14} /> : <FaMoon size={12} />}
          </IconButton>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
