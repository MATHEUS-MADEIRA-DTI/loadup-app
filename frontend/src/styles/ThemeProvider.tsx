"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

import {
  AppTheme,
  ColorTheme,
  ThemeMode,
  buildTheme,
  defaultColorTheme,
} from "./theme";

const THEME_MODE_KEY = "loadup_theme_mode";
const COLOR_THEME_KEY = "loadup_color_theme";

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  colorKey: ColorTheme;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_MODE_KEY);
  return stored === "light" ? "light" : "dark";
}

function getInitialColorTheme(): ColorTheme {
  if (typeof window === "undefined") return defaultColorTheme;
  const stored = window.localStorage.getItem(
    COLOR_THEME_KEY,
  ) as ColorTheme | null;
  const allowed: ColorTheme[] = [
    "electricBlue",
    "deepViolet",
    "obsidianGreen",
    "sunsetOrange",
    "roseGold",
  ];
  return stored && allowed.includes(stored) ? stored : defaultColorTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [colorKey, setColorKey] = useState<ColorTheme>(getInitialColorTheme);

  useEffect(() => {
    window.localStorage.setItem(THEME_MODE_KEY, mode);
    document.documentElement.classList.toggle("light", mode === "light");
  }, [mode]);

  useEffect(() => {
    window.localStorage.setItem(COLOR_THEME_KEY, colorKey);
  }, [colorKey]);

  const theme = useMemo(() => buildTheme(mode, colorKey), [mode, colorKey]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorKey(theme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode, colorKey, setMode, setColorTheme, toggleMode }),
    [theme, mode, colorKey, setMode, setColorTheme, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export function useAppTheme(): ThemeContextValue {
  return useTheme();
}
