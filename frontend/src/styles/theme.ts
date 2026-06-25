import { MuscleGroup } from "../types/trainingSheet";

export type { MuscleGroup };

export type ThemeMode = "light" | "dark";
export type ColorTheme =
  | "electricBlue"
  | "deepViolet"
  | "obsidianGreen"
  | "sunsetOrange"
  | "roseGold";

interface ColorThemeDefinition {
  id: ColorTheme;
  name: string;
  primary: string;
  primaryDark: string;
}

export interface AppTheme {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  colors: {
    primary: string;
    primaryDark: string;
    primaryStrong: string;
    primaryContainer: string;
    primaryGradient: string;
    surface: string;
    surfaceElevated: string;
    background: string;
    onPrimary: string;
    onSurface: string;
    onSurfaceMuted: string;
    onBackground: string;
    onBackgroundMuted: string;
    onBackgroundSubtle: string;
    glassOverlay: string;
    outline: string;
    outlineVariant: string;
    border: string;
    borderAlpha: string;
    error: string;
    errorContainer: string;
    success: string;
    successContainer: string;
    warning: string;
    destructive: string;
    muscleGroups: Record<MuscleGroup, { bg: string; text: string }>;
  };
  typography: {
    displayLarge: { fontSize: string; fontWeight: number };
    headlineMedium: { fontSize: string; fontWeight: number };
    titleLarge: { fontSize: string; fontWeight: number };
    titleMedium: { fontSize: string; fontWeight: number };
    bodyMedium: { fontSize: string; fontWeight: number };
    labelLarge: { fontSize: string; fontWeight: number };
    labelSmall: { fontSize: string; fontWeight: number };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    card: string;
    inner: string;
    header: string;
    chip: string;
    pill: string;
    avatar: string;
  };
  shadows: {
    card: string;
    primary: string;
  };
}

const colorThemes: Record<ColorTheme, ColorThemeDefinition> = {
  electricBlue: {
    id: "electricBlue",
    name: "Electric Blue",
    primary: "#3B82F6",
    primaryDark: "#1D4ED8",
  },
  deepViolet: {
    id: "deepViolet",
    name: "Deep Violet",
    primary: "#7C3AED",
    primaryDark: "#5B21B6",
  },
  obsidianGreen: {
    id: "obsidianGreen",
    name: "Obsidian Green",
    primary: "#059669",
    primaryDark: "#047857",
  },
  sunsetOrange: {
    id: "sunsetOrange",
    name: "Sunset Orange",
    primary: "#EA580C",
    primaryDark: "#C2410C",
  },
  roseGold: {
    id: "roseGold",
    name: "Rose Gold",
    primary: "#E11D48",
    primaryDark: "#BE123C",
  },
};

const muscleGroupsLight: Record<MuscleGroup, { bg: string; text: string }> = {
  Peito: { bg: "#EDE7F6", text: "#4A148C" },
  Tríceps: { bg: "#E8EAF6", text: "#1A237E" },
  Costas: { bg: "#D3E8D0", text: "#386A20" },
  Bíceps: { bg: "#E3F2FD", text: "#0D47A1" },
  Ombros: { bg: "#FFF3E0", text: "#E65100" },
  Abdômen: { bg: "#FFD8E4", text: "#7D5260" },
  Perna: { bg: "#FFF9C4", text: "#F57F17" },
  Glúteo: { bg: "#E0F7FA", text: "#006064" },
  Trapézio: { bg: "#C8E6C9", text: "#2E7D32" },
  Antebraço: { bg: "#BBDEFB", text: "#1565C0" },
  Panturrilha: { bg: "#F9FBE7", text: "#827717" },
};

const muscleGroupsDark: Record<MuscleGroup, { bg: string; text: string }> = {
  Peito: { bg: "#2D2040", text: "#D0BCFF" },
  Tríceps: { bg: "#1E2040", text: "#B0BAF0" },
  Costas: { bg: "#1E3320", text: "#A5D6A7" },
  Bíceps: { bg: "#0D2040", text: "#90CAF9" },
  Ombros: { bg: "#3A2210", text: "#FFCC80" },
  Abdômen: { bg: "#3A1020", text: "#F48FB1" },
  Perna: { bg: "#3A3210", text: "#FFF176" },
  Glúteo: { bg: "#003033", text: "#80DEEA" },
  Trapézio: { bg: "#1A2E1A", text: "#81C784" },
  Antebraço: { bg: "#0A1A30", text: "#64B5F6" },
  Panturrilha: { bg: "#2A2A0A", text: "#E6EE9C" },
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function hexToRgba(hex: string, alpha: number) {
  return `rgba(${hexToRgb(hex)}, ${alpha})`;
}

function createAppTheme(mode: ThemeMode, colorTheme: ColorTheme): AppTheme {
  const theme = colorThemes[colorTheme];
  const isLight = mode === "light";

  const surface = isLight ? "#F8FAFC" : "#0F172A";
  const surfaceElevated = isLight ? "#FFFFFF" : "#1E293B";
  const background = isLight ? "#F1F5F9" : "#020617";
  const text = isLight ? "#0F172A" : "#F8FAFC";
  const muted = isLight ? "#64748B" : "#CBD5E1";
  const subtle = isLight ? "#94A3B8" : "#94A3B8";
  const outline = isLight ? "#0F172A" : "#FFFFFF";
  const outlineVariant = isLight ? "#CBD5E1" : "#475569";
  const glassOverlay = isLight ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.7)";

  return {
    mode,
    colorTheme,
    colors: {
      primary: theme.primary,
      primaryDark: theme.primaryDark,
      primaryStrong: isLight ? theme.primary : theme.primaryDark,
      primaryContainer: isLight
        ? hexToRgba(theme.primary, 0.12)
        : hexToRgba(theme.primaryDark, 0.18),
      primaryGradient: `linear-gradient(153deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
      surface,
      surfaceElevated,
      background,
      onPrimary: "#FFFFFF",
      onSurface: text,
      onSurfaceMuted: muted,
      onBackground: text,
      onBackgroundMuted: muted,
      onBackgroundSubtle: subtle,
      glassOverlay,
      outline,
      outlineVariant,
      border: outline,
      borderAlpha: "0.08",
      error: "#EF4444",
      errorContainer: isLight ? "#FBCACA" : "#7F1D1D",
      success: "#22C55E",
      successContainer: isLight ? "#DCFCE7" : "#064E3B",
      warning: "#F59E0B",
      destructive: "#EF4444",
      muscleGroups: isLight ? muscleGroupsLight : muscleGroupsDark,
    },
    typography: {
      displayLarge: { fontSize: "22px", fontWeight: 700 },
      headlineMedium: { fontSize: "17px", fontWeight: 700 },
      titleLarge: { fontSize: "16px", fontWeight: 600 },
      titleMedium: { fontSize: "15px", fontWeight: 600 },
      bodyMedium: { fontSize: "13px", fontWeight: 400 },
      labelLarge: { fontSize: "12px", fontWeight: 500 },
      labelSmall: { fontSize: "10px", fontWeight: 400 },
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      xxl: "48px",
    },
    borderRadius: {
      card: "24px",
      inner: "20px",
      header: "0 0 28px 28px",
      chip: "12px",
      pill: "1200px",
      avatar: "50%",
    },
    shadows: {
      card: isLight
        ? "0 6px 18px rgba(15, 23, 42, 0.08)"
        : "0 6px 24px rgba(0, 0, 0, 0.45)",
      primary: isLight
        ? `0px 4px 16px rgba(${hexToRgb(theme.primary)}, 0.24)`
        : `0px 4px 16px rgba(${hexToRgb(theme.primaryDark)}, 0.28)`,
    },
  };
}

export const lightTheme = createAppTheme("light", "electricBlue");
export const darkTheme = createAppTheme("dark", "electricBlue");
export const defaultColorTheme: ColorTheme = "electricBlue";
export const colorThemeDefinitions = colorThemes;
export const availableColorThemes = Object.values(colorThemes);
export const buildTheme = createAppTheme;
export const createTheme = createAppTheme;
