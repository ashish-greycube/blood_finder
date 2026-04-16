import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useEffect, useState } from 'react';

const THEME_PREF_KEY = 'themePreference';

export const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  // Restore persisted preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const stored = await SecureStore.getItemAsync(THEME_PREF_KEY);
        if (stored !== null) {
          setIsDark(stored === 'dark');
        }
        // If nothing stored, default stays true (dark)
      } catch (e) {
        console.error('ThemeContext: failed to load preference', e);
      }
    };
    loadPreference();
  }, []);

  const toggleTheme = useCallback(async (nextDark) => {
    // Accept an explicit boolean (from ThemeToggle) or toggle current
    const newIsDark = typeof nextDark === 'boolean' ? nextDark : !isDark;
    setIsDark(newIsDark);
    try {
      await SecureStore.setItemAsync(THEME_PREF_KEY, newIsDark ? 'dark' : 'light');
    } catch (e) {
      console.error('ThemeContext: failed to persist preference', e);
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
