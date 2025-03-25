import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tema warna yang tersedia
export const THEMES = {
  AMBER: {
    name: 'amber',
    primary: '#FFB800',
    secondary: '#FF8A00',
    accent: '#FFC107',
    background: {
      light: '#FFF9E6',
      card: '#FFFFFF',
      dark: '#1F1F1F',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#757575',
      onDark: '#FFFFFF',
    }
  },
  BLUE: {
    name: 'blue',
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    accent: '#60A5FA',
    background: {
      light: '#EFF6FF',
      card: '#FFFFFF',
      dark: '#1F1F1F',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#757575',
      onDark: '#FFFFFF',
    }
  },
  GREEN: {
    name: 'green',
    primary: '#10B981',
    secondary: '#047857',
    accent: '#34D399',
    background: {
      light: '#ECFDF5',
      card: '#FFFFFF',
      dark: '#1F1F1F',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#757575',
      onDark: '#FFFFFF',
    }
  },
  PURPLE: {
    name: 'purple',
    primary: '#8B5CF6',
    secondary: '#6D28D9',
    accent: '#A78BFA',
    background: {
      light: '#F5F3FF',
      card: '#FFFFFF',
      dark: '#1F1F1F',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#757575',
      onDark: '#FFFFFF',
    }
  },
  ROSE: {
    name: 'rose',
    primary: '#EC4899',
    secondary: '#BE185D',
    accent: '#F472B6',
    background: {
      light: '#FDF2F8',
      card: '#FFFFFF',
      dark: '#1F1F1F',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#757575',
      onDark: '#FFFFFF',
    }
  }
};

export type ThemeType = typeof THEMES.AMBER;

type ThemeContextType = {
  theme: ThemeType;
  darkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(THEMES.AMBER);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme);
          setThemeState(parsedTheme);
        }
        
        if (savedDarkMode) {
          setDarkMode(savedDarkMode === 'true');
        }
      } catch (error) {
        console.error('Error loading theme', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, []);

  // Save theme to AsyncStorage
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(newTheme));
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = async () => {
    try {
      const newMode = !darkMode;
      await AsyncStorage.setItem('darkMode', newMode.toString());
      setDarkMode(newMode);
    } catch (error) {
      console.error('Error toggling dark mode', error);
    }
  };

  if (isLoading) {
    return null; // atau tampilkan loading indicator
  }

  return (
    <ThemeContext.Provider value={{ theme, darkMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};