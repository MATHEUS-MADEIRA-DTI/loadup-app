import { MuscleGroup } from "../types/trainingSheet";

export type { MuscleGroup };

export interface AppTheme {
  colors: {
    primary: string;
    primaryStrong: string;
    primaryContainer: string;
    primaryGradient: string;
    surface: string;
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
    error: string;
    errorContainer: string;
    success: string;
    successContainer: string;
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

export const lightTheme: AppTheme = {
  colors: {
    primary: "#6750A4",
    primaryStrong: "#6750A4",
    primaryContainer: "#EDE7F6",
    primaryGradient:
      "linear-gradient(153deg, rgba(103,80,164,1) 0%, rgba(74,20,140,1) 100%)",
    surface: "#FFFBFE",
    background: "#F6F0FA",
    onPrimary: "#FFFFFF",
    onSurface: "#1C1B1F",
    onSurfaceMuted: "#49454F",
    onBackground: "#1C1B1F",
    onBackgroundMuted: "#49454F",
    onBackgroundSubtle: "#79747E",
    glassOverlay: "rgba(255,255,255,0.15)",
    outline: "#79747E",
    outlineVariant: "#CAC4D0",
    error: "#B3261E",
    errorContainer: "#F9DEDC",
    success: "#386A20",
    successContainer: "#D3E8D0",
    muscleGroups: muscleGroupsLight,
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
    card: "48px",
    inner: "36px",
    header: "0 0 36px 36px",
    chip: "20px",
    pill: "1200px",
    avatar: "50%",
  },
  shadows: {
    card: "0px 2px 8px 0px rgba(103,80,164,0.15)",
    primary: "0px 4px 16px 0px rgba(103,80,164,0.30)",
  },
};

export const darkTheme: AppTheme = {
  colors: {
    primary: "#D0BCFF",
    primaryStrong: "#4F378B",
    primaryContainer: "#4F378B",
    primaryGradient:
      "linear-gradient(153deg, rgba(80,60,130,1) 0%, rgba(40,20,80,1) 100%)",
    surface: "#2B2930",
    background: "#1C1B1F",
    onPrimary: "#FFFFFF",
    onSurface: "#E6E1E5",
    onSurfaceMuted: "#CAC4D0",
    onBackground: "#E6E1E5",
    onBackgroundMuted: "#CAC4D0",
    onBackgroundSubtle: "#938F99",
    glassOverlay: "rgba(255,255,255,0.08)",
    outline: "#938F99",
    outlineVariant: "#49454F",
    error: "#F2B8B5",
    errorContainer: "#8C1D18",
    success: "#A5D6A7",
    successContainer: "#1B5E20",
    muscleGroups: muscleGroupsDark,
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
    card: "48px",
    inner: "36px",
    header: "0 0 36px 36px",
    chip: "20px",
    pill: "1200px",
    avatar: "50%",
  },
  shadows: {
    card: "0px 2px 8px 0px rgba(0,0,0,0.40)",
    primary: "0px 4px 16px 0px rgba(208,188,255,0.20)",
  },
};
