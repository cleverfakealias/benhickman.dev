import React, { useState } from 'react';
import { useConsent } from '../../hooks/useConsent';
import { Box, Typography, Menu, MenuItem, IconButton, Tooltip, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Socials from './Socials';
import { FaSun, FaMoon } from 'react-icons/fa';
import { getDomainConfig } from '../../config/domainConfig';

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
  const { setSettingsOpen } = useConsent(); // Use the consent hook
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
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/privacy"
          sx={{ fontSize: '0.95rem', minWidth: 120 }}
        >
          Privacy Policy
        </MenuItem>
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
        <MenuItem
          key="cookies"
          onClick={() => {
            // Open the settings modal
            setSettingsOpen(true);
            handleClose();
          }}
          sx={{ fontSize: '0.95rem', minWidth: 120 }}
        >
          Cookie Preferences
        </MenuItem>
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
  const config = getDomainConfig();

  return (
    <Box
      component="footer"
      role="contentinfo"
      aria-label="Site footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'color-mix(in oklch, var(--color-bg) 90%, black 5%)',
        backdropFilter: 'saturate(120%) blur(6px)',
        WebkitBackdropFilter: 'saturate(120%) blur(6px)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.04)',
        p: 0,
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: 'var(--space-4)',
          height: { xs: 'auto', sm: 'clamp(44px, 6vw, 52px)' },
          display: 'grid',
          gridTemplateColumns: { xs: 'auto 1fr auto', sm: '1fr auto 1fr' },
          alignItems: 'center',
          gap: { xs: 'var(--space-2)', sm: 'var(--space-3)' },
          py: { xs: 'var(--space-2)', sm: 0 },
        }}
      >
        {/* Left: Tagline with copper accent dot */}
        <Box
          sx={{
            justifySelf: 'start',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
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
        <Box
          sx={{
            justifySelf: 'center',
            order: { xs: 3, sm: 0 },
            gridColumn: { xs: '1 / -1', sm: 'auto' },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.7rem', md: '0.8125rem' },
              color: theme.palette.text.secondary,
              opacity: 0.7,
            }}
          >
            © {new Date().getFullYear()} {config.branding.name}
          </Typography>
        </Box>

        {/* Right: Icons */}
        <Box
          sx={{
            justifySelf: 'end',
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
    </Box>
  );
};

export default Footer;
