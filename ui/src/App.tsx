import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "./hooks/useTheme";
import Blog from "./pages/Blog";
import BlogPostDetail from "./components/features/blog/BlogPostDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DevelopmentExperience from "./pages/DevelopmentExperience";
import Playground from "./pages/Playground";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { createMnTheme } from "./styles/theme";
import { useState, useEffect } from "react";
import { getDomainConfig } from "./config/domainConfig";

function AnimatedPageContainer() {
  const location = useLocation();
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 0);
    return () => clearTimeout(timeout);
  }, [location.pathname]);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: "2rem",
        paddingBottom: "6rem",
        marginBottom: 0,
        gap: "2rem",
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/post/:slug" element={<BlogPostDetail />} />
        <Route path="experience" element={<DevelopmentExperience />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="playground" element={<Playground />} />
      </Routes>
    </div>
  );
}

function App() {
  const { themeMode, setThemeMode } = useTheme();
  const { branding } = getDomainConfig();
  // Set document title and meta description dynamically
  useEffect(() => {
    // Set document title
    document.title = branding.title;
    // Set or update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", branding.description);
  }, [branding]);

  const theme = createMnTheme(themeMode as "light" | "dark");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header themeMode={themeMode} setThemeMode={setThemeMode} />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: "4.5rem", // Space for fixed header
            marginBottom: "4rem", // Space for fixed footer
            minHeight: "calc(100vh - 8.5rem)", // Full height minus header and footer
          }}
        >
          <AnimatedPageContainer />
        </main>
        <Footer themeMode={themeMode} setThemeMode={setThemeMode} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
