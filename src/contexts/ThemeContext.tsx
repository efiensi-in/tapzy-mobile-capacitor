import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { storage, type ColorTheme } from '../utils/storage';
import { ThemeContext, type Theme } from './theme-context-value';

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function applyColorTheme(colorTheme: ColorTheme) {
  const root = document.documentElement;
  // Remove all color theme classes
  root.classList.remove('theme-emerald', 'theme-blue', 'theme-purple', 'theme-orange');
  // Add the selected color theme class
  root.classList.add(`theme-${colorTheme}`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('emerald');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from storage or system preference
  useEffect(() => {
    const initTheme = async () => {
      const savedTheme = await storage.getTheme();
      const savedColorTheme = await storage.getColorTheme();

      const initialTheme = savedTheme || getSystemTheme();
      const initialColorTheme = savedColorTheme || 'emerald';

      setThemeState(initialTheme);
      setColorThemeState(initialColorTheme);
      applyTheme(initialTheme);
      applyColorTheme(initialColorTheme);
      setIsInitialized(true);
    };

    initTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = async (e: MediaQueryListEvent) => {
      const savedTheme = await storage.getTheme();
      // Only follow system if user hasn't set a preference
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    await storage.setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const setColorTheme = useCallback(async (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
    applyColorTheme(newColorTheme);
    await storage.setColorTheme(newColorTheme);
  }, []);

  // Prevent flash of wrong theme
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        colorTheme,
        toggleTheme,
        setTheme,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
