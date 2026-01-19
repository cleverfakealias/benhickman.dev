import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './hooks/useTheme';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteSkeleton from './components/common/RouteSkeleton';
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./components/features/blog/BlogPostDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Playground = lazy(() => import('./pages/Playground'));
const DevelopmentExperience = lazy(() => import('./pages/DevelopmentExperience'));
import { buildTheme } from './theme/theme';
import { getDomainConfig } from './config/domainConfig';
import { ConsentProvider } from './contexts/consent/ConsentProvider';
import ConsentBanner from './components/common/ConsentBanner';
import CookieSettingsModal from './components/common/CookieSettingsModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AnalyticsTracker from './components/common/AnalyticsTracker';
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
        paddingBottom: 'var(--space-7)',
        marginBottom: 0,
        gap: 'var(--space-3)',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(24px)',
        transition:
          'opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <ErrorBoundary
        fallback={
          <div role="alert" style={{ padding: 'var(--space-3)' }}>
            Unable to load route.
          </div>
        }
      >
        <Suspense fallback={<RouteSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="experience" element={<DevelopmentExperience />} />
            <Route path="career" element={<DevelopmentExperience />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="contact" element={<Contact />} />
            <Route path="playground" element={<Playground />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Internal AnalyticsTracker removed - replaced by src/components/common/AnalyticsTracker.tsx

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

  // Note: useTheme hook already sets html[data-theme], no need to duplicate here

  // New MUI theme based on CSS vars; keep old theme available if needed
  // Memoize theme to ensure it's recreated when themeMode changes
  const theme = useMemo(() => buildTheme(themeMode as 'light' | 'dark'), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <ConsentProvider>
        <CssBaseline />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AnalyticsTracker />
          <Header themeMode={themeMode} setThemeMode={setThemeMode} />
          <main
            id="main-content"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 'var(--space-5)', // Space for fixed footer
              minHeight: 'calc(100vh - 64px - 52px)', // Full height minus header and footer
            }}
          >
            <AnimatedPageContainer />
          </main>
          <Footer themeMode={themeMode} setThemeMode={setThemeMode} />
          <ConsentBanner />
        </Router>
        <CookieSettingsModal />
      </ConsentProvider>
    </ThemeProvider>
  );
}

export default App;
