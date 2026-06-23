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

export const StyledDayPill = styled.div<{
  $today: boolean;
  $selected: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ $today, $selected, theme }) =>
    $today
      ? theme.colors.primary
      : $selected
        ? theme.colors.primaryContainer
        : "transparent"};
  border: 1px solid
    ${({ $today, $selected, theme }) =>
      $today || $selected ? "transparent" : theme.colors.outlineVariant};
  cursor: pointer;
  user-select: none;
  &:active {
    opacity: 0.75;
  }
`;

export const StyledDayLabel = styled.span<{
  $today: boolean;
  $selected: boolean;
}>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ $today, $selected, theme }) =>
    $today
      ? theme.colors.background
      : $selected
        ? theme.colors.primary
        : theme.colors.onSurfaceMuted};
`;

export const StyledDayNumber = styled.span<{
  $today: boolean;
  $selected: boolean;
}>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $today, $selected, theme }) =>
    $today
      ? theme.colors.background
      : $selected
        ? theme.colors.primary
        : theme.colors.onSurface};
`;

export const StyledDayDot = styled.div<{
  $plannedStatus: string;
  $sessionStatus: CalendarSessionStatus;
}>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ $plannedStatus, $sessionStatus, theme }) => {
    if ($plannedStatus === "rest") return "transparent";
    if ($sessionStatus === "recorded") return theme.colors.success;
    if ($sessionStatus === "skipped") return theme.colors.error;
    return theme.colors.outlineVariant;
  }};
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
