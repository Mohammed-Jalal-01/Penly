import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  cardBackground: string;
  headerBackground: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export interface ThemeContextType {
  currentTheme: Theme;
  accentColor: string;
  autoTheme: boolean;
  setTheme: (themeId: string) => void;
  setAccentColor: (color: string) => void;
  setAutoTheme: (enabled: boolean) => void;
  themes: Theme[];
  accentColors: Array<{ id: string; name: string; color: string }>;
}

const THEME_STORAGE_KEY = '@notes_app_theme';
const ACCENT_STORAGE_KEY = '@notes_app_accent';
const AUTO_THEME_STORAGE_KEY = '@notes_app_auto_theme';

// Define all available themes
const createThemes = (accentColor: string): Theme[] => [
  {
    id: 'light',
    name: 'Light Mode',
    colors: {
      primary: accentColor,
      secondary: '#F3F4F6',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      accent: accentColor,
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      cardBackground: '#FFFFFF',
      headerBackground: '#FFFFFF',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: accentColor,
      secondary: '#1F2937',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      accent: accentColor,
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      cardBackground: '#1F2937',
      headerBackground: '#111827',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      primary: accentColor,
      secondary: '#0F0F0F',
      background: '#000000',
      surface: '#0F0F0F',
      text: '#FFFFFF',
      textSecondary: '#9CA3AF',
      border: '#1F1F1F',
      accent: accentColor,
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      cardBackground: '#0F0F0F',
      headerBackground: '#000000',
    },
  },
];

// Available accent colors
export const accentColors = [
  { id: 'purple', name: 'Purple', color: '#8B5CF6' },
  { id: 'blue', name: 'Blue', color: '#3B82F6' },
  { id: 'green', name: 'Green', color: '#10B981' },
  { id: 'orange', name: 'Orange', color: '#F59E0B' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'indigo', name: 'Indigo', color: '#6366F1' },
  { id: 'teal', name: 'Teal', color: '#14B8A6' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentThemeId, setCurrentThemeId] = useState('dark');
  const [accentColor, setAccentColorState] = useState('#8B5CF6');
  const [autoTheme, setAutoThemeState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const themes = createThemes(accentColor);
  const currentTheme = themes.find(theme => theme.id === currentThemeId) || themes[1];

  // Load saved preferences
  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const [savedTheme, savedAccent, savedAutoTheme] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(ACCENT_STORAGE_KEY),
        AsyncStorage.getItem(AUTO_THEME_STORAGE_KEY),
      ]);

      if (savedTheme) {
        setCurrentThemeId(savedTheme);
      }
      if (savedAccent) {
        setAccentColorState(savedAccent);
      }
      if (savedAutoTheme !== null) {
        setAutoThemeState(JSON.parse(savedAutoTheme));
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (themeId: string) => {
    setCurrentThemeId(themeId);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setAccentColor = async (color: string) => {
    setAccentColorState(color);
    try {
      await AsyncStorage.setItem(ACCENT_STORAGE_KEY, color);
    } catch (error) {
      console.error('Error saving accent color:', error);
    }
  };

  const setAutoTheme = async (enabled: boolean) => {
    setAutoThemeState(enabled);
    try {
      await AsyncStorage.setItem(AUTO_THEME_STORAGE_KEY, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving auto theme preference:', error);
    }
  };

  // Don't render children until theme is loaded
  if (!isLoaded) {
    return null;
  }

  const value: ThemeContextType = {
    currentTheme,
    accentColor,
    autoTheme,
    setTheme,
    setAccentColor,
    setAutoTheme,
    themes,
    accentColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}