"use client";

import { Sun, Moon } from "lucide-react";
import styled from "styled-components";

import { useTheme } from "@/styles/ThemeProvider";

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <StyledButton
      onClick={toggleMode}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.8} />
      ) : (
        <Moon size={18} strokeWidth={1.8} />
      )}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurface};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryContainer};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
