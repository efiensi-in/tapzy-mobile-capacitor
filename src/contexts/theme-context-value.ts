import { createContext } from 'react';
import type { ColorTheme } from '../utils/storage';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
