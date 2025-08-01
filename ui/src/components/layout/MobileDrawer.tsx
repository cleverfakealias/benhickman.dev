import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import FocusTrap from "focus-trap-react";
import Socials from "./Socials";

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
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop for click outside */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 1999,
          backdropFilter: "blur(4px)",
          cursor: "pointer",
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
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "#412A91",
            color: "#ffffff",
            padding: "1rem",
            zIndex: 2000,
            transform: "translateY(0)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "1.5rem",
          }}>
            <Link 
              to="/" 
              onClick={onClose} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.75rem",
                textDecoration: "none",
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
              aria-label={`Go to ${brand.name} home page`}
            >
              <Avatar
                src={brand.logo}
                alt={brand.alt}
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid #8CD2EF",
                  boxShadow: "0 2px 12px 0 rgba(140, 210, 239, 0.15)",
                  bgcolor: "background.paper",
                }}
              />
              <span>{brand.name}</span>
            </Link>
            
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Mobile navigation">
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                                          style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1rem",
                        color: isActiveLink(link.href) ? "#8CD2EF" : "#ffffff",
                        fontWeight: isActiveLink(link.href) ? "600" : "400",
                        textDecoration: "none",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        fontSize: "1.1rem",
                        minHeight: "44px",
                      }}
                    onMouseEnter={(e) => {
                      if (!isActiveLink(link.href)) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveLink(link.href)) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {link.name}
                    {isActiveLink(link.href) && (
                      <span style={{
                        marginLeft: "auto",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#8CD2EF",
                        boxShadow: "0 0 8px rgba(140, 210, 239, 0.5)",
                      }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div style={{ 
            marginTop: "2rem", 
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}>
            <Socials />
          </div>
        </div>
      </FocusTrap>
    </>
  );
};

export default MobileDrawer;
