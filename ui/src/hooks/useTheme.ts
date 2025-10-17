import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeSource = 'system' | 'manual';

const STORAGE_MODE_KEY = 'zennlogic-theme-mode';
const STORAGE_SOURCE_KEY = 'zennlogic-theme-source';

export const useTheme = () => {
  const getSystemTheme = (): ThemeMode =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const getInitial = (): { mode: ThemeMode; source: ThemeSource } => {
    const savedSource = (localStorage.getItem(STORAGE_SOURCE_KEY) as ThemeSource) || 'system';
    const savedMode = localStorage.getItem(STORAGE_MODE_KEY) as ThemeMode | null;
    if (savedSource === 'manual' && (savedMode === 'light' || savedMode === 'dark')) {
      return { mode: savedMode, source: 'manual' };
    }
    return { mode: getSystemTheme(), source: 'system' };
  };

  // Use lazy initialization with useState instead of useMemo
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getInitial().mode);
  const [source, setSource] = useState<ThemeSource>(() => getInitial().source);

  // Persist preference
  useEffect(() => {
    localStorage.setItem(STORAGE_SOURCE_KEY, source);
    if (source === 'manual') {
      localStorage.setItem(STORAGE_MODE_KEY, themeMode);
    } else {
      localStorage.removeItem(STORAGE_MODE_KEY);
    }
  }, [source, themeMode]);

  // React to system changes when source is system
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      if (source === 'system') {
        setThemeModeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [source]);

  // Apply to <html> for CSS tokens - do this synchronously, not in useEffect
  // This ensures CSS variables are updated before MUI theme reads them
  document.documentElement.setAttribute('data-theme', themeMode);

  const setThemeMode = (mode: string) => {
    if (mode === 'system') {
      setSource('system');
      setThemeModeState(getSystemTheme());
      return;
    }
    if (mode === 'light' || mode === 'dark') {
      setSource('manual');
      setThemeModeState(mode);
    }
  };

  return { themeMode, setThemeMode };
};
