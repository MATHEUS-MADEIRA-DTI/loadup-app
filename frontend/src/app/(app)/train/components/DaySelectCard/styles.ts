import styled from "styled-components";

export const StyledDayCard = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.outlineVariant};
  cursor: pointer;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease,
    border-color 200ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:active {
    opacity: 0.95;
  }
`;

export const StyledDayAbbr = styled.div<{ $selected: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.primaryContainer};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.background : theme.colors.primary};
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledDayInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StyledDayName = styled.p`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

export const StyledDayMeta = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
`;

export const StyledDayMuscleText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledDayExCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledDaySelectIndicator = styled.div<{ $selected: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : "transparent"};
  color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 200ms ease,
    border-color 200ms ease,
    transform 200ms ease;

  ${({ $selected }) => $selected && "transform: scale(1.02);"}
`;
