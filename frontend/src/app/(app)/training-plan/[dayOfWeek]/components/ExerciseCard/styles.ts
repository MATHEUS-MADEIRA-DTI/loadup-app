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
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StyledExName = styled.h3`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 18px;
  font-weight: 900;
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
  padding: 8px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.borderRadius.avatar};
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
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
  padding: 8px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.borderRadius.avatar};
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const StyledExMuscle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  letter-spacing: 0.01em;
`;

export const StyledSeriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledSeriesRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  padding: 12px 14px;
`;

export const StyledSeriesCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StyledSeriesReps = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledExFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding-top: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;
