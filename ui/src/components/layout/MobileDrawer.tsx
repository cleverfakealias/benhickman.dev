import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const [visible, setVisible] = React.useState(open);
  React.useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1999,
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
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--space-3)',
            zIndex: 2000,
            transform: open ? 'translateY(0)' : 'translateY(-32px)',
            opacity: open ? 1 : 0,
            transition:
              'transform 300ms cubic-bezier(0.4,0,0.2,1), opacity 300ms cubic-bezier(0.4,0,0.2,1)',
            maxHeight: '100vh',
            overflowY: 'auto',
          }}
          onTransitionEnd={() => {
            if (!open) setVisible(false);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Link
              to="/"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                textDecoration: 'none',
                color: 'var(--color-text)',
                fontFamily: 'Geist, sans-serif',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
              aria-label={`${brand.name} — home`}
            >
              <span
                aria-hidden="true"
                style={{ color: 'var(--color-accent-hex)', fontSize: '1.2rem' }}
              >
                ◉
              </span>
              <span>{brand.name}</span>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontSize: '1.25rem',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Nav */}
          <nav aria-label="Mobile navigation">
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 'var(--space-3)',
                        color: active ? 'var(--color-accent-hex)' : 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: active ? 600 : 400,
                        textDecoration: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem',
                        minHeight: '44px',
                      }}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-accent-hex)',
                            marginRight: '0.7rem',
                            display: 'inline-block',
                          }}
                        />
                      )}
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Socials */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border)',
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
