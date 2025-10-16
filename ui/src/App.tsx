import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './hooks/useTheme';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteSkeleton from './components/common/RouteSkeleton';
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./components/features/blog/BlogPostDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const DevelopmentExperience = lazy(() => import('./pages/DevelopmentExperience'));
const Playground = lazy(() => import('./pages/Playground'));
import { buildTheme } from './theme/theme';
import { useState, useEffect } from 'react';
import { getDomainConfig } from './config/domainConfig';
import './theme/tokens.css';

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: '2rem',
        paddingBottom: '6rem',
        marginBottom: 0,
        gap: '2rem',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(24px)',
        transition:
          'opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <ErrorBoundary fallback={<div role="alert" style={{ padding: '2rem' }}>Unable to load route.</div>}>
        <Suspense fallback={<RouteSkeleton /> }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/post/:slug" element={<BlogPostDetail />} />
            <Route path="experience" element={<DevelopmentExperience />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="playground" element={<Playground />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
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
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', branding.description);
  }, [branding]);

  // Apply html data-theme for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // New MUI theme based on CSS vars; keep old theme available if needed
  const theme = buildTheme(themeMode as 'light' | 'dark');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header themeMode={themeMode} setThemeMode={setThemeMode} />
        <main id="main-content"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginTop: '4.5rem', // Space for fixed header
            marginBottom: '4rem', // Space for fixed footer
            minHeight: 'calc(100vh - 8.5rem)', // Full height minus header and footer
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
