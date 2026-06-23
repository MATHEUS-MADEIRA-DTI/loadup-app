import styled from "styled-components";

export const StyledDayCard = styled.div<{ $isToday: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 2px solid
    ${({ theme, $isToday }) =>
      $isToday ? theme.colors.primary : "transparent"};
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
  font-size: 14px;
  font-weight: 600;
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
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background: ${({ theme, $training }) =>
    $training ? theme.colors.primaryContainer : theme.colors.background};
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.primaryStrong};
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;
