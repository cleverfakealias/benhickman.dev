import React, { useState, useEffect, useRef } from "react";
import { Avatar, Box, Typography, IconButton, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, matchPath } from "react-router-dom";
import debounce from "lodash/debounce";
import { getDomainConfig } from "../../config/domainConfig";
import Socials from "./Socials";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MobileDrawer from "./MobileDrawer";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Experience", href: "/experience" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
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

  const isActiveLink = (href: string) =>
    !!matchPath({ path: href, end: href === "/" }, location.pathname);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  return (
    <header 
      className="header" 
      role="banner" 
      aria-label="Site header"
              style={{
          background: '#412A91',
          color: '#ffffff'
        }}
    >
      <nav
        className="header-nav"
        aria-label="Main navigation"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          alignItems: "center",
          minHeight: "4.5rem",
        }}
      >
        {/* Left: Brand */}
        <Link
          to="/"
          aria-label="Go to home"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Avatar
            src={brand.logo}
            alt={brand.alt}
            sx={{
              width: 64,
              height: 64,
              border: `3px solid ${theme.palette.primary.light}`,
              boxShadow: "0 4px 24px 0 rgba(140,210,239,0.15)",
              bgcolor: "#fff",
              marginRight: "0.5rem",
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography
              variant="h2"
              component="span"
              sx={{
                fontWeight: 900,
                color: theme.palette.text.primary,
                fontFamily: "'Manrope', Arial, sans-serif",
                fontSize: { xs: "1.7rem", md: "2.5rem" },
              }}
            >
              {brand.name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: { xs: "1.08rem", md: "1.22rem" },
              }}
            >
              {brand.subtitle}
            </Typography>
          </Box>
        </Link>

        {/* Center: Nav links */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {!isMobile && (
            <ul className="header-links" style={{ display: "flex", gap: "1.5rem" }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={isActiveLink(link.href) ? "active" : ""}
                    style={{
                      position: "relative",
                      ...(isActiveLink(link.href) && {
                        color: theme.palette.primary.light,
                        fontWeight: 600,
                        textShadow: `0 0 8px ${theme.palette.primary.light}`,
                      }),
                    }}
                  >
                    {link.name}
                    {isActiveLink(link.href) && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100%",
                          height: "4px",
                          background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                          borderRadius: "4px",
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1.5 }}>
          {!isMobile && <Socials />}
          {!isMobile && (
            <IconButton onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}>
              {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          )}
          {isMobile && (
            <>
              <IconButton
                aria-label="Toggle menu"
                onClick={handleDrawerToggle}
                sx={{ color: theme.palette.primary.light }}
              >
                <MenuIcon />
              </IconButton>
              <MobileDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                navLinks={navLinks}
                brand={brand}
                isActiveLink={isActiveLink}
              />
            </>
          )}
        </Box>
      </nav>
    </header>
  );
};

export default Header;
