import styled from "styled-components";

export const StyledExCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StyledExName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
  min-width: 0;
`;

export const StyledEditBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  padding: 4px;
  flex-shrink: 0;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledTrashBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  padding: 4px;
  flex-shrink: 0;
  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const StyledExMuscle = styled.div`
  display: flex;
`;

export const StyledSeriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledSeriesRow = styled.div<{ $bg: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ $bg }) => $bg};
  border-radius: 12px;
  padding: 6px 10px;
`;

export const StyledSeriesCircle = styled.div<{ $color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StyledSeriesType = styled.span<{ $color: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  flex: 1;
`;

export const StyledSeriesReps = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledExFooter = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding-top: ${({ theme }) => theme.spacing.xs};
`;
