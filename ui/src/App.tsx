import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './hooks/useTheme';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useParams,
} from 'react-router-dom';
import { lazy, Suspense, useState, useEffect, useMemo, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
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

// Legacy /blog/:slug links → /blog/post/:slug. Navigate's `to` is a literal
// string (it does not substitute `:slug`), so resolve the param explicitly.
function LegacyBlogRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/blog/post/${slug}`} replace />;
}

function AnimatedPageContainer() {
  const location = useLocation();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [animate, setAnimate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimate(true);
      return;
    }
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 0);
    return () => clearTimeout(timeout);
  }, [location.pathname, prefersReducedMotion]);

  // Move focus to the page region on navigation (skip the initial mount) for a11y.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    containerRef.current?.focus();
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingBottom: 'var(--space-7)',
        marginBottom: 0,
        gap: 'var(--space-3)',
        outline: 'none',
        opacity: prefersReducedMotion || animate ? 1 : 0,
        transform: prefersReducedMotion || animate ? 'translateY(0)' : 'translateY(24px)',
        transition: prefersReducedMotion
          ? 'none'
          : 'opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.4,0,0.2,1)',
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
            <Route path="/blog/post/:slug" element={<BlogPostDetail />} />
            <Route path="/blog/:slug" element={<LegacyBlogRedirect />} />
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
            }}
          >
            <AnimatedPageContainer />
          </main>
          <Footer themeMode={themeMode} setThemeMode={setThemeMode} />
          <BottomNav />
          <ConsentBanner />
        </Router>
        <CookieSettingsModal />
      </ConsentProvider>
    </ThemeProvider>
  );
}

export default App;
