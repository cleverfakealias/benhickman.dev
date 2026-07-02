import React, { useState } from 'react';
import { useConsent } from '../../hooks/useConsent';
import { Box, Typography, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Socials from './Socials';
import { FaSun, FaMoon } from 'react-icons/fa';
import { getDomainConfig } from '../../config/domainConfig';
import { navLinks } from '../../config/navLinks';

const iconBtnSx = {
  width: 32,
  height: 32,
  color: 'var(--color-text-muted)',
  border: '1px solid transparent',
  transition:
    'color 0.15s var(--easing-standard), border-color 0.15s var(--easing-standard), background 0.15s var(--easing-standard)',
  '&:hover': {
    color: 'var(--color-accent-hex)',
    borderColor: 'var(--color-border)',
    background: 'color-mix(in oklch, var(--color-accent) 8%, transparent)',
  },
} as const;

const FooterQuickLinks: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setSettingsOpen } = useConsent();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <Tooltip title="Quick links">
        <IconButton
          aria-label="Quick links"
          aria-controls={open ? 'footer-quick-links-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          size="small"
          sx={iconBtnSx}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        id="footer-quick-links-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/privacy"
          sx={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', minWidth: 140 }}
        >
          Privacy Policy
        </MenuItem>
        {navLinks.map((link) => (
          <MenuItem
            key={link.name}
            component={Link}
            to={link.href}
            onClick={handleClose}
            sx={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', minWidth: 140 }}
          >
            {link.name}
          </MenuItem>
        ))}
        <MenuItem
          key="cookies"
          onClick={() => {
            setSettingsOpen(true);
            handleClose();
          }}
          sx={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', minWidth: 140 }}
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

export const Footer: React.FC<FooterProps> = ({ themeMode, setThemeMode }) => {
  const isDark = themeMode === 'dark';
  const { branding } = getDomainConfig();

  return (
    <Box
      component="footer"
      role="contentinfo"
      aria-label="Site footer"
      sx={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        // Clear the fixed mobile bottom tab bar (it overlays the viewport bottom).
        pb: { xs: 'calc(var(--bottom-nav-h) + env(safe-area-inset-bottom))', md: 0 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1240,
          mx: 'auto',
          px: 'clamp(16px, 5vw, 40px)',
          py: 'var(--space-3)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2) var(--space-4)',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.01em',
          }}
        >
          © {new Date().getFullYear()} {branding.name} · built in an IDE
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            aria-hidden="true"
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              display: { xs: 'none', md: 'inline' },
              mr: 0.5,
            }}
          >
            ◉ model → agent → UI
          </Typography>
          <FooterQuickLinks />
          <Socials />
          <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              size="small"
              sx={iconBtnSx}
            >
              {isDark ? <FaSun size={14} /> : <FaMoon size={12} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
