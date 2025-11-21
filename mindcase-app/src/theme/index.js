import React, { createContext, useContext, useState } from 'react';
import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

const ThemeContext = createContext({
  colors: lightColors,
  typography,
  spacing,
  isDark: false,
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  
  const colors = isDark ? darkColors : lightColors;
  
  return (
    <ThemeContext.Provider value={{ colors, typography, spacing, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
