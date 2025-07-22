import React, { createContext, useContext, ReactNode } from 'react';
import { LightColors, DarkColors } from '@/constants/colors';
import { useProfileStore } from '@/store/profile';

type ColorScheme = typeof LightColors;

interface ThemeContextType {
  colors: ColorScheme;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfileStore();
  const isDarkMode = profile.settings.darkMode;
  const colors = isDarkMode ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}