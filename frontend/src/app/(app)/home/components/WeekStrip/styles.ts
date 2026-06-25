import styled, { keyframes } from "styled-components";

import { CalendarSessionStatus } from "@/types";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledWeekRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
`;

export const StyledDayPill = styled.button<{
  $today: boolean;
  $selected: boolean;
  $rest: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px;
  min-height: 98px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ $selected, $today, theme }) =>
    $selected
      ? theme.colors.primaryContainer
      : $today
        ? theme.colors.surfaceElevated
        : theme.colors.surface};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.outlineVariant};
  color: ${({ $selected, $today, theme }) =>
    $selected || $today ? theme.colors.primary : theme.colors.onSurface};
  opacity: ${({ $rest }) => ($rest ? 0.55 : 1)};
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

export const StyledDayLabel = styled.span<{
  $today: boolean;
  $selected: boolean;
}>`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ $today, $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.onSurfaceMuted};
`;

export const StyledDayNumber = styled.span<{
  $today: boolean;
  $selected: boolean;
}>`
  font-family: "Bebas Neue", Impact, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${({ $today, $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.onSurface};
  line-height: 1;
`;

export const StyledDayDot = styled.div`
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
`;

export const StyledDayPillSkeleton = styled.div`
  flex: 1;
  height: 68px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primaryContainer} 25%,
    ${({ theme }) => theme.colors.outlineVariant} 50%,
    ${({ theme }) => theme.colors.primaryContainer} 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

export const StyledCalendarEmpty = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;
