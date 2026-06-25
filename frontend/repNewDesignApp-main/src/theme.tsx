import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeId = 'electric' | 'violet' | 'green' | 'orange' | 'rose';
export type Mode = 'dark' | 'light';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  primary: string;
  primaryDark: string;
}

export const THEMES: ThemeDef[] = [
  { id: 'electric', name: 'Electric Blue', primary: '#3B82F6', primaryDark: '#1D4ED8' },
  { id: 'violet', name: 'Deep Violet', primary: '#7C3AED', primaryDark: '#5B21B6' },
  { id: 'green', name: 'Obsidian Green', primary: '#059669', primaryDark: '#047857' },
  { id: 'orange', name: 'Sunset Orange', primary: '#EA580C', primaryDark: '#C2410C' },
  { id: 'rose', name: 'Rose Gold', primary: '#E11D48', primaryDark: '#BE123C' },
];

interface ThemeContextValue {
  theme: ThemeId;
  mode: Mode;
  setTheme: (t: ThemeId) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  themeDef: ThemeDef;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>('electric');
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    const root = document.documentElement;
    const def = THEMES.find((t) => t.id === theme)!;
    root.style.setProperty('--c-primary', hexToRgb(def.primary));
    root.style.setProperty('--c-primary-dark', hexToRgb(def.primaryDark));
    root.classList.toggle('light', mode === 'light');
  }, [theme, mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      setTheme,
      setMode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      themeDef: THEMES.find((t) => t.id === theme)!,
    }),
    [theme, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
