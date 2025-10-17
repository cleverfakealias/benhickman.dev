import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, useTheme } from '@mui/material';
import FocusTrap from 'focus-trap-react';
import Socials from './Socials';

interface Props {
  open: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  brand: { logo: string; name: string; subtitle?: string; alt: string };
  isActiveLink: (href: string) => boolean;
}

const MobileDrawer: React.FC<Props> = ({ open, onClose, navLinks, brand, isActiveLink }) => {
  const theme = useTheme();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Animate drawer and backdrop
  const [visible, setVisible] = React.useState(open);
  React.useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  if (!visible) return null;

  return (
    <>
      {/* Animated Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1999,
          backdropFilter: 'blur(4px)',
          cursor: 'pointer',
          opacity: open ? 1 : 0,
          transition: 'opacity 300ms cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
        onTouchEnd={onClose}
        aria-hidden="true"
      />

      <FocusTrap>
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: 'var(--space-3)',
            zIndex: 2000,
            transform: open ? 'translateY(0)' : 'translateY(-32px)',
            opacity: open ? 1 : 0,
            transition:
              'transform 300ms cubic-bezier(0.4,0,0.2,1), opacity 300ms cubic-bezier(0.4,0,0.2,1)',
            boxShadow: theme.shadows[2],
            maxHeight: '100vh',
            overflowY: 'auto',
          }}
          onTransitionEnd={() => {
            if (!open) setVisible(false);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 'var(--space-3)',
              borderBottom: `1px solid ${theme.palette.primary.contrastText}1A`,
              marginBottom: 'var(--space-4)',
            }}
          >
            <Link
              to="/"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: theme.palette.primary.contrastText,
                fontSize: '1.1rem',
                fontWeight: '600',
              }}
              aria-label={`Go to ${brand.name} home page`}
            >
              <Avatar
                src={brand.logo}
                alt={brand.alt}
                sx={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${theme.palette.secondary.main}`,
                  boxShadow: theme.shadows[1],
                  bgcolor: 'background.paper',
                }}
              />
              <span>{brand.name}</span>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              style={{
                background: 'none',
                border: 'none',
                color: theme.palette.primary.contrastText,
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'background-color 0.2s ease',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.palette.primary.contrastText}1A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Mobile navigation">
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    aria-current={isActiveLink(link.href) ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--space-3)',
                      color: isActiveLink(link.href)
                        ? theme.palette.secondary.main
                        : theme.palette.primary.contrastText,
                      fontWeight: isActiveLink(link.href) ? '700' : '400',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                      fontSize: '1.1rem',
                      minHeight: '44px',
                      position: 'relative',
                    }}
                  >
                    {isActiveLink(link.href) && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: theme.palette.secondary.main,
                          boxShadow: `0 0 8px ${theme.palette.mode === 'dark' ? 'rgba(140, 210, 239, 0.3)' : 'rgba(65, 42, 145, 0.3)'}`,
                          marginRight: '0.75rem',
                          display: 'inline-block',
                        }}
                      />
                    )}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${theme.palette.primary.contrastText}1A`,
              textAlign: 'center',
            }}
          >
            <Socials />
          </div>
        </div>
      </FocusTrap>
    </>
  );
};

export default MobileDrawer;
