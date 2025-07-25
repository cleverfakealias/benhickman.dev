import "./styles/App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "./hooks/useTheme";
import Blog from "./components/features/Blog";
import BlogPostDetail from "./components/features/BlogPostDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DevelopmentExperience from "./pages/DevelopmentExperience";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { createMnTheme } from "./styles/theme";
import { useEffect } from "react";
import { getDomainConfig } from "./config/domainConfig";
function App() {
  const { themeMode, setThemeMode } = useTheme();

  // Set document title and meta description dynamically
  useEffect(() => {
    const { branding } = getDomainConfig();
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
  }, []);

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
          <Container
            maxWidth="lg"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingTop: { xs: 2, md: 3 }, // Small responsive top padding
              paddingBottom: { xs: 6, md: 8 }, // More bottom padding for footer space
              marginBottom: 0,
              gap: { xs: 2, md: 3 }, // Consistent spacing between child components
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/post/:slug" element={<BlogPostDetail />} />
              <Route path="experience" element={<DevelopmentExperience />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Routes>
          </Container>
        </main>
        <Footer themeMode={themeMode} setThemeMode={setThemeMode} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
