import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";
import Socials from "./Socials";

interface Props {
  open: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  brand: { logo: string; name: string; subtitle: string; alt: string };
  isActiveLink: (href: string) => boolean;
}

const MobileDrawer: React.FC<Props> = ({ open, onClose, navLinks, brand, isActiveLink }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <FocusTrap>
      <div
        ref={drawerRef}
        className="mobile-drawer open"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "75%",
          background: "#111",
          padding: "2rem",
          zIndex: 2000,
          transition: "transform 0.3s ease",
        }}
      >
        <Link to="/" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={brand.logo} alt={brand.alt} style={{ width: "2.75rem" }} />
          <span>{brand.name} {brand.subtitle}</span>
        </Link>
        <ul style={{ marginTop: "2rem", listStyle: "none", padding: 0 }}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                onClick={onClose}
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  color: isActiveLink(link.href) ? "#8CD2EF" : "#fff",
                  fontWeight: isActiveLink(link.href) ? 600 : 400,
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Socials />
        </div>
      </div>
    </FocusTrap>
  );
};

export default MobileDrawer;
