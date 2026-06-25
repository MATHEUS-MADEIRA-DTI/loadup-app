import styled from "styled-components";
import { CalendarSessionStatus } from "@/types";

export const StyledHistoryCard = styled.button`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  align-items: flex-start;
  border: 1px solid transparent;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease,
    border-color 200ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.focus};
    border-color: ${({ theme }) => theme.colors.outlineVariant};
  }

  &:active {
    opacity: 0.95;
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
        ? theme.colors.errorContainer
        : $status === "pending"
          ? theme.colors.primaryContainer
          : theme.colors.outlineVariant};
  color: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.success
      : $status === "skipped"
        ? theme.colors.error
        : $status === "pending"
          ? theme.colors.primary
          : theme.colors.onSurfaceMuted};
`;

export const StyledHistoryInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledHistoryTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledHistoryDayName = styled.p`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

export const StyledHistoryBadge = styled.span<{
  $status: CalendarSessionStatus;
}>`
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.successContainer
      : $status === "skipped"
        ? theme.colors.errorContainer
        : theme.colors.primaryContainer};
  color: ${({ $status, theme }) =>
    $status === "recorded"
      ? theme.colors.success
      : $status === "skipped"
        ? theme.colors.error
        : theme.colors.primary};
`;

export const StyledHistoryDate = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin: 0;
`;

export const StyledHistoryMuscles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const StyledHistoryExCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin: 0;
`;
