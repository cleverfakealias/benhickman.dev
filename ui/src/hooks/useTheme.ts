import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'zennlogic-theme-mode';

export const useTheme = () => {
  const getInitialTheme = (): 'light' | 'dark' => {
    // First, try to get from localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(getInitialTheme);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  // Listen for system theme changes (only if no manual preference is set)
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    // Only listen to system changes if user hasn't manually set a preference
    if (!savedTheme) {
      const listener = (e: MediaQueryListEvent) => {
        setThemeMode(e.matches ? 'dark' : 'light');
      };

      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', listener);

      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Update document body attribute
  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const setThemeModeString = (mode: string) => {
    if (mode === 'light' || mode === 'dark') {
      setThemeMode(mode);
    }
  };

  return { themeMode, setThemeMode: setThemeModeString };
};
