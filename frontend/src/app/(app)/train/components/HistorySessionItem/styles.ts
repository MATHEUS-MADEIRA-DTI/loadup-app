import styled from "styled-components";
import { CalendarSessionStatus } from "@/types";

export const StyledHistoryCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  align-items: flex-start;
  &:active {
    opacity: 0.85;
  }
`;

export const StyledHistoryIcon = styled.div<{ $status: CalendarSessionStatus }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.successContainer
      : $status === "skipped"
        ? "#FDECEA"
        : $status === "pending"
          ? "#FFF8E1"
          : theme.colors.outlineVariant};
  color: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.success
      : $status === "skipped"
        ? theme.colors.error
        : $status === "pending"
          ? "#F57F17"
          : theme.colors.onSurfaceMuted};
`;

export const StyledHistoryInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledHistoryTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledHistoryDayName = styled.p`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledHistoryBadge = styled.span<{
  $status: CalendarSessionStatus;
}>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.successContainer
      : $status === "skipped"
        ? "#FDECEA"
        : $status === "pending"
          ? "#FFF8E1"
          : theme.colors.outlineVariant};
  color: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.success
      : $status === "skipped"
        ? theme.colors.error
        : $status === "pending"
          ? "#F57F17"
          : theme.colors.onSurfaceMuted};
`;

export const StyledHistoryDate = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledHistoryMuscles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const StyledHistoryExCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;
