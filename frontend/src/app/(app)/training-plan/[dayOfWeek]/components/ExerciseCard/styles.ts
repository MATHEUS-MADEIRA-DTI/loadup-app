import styled from "styled-components";

export const StyledExCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledExHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
export const StyledExNumCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-bebas), sans-serif;
  font-size: 16px;
  flex-shrink: 0;
`;

export const StyledExName = styled.h3`
  font-family: var(--font-barlow), sans-serif;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
  min-width: 0;
`;

export const StyledExMuscle = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledEditBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 180ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryContainer};
  }
`;

export const StyledTrashBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 180ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorContainer};
  }
`;

export const StyledSeriesRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  padding: 10px 14px;
`;

export const StyledSeriesCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-bebas), sans-serif;
  font-size: 13px;
  flex-shrink: 0;
`;

export const StyledSeriesReps = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledExFooter = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding-top: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const StyledSeriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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




