import styled from "styled-components";

export const StyledDayCard = styled.div<{
  $isToday: boolean;
  $isRest: boolean;
  $isDragging?: boolean;
}>`
  background: ${({ theme, $isToday }) =>
    $isToday ? theme.colors.primaryContainer : theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme, $isDragging }) =>
    $isDragging
      ? (theme.shadows.primary ?? "0 8px 32px rgba(0,0,0,0.5)")
      : theme.shadows.card};
  border: 2px solid
    ${({ theme, $isToday, $isDragging }) =>
      $isDragging
        ? theme.colors.primary
        : $isToday
          ? theme.colors.primary
          : "transparent"};
  opacity: ${({ $isRest, $isDragging }) =>
    $isDragging ? 0.8 : $isRest ? 0.62 : 1};
  transform: ${({ $isDragging }) => ($isDragging ? "scale(1.02)" : "scale(1)")};
  transition:
    transform 150ms ease,
    box-shadow 150ms ease,
    opacity 150ms ease;
`;

export const StyledCardRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledAbbrCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;
export const StyledArrowCol = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

export const StyledArrowBtn = styled.button`
  width: 36px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: background 150ms ease;

  &:first-child {
    border-radius: 8px 8px 0 0;
    border-bottom: none;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    background: ${({ theme }) => theme.colors.primaryContainer};
  }
`;
export const StyledAbbrPill = styled.div<{ $isToday: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${({ theme, $isToday }) =>
    $isToday ? theme.colors.primaryContainer : theme.colors.primary};
  color: ${({ theme, $isToday }) =>
    $isToday ? theme.colors.primary : theme.colors.background};
  border: ${({ theme, $isToday }) =>
    $isToday ? `2px solid ${theme.colors.primary}` : "none"};
`;

export const StyledTodayLabel = styled.span`
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

export const StyledNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

export const StyledDayName = styled.span`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledTodayBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;

export const StyledMeta = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const StyledTypeBadge = styled.span<{ $training: boolean }>`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme, $training }) =>
    $training ? theme.colors.primaryContainer : theme.colors.surface};
  color: ${({ theme, $training }) =>
    $training ? theme.colors.primary : theme.colors.onSurfaceMuted};
  white-space: nowrap;
`;

export const StyledToggle = styled.button<{ disabled?: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${({ theme, "aria-checked": c }) =>
    c === true ? theme.colors.primaryStrong : theme.colors.outline};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  padding: 2px;
  display: flex;
  align-items: center;
  transition: background 200ms ease;
  flex-shrink: 0;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const StyledToggleThumb = styled.div<{ $on: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.onPrimary};
  transform: translateX(${({ $on }) => ($on ? "20px" : "0")});
  transition: transform 200ms ease;
`;

export const StyledChevronBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.surfaceElevated};
  }
`;
