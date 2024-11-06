// ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

type ThemeContextType = {
  theme: Theme;
  isDarkTheme: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  return (
    <ThemeContext.Provider value={{
      theme: isDarkTheme ? DarkTheme : DefaultTheme,
      isDarkTheme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook para usar o contexto de tema em outros componentes
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
