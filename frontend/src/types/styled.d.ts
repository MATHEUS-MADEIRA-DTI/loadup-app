import { AppTheme, ThemeMode, ColorTheme } from "@/styles/theme";

export type { AppTheme, ThemeMode, ColorTheme };

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
